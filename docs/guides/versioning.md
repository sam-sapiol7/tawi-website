---
sidebar_position: 4
title: Versioning and compatibility
description: What can change in each API, how changes are announced, and how agent versions relate to API versions.
---

# Versioning and compatibility

Three different things are versioned, and they move independently:

| | Example | Changes when |
|---|---|---|
| The Agent API | `/v1`, spec version `1.0.0` | The contract your apps rely on changes |
| The Studio API | spec version `0.1.0` | The studio's own features change |
| An agent | `maple-grove-dental@v3` | You train the agent again |

## The Agent API

The Agent API's major version is in the path: `/v1/...`. Within `/v1`:

- **Will not change:** existing paths, existing request fields and their meaning, existing response fields and
  their types, status codes for existing errors, and the streaming event shapes (`delta`, `done`, `error`,
  `[DONE]`).
- **May be added:** new endpoints, new optional request fields, new response fields, new values in `timing`,
  new `checks`. Write clients that ignore fields they don't know.

A change that breaks those rules would go into a new `/v2`, served next to `/v1` for a transition period
announced in the changelog. *This is the policy proposed with this documentation; how long `/v1` stays after a
`/v2` ships hasn't been decided.*

The spec's `info.version` follows semantic versioning for the contract: a minor bump for additions, a patch bump
for documentation fixes.

## The Studio API

The Studio API serves the studio's web page and changes with it. While the studio is below 1.0, any minor release
may change it; every change is listed in [CHANGELOG.md](/changelog). Scripts that use it should pin the
studio version they were written for (`GET /api/version` reports it).

## Agent versions

Training an agent again makes a new agent version (`v1`, `v2`, ...). This has nothing to do with the API's version:
`/v1/chat` serves every agent version.

- `"agent": "maple-grove-dental"` gets the **Live** version, so publishing a new version in the studio changes
  answers without any change to your app.
- `"agent": "maple-grove-dental@v2"` pins a version, as long as it passed the safety check.

Rolling back (`POST /api/bots/{bid}/versions/rollback`, or **Rollback** in the studio) makes the previous Live
version live again immediately.

## The specs follow the code

The specs in `docs/openapi/` are generated from the code by `scripts/gen_openapi.py`, with the descriptions kept
in `docs/openapi/overlay/`. CI fails when the code changes and the specs weren't regenerated, so each commit's specs
describe exactly that commit's API. Each release also publishes its specs, guides and library reference to the docs
website, where every version keeps its own copy: the newest at `tawihub.com/docs`, older ones at
`tawihub.com/docs/<version>/`.
