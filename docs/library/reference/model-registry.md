---
title: "Model registry (tawi.registry)"
sidebar_label: "Model registry"
sidebar_position: 13
---


Module `tawi.registry`. Model registry: named models with numbered versions and stages, kept next to the runs (TAWI_RUNS/_registry).

## `tawi.registry.register`

```python
def register(name, path, run=None, metrics=None, notes='', copy=False, stage='draft')
```

Add a version of `name` from a model folder or file. Returns its version number.

## `tawi.registry.versions`

```python
def versions(name)
```

## `tawi.registry.get`

```python
def get(name, stage_or_version='live')
```

A version's record by number, or the newest version in a stage ("live", "tested", ...).

## `tawi.registry.promote`

```python
def promote(name, version, stage='live')
```

Move a version to a stage. Only one version is live: the previous live one becomes tested.

## `tawi.registry.rollback`

```python
def rollback(name)
```

Make the previously live version live again. Returns its record.

## `tawi.registry.verify`

```python
def verify(name, version='live')
```

True when the version's files are still there and unchanged since it was registered.

## `tawi.registry.names`

```python
def names()
```
