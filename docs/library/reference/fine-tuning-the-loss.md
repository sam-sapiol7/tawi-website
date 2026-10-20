---
title: "Fine-tuning: the loss"
sidebar_label: "Fine-tuning: the loss"
sidebar_position: 3
---


Module `tawi.ft.losses`. Chunked cross-entropy straight from the last hidden states.

## `tawi.ft.losses.chunked_lm_loss`

```python
def chunked_lm_loss(hidden, weight, labels, chunk_rows=1024, softcap=None, shift=True)
```

Mean cross-entropy of the next-token predictions.

hidden: (batch, seq, dim) or (tokens, dim), the model's last hidden states (after the final norm).
weight: (vocab, dim), the output head (`model.lm_head.weight`; tied embeddings work too).
labels: (batch, seq) or (tokens,) token ids, IGNORE (-100) where the loss shouldn't count.
shift:  True when labels are the inputs (predict token t+1 from position t), as in Hugging Face models.
softcap: Gemma 2's final logit soft-capping value, if the model uses it.
