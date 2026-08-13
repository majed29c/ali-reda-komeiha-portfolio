# Photos

Paths are wired up in `src/lib/site.ts` under `images`.

| Slot            | File                     | Status                                    |
| --------------- | ------------------------ | ----------------------------------------- |
| About portrait  | `IMG_5728.JPG.jpeg`      | In use. Rendered in a 4:5 frame with `grayscale(1) contrast(1.08)` and the orange→dark wash, per the hand-off. |
| Hero portrait   | —                        | Still empty; a labelled placeholder shows in its slot. |

## About portrait

The source is 896×1195 (≈3:4) and the frame is 4:5, so a centre crop trims ~6% off the
top and bottom. If a different photo is dropped in and the crop cuts badly, set
`object-position` on `.photo` in `src/components/About/about.module.css`.

## Hero portrait

Add the B/W cut-out as `hero-portrait.png` (transparent or dark background works best)
and set:

```ts
heroPortrait: "/images/hero-portrait.png",
```

It is rendered with the duotone treatment — `grayscale(1) contrast(1.45) brightness(1.06)`,
`mix-blend-mode: multiply` and a radial feather mask. If the photo is not roughly 3:4,
adjust `--portrait-aspect` in `src/components/Hero/hero.module.css` to match.
