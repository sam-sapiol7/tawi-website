---
title: "What fits here"
sidebar_label: "What fits here"
sidebar_position: 8
---


Module `tawi.hardware`. What fits on this machine, and good starting settings for it.

## `tawi.fits`

```python
def fits(model, memory=None)
```

For each precision: estimated GB to chat and to fine-tune, and whether each fits (with 0.4 GB spare).

## `tawi.suggest`

```python
def suggest(model, memory=None, kind='qa')
```

Starting settings: the most precise precision that trains here, and batch settings from the tested defaults.
