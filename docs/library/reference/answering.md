---
title: "Answering"
sidebar_label: "Answering"
sidebar_position: 7
---


Module `tawi.model`. Load a model and ask it things, on the same engines as the studio (llama.cpp when a GGUF copy exists,
Transformers on NVIDIA or MLX on a Mac until then).

## `tawi.load_model`

```python
def load_model(name, precision='16bit')
```

## `tawi.Model`

```python
class Model(name, precision='16bit')
```

A model to ask things: a catalog id, Hugging Face id or fine-tuned adapter folder, in a precision.

- `batch(self, prompts, system=None, max_new_tokens=256)`: Replies to several prompts, answered together (faster than one by one).
- `generate(self, prompt, system=None, history=(), max_new_tokens=256)`: The reply text. `prompt` is a string or a full list of chat messages.
- `last_timing`
- `load(self)`
- `stream(self, prompt, system=None, history=(), max_new_tokens=256)`: Yields the reply in pieces as it is written.
- `unload(self)`
