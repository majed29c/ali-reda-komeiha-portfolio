# Photos

Paths are wired up in `src/lib/site.ts` under `images`.

| Slot            | File                      | Status                                   |
| --------------- | ------------------------- | ---------------------------------------- |
| Hero portrait   | `ali-hero-portrait.jpeg`  | In use. `brightness(1.5) saturate(0.45)` behind a feathered radial mask. No blend mode — see below. |
| About portrait  | `IMG_5728.JPG.jpeg`       | In use. 4:5 frame with `grayscale(1) contrast(1.08)` and the orange→dark wash, per the hand-off. |

## About portrait

The source is 896×1195 (≈3:4) and the frame is 4:5, so a centre crop trims ~6% off the
top and bottom. If a different photo is dropped in and the crop cuts badly, set
`object-position` on `.photo` in `src/components/About/about.module.css`.

## Hero portrait

The hand-off's duotone assumed a portrait shot on a **light** background. This photo is
lit on black, so the specified treatment does not work. What was tried:

| Approach | Result |
| -------- | ------ |
| `mix-blend-mode: multiply` (hand-off) | Black background multiplies to black — the frame becomes a shadow and the face is barely readable. |
| `mix-blend-mode: screen` | Drops the black cleanly, but leaves a washed-out floating face with no hair. |
| Automated luminance cutout | Fails: his hair and black shirt are the same value as the background, so they get keyed out too. |
| Edge flood-fill cutout | Fails worse — removes 83–91% of the frame, bleeding through the hair into the face. |
| **No blend + lifted exposure + feathered mask** | **In use.** Face is clear, background dissolves into a soft halo. |

**A properly background-removed PNG would still be better** — ask Ali for one (remove.bg
or Photoshop), drop it in, and the mask can then be widened to show his shoulders.

Swapping the photo means updating `--portrait-aspect` in
`src/components/Hero/hero.module.css` to the new file's intrinsic ratio. Keep the mask
radii at or under 50%, or the feather is clipped and the photo ends in a hard edge.
