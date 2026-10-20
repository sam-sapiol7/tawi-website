---
sidebar_position: 1
sidebar_label: "Install"
---

# Installing Tawi.ai Studio

The studio runs on your own machine. One codebase; each platform gets its own backends.

| | Windows + NVIDIA | Linux + NVIDIA | Mac (Apple Silicon) | No GPU |
|---|---|---|---|---|
| Fine-tuning | Tawi's engine (CUDA); Unsloth optional | same | MLX, **Beta** | off |
| Answering | llama.cpp (CUDA), Transformers until the GGUF copy exists | same | llama.cpp (Metal), MLX until then | llama.cpp (CPU), slow |
| Search (RAG), deploy, notebooks | yes | yes | yes | yes |

## Windows with an NVIDIA GPU (tested: RTX 5050 laptop, driver 580+)

1. Python 3.12 or 3.13 from python.org.
2. In the project folder:

        python -m venv .venv
        .venv\Scripts\python -m pip install torch==2.11.0 torchvision==0.26.0 --index-url https://download.pytorch.org/whl/cu128
        .venv\Scripts\python -m pip install -r requirements\studio.txt -c constraints.txt

3. llama.cpp for fast answers (downloads the tested build for your OS and GPU, checked by SHA-256):

        .venv\Scripts\python -m tawi.setup_llama

   Without it, answers use Transformers (about 10 to 15 times slower). `TAWI_LLAMA_DIR` points elsewhere if you
   keep it somewhere else.
4. Double-click `start_studio.bat`, open http://127.0.0.1:8000, sign in with admin / admin and choose a password.

## Linux with an NVIDIA GPU

Same steps with `.venv/bin/python`; `python -m tawi.setup_llama` installs the CUDA 12.8 build.
On a server, the studio image is simpler: see `docker/studio.Dockerfile`. Put HTTPS in front before opening it
to a network ([https.md](../guides/https.md)).

## Mac with Apple Silicon (Beta)

    python3 -m venv .venv
    .venv/bin/python -m pip install mlx mlx-lm torch transformers peft safetensors -r requirements/test.txt
    .venv/bin/python -m tawi.setup_llama     # fast answers on Metal

Fine-tuning on a Mac is Beta: see [beta.md](../guides/beta.md). `bash scripts/mac_beta_test.sh` checks a Mac end to end.

## Settings

All settings are environment variables (`TAWI_x`; the old `ANTAHKARANA_x` names still work).

| Setting | Default | What it does |
|---|---|---|
| `TAWI_DATA` | `studio_data` | Agents, uploads, versions, accounts |
| `TAWI_LOGS` | `logs` | Log folder |
| `TAWI_ENGINE` | `auto` | `transformers` turns llama.cpp answering off |
| `TAWI_AUTO_EXPORT` | `1` | Make the llama.cpp (GGUF) copy of models and new versions in the background |
| `TAWI_LLAMA_DIR` | `tools/llama.cpp` | Where llama.cpp lives |
| `TAWI_OFFLINE` | `0` | `1`: no network at all; downloaded models keep working |
| `TAWI_REGISTRY_URL` | (bundled) | Your own `models.json` (see `scripts/publish_model.py`) |
| `TAWI_HTTPS` | `0` | `1` behind an HTTPS proxy: Secure cookies and HSTS |
| `TAWI_NB_PRELOAD` | (none) | Modules new notebook kernels import ahead of time, e.g. `torch,pandas` |
| `TAWI_NB_SPARE` | `1` | Keep one notebook kernel warm |
| `TAWI_UPDATE_CHECK` | `1` | Daily "new version available" check |
| `TAWI_ACCELERATOR` | (detected) | Force `cuda`, `metal` or `cpu` (support and tests) |
