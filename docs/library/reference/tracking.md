---
title: "Tracking"
sidebar_label: "Tracking"
sidebar_position: 12
---


Module `tawi.tracking`. Experiment tracking you add with one decorator.

## `tawi.track`

```python
def track(fn=None, *, project=None, name=None, tags=None, log_args=True, exclude=())
```

Record every call of a function as a run. Use bare (`@tawi.track`) or with options
(`@tawi.track(project="dentist", tags=["baseline"], exclude=("api_key",))`). Arguments named in `exclude`, and any
argument whose name contains key, token, secret or password, are not recorded.

## `tawi.step`

```python
def step(fn=None, *, cache=True, name=None)
```

A pipeline step: its result is cached under TAWI_RUNS/_cache and reused while its inputs (argument values,
and the contents of file arguments) and its source code are unchanged. Inside a run, each call is logged as
`step.<name>` with whether it was cached. `fn.clear_cache()` forgets its results.

## `tawi.run`

```python
def run(name='run', project=None, params=None, tags=None)
```

A run as a context manager: `with tawi.run("sweep", params={...}) as r: r.log(loss=...)`.

## `tawi.current`

```python
def current()
```

The run in progress here, or None.

## `tawi.log`

```python
def log(step=None, **metrics)
```

## `tawi.log_params`

```python
def log_params(**params)
```

## `tawi.log_artifact`

```python
def log_artifact(path, name=None)
```

## `tawi.tag`

```python
def tag(*tags)
```

## `tawi.runs`

```python
def runs(project=None, status=None)
```

Recorded runs, newest first, as dicts (run.json). `project=None` lists every project.

## `tawi.get_run`

```python
def get_run(run_id, project=None)
```

## `tawi.metrics`

```python
def metrics(run_id, project=None)
```

The logged metric rows of a run.

## `tawi.compare`

```python
def compare(run_ids, project=None)
```

Rows of params and final metrics side by side: {"columns": [...], "rows": [...]}.

## `tawi.to_mlflow`

```python
def to_mlflow(run_id, project=None, tracking_uri=None, experiment=None)
```

Copy a run (params, metric history, tags, artifacts) into MLflow. Needs `pip install mlflow`.

## `tawi.tracking.Run`

```python
class Run(name, project='default', params=None, tags=None, parent=None, capture_env=True)
```

One recorded run (a folder under TAWI_RUNS). Made by @tawi.track or tawi.run(); use it as a context manager.

- `as_dict(self)`
- `finish(self, status='done', error=None, result=None)`
- `log(self, step=None, **metrics)`: Record metric values (numbers) at a step. The latest value of each is also kept as the run's metric.
- `log_artifact(self, path, name=None)`: Copy a file or folder into the run (artifacts/<name>), with its SHA-256.
- `log_params(self, **params)`
- `log_text(self, text, name='notes.txt')`
- `tag(self, *tags)`
