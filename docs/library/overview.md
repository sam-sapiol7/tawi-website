---
sidebar_position: 1
sidebar_label: "Overview"
---

# The Tawi library (`import tawi`)

Every function with its signature: [api-reference.md](reference/index.md). Runnable examples: `examples/` (they run as part of
the test suite, so they stay correct).

The same training, search, evaluation and serving the studio uses, as Python. Install with
`pip install tawi-ai`, then `tawi setup` once (CUDA PyTorch on NVIDIA, llama.cpp everywhere).

## Ten lines, end to end

```python
import tawi

ds = tawi.Dataset.from_file("qa.jsonl").dedupe()                 # chat JSONL, Q&A JSONL, CSV, or text
train, test = ds.split(test_pct=10)                              # stable: a question never lands on both sides

result = tawi.finetune("qwen3-0.6b", train, out_dir="adapter", system="You are the front desk.")
model = tawi.load_model("adapter")                               # llama.cpp once its GGUF copy exists

docs = tawi.rag.Index(chunker="headings"); docs.add("docs/"); docs.save("index")
print(tawi.evaluate(model, test, rag=docs, gate={"facts": 0.8})["summary"])
print(tawi.redteam(model, system="You are the front desk.", rag=docs, min_pass=0.8)["pass_rate"])
tawi.serve(model, rag=docs, port=8100)                           # OpenAI-compatible: base_url http://127.0.0.1:8100/v1
```

## Data: `tawi.Dataset`
- `from_file`, `from_pairs`, `from_list`; `check()` reports empty rows, duplicates, personal data, long examples.
- `clean()`, `dedupe()`, `with_system(prompt)`, `split(test_pct)`, `to_jsonl(path)`, `sha` (for tracking).
- `tokenize(tokenizer, max_len)` gives token ids plus a mask that is 1 only on assistant replies. The mask is read
  from each model's own chat template, so no per-model markers are needed (checked on Qwen and Gemma, multi-turn).

## Fine-tuning: `tawi.finetune(model, data, out_dir, ...)`
- Our own loop: PEFT LoRA, a chunked loss that never builds the tokens x vocabulary logits, checkpointing only when
  the batch doesn't fit without it (retries with it if memory runs out), fused AdamW, warmup and decay.
- 16-bit, Q8 or Q4 (QLoRA). Settings default to `tawi.suggest(model)`. `checkpoint_dir` + `save_steps` save and resume.
- Measured on the RTX 5050 laptop against Unsloth with the same data and settings:

  | Model | Tawi | Unsloth |
  |---|---|---|
  | Qwen3 0.6B (dentist) | 16 s | 52 to 104 s |
  | Qwen3 1.7B, 16-bit | 35 s | 75 s |
  | Qwen3 1.7B, 4-bit | 60 s | 72 s |
  | Qwen3 0.6B, ~1,000-token examples | 110 s | 130 s |

- On Apple Silicon the same call trains with MLX (Beta).

## Search: `tawi.rag.Index`
- `add(files or folders)` for PDF, Word, HTML, Markdown, text, CSV and JSON; `add_text`, `add_pairs`.
- Chunkers: `paragraphs` (default), `headings` (each chunk carries its heading path), `sentences`, `fixed`.
- PDF tables become Markdown tables (header row repeated in every chunk), scanned PDFs are read with OCR when
  `pip install tawi-ai[ocr]` is installed, Word tables keep their header row, web pages lose scripts and menus.
- `search(q, k)`: hybrid BM25 + embeddings, reranked by a cross-encoder by default (`Index(rerank=False)` or
  `search(..., rerank=False)` turns it off). Dentist demo: right passage first 83% to 86%, +4 ms on a GPU, about
  +0.1 s on the CPU (8 candidates there instead of 20).
- `answer(q, model, history=[(q, a), ...])`: cited answer, or "I don't know" when nothing scores above `min_score`.
  A follow-up ("and on Saturday?") is searched together with the previous question (right passage first 55% to 90%
  on 20 dentist follow-ups); each part of "A and B" questions is searched too. The result has `query` and `timing`
  (search, rerank and generation milliseconds).
- `tawi.serve(..., rag=idx)` passes the conversation to `answer` and caches answers to repeated questions.
- `evaluate(cases)`: hit rate and MRR. `save(path)` / `Index.load(path)`.

## Quality and safety: `tawi.evaluate`, `tawi.redteam`
- Metrics: `exact`, `token_f1`, `rouge_l`, `facts` (numbers, prices, times and names from the reference found in the
  answer), and `judge` (a model's yes/no). `gate={"facts": 0.8}` raises `tawi.GateFailed`.
- `redteam`: the studio's 50 attacks (injection, prompt leaks, personal data, advice, off-topic, harm), with a hidden
  marker that detects leaks for certain. `min_pass=0.8` gates.

## Tracking: `@tawi.track`, `@tawi.step`, `tawi.registry`
- `@tawi.track(project=...)` records arguments, returned metrics, `tawi.log(...)` curves, artifacts, git commit,
  data hashes, packages and hardware. Secrets (arguments named like key, token, password) are never recorded.
- `@tawi.step` caches a function's result until its arguments, the contents of file arguments, or its code change.
- `tawi.runs()`, `tawi.compare(ids)`, `tawi.to_mlflow(id)`. Runs live in `TAWI_RUNS` (default `./tawi_runs`).
- `tawi.registry.register(name, path)`, `promote(name, v, "live")`, `rollback(name)`, `verify(name)`.

## Answering: `tawi.load_model(name, precision)`
`generate`, `stream`, `batch` on llama.cpp (when a GGUF copy exists), Transformers on NVIDIA or MLX on a Mac.
`tawi.fits(model)` and `tawi.suggest(model)` say what fits on this machine.

## Command line
`tawi studio | setup | doctor | finetune | eval | redteam | index | serve | runs`. `tawi eval --gate facts=0.8` and
`tawi redteam --min-pass 0.8` exit with code 1 below the bar, for CI.
