---
title: "Serving"
sidebar_label: "Serving"
sidebar_position: 11
---


Module `tawi.serving`. Serve a model (optionally answering from documents) over the same OpenAI-compatible API as the studio's agents.

## `tawi.serve`

```python
def serve(model, rag=None, system=None, port=8100, host=None, api_key=None, max_new_tokens=256)
```

Run the server (blocks). Listens on 127.0.0.1 unless an api_key is set and host is given.

## `tawi.serving.make_app`

```python
def make_app(model, rag=None, system=None, api_key=None, max_new_tokens=256, cache_size=2000, cache_ttl=600)
```
