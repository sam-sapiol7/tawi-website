---
title: "Preference tuning (tawi.align)"
sidebar_label: "Preference tuning"
sidebar_position: 5
---


Module `tawi.ft.preference`. Preference tuning after fine-tuning: make the model prefer better answers.

## `tawi.align.pairs_from_ratings`

```python
def pairs_from_ratings(ratings)
```

Human ratings to DPO pairs. Accepts {"prompt", "chosen", "rejected"} rows as they are, and groups
{"prompt", "answer", "rating": +1/-1} rows into every (liked, disliked) combination for the same prompt.

## `tawi.align.reference_pairs`

```python
def reference_pairs(model, data, system=None, max_new_tokens=200, max_facts=0.99)
```

No humans and no judge: where the model's answer misses facts of the reference answer, the reference is
`chosen` and the model's answer `rejected`. `data` is a tawi.Dataset or (question, reference) pairs.

## `tawi.align.ai_pairs`

```python
def ai_pairs(model, prompts, judge='claude', references=None, system=None, base=None, max_new_tokens=200, seed=0)
```

RLAIF: two candidate answers per prompt (the model's, and the base model's or the reference), a judge picks the
better one. Candidates are shown in random order so the judge can't favour a position. Returns DPO pairs.

## `tawi.align.dpo`

```python
def dpo(model, pairs, out_dir='tawi_dpo', beta=0.1, epochs=1, learning_rate=5e-06, batch_size=4, max_len=1024, precision='16bit', sft_weight=1.0, on_step=None, track=True, project='align')
```

Direct Preference Optimization: raise the likelihood of `chosen` over `rejected` relative to the starting model
(whose log-probabilities are computed once up front, so no second copy of the model is kept in memory).
`model` is a fine-tuned adapter folder (usual) or a base model. sft_weight adds the chosen answers' own
likelihood to the loss (per token, as in RPO): plain DPO only pushes the two answers apart and can drift away
from good answers altogether; measured on the dentist agent, plain DPO halved the held-out facts score.
Returns losses, reward margin and accuracy.

## `tawi.align.train_reward_model`

```python
def train_reward_model(model, pairs, out_dir='tawi_reward', epochs=1, learning_rate=2e-05, batch_size=4, max_len=1024, track=True, project='align')
```

Bradley-Terry reward model from preference pairs: score(chosen) should beat score(rejected). Returns accuracy.

## `tawi.align.RewardModel`

```python
class RewardModel(path)
```

Scores (prompt, answer) with a scalar: the base model + a LoRA + a linear head on the last token.

- `score(self, prompts, answers, system=None)`

## `tawi.align.ppo`

```python
def ppo(model, prompts, reward='claude', out_dir='tawi_ppo', steps=50, group=4, batch_prompts=2, learning_rate=1e-06, clip=0.2, kl=0.02, ppo_epochs=2, max_new_tokens=128, temperature=0.9, system=None, on_step=None, track=True, project='align')
```

RLHF with PPO's clipped objective. Each step: sample `group` answers for each of `batch_prompts` prompts, score
them with `reward` (a RewardModel or its folder, a judge such as "claude" or "openai", or a function), use each
answer's reward minus its group's mean (divided by the group's spread) as the advantage, then take `ppo_epochs`
clipped updates, with a KL penalty that keeps the model close to where it started.

## `tawi.align.save_pairs`

```python
def save_pairs(pairs, path)
```

## `tawi.align.load_pairs`

```python
def load_pairs(path)
```
