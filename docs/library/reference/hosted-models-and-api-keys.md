---
title: "Hosted models and API keys (tawi.providers)"
sidebar_label: "Hosted models and API keys"
sidebar_position: 6
---


Module `tawi.providers`. Hosted model providers (Claude, OpenAI) next to local models, and where their API keys are kept.

## `tawi.providers.get`

```python
def get(provider='anthropic', model=None, **kw)
```

A provider by name: "claude"/"anthropic", "openai"/"gpt", or "local" (model = a tawi.load_model name).

## `tawi.providers.set_key`

```python
def set_key(provider, key)
```

Save a provider's API key (empty or None removes it).

## `tawi.providers.get_key`

```python
def get_key(provider)
```

## `tawi.providers.status`

```python
def status()
```

{provider: {"label", "configured", "source", "hint", "default_model", "models"}}: safe to show (last 4 characters only).
Today's estimated spend across hosted models, and the daily cap, are in limits.spend_today().

## `tawi.providers.Claude`

```python
class Claude(model=None, effort='medium')
```

Claude through the official Anthropic SDK. Refused requests fall back server-side (fallbacks="default").

- `batch(self, prompts, system=None, max_new_tokens=1024)`
- `generate(self, prompt, system=None, history=(), max_new_tokens=16000)`
- `json(self, prompt, schema, system=None, max_new_tokens=16000)`

## `tawi.providers.OpenAI`

```python
class OpenAI(model=None)
```

OpenAI models through the official OpenAI SDK (Chat Completions).

- `batch(self, prompts, system=None, max_new_tokens=1024)`
- `generate(self, prompt, system=None, history=(), max_new_tokens=4096)`
- `json(self, prompt, schema, system=None, max_new_tokens=8192)`

## `tawi.providers.Local`

```python
class Local(model='qwen3-0.6b', precision='16bit')
```

A local model (tawi.load_model) with the same interface. json() asks for JSON and parses the first object.

- `batch(self, prompts, system=None, max_new_tokens=1024)`
- `generate(self, prompt, system=None, history=(), max_new_tokens=1024)`
- `json(self, prompt, schema, system=None, max_new_tokens=2048)`
