---
slug: better-search
title: "Follow-up questions and reranking: making document answers find the right passage"
authors: [tawi]
tags: [rag, benchmarks]
description: How Tawi's search handles "and on Saturday?", and what reranking costs, measured on dentist questions.
---

An agent that answers from documents is only as good as the passage it finds. We measured the two changes that moved
that number most, on the dentist clinic's documents and questions.

<!-- truncate -->

## Follow-up questions

People don't repeat themselves. After "What are your hours on Monday?" they ask "And on Saturday?", which on its own
matches nothing useful.

Tawi now notices when a question leans on the one before it, and searches the two together. A question that changes
topic is searched as it is. On 20 dentist follow-ups, the right passage came first **55%** of the time before and
**90%** after.

We also tried having a small model rewrite the question first. It scored 85%, and added 0.4 seconds to every
answer. The search-together approach is better and costs nothing, because no model is involved.

## Reranking

Search returns candidates from two methods at once: keywords (BM25) and meaning (embeddings). A reranker then reads
the question and each candidate together and puts them in order. It's slower than search, so the question is
whether it pays for itself.

| | Right passage first | Added time |
|---|---|---|
| Without reranking | 83% | |
| With reranking, GPU (20 candidates) | 86% | about 4 ms |
| With reranking, CPU (8 candidates) | 86% | about 0.1 s |

On the CPU, reranking 8 candidates instead of 20 kept the same accuracy at a fraction of the time. Reranking is now
on by default everywhere.

## Questions with two parts

"How much are a check-up and a filling?" asks for two passages. Tawi now searches each part and keeps the best
passage for each, so the answer can cover both.

## Measure your own

`scripts/rag_bench.py` in the Tawi repository measures search quality and milliseconds on the dentist data, and the
studio shows a timing breakdown (search, rerank, first word, generation) on every answer. In the library, the same
search is `tawi.rag.Index`; see the [library overview](/docs/library/overview).
