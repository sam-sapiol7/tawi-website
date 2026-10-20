---
sidebar_position: 3
title: Studio API guide
description: Automate the studio from scripts and CI, from creating an agent to putting a trained version live.
---

# Studio API guide

Everything the studio's web page does goes through the Studio API, so anything you click can be scripted:
nightly retraining when the documents change, building agents from a spreadsheet, or a CI job that checks a new
version before it goes live. The full reference is [studio.yaml](../api/studio/tawi-studio-api.info.mdx).

The Studio API changes with the studio and can change between minor releases while the studio is below 1.0
([Versioning](versioning.md)). For answering customers, use the [Agent API](agent-api.md).

## Signing in

Sign in once and reuse the session. On every request that changes something, send the `tawi_csrf` cookie's
value back as the `X-CSRF-Token` header ([Authentication](authentication.md) explains why).

```python
import time
import requests

BASE = "http://127.0.0.1:8000"
s = requests.Session()
s.post(f"{BASE}/api/login", json={"username": "ci-bot", "password": "..."}).raise_for_status()
s.headers["X-CSRF-Token"] = s.cookies["tawi_csrf"]


def call(method, path, **kw):
    r = s.request(method, BASE + path, **kw)
    if r.status_code >= 400:
        raise RuntimeError(f"{method} {path} -> {r.status_code}: {r.json().get('detail')}")
    return r.json()
```

Errors are JSON with a sentence in `detail`, which is meant to be shown to a person as it is.

## Words the API uses

- Agents are called *bots* in the paths: `/api/bots/{bid}`, where `bid` is the agent's 8-character id.
- An agent's **slug** is its name in the Agent API.
- A **version** is the result of one training run (`v1`, `v2`, ...). The **active** version is the one the studio
  tests with; the **live** version is the one the Agent API serves. A version is `draft` until it passes the safety
  check, then `tested`, then `live` once published.

## Example: a document-answering agent

```python
agent = call("POST", "/api/bots", json={"name": "Maple Grove Dental", "mode": "rag"})
bid = agent["id"]

files = [("files", (name, open(name, "rb"))) for name in ["hours.pdf", "new-patients.pdf", "prices.docx"]]
up = call("POST", f"/api/bots/{bid}/docs", files=files)
for rep in up["reports"]:
    if "error" in rep:
        print("skipped:", rep["error"])

call("PUT", f"/api/bots/{bid}/agent-file", json={"content": "# Maple Grove Dental\n\nAnswer in two short sentences."})
```

## Example: fine-tune, check and publish

```python
def wait(path, running):
    while True:
        st = call("GET", path)
        if st["state"] not in running:
            return st
        time.sleep(5)


agent = call("POST", "/api/bots", json={"name": "Leaf & Kettle", "mode": "train"})
bid = agent["id"]
call("POST", f"/api/bots/{bid}/qa", files={"file": ("examples.csv", open("examples.csv", "rb"))})

run = call("POST", f"/api/bots/{bid}/train", json={"kind": "qa", "params": {"epochs": 3}})
st = wait(f"/api/bots/{bid}/train", running={"preparing", "starting", "loading", "training"})
if st["state"] != "done":
    raise SystemExit(f"training {st['state']}: {st.get('message')}")

call("POST", f"/api/bots/{bid}/redteam")
check = wait(f"/api/bots/{bid}/redteam", running={"running"})
bar = call("GET", "/api/catalog")["redteam_bar"]
if check["state"] != "done" or check["pass_rate"] < bar:
    raise SystemExit(f"safety check: {check.get('pass_rate')} < {bar}")

live = call("POST", f"/api/bots/{bid}/make-api")
if live["key"]:
    print("API key (shown once):", live["key"])
```

What each step does:

- **Upload examples** (`POST /api/bots/{bid}/qa`): about 10% of the questions are held out and never trained on;
  they become the test questions and the score each new version gets.
- **Train** (`POST /api/bots/{bid}/train`) returns at once with the version number it will make. Poll
  `GET /api/bots/{bid}/train`: the states are `preparing`, `starting`, `loading`, `training`, then `done`,
  `failed` or `cancelled`. The GPU trains one run at a time; a second start gets 409. The training settings
  accepted in `params` and their ranges are listed under `AgentChanges.params` in the spec.
- **Safety check** (`POST /api/bots/{bid}/redteam`) runs attack prompts against the active version in the
  background. Poll its GET route until `state` is `done`.
- **Make the API** (`POST /api/bots/{bid}/make-api`): the first call creates the key and returns it once; later
  calls publish the active version and return `key: null`.

## Publishing a new version of a live agent

Training again makes a new version, which becomes the active one but not the live one: the Agent API keeps
serving the previous version until you publish.

```python
versions = call("GET", f"/api/bots/{bid}/versions")
new = versions["versions"][0]["v"]                   # newest first
# compare it with the live version on the saved test questions before publishing
side_by_side = call("POST", f"/api/bots/{bid}/versions/answers", json={"a": versions["live"], "b": new})

call("POST", f"/api/bots/{bid}/redteam")
wait(f"/api/bots/{bid}/redteam", running={"running"})
call("POST", f"/api/bots/{bid}/versions/promote", json={"v": new})   # 400 if it hasn't passed the safety check

# and if it misbehaves
call("POST", f"/api/bots/{bid}/versions/rollback")
```

## Background jobs

Long jobs start with a POST that returns at once, and report through a GET you poll every few seconds:

| Job | Start | Progress | Finished when `state` is |
|---|---|---|---|
| Training | `POST /api/bots/{bid}/train` | `GET /api/bots/{bid}/train` | `done`, `failed`, `cancelled` |
| Safety check | `POST /api/bots/{bid}/redteam` | `GET /api/bots/{bid}/redteam` | `done`, `failed` |
| Speed test | `POST /api/bots/{bid}/benchmark` | `GET /api/bots/{bid}/benchmark` | `done`, `failed` |
| Synthetic examples | `POST /api/bots/{bid}/synth` | `GET /api/bots/{bid}/synth` | `done`, `failed` |
| Model download | `POST /api/models/{mid}/download` | `GET /api/models/{mid}` | the download's `state` is `done`, `failed`, `cancelled` |
| Docker deploy | `POST /api/bots/{bid}/deploy` | `GET /api/bots/{bid}/deploy` | the job's `state` is no longer `running` |

The studio keeps running jobs in memory. If it restarts during training, the run shows as `interrupted`, and
starting it again resumes from its last checkpoint.

## Keeping documents up to date

To refresh an agent's documents from a script, upload them again: a file with the same name replaces the old one,
and the index is rebuilt. Agents whose documents live in Google Drive or Notion can sync on their own
(`POST /api/bots/{bid}/connectors`, every 1 to 168 hours).

Uploading or removing documents, or changing the agent file or search settings, clears the last safety check,
because answers can change. A version that is already live keeps serving; run the check again before publishing
the next one.

## Admin-only routes

Routes marked `x-tawi-role: admin` in the spec need an admin account: accounts (`/api/users`), connected machines
(`/api/compute/...` changes), hosted-model keys (`PUT /api/providers/{name}`), running notebook code, and
`POST /api/clear-data`. A member account gets 403 there.
