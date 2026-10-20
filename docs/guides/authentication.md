---
sidebar_position: 1
title: Authentication
description: API keys for the Agent API, and sessions for the Studio API.
---

# Authentication

Tawi has two APIs with two kinds of credentials:

| | Agent API (`/v1/...`) | Studio API (`/api/...`) |
|---|---|---|
| Who calls it | Your apps, to get answers | Scripts that automate the studio |
| Credential | The agent's API key, `ak_...` | A signed-in account's session cookie |
| Scope | One agent | Everything the account can do |

## Agent API keys

Each agent gets one key when you click **Make API** on the Go live step (or call `POST /api/bots/{bid}/make-api`).
The key is shown **once**. The studio stores only its SHA-256 hash and the first 8 characters (`key_prefix`), so
a lost key can't be recovered, only replaced.

Send it in either header:

```
Authorization: Bearer ak_...
X-API-Key: ak_...
```

`GET /v1/health` needs no key. The studio and agent containers also accept `?key=ak_...` in the URL so
`/query/...` can be tried from a browser address bar. Don't use that from apps: URLs end up in browser history,
proxies and logs.

A key belongs to one agent. Asking for another agent with it returns 401, as does a wrong or missing key.

### Rotating a key

**Go live > New key** (or `POST /api/bots/{bid}/rotate-key`) makes a new key and returns it once. The old key
stops working immediately, so update your app's secret first, or plan for a few seconds of 401s.

A container built before the rotation keeps the hash it was built with: redeploy it to switch it to the new key.

### Keeping keys safe

- Call the Agent API from your server. A key in a web page or mobile app can be read by anyone who has it.
- Keep keys in your secret store or environment, not in code.
- Each agent has its own key, so one leaked key exposes one agent, which you can rotate on its own.

### Limits that protect a key

On the studio, each key gets 30 requests a minute by default (`TAWI_RATE_PER_MIN`, or the agent's own limit set
with `PUT /api/bots/{bid}/api-limits`), and an agent can have a daily limit. An address that sends 30 wrong keys in
5 minutes is refused for 5 minutes. All of these return 429 with a `Retry-After` header. A container allows 30
requests a minute per key.

## `tawi serve`

`tawi serve --api-key KEY` (or `tawi.serve(..., api_key=KEY)`) checks the same two headers against the key you
chose. Without a key it only listens on 127.0.0.1, and refuses to listen beyond this machine.

## Studio API sessions

The Studio API uses the same sign-in as the studio's web page.

1. `POST /api/login` with `{"username": ..., "password": ...}`. The reply sets two cookies:
   `ak_session` (the session, valid 12 hours) and `tawi_csrf`.
2. Send the cookies with every request.
3. On every request that changes something (POST, PUT, PATCH, DELETE), also send the header
   `X-CSRF-Token` with the value of the `tawi_csrf` cookie. Without it the studio answers 403. This stops other
   web sites from acting with a signed-in browser's cookies.

```python
import requests

s = requests.Session()
s.post("http://127.0.0.1:8000/api/login", json={"username": "ci-bot", "password": "..."}).raise_for_status()
s.headers["X-CSRF-Token"] = s.cookies["tawi_csrf"]
print(s.get("http://127.0.0.1:8000/api/me").json())   # {"username": "ci-bot", "role": "member", "must_change": false}
```

Things to know:

- **Accounts and roles.** `admin` accounts also manage accounts, connected servers, hosted-model API keys, running
  notebook code and clearing data; `member` accounts do everything else. Give automation its own `member` account.
- **Temporary passwords.** A new account's password (and the first `admin` / `admin`) is temporary. From any
  address other than the studio's own PC it can do nothing but change the password
  (`POST /api/change-password`), so sign in once and change it before automating from elsewhere.
- **Wrong passwords.** 10 wrong passwords from one address in 15 minutes lock that address out for 15 minutes (429).
- **HTTPS.** Behind an HTTPS reverse proxy set `TAWI_HTTPS=1`, so cookies are marked Secure
  ([https.md](https.md)).
- **Signing out.** `POST /api/logout` ends the session. Changing a password signs out every other session of the
  account.
