/**
 * Single place for the details that change per client hand-off.
 * Replace the placeholders below with Ali's real contact details and photos.
 */
export const site = {
  name: "Ali Komeiha",
  role: "Video Editor & Filmmaker",
  year: 2026,

  contact: {
    /** International format, digits only — e.g. "9613123456". */
    whatsapp: "00000000000",
    email: "hello@example.com",
    instagram: "https://instagram.com/",
  },

  /**
   * Drop the final high-res photos into `public/images/` and point these at
   * them. While empty, a labelled placeholder is rendered in their place.
   */
  images: {
    /** B/W turtleneck portrait, rendered with the duotone multiply + mask. */
    heroPortrait: "",
    /** 4:5 portrait for the About section, grayscale + gradient wash. */
    aboutPortrait: "/images/IMG_5728.JPG.jpeg",
  },
};

export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}`;
export const emailUrl = `mailto:${site.contact.email}`;
