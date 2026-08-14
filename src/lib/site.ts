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
   * Drop the final high-res photos into `public/images/` and point these at
   * them. While empty, a labelled placeholder is rendered in their place.
   */
  images: {
    /**
     * Seated full-body shot on a white studio backdrop. The white is dropped by
     * `mix-blend-mode: multiply` in the hero, so this file must keep its light
     * background — a cut-out PNG would blend to nothing.
     */
    heroPortrait: "/images/ali2-.jpg",
    /** 4:5 portrait for the About section, grayscale + gradient wash. */
    aboutPortrait: "/images/IMG_5728.JPG.jpeg",
  },
};

/** Opens WhatsApp with the message already typed out, ready to send. */
export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;

export const emailUrl = `mailto:${site.contact.email}`;
