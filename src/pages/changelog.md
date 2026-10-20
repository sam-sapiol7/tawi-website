---
title: Changelog
description: What changed in each version of Tawi.
---

# Changelog

Versions follow semantic versioning (MAJOR.MINOR.PATCH). Each release tag `vX.Y.Z` needs a section here.

## Unreleased

### API documentation
- OpenAPI 3.1 specs for both APIs, generated from the code: `docs/openapi/agent.yaml` (the Agent API apps call:
  `/v1/chat`, OpenAI-compatible completions, health, with which of the studio, agent containers and `tawi serve`
  serves each) and `docs/openapi/studio.yaml` (all 123 Studio API routes, with sign-in, CSRF and admin markings
  taken from the code). Descriptions, response schemas and examples live in `docs/openapi/overlay/`.
- `scripts/gen_openapi.py` writes them; CI fails when they are out of date, when a route is in neither spec, when an
  operation has no description or response schema, or when the studio's real answers don't match the schemas
  (`tests/test_openapi.py`), and lints them with Redocly (`redocly.yaml`, new `api-docs` job).
- Guides in `docs/guides/`: quickstart, authentication, Agent API, Studio API (automating training and publishing),
  and versioning.
- `scripts/export_site_docs.py` writes what the docs website builds from: the specs (YAML and JSON), the guides, and
  the library reference split into one page per section with the examples from `examples/`. Each release attaches it
  to the GitHub release as `tawi-docs-<version>.tar.gz` and asks the website to publish it (`docs` job in
  `release.yml`).
- The install page no longer says fine-tuning on NVIDIA uses Unsloth: Tawi's own engine is the default, Unsloth is
  optional.

### Better search (RAG), in the studio and the library
- Follow-up questions: "And on Saturday?" is searched together with the previous question when it leans on it
  (right passage first 55% to 90% on 20 dentist follow-ups); questions that change topic are searched as they are.
  No model call, so no added time (a small model rewriting the question scored 85% and cost 0.4 s).
- Multi-part questions ("How much are a check-up and a filling?", "compare A and B"): each part is searched and its
  best passage kept.
- Reranking is on by default and runs on the GPU when there is one: right passage first 83% to 86% for about 4 ms
  (0.1 s on the CPU, with 8 candidates instead of 20 and the same accuracy). Models load from the local cache first,
  so a network hiccup no longer breaks search.
- Speed: repeated questions skip the embedding model (query cache). Optional, off by default: reuse answers for
  questions that mean the same (Search settings > Advanced), and answer straight from a closely matching example
  without the model. Every answer reports a timing breakdown (search, rerank, first word, generation).
- Documents: PDF tables become real tables with their header row, scanned PDFs are read with OCR
  (`tawi-ai[ocr]`, RapidOCR on the CPU), Word tables keep their headers, and web pages (.html) can be uploaded.
- Connectors: sync an agent's documents from a Google Drive folder (service account) or Notion pages (integration
  secret), by hand or every 1, 6 or 24 hours. Changed files are downloaded again, deleted ones removed.
- `scripts/rag_bench.py` measures all of this on the dentist data (search quality and milliseconds).

### Hosted models, synthetic data and preference tuning
- API keys for Claude and OpenAI (user menu > API keys): encrypted on this machine (Windows DPAPI), masked in logs, never
  shown again; a Test button checks them. `tawi.providers` gives the same generate/batch/json interface for Claude
  (official SDK, claude-opus-5-5, server-side refusal fallback), OpenAI (official SDK) and local models.
- Synthetic data (Data step > Generate examples, `tawi.synth.generate`): from a description or the agent's documents;
  grounded examples are checked against their source; Q&A, instructions, classification, extraction, summaries;
  you review before adding.
- Preference tuning after fine-tuning (Fine-tune page > Preference tuning, `tawi.align`): DPO with people's ratings
  (thumbs up/down and "base was better" on the Test page), DPO against reference answers (no people, no judge),
  DPO with an AI judge (RLAIF), and RLHF with PPO (judge or a reward model trained on ratings). Each run is a new
  version. DPO adds the chosen answers' likelihood (RPO): plain DPO halved the dentist agent's held-out facts score,
  with it the score holds (0.48 before and after at the default learning rate).

### The library and the pip package
- `pip install tawi-ai`; `tawi setup` (CUDA PyTorch, llama.cpp), `tawi doctor`, `tawi studio` and more. Data lives in a
  per-user folder when installed (TAWI_HOME overrides).
- `import tawi`: Dataset, finetune (own engine, faster than Unsloth in every measured case; MLX on Mac), rag.Index
  (reranker, citations, evaluation), evaluate and redteam with gates, serve (OpenAI-compatible), load_model,
  @track / @step / registry. See docs/library.md.
- The studio trains with Tawi's engine by default (Unsloth selectable per agent); optional reranking in search;
  Q4 precision; one-command llama.cpp install.

### Faster answers (llama.cpp)
- Answers run on llama.cpp when a model has a GGUF copy: 0.1 to 0.3 s per answer on the RTX 5050 laptop for the
  dentist agent, was 3.4 to 5.9 s. Decode speed 152 tokens/s in 16-bit and 254 in Q8 (was 10 to 17).
- The GGUF copy (16-bit and Q8) is made in the background after training, and on first use of a base model.
  Until it exists, and if llama.cpp fails, answers fall back to Transformers. `TAWI_ENGINE=transformers` turns it off.
- Up to 4 requests per model are batched together; streaming starts with the first word.
- Docker agents ship their model file and run llama.cpp: no downloads at start, smaller image.

### Mac (Beta)
- Fine-tuning with MLX on Apple Silicon, same output files as NVIDIA; MLX answering until the GGUF copy exists.
- `scripts/mac_beta_test.sh` for testing on a Mac.

### Model hub
- Download button on model cards: progress, cancel, delete, resume, SHA-256 check, disk-space check.
- Licences that need acceptance (Gemma, Llama) are accepted once and recorded.
- Offline mode (`TAWI_OFFLINE=1`). Registry `tawi/core/models.json`, or your own via `TAWI_REGISTRY_URL`;
  `scripts/publish_model.py` pins revisions, checksums files and makes GGUF copies.

### Hardening
- Accounts with admin and member roles (user menu > Accounts); CSRF protection; Secure cookies and HSTS with
  `TAWI_HTTPS=1`; security headers; secrets masked in logs.
- Notebooks start Python when opened, and a spare kernel is kept warm: first cell 0.05 s (was 1.7 s).
  Optional `TAWI_NB_PRELOAD`.
- Version in the footer and a daily "new version available" check.
- CI on Windows, macOS and Linux; release workflow for PyPI and the studio image; `docker/studio.Dockerfile`.
- Docs: install, API, HTTPS, troubleshooting, Beta.

## 0.1.0

First internal version (as Antahkarana): training, RAG, safety checks, versions and MLOps, deploy with Docker.
