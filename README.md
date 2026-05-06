# fvcsolutions.com

Marketing site for FVC Solutions. Static, JSON-driven, deployed to GitHub Pages.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output in dist/
npm run preview      # serve dist/ locally
```

## Editing content

Everything visible on the site comes from JSON files in [`src/content/`](src/content/). Edit a JSON, push to `main`, and the GitHub Action redeploys.

| File | Drives |
|------|--------|
| [`site.json`](src/content/site.json) | Brand, location, nav, social links, Calendly URL + question mapping |
| [`home.json`](src/content/home.json) | Hero + final CTA on the homepage |
| [`services.json`](src/content/services.json) | "What we build" four-card grid |
| [`method.json`](src/content/method.json) | "How we work" numbered list |
| [`engagement.json`](src/content/engagement.json) | Engagement tier cards |
| [`team.json`](src/content/team.json) | Team members |
| [`portfolio.json`](src/content/portfolio.json) | Portfolio page — `active.items` and `past.items` |
| [`schedule.json`](src/content/schedule.json) | Schedule page form questions, copy, trust banner |

The "Selected past work" section on `/portfolio` only renders when `past.items` is non-empty — leave it `[]` until you have entries.

A title written as `[{ "text": "Foo " }, { "text": "bar.", "italic": true }]` renders the second segment in italic accent green. Use it for any headline that needs the in-line emphasis treatment.

## Updating logos / icons

The canonical logo lives in [`public/favicon.svg`](public/favicon.svg) and inline in [`src/components/Logo.astro`](src/components/Logo.astro).

PWA icons, the Apple touch icon, `favicon.ico`, and the Open Graph share image are all generated from that SVG by the icon script:

```bash
npm run icons
```

Outputs are committed to `public/icons/` so production builds are deterministic. Re-run the script (and commit the result) if the logo changes.

## Updating the Calendly hand-off

The schedule form posts to `site.calendly.url` with the form values as query-string `a1`–`a7` parameters. To adjust:

1. Update `calendly.url` in `site.json` if the event URL changes.
2. Update `calendly.questionMap` if Calendly custom-question slots change order. The keys are form field IDs; the values are the Calendly slot keys (`a1`, `a2`, ...).

## Deploy

GitHub Action at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys on every push to `main`. One-time setup in GitHub:

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Add a custom domain `fvcsolutions.com` (the `CNAME` file in `public/` survives the build).

## Stack

- [Astro](https://astro.build) — static-first, ships zero JS by default
- Self-hosted variable fonts via `@fontsource-variable` (no Google Fonts request on render)
- [`@vite-pwa/astro`](https://vite-pwa-org.netlify.app) — manifest, service worker, offline shell
- `@astrojs/sitemap` — sitemap + robots
- JSON-LD: `ProfessionalService`, `WebSite`, `FAQPage`, `BreadcrumbList`, `CollectionPage`, `ContactPage` for SEO + AEO
