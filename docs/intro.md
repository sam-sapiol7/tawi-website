---
title: Tawi documentation
sidebar_label: Introduction
sidebar_position: 0
slug: /
description: Build, fine-tune and serve AI agents on your own computer, and call them from your apps.
---

# Tawi documentation

Tawi builds AI agents that answer from your own documents and examples, on your own computer. You build an agent
in the **studio**, check it with a safety test, and put it live behind an API key. Your apps then ask it questions
over HTTP. The same training, search and serving are also available as a Python library, `import tawi`.

## Start here

- [Install](start/install.md) the studio on Windows, Linux or a Mac.
- [Quick start](start/quickstart.md): a first agent, answering over HTTP in about ten minutes.

## Calling agents from your apps

- [Authentication](guides/authentication.md): API keys, and signing in to the Studio API.
- [Agent API guide](guides/agent-api.md): asking, streaming, conversations, versions and errors.
- [API reference](api/index.md): every endpoint, with request and response schemas.

## Automating the studio

- [Studio API guide](guides/studio-api.md): upload data, train, run the safety check and publish from a script.
- [Versioning](guides/versioning.md): what can change between releases.

## Running it

- [HTTPS](guides/https.md), [running in production](guides/operations.md) and
  [troubleshooting](guides/troubleshooting.md).

## The Python library

- [Overview](library/overview.md), the [reference](library/reference/index.md) for every function, and
  [examples](library/examples.md) that run in Tawi's test suite.
