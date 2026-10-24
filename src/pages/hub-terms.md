---
title: Tawi Hub terms
description: What you can share on the Tawi Hub (hub.tawihub.com), and how reports and takedowns work.
---

# Tawi Hub terms

*Last updated 20 October 2026.*

The Tawi Hub at hub.tawihub.com keeps models and adapters that people share with `tawi push` and download with
`tawi pull`. These terms add to the [terms of use](/terms) for anything you upload or download there.

## Your account

1. You sign in with a GitHub account, and your hub account name is your GitHub username. You're responsible for
   what's pushed with your tokens, so keep them private. `tawi logout` forgets the token on your computer; tell us
   at **security@tawihub.com** if you think a token has leaked and we'll revoke it.
2. Each account can store 50 GB to start, counting each distinct file once.

## What you upload

3. **You need the right to share it.** Only push models, adapters, data and text you made or are allowed to
   redistribute. An adapter or fine-tuned model is usually bound by its base model's licence too; check it before
   making a repo public, and set the repo's licence (`tawi push ... --licence`) so others know their terms.
4. **You keep what's yours.** You keep any rights you have in what you upload. By making a repo public you let
   anyone download it under the licence you set, and you let us store, copy and serve it to do that. Private repos
   are visible only to you.
5. **Not allowed:** content that infringes someone else's rights; malware or files built to harm the people who
   load them; models trained to produce illegal content or to help harm people; personal data about others without
   a lawful basis; and anything illegal where you or we are.
6. **Files we check.** The hub accepts safetensors and GGUF weights, JSON configs, tokenizers and text. It refuses
   pickle files (`.bin`, `.pt`, `.pth`, `.ckpt`, `.pkl`), because loading them can run code, and checks that every
   file is what its name says before publishing it. These checks reduce risk but can't prove a model is safe or
   that it behaves well: test a model before you rely on it.

## What you download

7. Models on the hub are shared by the people who pushed them, not made or reviewed by Tawi. Each repo shows its
   licence; some ask you to accept it first (`tawi pull ... --accept-licence`), and we record that you did.

## Reports and takedowns

8. To report a repo (copyright, licence, malware, illegal content, personal data or anything else), use
   **Report this repo** on its page, or email **hello@tawihub.com** with the repo's name and what's wrong. Rights
   holders: include what you own, where it appears in the repo, and how to reach you.
9. We may take a repo down while we look into a report, or for good when it breaks these terms. A taken-down repo
   can't be downloaded and shows the reason. If you think we got it wrong, reply to our message and we'll look again.
   We may suspend accounts that break these terms repeatedly.

## Deleting

10. You can delete a repo in its settings, and your account in your account settings on hub.tawihub.com. Deleting
    removes the files from storage unless another repo still uses them. Deleting can't be undone.

## Changes

11. We may update these terms; the date above shows the latest version, and we'll say on the hub when something
    important changes.
