---
title: Security
description: How Tawi protects your studio, your agents and your data, and how to report a vulnerability.
---

# Security

## Reporting a vulnerability

Email **security@tawihub.com** with what you found and how to reproduce it. We'll confirm we have it and keep you
informed while we fix it. Please give us a reasonable time to ship a fix before you publish details, and don't test
against studios or agents that aren't yours.

## How the studio is protected

The studio runs on your own computer and listens only on `127.0.0.1` unless you open it to a network.

- **Accounts.** Passwords are hashed with PBKDF2-SHA256 (200,000 rounds, a salt per account). From another
  computer, an account still on the default `admin` / `admin` or on a temporary password can do nothing until it
  chooses its own password. Wrong passwords are rate limited per address.
- **Sessions.** Random 256-bit tokens in HttpOnly, SameSite=Strict cookies. Every request that changes something
  needs a CSRF token. Changing a password signs out the account's other sessions.
- **Roles.** Only admins can run code (notebooks), run commands on connected servers, manage accounts or delete
  data. Members build and test agents.
- **API keys.** Stored only as SHA-256 hashes and compared in constant time. Each key works for one agent, is rate
  limited, and can be rotated at any time.
- **The page itself.** A strict Content-Security-Policy, no third-party scripts or fonts, and everything shown is
  escaped.
- **Logs.** Requests are logged without the text people type, and keys, tokens and passwords are masked.

## How agents are protected

- **Safety check before going live.** Every agent faces 50 attack prompts (instruction injection, prompt
  extraction, off-topic and harmful requests, risky advice, personal data). Its API stays off until it handles at
  least 80% safely, and changing its documents or instructions clears the result.
- **Documents can't give orders.** Text found in documents is passed to the model as quoted material, with its own
  boundaries, so a document saying "ignore your rules" is treated as content, not as an instruction.
- **Answers are checked.** Answers that would reveal the agent's instructions are blocked, and personal data in
  uploads can be found and redacted before training.

## Reviews

The studio, the Agent API, the search pipeline and the agent containers were reviewed on 17 October 2026 against the
OWASP Top 10 and the OWASP Top 10 for LLM Applications, with a dependency scan. All three high-severity findings
were fixed, each with a test that keeps it fixed, and the remaining lower-severity items are being worked through.
A penetration test of a real deployment hasn't been done yet.

## Running it safely

If you open the studio to a network, put HTTPS in front of it and set `TAWI_HTTPS=1`
([HTTPS guide](/docs/guides/https)). Agent containers serve only the Agent API, so they are the right thing to
expose to the internet; keep the studio private.
