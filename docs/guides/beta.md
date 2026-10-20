---
sidebar_position: 8
sidebar_label: "What Beta means"
---

# What Beta means

Features marked **Beta** work, but have been tested on fewer machines and may change. Today that is
**fine-tuning and answering on a Mac (Apple Silicon, MLX)**.

## Mac (MLX) status

- Training (`tawi/backends/train/mlx_job.py`) writes the same files as the NVIDIA job, including a standard
  Hugging Face (PEFT) adapter, so the versions page, the comparison, GGUF export and deploy work unchanged.
  The conversion is checked on every test run: a Mac adapter loaded into PEFT gives the same output as MLX.
- 16-bit trains the full-precision model with LoRA; Q8 quantizes the base model to 8 bits first.
- Loss is on the assistant replies only, like on NVIDIA. Resuming restores the adapter weights; the optimizer restarts.
- Answering uses llama.cpp (Metal) once the GGUF copy exists, MLX until then. Versions trained on NVIDIA answer
  on a Mac through their GGUF copy.
- Not tested on real Macs yet. `bash scripts/mac_beta_test.sh` trains the dentist demo, compares answers before
  and after, tries llama.cpp, and writes a zip with the results to share.

## What to report

The zip from the test script, plus your Mac model and memory. Training loss falling from about 3 to under 1 and
the trained answers naming "218 Bloor Street West" mean it works.
