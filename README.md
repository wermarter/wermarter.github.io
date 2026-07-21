# Hà Minh Chiến — personal website

A static portfolio and writing garden built with Astro 7, TypeScript 7, and small React islands.

## Local development

```bash
npm install
npm run dev
```

Run the full local checks with:

```bash
npm test
npm run build
```

## Edit portfolio data

Professional experience, projects, education, certificates, and contact details live in `src/data/personal.ts`. Canonical skill names and their ranking behavior live in `src/data/skills.ts`. The same sources power the pages and the public machine-readable endpoint at [`/data.json`](https://wermarter.github.io/data.json).

The JSON response allows cross-origin reads and includes the raw Markdown or MDX body for every post, including drafts. Draft entries have `draft: true` and a `null` public URL; they are excluded from the rendered blog until published.

## Publish a note

Add an `.md` or `.mdx` file under `src/content/blog` with this frontmatter:

```yaml
---
title: "A clear title"
description: "One sentence that says what the note is about."
publishedAt: 2026-07-21
tags:
  - type: skill
    value: Redis
  - type: project
    value: homelab
  - type: topic
    value: observability
draft: false
---
```

Reference tags are typed: `skill` values must come from the `Skill` enum, `project` values must match a project id, and `topic` values are free-form labels. These references power the filters on the Projects page.

Use Markdown by default. Choose MDX only when the note needs an embedded component. Set `draft: true` to keep a note out of the rendered site; drafts remain available in the JSON export with a `null` public URL.

## Deployment

GitHub Actions checks every push and pull request. Pushes to `main` also build and deploy the static site to GitHub Pages through Astro's official action.

The site is published at `https://wermarter.github.io`. A custom domain can be added later by creating `public/CNAME`, updating `site` in `astro.config.ts`, and configuring DNS.
