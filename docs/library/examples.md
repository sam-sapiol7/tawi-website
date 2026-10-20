---
title: "Examples"
sidebar_label: "Examples"
sidebar_position: 3
---


These scripts are in `examples/` in the Tawi repository. The test suite runs every one of them, so they work as
written. All but the last run on any computer; the last needs an NVIDIA GPU.

## 01_tracking_and_registry.py

```python
"""Record experiments with one decorator, cache a slow step, compare runs, and keep a model registry.
Runs anywhere (no GPU). Runs go to ./tawi_runs unless TAWI_RUNS is set."""
import os
import tempfile

import tawi


@tawi.step  # runs again only when its inputs (or the file's contents) or its code change
def count_words(path):
    with open(path, encoding="utf-8") as f:
        return len(f.read().split())


@tawi.track(project="examples", tags=["demo"])
def experiment(learning_rate=2e-4, epochs=3, data="demo_data/customer-dentist-qa.jsonl"):
    words = count_words(data)
    for step in range(epochs * 10):
        tawi.log(loss=2.0 / (1 + step * learning_rate * 1000))  # a curve
    return {"eval_loss": 0.4 / epochs, "words": words}  # numbers here become the run's final metrics


for lr in (1e-4, 2e-4):
    experiment(learning_rate=lr)

runs = tawi.runs("examples")[:2]
table = tawi.compare([r["id"] for r in runs])
for row in table["rows"]:
    print(row["param.learning_rate"], round(row["metric.eval_loss"], 3), row["metric.loss"])

# a registry entry for a model folder (here: a stand-in folder)
model_dir = tempfile.mkdtemp()
with open(os.path.join(model_dir, "adapter_config.json"), "w") as f:
    f.write("{}")
v = tawi.registry.register("dentist-example", model_dir, metrics={"eval_loss": 0.13})
tawi.registry.promote("dentist-example", v, "live")
print("live version:", tawi.registry.get("dentist-example", "live")["version"], "unchanged:", tawi.registry.verify("dentist-example"))
```

## 02_data.py

```python
"""Load, check, clean and split training data, and see exactly which tokens a fine-tune learns from.
Runs anywhere; downloads the Qwen3 tokenizer (a few MB) the first time."""
import tawi

ds = tawi.Dataset.from_file("demo_data/customer-dentist-qa.jsonl").with_system("You are the front desk of Maple Grove Dental.")
report = ds.check()
print(report["rows"], "rows,", report["duplicates"], "duplicates, problems:", report["problems"] or "none")

train, test = ds.dedupe().split(test_pct=10)  # the same questions are held out on every machine
print(len(train), "to train,", len(test), "to test")

from transformers import AutoTokenizer  # noqa: E402

tok = AutoTokenizer.from_pretrained("unsloth/Qwen3-0.6B")
row = train.tokenize(tok, max_len=512)[0]
learned = tok.decode([t for t, m in zip(row["input_ids"], row["labels_mask"]) if m])
print("the model learns only from:", repr(learned))
```

## 03_rag.py

```python
"""Index documents, search them, check how well search works, and answer with citations.
Runs on the CPU; downloads the small embedding model (130 MB) the first time."""
import json

import tawi

idx = tawi.rag.Index(chunker="paragraphs")
idx.add("demo_data/customer-dentist.json")  # files or whole folders: PDF, Word, HTML, Markdown, text, CSV, JSON
print(idx)

for hit in idx.search("How much is a check-up?", k=2):
    print(f"{hit['score']:.2f}  {hit['citation']}  {hit['text'][:80]}...")

# how often search finds the passage holding the answer
cases = [("How much is a check-up?", "165"), ("When do you open on Monday?", "8:00"), ("Where is the clinic?", "Bloor")]
report = idx.evaluate(cases, k=4)
print("hit@1", report["hit_at_1"], "hit@4", report["hit_at_4"], "MRR", round(report["mrr"], 2))

# without a model, answer() returns the best passage; with tawi.load_model(...) it writes a cited answer
print(json.dumps(idx.answer("What is the capital of France?"), indent=1))
```

## 04_evaluate.py

```python
"""Score answers against references, gate on a minimum, and run the safety check.
Any object with .batch(prompts, system=..., max_new_tokens=...) can be evaluated; this example uses a tiny
stand-in so it runs without a GPU. With a real model: model = tawi.load_model("qwen3-0.6b")."""
import tawi


class LookupModel:
    """Stand-in model: answers from a table, refuses everything else."""
    name = "lookup"
    table = {"How much is a check-up?": "A check-up costs $165.", "When do you open on Monday?": "We open at 9:00 am."}

    def batch(self, prompts, system=None, max_new_tokens=200):
        return [self.table.get(p, "Sorry, I can't help with that.") for p in prompts]


test = [("How much is a check-up?", "A check-up and cleaning costs $165."), ("When do you open on Monday?", "We open at 8:00 am on Monday.")]
report = tawi.evaluate(LookupModel(), test)
print(report["summary"])  # exact, token_f1, rouge_l, facts (numbers, prices, times, names found)

try:
    tawi.evaluate(LookupModel(), test, gate={"facts": 0.9}, track=False)
except tawi.GateFailed as e:
    print("gate:", e)  # in CI: `tawi eval --gate facts=0.9` exits with code 1

safety = tawi.redteam(LookupModel(), system="You are the front desk.", track=False)
print("safety:", safety["pass_rate"], safety["by_category"])
```

## 05_serve.py

```python
"""Serve an agent over the OpenAI-compatible API, and call it.
Here the server runs in-process (FastAPI's test client), so the example needs no GPU or port. For real:
    tawi.serve(tawi.load_model("adapter"), rag=index, port=8100, api_key="...")   or   tawi serve --model adapter --rag index
and call it with any OpenAI client: OpenAI(base_url="http://127.0.0.1:8100/v1", api_key="...")."""
from fastapi.testclient import TestClient

import tawi
from tawi.serving import make_app


class LookupModel:
    name = "lookup"

    def generate(self, prompt, system=None, history=(), max_new_tokens=256):
        return "We are open Monday to Friday, 8:00 am to 6:00 pm."

    def stream(self, prompt, system=None, history=(), max_new_tokens=256):
        yield from ("We are ", "open ", "8 to 6.")


client = TestClient(make_app(LookupModel(), api_key="sk-local-example"))
headers = {"Authorization": "Bearer sk-local-example"}
r = client.post("/v1/chat/completions", headers=headers,
                json={"model": "front-desk", "messages": [{"role": "user", "content": "When are you open?"}]})
print(r.json()["choices"][0]["message"]["content"])
print(client.post("/v1/chat", headers=headers, json={"message": "Hours?"}).json()["message"])
print("without the key:", client.post("/v1/chat", json={"message": "Hours?"}).status_code)
```

## 06_finetune_end_to_end.py

```python
"""The whole loop on a GPU (or Apple Silicon): fine-tune, answer, evaluate on held-out questions, register.
About a minute on an 8 GB NVIDIA laptop GPU with Qwen3 0.6B."""
import os
import tempfile

import tawi

system = "You are the front desk of Maple Grove Dental. Answer in one sentence."
train, test = tawi.Dataset.from_file("demo_data/customer-dentist-qa.jsonl").split(test_pct=10)
out = os.path.join(tempfile.mkdtemp(), "adapter")

result = tawi.finetune("qwen3-0.6b", train, out_dir=out, system=system, epochs=1)
print(f"trained {result['steps']} steps in {result['train_seconds']} s, loss {result['train_loss']:.3f}, {result.get('peak_vram_gb')} GB")

model = tawi.load_model(out)
print(model.generate("Where is the clinic?", system=system))
summary = tawi.evaluate(model, test, system=system)["summary"]
print("held-out:", {k: summary[k] for k in ("facts", "token_f1", "rouge_l")})
v = tawi.registry.register("dentist-example", out, metrics=summary)
print("registered version", v)
model.unload()
```
