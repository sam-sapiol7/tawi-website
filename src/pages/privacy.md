---
title: Privacy
description: What this website and the Tawi software collect, and what they send.
---

# Privacy

*Last updated 20 October 2026.*

## This website

- **No cookies, no tracking.** We count visits with Cloudflare Web Analytics, which sets no cookies, doesn't
  fingerprint visitors and doesn't follow anyone across sites. We see totals such as page views, referring sites and
  countries.
- **Hosting.** The site is served by Cloudflare, which processes visitors' IP addresses to deliver pages and stop
  attacks, as any web host does.
- **Search** on this site runs in your browser. What you type isn't sent anywhere.
- **No fonts or scripts from other companies** are loaded.

## The Tawi software

Tawi runs on your computer. Your documents, examples, agents, conversations and API keys stay there, and we never
receive them. The software contacts other services only in these cases:

| When | Where | What is sent |
|---|---|---|
| Once a day, to check for a new version | pypi.org | A request for Tawi's latest version number. Turn it off with `TAWI_UPDATE_CHECK=0`, or all network use with `TAWI_OFFLINE=1`. |
| When you download a model | Hugging Face | A request for that model's files |
| When you run `tawi setup` | GitHub, PyTorch | Requests for the llama.cpp and PyTorch builds for your computer |
| Only if you add a Claude or OpenAI key and use those models | Anthropic or OpenAI | The prompts you choose to send, under that provider's terms |

There is no telemetry, crash reporting or analytics in the software.

## Agents you build

When your agents answer your customers, you are responsible for that data, not us; we have no access to it. By
default an agent keeps only the last few turns of each conversation, in memory, and forgets them when it restarts.
Usage counts are saved; message text is not.

## Contact

Questions about privacy: **privacy@tawihub.com**.
