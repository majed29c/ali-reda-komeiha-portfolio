# Handoff: Ali Komeiha — Video Editor & Filmmaker Portfolio

## Overview
A single-page marketing portfolio for Ali Komeiha, a video editor and filmmaker. Sections in order:
sticky-free simple nav, orange gradient hero with a duotone portrait, About, Work (per-category
horizontal video carousels, intended to be fed from Google Sheets), Services (10 cards), Contact, footer.

## About the Design Files
`Video Editor Portfolio.dc.html` is a **design reference created in HTML** — a prototype showing
intended look and behavior, not production code to copy directly. It uses a proprietary streaming
component runtime (`<x-dc>` + a `Component extends DCLogic` class) that will NOT exist in your
codebase. Recreate the design in the target environment (Next.js/React recommended; the original
inspiration site is a Next.js app) using its existing patterns. If no codebase exists yet, Next.js +
Tailwind or plain CSS modules is a good fit.

`image-slot.js` is a drag-and-drop image placeholder used only for prototyping. In production replace
every `<image-slot>` with a real `<img>` / `next/image` (or a `<video>` poster + player for work items).

## Fidelity
**High fidelity.** Colors, type, spacing, radii and interactions below are final. Recreate pixel-close.

## Design Tokens

Colors
- Page background: `#0d0a08`
- Surface / card: `#141110`; hover surface `#181312`; secondary surface `#171310`
- Hairline border: `#241e19`; stronger border `#2b2420`
- Text primary: `#f5efe8`; text secondary: `#8a7f74`; text muted/index: `#4a423c`; nav idle: `#b8ada3`
- Accent (brand orange): `#ff5a1f`; accent hover: `#e04a12`; accent tint: `rgba(255,90,31,0.12)`
- On-accent text: `#fff`; on-accent secondary: `#ffd9bd` / `#ffe1cd`; hero sub-label `#ffc9a3`
- Availability dot: `#4ade80`
- Hero gradient: `radial-gradient(120% 140% at 68% 18%, #ffa04d 0%, #ff6a24 32%, #d43c05 55%, #7d1e00 80%, #3f0d00 100%)`

Typography — **Archivo** (Google Fonts), weights 400/500/600/700/800.
- Hero H1: `clamp(36px,4.4vw,64px)`, 800, line-height .96, letter-spacing -.03em
- Section H2/H3: `clamp(30px,3.4vw,44px)` – `clamp(36px,4.6vw,60px)`, 800, letter-spacing -.025/-.03em
- Card title: 18px/700; work title 16px/700; body 13–16px/400–600, line-height 1.55–1.7
- Eyebrow label: 15px/600 in accent orange
- `text-wrap: pretty` on all headings and multi-line copy

Radii: 28px hero, 24px contact panel, 22px about photo, 18px cards, 14px thumbnails, 12px icon tiles, 999px pills.
Spacing: page gutter `clamp(20px, 8.4vw, 160px)`; section vertical `clamp(48px,6vw,80px)` top /
`clamp(72px,8vw,110px)` bottom; grid gaps 16–20px; card padding 26px 24px 30px.
Transitions: 0.2–0.25s ease on color/background/border/transform.

## Screens / Views

Single page, max-width none — full viewport width with the fixed gutter above.

### 1. Nav
Flex row, space-between, padding `14px 8px 24px`. Left: wordmark "Ali Komeiha" 20px/800 with an orange
period. Center: About / Work / Services / Contact, 14px/500, `#b8ada3` → `#f5efe8` on hover, smooth
scroll to anchors. Right: pill button "Get in touch" — `#f5efe8` bg, `#0d0a08` text, 10px 8px 10px 20px,
radius 999px, with a 28px orange circle holding a chevron icon; hover flips to orange bg / white text.

### 2. Hero
Rounded 28px section, min-height 640px, the radial orange gradient above, `overflow:hidden`.
Portrait `<img>` absolutely positioned, `left:50%; translateX(-50%); bottom:0; height:94%`,
`filter: grayscale(1) contrast(1.45) brightness(1.06)`, `mix-blend-mode: multiply`, and a feathering mask:
`mask-image: radial-gradient(ellipse 58% 74% at 50% 44%, #000 58%, transparent 100%)`.
Above it a 3-column grid (`1fr auto 1fr`, center-aligned, the middle column an empty spacer sized
`clamp(200px,26vw,340px) × 470px` reserving the portrait area):
- Left: "Hey, I'm a" 20px/500 `#fff3e8`; H1 "Video Editor & Filmmaker"; 13px sub-line `#ffd9bd`.
- Right (text-align right): 22px/700 "Great stories are made in the edit."; 13px `#ffd9bd` paragraph;
  dark translucent pill "See the reel" with a white circular play badge.
Bottom strip: 4-column grid, `#01–#04` labels 12px `#ffc9a3` over 14px/600 white titles —
Montage Editing / Cinematic Shots / UGC & Ads / 3D Animation.

### 3. About
2-column grid `repeat(auto-fit,minmax(280px,1fr))`, gap `clamp(32px,5vw,72px)`, items center.
- Left: photo in a 4:5 rounded-22px frame, max-width 440px, centered in its column,
  `filter: grayscale(1) contrast(1.08)` with an overlay
  `linear-gradient(180deg, rgba(255,90,31,.10), rgba(13,10,8,.55))`. An orange badge overhangs the
  bottom-right corner (`right:-10px; bottom:-14px`, radius 16px): "+4 years" 26px/800 over
  "of experience" 12px `#ffe1cd`.
- Right: eyebrow "About Me"; H2 "I cut video that holds attention."; 16px `#8a7f74` paragraph;
  three rows on a `40px 1fr` grid (icon tile 40px, radius 11px, accent tint bg, orange 19px stroke icon;
  title 16px/700 + 13px sub), each with `border-top: 1px solid #241e19`:
  Montage & cinematic edits / UGC, ads & VSL / 3D animation & advanced edits.
  Then an orange "View my work" pill and a green-dot "Available for new projects" marker.

### 4. Work
Header: H3 "Work" + "Organised by category". Then one block per category:
- Category header row: 8px orange dot, 24px/700 name, spacer, film count 13px `#8a7f74`,
  then prev/next round buttons (38px, 1px `#2b2420` border, `#141110` bg, orange 16px chevron SVG;
  hover fills orange). Bottom border 1px `#241e19`.
- Row: horizontal flex, `gap:20px`, `overflow-x:auto`, `scroll-snap-type: x mandatory`,
  `scroll-behavior:smooth`, scrollbar hidden (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`).
  Cards are `flex: 0 0 320px`, `scroll-snap-align: start`: 16:9 thumbnail (radius 14, `#171310` bg) with a
  duration pill bottom-right (`rgba(13,10,8,.72)`, 11px/600, "▶ 1:40"), then 16px/700 title and
  13px `#8a7f74` description.
- Arrow behavior: each button's opacity is 1/0 depending on whether the row can scroll that way
  (`scrollLeft > 8`, `scrollLeft < scrollWidth - clientWidth - 8`); the whole button group is
  `display:none` when the row does not overflow at all. Recompute on scroll and on resize.

### 5. Services
Header: eyebrow "What I Do", H3 "Services", right-aligned 14px note.
Grid `repeat(auto-fill,minmax(280px,1fr))`, gap 18px. Each card: `#141110` bg, 1px `#241e19` border,
radius 18px, padding 26px 24px 30px, flex column gap 12px. Top row: 42px radius-12 icon tile
(accent-tint bg, orange 20px stroke icon) and a 12px/700 `#4a423c` index ("01"…"10"). Then 18px/700
title and 13px `#8a7f74` description. Hover: `translateY(-4px)`, border → `#ff5a1f`, bg → `#181312`.
The ten services, in order: Montage Editing, Cinematic Shots, Photography, Talking-Head Edits,
VSL Editing, UGC Content, 3D Animation, Advanced Edits, Basic Edits, Ads & Promos. (Copy is in the HTML.)

### 6. Contact
One panel: `#141110`, 1px `#241e19`, radius 24px, padding 56px 48px, 2-column
`repeat(auto-fit,minmax(320px,1fr))`.
- Left: eyebrow "Get In Touch", H3 "Let's create something great.", 15px `#8a7f74` paragraph.
- Right: three stacked action rows (radius 14, padding 20px 22px, space-between). Row 1 is the orange
  primary (WhatsApp) with a translucent-white 44px icon tile; rows 2–3 are `#0d0a08` with 1px `#2b2420`
  and an accent-tint icon tile (email, Instagram). Each row: 16px/700 label + 13px sub, trailing chevron.
  Hover: orange row darkens to `#e04a12`; dark rows get an orange border.

### 7. Footer
Flex row space-between, 13px `#8a7f74`: "© 2026 Ali Komeiha — Video Editor & Filmmaker" and three
36px square icon buttons (Instagram / WhatsApp / Email), 1px `#241e19`, radius 10px, hover orange.

## Interactions & Behavior
- `html { scroll-behavior: smooth }`; all nav items are in-page anchors.
- Work carousels: chevron buttons scroll by `max(340px, clientWidth * 0.8)`; arrow visibility derived
  from scroll position as described; snap points on every card.
- All hovers 0.2–0.25s ease. Service cards lift 4px. No scroll-triggered animation in the design.
- Responsive: everything is fluid via `clamp()` and `auto-fit`/`auto-fill` grids — no media queries.
  Two-column blocks stack below ~320px per column; the hero grid keeps its 3 columns and shrinks the
  portrait spacer, so on narrow screens re-stack it (portrait above, text below) in your implementation.

## State Management
Minimal:
- `sections`: array of `{ name, videos: [{ title, description, thumb, duration }] }` — the work data.
- Per-category scroll edge state (`canScrollPrev/Next`) derived from the scroll container refs.
- Data source: a **published Google Sheet CSV**. The prototype fetches a CSV URL and groups rows by a
  `Section` column, reading `Section, Title, Description, Thumbnail, Duration` headers (case-insensitive),
  with a quoted-field CSV parser. Falls back to hardcoded example data when no URL is set.
  In production, fetch server-side (e.g. a Next.js route/server component with revalidation) rather than
  in the browser, and validate rows.

## Assets
- Font: Archivo from Google Fonts (400–800).
- Hero portrait: `uploads/magnific_use-the-second-image-as-t_5xhLyZ7Kxe.png` (B/W turtleneck portrait),
  rendered with the duotone multiply + mask treatment described above.
- About portrait: `uploads/IMG_5728.JPG.jpeg` (user-supplied photo), grayscale + gradient wash.
  Both are user-provided photos — ask Ali for final high-res versions and consider a background-removed
  cutout for the About photo (not available in the prototype).
- Icons: hand-written inline SVG, 24×24 viewBox, `stroke="currentColor"`, stroke-width 1.7–2.4,
  round caps/joins. Swap for Lucide equivalents if the codebase already uses an icon set.
- Work thumbnails: none supplied — placeholders in the prototype.

## Files
- `Video Editor Portfolio.dc.html` — the full design (markup + logic; ignore the runtime wrapper).
- `image-slot.js` — prototype-only image placeholder component; do not port.
