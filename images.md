# Image guide

How to add and prepare images for fvcsolutions.com.

## Where images live

| Location | Use for | How to reference |
|----------|---------|------------------|
| [`public/images/portfolio/`](public/images/portfolio/) | Portfolio screenshots | `/images/portfolio/foo.webp` |
| [`public/icons/`](public/icons/) | Generated PWA icons — don't edit by hand, run `npm run icons` | `/icons/...` |
| [`public/og-image.png`](public/og-image.png) | Social-share image — generated, don't edit by hand | `/og-image.png` |
| [`public/favicon.svg`](public/favicon.svg) | Canonical site favicon | `/favicon.svg` |

Anything in `public/` ships verbatim — no build step, no import. Drop a file, reference it by absolute path from JSON or markup.

## Portfolio screenshots

### Adding one

1. Drop the file in [`public/images/portfolio/`](public/images/portfolio/).
2. Add an `image` block to the item in [`src/content/portfolio.json`](src/content/portfolio.json):

   ```json
   {
     "id": "foreman",
     "image": {
       "src": "/images/portfolio/foreman.webp",
       "alt": "Foreman Run dashboard showing five active pipelines",
       "eager": true
     },
     "badge": { "kind": "active", "label": "In Development" },
     "meta": "Internal · 2026",
     "title": "Foreman Run",
     "role": "AI orchestration · workflow tooling",
     "description": "..."
   }
   ```

3. Drop `shotVariant` from the item (it becomes unused). If `image` is absent, the decorative `shotVariant` placeholder renders instead — useful while you're collecting screenshots.

### Image fields

| Field | Required | Notes |
|-------|----------|-------|
| `src` | yes | Absolute path. Always starts with `/`. |
| `alt` | yes | Describe the *content*, not the fact that it's a screenshot. Used for SEO + accessibility. |
| `eager` | no | Set `true` for items above the fold (the first row of "Currently building"). Skips lazy-loading so the image counts toward LCP. |

### Specs

- **Aspect ratio: 4:3.** The `.shot` frame enforces this; non-4:3 images are `object-fit: cover`-cropped from the top.
- **Format: WebP or AVIF.** Both compress screenshots far better than PNG. Convert with `cwebp` or any image tool.
- **Width: ~1200 px.** Covers Retina at the rendered ~600 px container width without overshooting. Keep file size under ~80 KB where possible — the page-speed budget cares.
- **Crop to app content, not browser window.** The component overlays a fake browser-chrome bar (three grey dots, 22 px tall) on top of the image. If your screenshot already has a real browser frame, you'll get chrome-on-chrome — crop it out.

### Conversion recipes

WebP from PNG, quality 82, drops a 1 MB screenshot to ~50 KB:

```bash
cwebp -q 82 -resize 1200 0 input.png -o output.webp
```

AVIF (smaller still, slightly slower to decode):

```bash
avifenc --min 30 --max 40 -s 4 input.png output.avif
```

ImageMagick alternative if you don't have the codec tools:

```bash
magick input.png -resize 1200x -quality 82 output.webp
```

## OG image and favicons

These are generated from the canonical logo SVG, not edited by hand.

```bash
npm run icons
```

Outputs go to `public/icons/`, `public/favicon.ico`, and `public/og-image.png`. Re-run after the logo changes, then commit the result.

## Performance budget

The site targets 100/100 PageSpeed on mobile and desktop. Per page:

- **Total image weight under ~250 KB above the fold.** One large hero image is fine; six unoptimized PNGs is not.
- **Every `<img>` has explicit dimensions or sits in an aspect-ratio container.** The `.shot` wrapper handles this for portfolio screenshots — you don't need to set `width`/`height` in the JSON.
- **Lazy-load below-the-fold images.** The component does this by default; only set `eager: true` for the first one or two items on the portfolio page.
