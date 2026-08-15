/*
 * Imported, not written as "/images/...", so the bundler reads each file's real
 * pixel dimensions and hands them to <Image> itself. A hand-typed width/height
 * that no longer matches the file gives the browser the wrong aspect ratio to
 * reserve, and iOS Safari keeps that wrong box on the first load — which is how
 * the hero cut-out ended up letterboxed inside a black frame. Swapping a photo
 * now means changing only the path below.
 */
import aboutPortrait from "../../public/images/IMG_5728.JPG.jpeg";
import heroPortrait from "../../public/images/ali-km.png";

/** Single place for the details that change per client hand-off. */
export const site = {
  name: "Ali Reda Km",
  role: "Video Editor & Visual Storyteller",
  year: 2026,

  /** Counts up when the About section scrolls into view. */
  stats: [
    { value: 4, suffix: "+", label: "Years Experience" },
    { value: 4000, suffix: "+", label: "Videos Edited" },
    { value: 50, suffix: "+", label: "Happy Clients" },
  ],

  contact: {
    /** +961 71 252 276 — wa.me needs country code first, digits only. */
    whatsapp: "96171252276",
    /** Pre-filled into WhatsApp so the visitor only has to press send. */
    whatsappMessage:
      "Hi Ali, I came across your portfolio and I'd like to discuss a video project with you.",
    email: "Komeihaa07@gmail.com",
    instagram: "https://www.instagram.com/ali_reda.km",
  },

  /**
   * Drop the final high-res photos into `public/images/`, then point the two
   * imports at the top of this file at them. Set a slot to `null` to render a
   * labelled placeholder instead.
   *
   * heroPortrait — seated full-body shot, cut out of its white studio backdrop
   * (alpha PNG, keyed from ali2-.jpg). Because the background is genuinely
   * gone, the hero needs no multiply blend and no mask to hide a frame edge.
   *
   * aboutPortrait — 4:5 portrait for the About section, grayscale + wash.
   */
  images: {
    heroPortrait,
    aboutPortrait,
  },
};

/** Opens WhatsApp with the message already typed out, ready to send. */
export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;

export const emailUrl = `mailto:${site.contact.email}`;
