---
slug: training-time
title: "Fine-tuning on an 8 GB laptop GPU: Tawi and Unsloth, measured"
authors: [tawi]
tags: [fine-tuning, benchmarks]
description: The same data and settings on Tawi's own training engine and on Unsloth, on an RTX 5050 laptop.
---

Tawi trains with its own engine. We measured it against Unsloth, a popular library built for fast fine-tuning, on
a laptop with an 8 GB NVIDIA GPU (an RTX 5050).

<!-- truncate -->

## The numbers

Each row is one fine-tune with the same data, model and settings on both engines (LoRA, the settings Tawi suggests
for the model). The dentist dataset is 100 questions and answers for a dental clinic's front desk.

| Model and data | Tawi | Unsloth |
|---|---|---|
| Qwen3 0.6B, dentist questions | 16 s | 52 to 104 s |
| Qwen3 1.7B, 16-bit | 35 s | 75 s |
| Qwen3 1.7B, 4-bit (QLoRA) | 60 s | 72 s |
| Qwen3 0.6B, examples of about 1,000 tokens | 110 s | 130 s |

Unsloth's time for the first row varied from run to run, so it is shown as a range. Tawi was faster in every case
we measured. The gap is largest for small models and short examples, which is exactly what a support agent trained on
a business's own questions looks like.

## Where the time goes

For a small model, much of a fine-tune isn't the model at all:

- **The loss.** Qwen3 has a vocabulary of about 150,000 tokens, so it produces a huge table of scores for every token in a batch.
  Tawi computes the loss in chunks and never builds that table, which saves memory and time.
- **Gradient checkpointing only when it's needed.** Checkpointing saves memory by running parts of the model twice.
  Tawi first tries the batch without it, and turns it on only if memory runs out, so small models on short
  examples skip the second pass entirely.
- **The optimizer.** A fused AdamW update, with warmup and decay.

Both engines produce a standard LoRA adapter, so everything after training (comparing versions, the safety check,
llama.cpp export, Docker deploy) works the same whichever trained it. Unsloth remains available as a second
engine for each agent.

## Run it yourself

The comparison is a script in the Tawi repository. It runs each engine in its own process and writes training time,
peak GPU memory and loss for both:

```bash
python scripts/bench_finetune.py --model qwen3-0.6b --data demo_data/customer-dentist-qa.jsonl
python scripts/bench_finetune.py --model qwen3-0.6b --data demo_data/customer-dentist-qa.jsonl --pad-system 3000
```

The second line pads every example to make them longer. Unsloth has to be installed for the comparison
(`pip install tawi-ai[unsloth]`). If your numbers look different, we'd like to see them: hello@tawihub.com.
