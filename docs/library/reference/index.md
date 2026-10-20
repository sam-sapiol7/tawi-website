---
title: "Library reference"
sidebar_label: "Reference"
sidebar_position: 2
---


Every public function and class of `import tawi`, with its signature and docstring, generated from the code.
For an overview, see [the library](../overview.md); for runnable code, see [the examples](../examples.md).

- [Data](data.md): `Dataset`, `reply_segments`, `DataError`
- [Fine-tuning](fine-tuning.md): `finetune`
- [Fine-tuning: the loss](fine-tuning-the-loss.md): `chunked_lm_loss`
- [Synthetic data (tawi.synth)](synthetic-data.md): `generate`
- [Preference tuning (tawi.align)](preference-tuning.md): `pairs_from_ratings`, `reference_pairs`, `ai_pairs`, `dpo`, `train_reward_model`, `RewardModel`, `ppo`, `save_pairs`, `load_pairs`
- [Hosted models and API keys (tawi.providers)](hosted-models-and-api-keys.md): `get`, `set_key`, `get_key`, `status`, `Claude`, `OpenAI`, `Local`
- [Answering](answering.md): `load_model`, `Model`
- [What fits here](what-fits-here.md): `fits`, `suggest`
- [Search (RAG)](search.md): `Index`, `chunk_text`, `load_file`, `html_text`
- [Evaluation and safety](evaluation-and-safety.md): `evaluate`, `redteam`, `GateFailed`, `exact`, `token_f1`, `rouge_l`, `facts`, `facts_of`
- [Serving](serving.md): `serve`, `make_app`
- [Tracking](tracking.md): `track`, `step`, `run`, `current`, `log`, `log_params`, `log_artifact`, `tag`, `runs`, `get_run`, `metrics`, `compare`, `to_mlflow`, `Run`
- [Model registry (tawi.registry)](model-registry.md): `register`, `versions`, `get`, `promote`, `rollback`, `verify`, `names`
- [Setup](setup.md): `install`
