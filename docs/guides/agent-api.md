---
sidebar_position: 2
title: Agent API guide
description: Ask agents questions, stream answers, keep conversations, pin versions and handle errors.
---

# Agent API guide

The Agent API is what your apps call to get answers from an agent. The full reference is the OpenAPI spec,
[agent.yaml](../api/agent/tawi-agent-api.info.mdx); this guide covers how to use it well. Keys are covered in
[Authentication](authentication.md).

## Where it runs

The same API is served in three places, so an app can move between them by changing its base URL:

| Server | Base URL | Serves |
|---|---|---|
| The studio | `http://127.0.0.1:8000` | Every live agent |
| An agent's Docker container (Deploy step) | `http://<host>:8100` | One agent, its published version |
| `tawi serve` / `tawi.serve()` | `http://127.0.0.1:8100` | One model, optionally with a search index |

The differences are small and listed per endpoint in the spec (`x-tawi-servers`). The main ones:

- Only the studio has the per-agent URLs (`/v1/agents/{agent}/chat`, `/v1/agents/{agent}/chat/completions`).
- Streaming (`stream: true`) works on the studio. A container returns the whole answer as JSON instead, and
  `tawi serve` streams only when it has no search index.
- The agent that answered is named in `bot` by the studio, `agent` by a container, and `model` by `tawi serve`.

## Asking

```http
POST /v1/chat
Authorization: Bearer ak_...
Content-Type: application/json

{"agent": "maple-grove-dental", "message": "Do you take new patients?"}
```

| Field | |
|---|---|
| `message` | The question, up to 4,000 characters. |
| `agent` | The agent's slug. `slug@v2` pins version 2; the default is the Live version. Optional on a container. |
| `user` | Any stable id for the person asking. Turns on conversation memory (below). |
| `mode` | `auto` (the agent's setting), `rag` (documents only, no model), `model` (model only), `rag+model`. |
| `stream` | `true` for server-sent events. |

The reply:

```json
{
  "message": "Yes, we're taking new patients. You can book online or call 555-0142.",
  "sources": [{"source": "new-patients.pdf", "page": 1, "score": 0.812, "excerpt": "New patients are welcome..."}],
  "bot": "maple-grove-dental@v2",
  "mode": "auto",
  "timing": {"search_ms": 11.4, "rerank_ms": 4.1, "first_token_ms": 182.0, "generate_ms": 640.2}
}
```

`sources` are the passages the answer was based on, best first; show them to users as citations if that fits your
product. When nothing in the documents matches well enough, a RAG agent says it doesn't know rather than guessing,
and `sources` is empty.

## Conversations

Without `user`, every message stands alone. With `user`, the agent keeps the last 6 turns of that person's
conversation (keyed by a hash of `user`), so follow-ups work:

```python
ask = lambda text: requests.post(URL, headers=H, json={"agent": "maple-grove-dental", "message": text, "user": "customer-123"}).json()
ask("What are your hours on Monday?")
ask("And on Saturday?")          # understood as "What are your hours on Saturday?"
```

Conversations are kept in the server's memory: they are lost on restart, and each studio or container keeps its
own. Up to 2,000 conversations are kept; the least recently used are dropped first.

Answers to messages without `user` can be served from a short-lived cache (10 minutes by default), marked
`"cached": true`. Messages with `user` are never cached, because the answer depends on the conversation.

## Streaming

With `"stream": true` the answer arrives as server-sent events while it is written:

```
data: {"delta": "Yes, "}

data: {"delta": "we're taking new patients."}

data: {"done": true, "message": "Yes, we're taking new patients.", "sources": [...], "bot": "maple-grove-dental@v2", ...}

data: [DONE]
```

Show the `delta` pieces as they come, then use the `done` event's `message`: it is the final answer after the
safety checks, which can differ from the joined pieces. If the answer fails part-way, the last event is
`{"error": "...", "status": 503}` instead of `done`.

```python
import json, requests

with requests.post(URL, headers=H, json={"agent": "maple-grove-dental", "message": "Hours?", "stream": True}, stream=True) as r:
    for line in r.iter_lines(decode_unicode=True):
        if not line.startswith("data: ") or line == "data: [DONE]":
            continue
        ev = json.loads(line[6:])
        if "delta" in ev:
            print(ev["delta"], end="", flush=True)
        elif ev.get("done"):
            final = ev["message"]
        elif "error" in ev:
            raise RuntimeError(ev["error"])
```

Behind a reverse proxy, turn response buffering off for these routes (Caddy `flush_interval -1`, nginx
`proxy_buffering off`), or the events arrive all at once. See [https.md](https.md).

## OpenAI client libraries

`POST /v1/chat/completions` takes OpenAI's request format, so OpenAI's SDKs work with the base URL changed:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="ak_...")
r = client.chat.completions.create(model="maple-grove-dental", messages=[{"role": "user", "content": "Hours on Monday?"}])

for chunk in client.chat.completions.create(model="maple-grove-dental", messages=[...], stream=True):
    print(chunk.choices[0].delta.content or "", end="")
```

The agent answers the **last user message**. On the studio and in a container, earlier messages in `messages` are
not used: pass `user` (OpenAI's `user` parameter) to keep a conversation. `tawi serve` does use the earlier turns.
Sampling settings such as `temperature` and `max_tokens` are ignored: the agent's own settings apply.

## Versions

Every training run makes a new version. The API serves the **Live** version unless you pin one:

- `"agent": "maple-grove-dental"`: the Live version. When you publish a new version in the studio, the next
  request gets it, with no change to your app.
- `"agent": "maple-grove-dental@v2"`: always version 2, for example to compare versions or roll out gradually.
  A pinned version must have passed the safety check (otherwise 403), and must exist (otherwise 404).

A container serves only the version it was built with.

## While the studio is training

The studio has one GPU and trains one run at a time. While it trains, answers that need the model return status
200 with:

```json
{"message": "We'll be back shortly.", "sources": [], "busy": true}
```

Check for `busy` if your app should behave differently (for example, retry later). `mode: rag` answers keep
working, because they don't use the model. Agents that must never pause belong in their own container.

## Errors

Errors are JSON with a sentence in `detail` and the request's id:

```json
{"detail": "Rate limit: 30 requests a minute for this key", "request_id": "7f3a9c2e1b4d"}
```

| Status | When | What to do |
|---|---|---|
| 400 | Empty message, over 4,000 characters, unknown `mode`, bad version format, or the question and context don't fit the model | Fix the request |
| 401 | Missing key, or not this agent's key | Check the key and agent |
| 403 | The pinned version hasn't passed the safety check | Pin another version, or run the check |
| 404 | No such version; or a container asked for an agent or version it doesn't serve | Check the name |
| 422 | The body isn't valid JSON of the right shape (FastAPI's format: `detail` is a list) | Fix the request |
| 429 | Over the rate or daily limit, or too many wrong keys from your address | Wait `Retry-After` seconds |
| 500 | A bug | Retry once; report it with the `request_id` |
| 503 | The model couldn't answer (failed to load, out of memory) | Retry with backoff |

Every response has an `X-Request-ID` header, also written on the server's log line for that request. Send your own
`X-Request-ID` to have it used instead, which ties your logs to the studio's.

## Health checks

`GET /v1/health` needs no key. Use it for load balancers and container health checks:

- Studio: `{"ok": true, "training": false, "models_loaded": [...], "gpu": {...}}`
- Container: `{"ok": true, "ready": true, "agent": "maple-grove-dental", "version": 2, ...}`. `ready` turns true once
  the model is loaded; `ok` is false if start-up failed, with the reason in `error`.
- `tawi serve`: `{"ok": true, "model": "...", "rag": true}`

## Trying it from a browser

`GET /query/{question}?agent=<slug>&key=<key>` answers one question with no history, for a quick look from the
address bar. Don't use it from apps, because the key ends up in URLs and logs.
