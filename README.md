# Ali Komeiha — Video Editor & Filmmaker

Single-page portfolio built with Next.js (App Router) and CSS Modules, implemented from
`design_handoff_video_editor_portfolio/`.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/app/page.tsx          Page composition (server component; loads the work data)
src/app/globals.css       Design tokens + base styles
src/lib/site.ts           Name, contact links, photo paths
src/lib/work.ts           Work data: Google Sheet CSV loader + fallback

src/components/
  Nav/                    Nav.tsx, MobileMenu.tsx (burger + drawer), CSS modules
  Hero/  About/  Work/  Services/  Contact/  Footer/
  icons/                  Inline 24×24 stroke icons from the hand-off
```

Each folder keeps its component, any sub-components and its CSS modules together,
with an `index.ts` barrel so imports stay `@/components/Hero`.

Below 720px the inline nav links and "Get in touch" pill are replaced by a burger
button that opens a right-hand drawer holding both.

## Master switch

`SITE_ENABLED` at the top of [src/app/page.tsx](src/app/page.tsx) turns the whole
portfolio on and off:

- `true` — the full site renders.
- `false` — only the holding page ([src/components/Offline/](src/components/Offline/))
  renders. None of the portfolio markup reaches the browser, the title and description
  are replaced, and the page is marked `noindex, nofollow`.

Flip it and redeploy. To toggle without a redeploy, read an environment variable
instead: `const SITE_ENABLED = process.env.SITE_ENABLED !== "false";`

## Before going live

1. **Contact details** — set the WhatsApp number, email and Instagram URL in
   [src/lib/site.ts](src/lib/site.ts). They are currently placeholders.
2. **Photos** — add the hero and About portraits to `public/images/` and point
   `site.images` at them; see [public/images/README.md](public/images/README.md).
   Until then a labelled placeholder is shown in each slot.

## Work data (Google Sheet)

The Work carousels read from a published Google Sheet CSV, fetched on the server and
revalidated hourly. Set:

```bash
# .env.local
WORK_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/e/…/pub?output=csv"
```

Expected headers (case-insensitive, order does not matter):

| Section | Title | Description | Thumbnail | Duration |
| ------- | ----- | ----------- | --------- | -------- |
| UGC & Ads | Skincare UGC Ad | Creator-style ad… | https://… | 0:32 |

Rows are grouped into one carousel per `Section`. Rows without a `Title` are skipped and
non-`http(s)` thumbnails are dropped. If the variable is unset or the sheet cannot be
read, the example data in [src/lib/work.ts](src/lib/work.ts) is used instead.

Sheet thumbnails are rendered with a plain `<img>` rather than `next/image`, because the
image hosts are not known ahead of time. To run them through the optimizer, add the hosts
to `images.remotePatterns` in [next.config.ts](next.config.ts) and swap the tag in
[src/components/WorkCarousel.tsx](src/components/WorkCarousel.tsx).
