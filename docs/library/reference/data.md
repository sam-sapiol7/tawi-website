---
title: "Data"
sidebar_label: "Data"
sidebar_position: 1
---


Module `tawi.data`. Training data: load, check, clean, split and format it for a model.

## `tawi.Dataset`

```python
class Dataset(rows, kind=None, source=None)
```

Rows of training data: {"messages": [...]} conversations (kind "qa") or {"text": ...} (kind "text").
Every cleaning method returns a new Dataset; the original is unchanged.

- `check(self, tokenizer=None, max_len=None)`: A report of what's in the data and what may need fixing.
- `clean(self)`: Drop empty rows and conversations without an assistant reply.
- `dedupe(self)`: Drop exact duplicates (ignoring case and spacing), keeping the first.
- `from_file(path, kind=None)`: Chat JSONL ({"messages": [...]}), JSONL with question/answer (or prompt/response, input/output), JSONL with
- `from_list(rows, kind=None)`: From a list of dicts in any of the file formats from_file accepts.
- `from_pairs(pairs, system=None)`: From (question, answer) pairs, optionally with a system prompt on each.
- `sha`: A short hash of the contents (for tracking which data a run used).
- `split(self, test_pct=10)`: (train, test). Stable: decided by a hash of the question, so the same question is always on the same side,
- `texts(self, tokenizer, template_kwargs=None)`: The chat-formatted text of every row (what the model sees).
- `to_jsonl(self, path)`: Write chat JSONL (one row per line). Returns the path.
- `tokenize(self, tokenizer, max_len=2048, template_kwargs=None)`: [{"input_ids", "labels_mask"}]: mask 1 on tokens the loss should use (assistant replies, or all raw text).
- `with_system(self, prompt, replace=False)`: Put a system prompt on every conversation (keeps existing ones unless replace=True).

## `tawi.data.reply_segments`

```python
def reply_segments(tokenizer, messages, template_kwargs=None)
```

[(text, trained)] covering the whole formatted conversation, trained=True on each assistant reply.

Each reply is found by rendering the conversation up to it with the generation prompt (where the reply starts)
and through it (where it ends). Templates that rewrite earlier turns (some drop old reasoning) fall back to
training only the last reply.

## `tawi.data.DataError`

```python
class DataError(...)
```

The data can't be used as given (no usable rows, missing columns, a chat template that hides the replies).
