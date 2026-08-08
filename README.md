# Less Carbon, more notions

A nature-themed static blog (**Astro 5**) with a browser CMS (**Sveltia**), hosted entirely on **GitHub Pages**.

No Cloudflare. No Netlify. Public site + deploys + content git history all live on GitHub.

## Live site

- **URL:** https://lesscarbon-morenotions.github.io/
- **Host:** GitHub Pages (Actions → `dist/`)
- **Source branch:** `redesign` (or `main` after you merge)

## Quick start

```bash
# Node 22+
npm install
npm run dev          # http://localhost:4321
```

```bash
npm run build        # Astro + Pagefind → dist/
npm run preview
```

## Stack

| Layer | Choice |
|-------|--------|
| Site | Astro 5 (static), Tailwind 4, Preact islands |
| Content | Markdown + frontmatter in `src/content/posts/` |
| Settings | `src/content/site/settings.json` |
| Search | Pagefind |
| CMS | Sveltia at `/admin/` (local Git backend) |
| Host | **GitHub Pages** via `.github/workflows/deploy-pages.yml` |

## Deploy (GitHub Pages)

Workflow: **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Push to `redesign` or `main` (or run the workflow manually)
3. Actions builds with `npm run build` and deploys `dist/` to Pages

The old Jekyll workflow is disabled on this branch so it cannot overwrite the Astro site.

## CMS handoff (GitHub-only)

The CMS does **not** use Cloudflare Workers or any external OAuth host.

### Recommended: local admin → push → Pages

```bash
# Terminal 1 — local Git API for the CMS
npx decap-server

# Terminal 2 — site + /admin/
npm run dev
```

Open **http://localhost:4321/admin/** → create/edit posts → save (writes into the repo) → `git push` → GitHub Actions redeploys Pages.

### Without the CMS UI

Edit files directly on GitHub:

- Posts: `src/content/posts/*.md`
- Site settings: `src/content/site/settings.json`

Commits to `redesign` / `main` still trigger a Pages deploy.

### Branch

`public/admin/config.yml` → `backend.branch: redesign`  
After merging the redesign into `main`, change that to `main`.

## Content model

```yaml
title: string
description: string
pubDate: YYYY-MM-DD
tags: [Title Case labels]
cover: /media/covers/...
coverAlt: string
featured: boolean
draft: boolean   # excluded from production lists
```

## Design system

Tokens in `src/styles/global.css` (hydrangea, cornflower, beluga, butterfly).  
Media under `src/assets/images/` and `public/media/**`.

## Archive

Original Notion HTML: `archive/notion-export/` (not published).

## Design document

See [`DESIGN.md`](./DESIGN.md) for the full architecture notes (ignore any older Cloudflare OAuth path — this project is GitHub Pages only).
