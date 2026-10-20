---
sidebar_position: 7
sidebar_label: "Troubleshooting"
---

# Troubleshooting

Every error message in the studio ends with a `ref`. Search for it on the Logs page (user menu > Logs) to find
the request and its traceback.

## Answers are slow
- Open the GPU pill: the Engine column should say llama.cpp. If it says Transformers, the llama.cpp copy isn't made
  yet (it is made in the background after training; `export.log` in the version's `gguf` folder says why it failed)
  or llama.cpp isn't installed (`tools/llama.cpp`, see [install.md](../start/install.md)).
- The first answer after a start loads the model (a few seconds). The studio unloads models idle for 15 minutes.
- Laptops: plug in power. On battery, Windows and NVIDIA throttle the GPU heavily.
- NVIDIA Control Panel > Manage 3D settings > Power management mode: Prefer maximum performance (for python.exe
  and llama-server.exe) helps on laptops with Optimus.

## "PyTorch can't use the GPU" / training is off
- `nvidia-smi` must work in a terminal. Update the NVIDIA driver (580 or newer for CUDA 12.8).
- The venv needs the CUDA build of PyTorch (`torch.__version__` ends in `+cu128`). Install with `-c constraints.txt`
  so other packages don't replace it with the CPU build.

## Out of GPU memory
- Free the GPU from the GPU pill (unloads answering models), close games and other GPU apps.
- Pick a smaller model, a shorter max length, batch size 1, or Q8 (advanced) on the Fine-tune step.

## Antivirus and Windows
- Windows Defender can slow the first model load and lock files briefly; add the project folder and
  `%USERPROFILE%\.cache\huggingface` as exclusions if loads are very slow or deletes fail.
- `llama-server.exe` must be allowed to listen on 127.0.0.1 (only local; no firewall prompt is expected).

## Downloads
- Offline mode (`TAWI_OFFLINE=1`) turns downloads off. A cancelled or interrupted download resumes on Download.
- "Checksum mismatch": the file was damaged in transit or changed upstream; it was removed, download again.

## Docker
- Docker Desktop must be running. GPU containers need the NVIDIA Container Toolkit (Linux) or WSL 2 GPU support (Windows).
- `docker logs tawi-<agent>` shows the agent API's own log.

## Reset
- Forgot the password: stop the studio and delete `studio_data/auth.json`; it starts again with admin / admin.
- User menu > Clear all data deletes agents but keeps accounts, notebooks and servers.
