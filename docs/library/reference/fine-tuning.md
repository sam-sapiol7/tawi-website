---
title: "Fine-tuning"
sidebar_label: "Fine-tuning"
sidebar_position: 2
---


Module `tawi.ft.trainer`. tawi.finetune(): LoRA fine-tuning with our own training loop (no Unsloth).

## `tawi.finetune`

```python
def finetune(model='qwen3-0.6b', data=None, out_dir='tawi_adapter', *, epochs=None, learning_rate=None, batch_size=None, grad_accum=None, lora_r=None, lora_alpha=None, max_len=None, precision='16bit', system=None, gradient_checkpointing='auto', chunk_rows=256, seed=3407, warmup_steps=None, max_grad_norm=1.0, on_step=None, track=True, project='finetune', checkpoint_dir=None, save_steps=None, resume=True)
```

Train a LoRA adapter. Returns a dict with the losses, time, memory, steps and out_dir (and run_id when tracked).

model:      a catalog id ("qwen3-0.6b"), a Hugging Face id, or a local model folder
data:       a tawi.Dataset or a file path (any format tawi.Dataset.from_file reads)
out_dir:    where the PEFT adapter is saved
epochs, learning_rate, batch_size, grad_accum, lora_r, lora_alpha, max_len: default to tawi.suggest(model)
precision:  "16bit", "q8" or "q4" (4-bit QLoRA)
system:     a system prompt put on every conversation
gradient_checkpointing: "auto" (on only when the batch wouldn't fit without it), True or False
on_step:    called after every optimizer step with {"step", "total_steps", "loss", "lr", "vram_gb", "seconds"}
track:      record the run with tawi.track (project=...)

With checkpoint_dir and save_steps, the adapter, optimizer and schedule are saved every save_steps steps (the
last two are kept); calling again with the same checkpoint_dir resumes from the latest one (resume=False starts over).
