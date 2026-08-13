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
src/lib/getProjects.ts    Work data: Google Sheets API v4 loader + grouping

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

## Work data (Google Sheets API + Drive)

The Work carousels are fed by [src/lib/getProjects.ts](src/lib/getProjects.ts), which
reads `Sheet1!A2:D` from the Sheets API v4 on the server and revalidates every 60
seconds. Both env vars are server-side only, so the API key never reaches the browser.

```bash
# .env.local
SHEET_ID=
SHEETS_API_KEY=
```

Sheet layout — tab `Sheet1`, headers in row 1, data from row 2:

| A Section | B Title | C Description | D VideoLink |
| --------- | ------- | ------------- | ----------- |
| Branding  | Nike Rebrand | A bold identity refresh… | https://drive.google.com/file/d/FILE_ID/view?usp=sharing |

- One carousel per `Section`, in the order the sections first appear in the sheet.
- A blank `Section` falls back to `"Other"`.
- `fileId` is pulled from the Drive link with `/\/d\/([^/]+)/`; a missing or malformed
  link leaves it `null` and the card shows "Video unavailable".
- Any failure — missing env vars, non-`ok` response, network error — returns `[]`, and
  the Work section shows "No projects yet." No placeholder data is ever shown.
- If the tab is renamed, change `SHEET_TAB` in `getProjects.ts` (the only place it appears).

**Sharing is the usual culprit.** The Sheet *and* every Drive video must be set to
"Anyone with the link → Viewer". A Sheet that isn't shared returns 403; a video that
isn't shared renders as "no access" inside the embed.

### Live updates on save

The sheet fetch is tagged `projects` and falls back to a 60s window. To make edits
appear immediately instead, the Sheet pings a webhook on every save:

```
Sheet edited → Apps Script onChange trigger → POST /api/revalidate → revalidateTag("projects")
```

1. Set `REVALIDATE_SECRET` in `.env.local` **and** in your host's environment variables.
2. Open the Sheet → Extensions → Apps Script, paste [docs/sheets-trigger.gs](docs/sheets-trigger.gs),
   fill in `ENDPOINT` and `SECRET`, then run `installTrigger` once and approve the prompt.

Notes:

- **Only works against a deployed URL.** Google has to reach the endpoint, so
  `localhost` will not do. Use a tunnel (ngrok/cloudflared) if you want to test locally.
- It must be an **installable** trigger. A plain `onEdit(e)` is a *simple* trigger and is
  not permitted to call external URLs — it fails silently. `installTrigger` registers an
  `onChange` trigger, which also covers row inserts and deletes.
- `revalidateTag(tag, "max")` marks the cache stale with stale-while-revalidate
  semantics: the first visit after an edit may still serve the previous version while
  fresh data loads behind it, and the next one is current. For a blocking refresh on the
  very next request, pass `{ expire: 0 }` instead of `"max"`.
The webhook only invalidates the server cache — it cannot push into an idle browser.
[LiveRefresh](src/components/LiveRefresh/LiveRefresh.tsx) covers that half: it calls
`router.refresh()` every 30s while the tab is visible, and immediately when the tab
regains focus. Hidden tabs are not polled.

`router.refresh()` re-fetches the RSC payload and merges it in place — no page reload,
and scroll position, carousel position and an open video modal all survive. Change the
cadence with `<LiveRefresh intervalMs={...} />` in [src/app/page.tsx](src/app/page.tsx).

The poll is skipped entirely while a video modal is open (`body[data-modal-open]`), so a
background refresh can never remount the player and restart a video mid-watch.

### Video playback

Cards never embed Drive's player. Drive's iframe ships its own chrome — an off-centre
play button and a pop-out button that escapes to a new tab — and none of it can be
restyled or removed. So the card shows Drive's poster with our own centred badge
([ProjectVideo.tsx](src/components/Work/ProjectVideo.tsx)), and clicking opens
[VideoModal.tsx](src/components/Work/VideoModal.tsx), which mounts the
`https://drive.google.com/file/d/FILE_ID/preview` iframe with full controls.

Mounting on demand also keeps a dozen Drive players from booting on page load. A
`<video>` tag is not used because Drive throttles direct file playback.

The modal portals to `document.body`, traps focus, locks page scroll, closes on Esc /
backdrop / the close button, and plays an exit animation before unmounting. Drive's
pop-out button still exists *inside* the player, which is unavoidable.

Posters use a plain `<img>` rather than `next/image`: the URL carries a dynamic `id`
query param, so allowing it through `images.remotePatterns` would require an
open-ended `search` wildcard, which turns the image optimizer into a proxy for any
public Drive file. Drive sizes the poster itself via `sz=w640`.
