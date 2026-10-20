---
title: "Search (RAG)"
sidebar_label: "Search"
sidebar_position: 9
---


Module `tawi.rag`. Search your documents and answer from them (RAG), as a library.

## `tawi.rag.Index`

```python
class Index(embed_model='BAAI/bge-small-en-v1.5', chunker='paragraphs', chunk_chars=900, keyword_weight=0.3, min_score=None, rerank=True)
```

A searchable collection of document chunks and Q&A pairs.

embed_model: one of the studio's embedders (default BAAI/bge-small-en-v1.5, CPU)
chunker:     "paragraphs", "headings", "sentences" or "fixed" (see chunk_text); chunk_chars: chunk size
keyword_weight: share of BM25 in the hybrid score; min_score: below this similarity, answer() says "I don't know"
rerank:      reorder candidates with a cross-encoder by default (on the GPU when there is one; same as the studio)

- `add(self, *paths)`: Add files or whole folders (recursively). Returns the number of chunks added.
- `add_pairs(self, pairs)`
- `add_text(self, text, source='text')`
- `answer(self, question, model=None, k=4, rerank=None, system=None, max_new_tokens=256, history=())`: Answer from the documents with numbered citations. Without a model, returns the best matching text.
- `build(self, path=None)`
- `evaluate(self, cases, k=4, rerank=None)`: How well search finds the right material. `cases` are (question, expected) pairs, where expected is a source
- `load(path)`
- `save(self, path)`
- `search(self, query, k=4, rerank=None, candidates=None)`: Best matches, best first: [{"text", "source", "page", "section", "score", "hybrid", "citation"}].
- `search_many(self, queries, k=4, rerank=None, candidates=None)`

## `tawi.rag.chunk_text`

```python
def chunk_text(text, source, chunker='paragraphs', size=900, overlap=150)
```

Split text into chunks: [{"text", "source", "page", "section"}].

paragraphs  keep paragraphs together up to `size` characters (the studio's default)
headings    one chunk group per Markdown heading; each chunk starts with its heading path, so it is findable by topic
sentences   sentences packed up to `size`, with `overlap` characters repeated between neighbours
fixed       plain windows of `size` with `overlap`

## `tawi.rag.load_file`

```python
def load_file(path, chunker='paragraphs', size=900)
```

Chunks of one file. PDFs keep page numbers, Word files their sections, JSON becomes readable facts.

## `tawi.rag.html_text`

```python
def html_text(raw)
```

Readable text from HTML: scripts, styles and navigation dropped, headings kept as Markdown headings.
