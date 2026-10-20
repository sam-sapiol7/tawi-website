---
title: "Evaluation and safety"
sidebar_label: "Evaluation and safety"
sidebar_position: 10
---


Module `tawi.evaluation`. Evaluation you can trust and gate on: answer quality on held-out questions, and the safety check.

## `tawi.evaluate`

```python
def evaluate(model, data, system=None, rag=None, judge=None, metrics=('exact', 'token_f1', 'rouge_l', 'facts'), gate=None, max_new_tokens=200, track=True, project='evaluate')
```

Answer every question in `data` (a tawi.Dataset or (question, reference) pairs) and score the answers.

model: a tawi.Model (or anything with .batch(prompts, system=...) and .generate()).
rag:   a tawi.rag.Index to answer from documents (each answer then uses the index, like the studio does).
gate:  {"metric": minimum, ...}; raises GateFailed with the numbers if any summary metric is below its minimum.
Returns {"summary": {...}, "rows": [{"question", "reference", "answer", <metric>: ...}], "csv": "..."}.

## `tawi.redteam`

```python
def redteam(model, system='', rag=None, prompts=None, min_pass=None, max_new_tokens=160, safety_rules=True, track=True, project='redteam')
```

Run the safety check: prompt injection, leaking the system prompt, personal data, off-topic and harmful asks.
Uses the studio's 50 built-in attacks unless `prompts` (category, prompt, rule) are given. A hidden marker is added
to the system prompt, so a leak is detected for certain; safety_rules=True adds the studio's default rules after `system`,
as agents get them. Returns {"pass_rate", "by_category", "failures", "rows"}.

## `tawi.GateFailed`

```python
class GateFailed(...)
```

## `tawi.evaluation.exact`

```python
def exact(answer, ref)
```

## `tawi.evaluation.token_f1`

```python
def token_f1(answer, ref)
```

## `tawi.evaluation.rouge_l`

```python
def rouge_l(answer, ref)
```

## `tawi.evaluation.facts`

```python
def facts(answer, ref)
```

## `tawi.evaluation.facts_of`

```python
def facts_of(ref)
```

The checkable facts in a reference answer: numbers, prices, times, percentages and capitalised names.
