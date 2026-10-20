---
sidebar_position: 6
sidebar_label: "Running in production"
---

# Running Tawi in production

## Limits and costs
| What | Default | Where to change it |
|---|---|---|
| Requests a minute per API key | 30 | Go live > Limits (per agent), or `TAWI_RATE_PER_MIN` |
| Requests a day per agent | none | Go live > Limits |
| Wrong API keys per address | 30 in 5 minutes, then 429 | fixed |
| Wrong passwords per address | 10 in 15 minutes, then 429 | fixed |
| Hosted-model spend (Claude, OpenAI) | $10 a day (estimate from token counts) | `TAWI_PROVIDER_DAILY_USD`; today's spend is under user menu > API keys |
| Upload size | 200 MB | `TAWI_MAX_UPLOAD_MB` |
| Message length | 4,000 characters | fixed |
| Answer cache (identical questions, no history) | 2,000 answers for 10 minutes | `TAWI_ANSWER_CACHE_SIZE`, `TAWI_ANSWER_CACHE_TTL` |

Every 429 carries a `Retry-After` header. Calls to Claude and OpenAI time out after 120 s and are retried 3 times (rate
limits, server errors, dropped connections) by the official SDKs.

## Failures
- Errors return a plain message and a `ref` matching `X-Request-ID` and a line in `logs/errors.log` (tracebacks
  included; secrets masked).
- Answering falls back from llama.cpp to Transformers if llama.cpp fails. Training and preference tuning that run out
  of GPU memory retry with checkpointing on.
- A second training run on the same agent is refused (409) while one runs. A run started right after another waits
  up to 2 minutes for the GPU instead of refusing.
- Synthetic-data jobs can't overlap per agent (409). Preference ratings are append-only.

## Speed
- Responses over 1 KB are gzip-compressed; answer streams are not, so words still arrive as they're written.
- Large lists page: `/api/experiments?limit=&offset=`.
- Data is stored in files (JSON and JSONL), not a database. API keys are looked up through an in-memory index from key
  hash to agent, so no scan per request.

## Uptime
- `GET /v1/health`: point UptimeRobot, Better Stack or a load balancer at it.
- `tawi monitor --url https://studio.example.com --webhook <Slack, Teams or Discord webhook>` checks every minute,
  alerts when the service goes down and when it comes back, and keeps a history in `logs/monitor.jsonl`.
- Docker images have a built-in HEALTHCHECK.

## Backups
- `tawi backup [file.zip]` covers agents, versions (adapters), search indexes, accounts, keys (still encrypted),
  ratings and notebooks. Every file is stored with its SHA-256. GGUF copies and checkpoints are left out because they
  can be rebuilt; add `--models` to include them.
- `tawi restore file.zip` verifies every file first; a damaged backup changes nothing. The current data folder is kept
  as `<folder>.before-restore-<time>`. Stop the studio first.
- Tested in `tests/test_production.py`: a backup, a restore, and a tampered backup that is refused.
- Schedule it: Windows Task Scheduler, or cron on Linux and Mac (`0 3 * * * tawi backup /backups/tawi-$(date +\%a).zip`
  keeps a week).

## Many users at once
- `python scripts/load_test.py --users 16 --requests 64` makes a temporary agent and fires real questions at once.
  It reports success rate, p50/p95 latency, cache hits and throughput. Results go to `runs/scenarios/`.
- `tests/test_production.py` also sends 30 simultaneous users through the API on every test run.

## Scenarios
- `python scripts/scenario_alignment.py` clicks through fine-tuning, rating answers and every preference-tuning
  method on a temporary agent, the way a person would, and records timings and held-out scores per version.
