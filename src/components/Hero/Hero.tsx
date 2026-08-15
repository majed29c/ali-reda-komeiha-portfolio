import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./hero.module.css";

const specialities = [
  "Video Editing",
  "Cinematic Filmmaking",
  "UGC & Ads",
  "3D Animation",
  "Motion Graphics",
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      {site.images.heroPortrait ? (
        <Image
          className={styles.portraitImage}
          src={site.images.heroPortrait}
          alt={`Portrait of ${site.name}`}
          /* width/height come from the static import in site.ts — see the note
             there. CSS drives the rendered height. */
          sizes="(max-width: 900px) 80vw, 40vw"
          priority
        />
      ) : (
        <div className={styles.portraitPlaceholder}>
          Hero portrait
          <br />
          public/images/
        </div>
      )}

      {/* Sits between the photo and the copy — see .scrim. */}
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>Hey, I&rsquo;m a</div>
          <h1 className={styles.title}>
            Video Editor
            {/* Serif italic against the bold sans above: he edits, he shoots. */}
            <span className={styles.titleLight}>
              <span className={styles.amp}>&amp;</span> Filmmaker
            </span>
          </h1>
          <div className={styles.sub}>
            Video editing, cinematic filmmaking &amp; visual storytelling.
          </div>
        </div>

        <div className={styles.spacer} aria-hidden="true" />

        <div className={styles.right}>
          <div className={styles.quote}>Great stories are made in the edit.</div>
          <div className={styles.rightCopy}>
            I turn raw footage into engaging videos, ads, &amp; content that
            keep people watching
          </div>
          <a className={styles.reel} href="#work">
            View my Reel
            <span className={styles.reelBadge} aria-hidden="true">
              ▶
            </span>
          </a>
        </div>
      </div>

      <div className={styles.strip}>
        {specialities.map((title, i) => (
          <div key={title}>
            <div className={styles.stripIndex}>#{String(i + 1).padStart(2, "0")}</div>
            <div className={styles.stripTitle}>{title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
