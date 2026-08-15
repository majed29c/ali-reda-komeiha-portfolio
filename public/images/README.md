# Photos

Wired up by the imports at the top of `src/lib/site.ts`.

| Slot            | File                      | Status                                   |
| --------------- | ------------------------- | ---------------------------------------- |
| Hero portrait   | `ali-km.png`              | In use. Background-removed alpha PNG (1024×1535), so no blend mode and no mask — just a `drop-shadow` off his silhouette. |
| About portrait  | `IMG_5728.JPG.jpeg`       | In use. 4:5 frame with `grayscale(1) contrast(1.08)` and the orange→dark wash, per the hand-off. |

## About portrait

The source is 896×1195 (≈3:4) and the frame is 4:5, so a centre crop trims ~6% off the
top and bottom. If a different photo is dropped in and the crop cuts badly, set
`object-position` on `.photo` in `src/components/About/about.module.css`.

## Hero portrait

`ali-km.png` is a supplied cut-out — the studio backdrop is genuinely gone, not hidden.
That is what makes the current treatment possible, and any replacement should be a
cut-out too. The earlier attempts, kept here so they are not retried on a flat photo:

| Approach | Result |
| -------- | ------ |
| `mix-blend-mode: multiply` (hand-off) | Assumes a light backdrop. On the black-lit source the frame multiplies to a shadow and the face is barely readable. |
| `mix-blend-mode: screen` | Drops the black cleanly, but leaves a washed-out floating face with no hair. |
| Automated luminance cutout | Fails: his hair and black shirt are the same value as the backdrop, so they get keyed out too. |
| Edge flood-fill cutout | Fails worse — removes 83–91% of the frame, bleeding through the hair into the face. |
| Lifted exposure + feathered mask | Was in use before the cut-out arrived. Readable, but his shoulders dissolve into a halo. |

## Swapping a photo

Point the import at the top of `src/lib/site.ts` at the new file. Nothing else: the
bundler reads the file's real pixel size and passes it to `<Image>`.

Do **not** go back to a `"/images/…"` string with a hand-typed `width`/`height`. When
those numbers drift from the actual file the browser reserves a box of the wrong shape,
and iOS Safari keeps that wrong shape for the whole first load — the cut-out then sits
letterboxed inside it, with the empty strips down each side rendering black. A reload
hides it, because by then the image is cached and its true ratio is known in time.
