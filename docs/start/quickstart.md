---
sidebar_position: 2
sidebar_label: "Quick start"
title: Quickstart
description: Build a first agent in the studio and ask it a question from your own code.
---

# Quickstart

From nothing to an agent answering over HTTP in about ten minutes. You need the studio installed and running
([install.md](install.md)); it listens on `http://127.0.0.1:8000`.

## 1. Build an agent in the studio

1. Open http://127.0.0.1:8000 and sign in (the first time: `admin` / `admin`, then choose a password).
2. **New agent**: give it a name (for example *Leaf & Kettle*). On the **Model** step pick a model, and on the
   **Mode** step pick **RAG only**: it answers from your documents and needs no training, so it is the quickest start.
3. **Data**: upload a few documents (PDF, Word, Markdown, text), or click **Use sample data** for a small tea-shop
   dataset.
4. **Test & safety**: ask a couple of questions and check the answers and their sources, then run the safety
   check. The API only goes live once it passes.
5. **Go live**: click **Make API**. Copy the key (`ak_...`) now: it is shown once, and only its hash is stored.

The agent's API name is its *slug*, shown next to the key (for example `leaf-kettle`).

## 2. Ask it a question

### curl

```bash
curl http://127.0.0.1:8000/v1/chat \
  -H "Authorization: Bearer ak_your_key" \
  -H "Content-Type: application/json" \
  -d '{"agent": "leaf-kettle", "message": "Do you ship to the US?"}'
```

```json
{
  "message": "Yes. We ship to Canada, the US and the UK. International orders arrive in 7 to 12 business days.",
  "sources": [{"source": "leaf-and-kettle-policies.md", "page": null, "score": 0.83, "excerpt": "## Shipping ..."}],
  "bot": "leaf-kettle",
  "mode": "auto",
  "timing": {"search_ms": 9.8, "rerank_ms": 3.9}
}
```

### Python

```python
import requests

r = requests.post(
    "http://127.0.0.1:8000/v1/chat",
    headers={"Authorization": "Bearer ak_your_key"},
    json={"agent": "leaf-kettle", "message": "Do you ship to the US?", "user": "customer-123"},
    timeout=60,
)
r.raise_for_status()
print(r.json()["message"])
```

`user` is optional. With it, the agent remembers that person's last few turns, so a follow-up such as
"How long does that take?" works.

### JavaScript

```js
const r = await fetch("http://127.0.0.1:8000/v1/chat", {
  method: "POST",
  headers: { "Authorization": "Bearer ak_your_key", "Content-Type": "application/json" },
  body: JSON.stringify({ agent: "leaf-kettle", message: "Do you ship to the US?" }),
});
const { message, sources } = await r.json();
```

Call the API from your server, not from a web page: a key in browser code can be read by anyone.

### OpenAI client libraries

The agent also speaks OpenAI's chat completions format:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="ak_your_key")
r = client.chat.completions.create(model="leaf-kettle", messages=[{"role": "user", "content": "Do you ship to the US?"}])
print(r.choices[0].message.content)
```

## 3. Next steps

- Stream answers as they are written, keep conversations and handle errors: [Agent API guide](../guides/agent-api.md).
- Keep keys safe and rotate them: [Authentication](../guides/authentication.md).
- Run the agent on its own in Docker: the **Deploy** step, or `GET /api/bots/{bid}/docker-bundle`. The container
  serves the same `/v1/chat` on its own port (8100 by default).
- Automate building and training agents: [Studio API guide](../guides/studio-api.md).
- Every endpoint in detail: the OpenAPI specs, [agent.yaml](../api/agent/tawi-agent-api.info.mdx) and
  [studio.yaml](../api/studio/tawi-studio-api.info.mdx).
