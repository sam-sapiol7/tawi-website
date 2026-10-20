# tawi-website

The Tawi website and docs, built with [Docusaurus](https://docusaurus.io/) and served by Cloudflare Pages at
`tawi.ai` (`docs.tawi.ai` redirects to `tawi.ai/docs`).

```bash
npm ci
npm start          # http://localhost:3000, reloads as you edit
npm run build      # the site in build/, as deployed
```

Node 20 or newer.

## Where the pages come from

| Path | Source | Edit it |
|---|---|---|
| `docs/intro.md`, `docs/api/index.md`, `src/pages/` (home, download, security, privacy, terms, contact), `blog/` | This repo | Here |
| `docs/start/`, `docs/guides/`, `docs/library/`, `src/pages/changelog.md`, `static/openapi/` | The Tawi repo, copied by `npm run sync-docs` | In the Tawi repo (`docs/`, `CHANGELOG.md`, docstrings), then sync |
| `docs/api/agent/`, `docs/api/studio/` | Generated from `static/openapi/*.yaml` by `npm run gen-api` (part of `start` and `build`); not committed | In the Tawi repo's `docs/openapi/overlay/` |
| `versioned_docs/`, `versioned_sidebars/`, `versions.json` | Frozen copies of `docs/`, one per Tawi release | Don't; they are what each release's studio links to |

To preview the docs of a Tawi checkout:

```bash
npm run sync-docs -- --tawi ../antahkarana     # runs its scripts/export_site_docs.py
npm start
```

## Versions

`docs/` holds the newest docs. Until the first release is published here they are served at `/docs`; after that
the newest release is at `/docs`, older releases at `/docs/<version>`, and `docs/` at `/docs/next` as
"Next (unreleased)". `/docs/<newest version>/...` and `/docs/latest/...` redirect to `/docs/...`, so a studio can
always link to `/docs/<its version>/...`.

A release publishes itself: Tawi's release workflow attaches `tawi-docs-<version>.tar.gz` to the GitHub release and
sends this repo a `tawi-release` event. `.github/workflows/site.yml` then runs

```bash
node scripts/sync-docs.mjs tawi-docs-<version>.tar.gz
node scripts/release-docs.mjs <version>        # regenerates the API pages and freezes docs/ as <version>
npm run build
```

commits the new version to `main` and deploys. To do it by hand, run the same commands and push, or use
Actions > Site > Run workflow with the version.

## Deploying

Every push to `main` builds and deploys to the Cloudflare Pages project `tawi-website` (see the comment at the top of
`.github/workflows/site.yml` for the secrets it needs). Pull requests are built but not deployed. The build writes
Cloudflare's `_redirects` and `_headers` (`plugins/cloudflare-pages.ts`); `functions/_middleware.js` does the
`docs.tawi.ai` redirect. In Cloudflare, add both `tawi.ai` and `docs.tawi.ai` as custom domains of the project.

## Analytics

Cloudflare Web Analytics, which sets no cookies. Builds include its script only when `CF_WEB_ANALYTICS_TOKEN` is set
(the site's token from Cloudflare > Web Analytics); add it as a secret for the deploy step, or turn analytics on in
the Pages project instead and leave it unset.

## Search

Local search (`@easyops-cn/docusaurus-search-local`): the index is built with the site, so it costs nothing and needs
no account. It only works on a built site (`npm run build && npm run serve`), not in `npm start`.

## Design

Same rules as the studio: system font, one blue accent, solid surfaces with 1px borders, frosted glass only on the
top bar, no gradients, glow or entrance animations, a readable dark mode. Colours are the studio's tokens, in
`src/css/custom.css`.
