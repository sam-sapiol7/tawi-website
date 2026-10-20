---
title: API reference
sidebar_label: Overview
description: The Agent API your apps call, and the Studio API that automates the studio.
---

# API reference

Tawi has two HTTP APIs. Both pages are generated from the OpenAPI specs in the Tawi repository, which are checked
against the code on every change, so they describe exactly the version shown in the header.

| | For | Credential | Stability |
|---|---|---|---|
| [Agent API](agent/tawi-agent-api.info.mdx) | Your apps: chat, streaming, OpenAI-compatible completions, health | The agent's API key | Stable within `/v1` |
| [Studio API](studio/tawi-studio-api.info.mdx) | Scripts that automate the studio | A signed-in session | Can change between minor releases |

Start with the [Agent API guide](../guides/agent-api.md) and [Authentication](../guides/authentication.md).

## Download the specs

- Agent API: [agent.yaml](pathname:///openapi/agent.yaml), [agent.json](pathname:///openapi/agent.json)
- Studio API: [studio.yaml](pathname:///openapi/studio.yaml), [studio.json](pathname:///openapi/studio.json)

Import them into Postman, Insomnia or an OpenAPI code generator to get a client.

## Trying requests from this page

Each endpoint page has a **Send API request** panel. Choose your studio under **Base URL** (the studio is
`http://127.0.0.1:8000`, an agent container `http://<host>:8100`) and paste your key under **Auth**.

The request is sent by your browser. Today's studio doesn't send the CORS headers a browser needs to read an answer
from another site, so from this page the panel shows a network error. Copy the curl, Python or JavaScript code
next to it instead and run it on the same computer as the studio; the code is filled in with what you entered.
The studio also serves its own interactive page at `http://127.0.0.1:8000/docs`, where requests do work.
