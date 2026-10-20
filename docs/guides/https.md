---
sidebar_position: 5
sidebar_label: "HTTPS"
---

# Opening the studio to a network (HTTPS)

By default the studio listens on 127.0.0.1 only. To share it with your team, keep it on 127.0.0.1 and put an
HTTPS reverse proxy in front. Then set `TAWI_HTTPS=1` so session cookies are marked Secure and browsers get HSTS.

## Caddy (simplest: gets a certificate automatically)

```
studio.example.com {
    reverse_proxy 127.0.0.1:8000 {
        flush_interval -1        # stream answers as they are written
    }
}
```

## nginx

```
server {
    listen 443 ssl http2;
    server_name studio.example.com;
    ssl_certificate     /etc/letsencrypt/live/studio.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/studio.example.com/privkey.pem;
    client_max_body_size 200m;   # uploads (TAWI_MAX_UPLOAD_MB)
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;     # stream answers
        proxy_read_timeout 600s;
    }
}
```

Start the studio with proxy headers trusted from the proxy only:

    TAWI_HTTPS=1 python -m uvicorn tawi.app.server:app --host 127.0.0.1 --port 8000 --proxy-headers --forwarded-allow-ips 127.0.0.1

## What the studio does for you

- Accounts: the admin adds people under the user menu > Accounts (admin or member). New accounts choose
  their own password at first sign-in. Removing an account signs it out everywhere.
- Sessions: random tokens in HttpOnly, SameSite=Strict cookies (Secure with `TAWI_HTTPS=1`), 12 hours.
- CSRF: every change sends a token from a second cookie in a header; requests from other sites are refused.
- Headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin`, HSTS.
- Logs: API keys, bearer tokens, Hugging Face tokens, private keys and password values are masked.
- Passwords: PBKDF2-SHA256 with 200,000 rounds, in `studio_data/auth.json`.

Not yet: single sign-on, per-agent permissions, and sign-in rate limiting beyond a delay on wrong passwords.
