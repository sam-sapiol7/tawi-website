---
title: "Synthetic data (tawi.synth)"
sidebar_label: "Synthetic data"
sidebar_position: 4
---


Module `tawi.synth`. Synthetic training data: from a description, or grounded in your documents.

## `tawi.synth.generate`

```python
def generate(description=None, documents=None, n=50, task='qa', teacher='claude', model=None, labels=None, style=None, system=None, per_call=10, check=True, chunk_chars=1500, seed=0, on_progress=None)
```

Make about `n` examples. Returns a tawi.Dataset (kind "qa"), each row with meta {synthetic, source, teacher}.
