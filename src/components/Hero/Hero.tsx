import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./hero.module.css";

const specialities = [
  "Montage Editing",
  "Cinematic Shots",
  "UGC & Ads",
  "3D Animation",
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.portrait}>
        {site.images.heroPortrait ? (
          <Image
            className={styles.portraitImage}
            src={site.images.heroPortrait}
            alt={`Portrait of ${site.name}`}
            fill
            sizes="(max-width: 900px) 60vw, 30vw"
            priority
          />
        ) : (
          <div className={styles.portraitPlaceholder}>
            Hero portrait
            <br />
            public/images/
          </div>
        )}
      </div>

      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>Hey, I&rsquo;m a</div>
          <h1 className={styles.title}>
            Video Editor
            <br />& Filmmaker
          </h1>
          <div className={styles.sub}>
            Montage, cinematic shots and photography — edited end to end.
          </div>
        </div>

        <div className={styles.spacer} aria-hidden="true" />

        <div className={styles.right}>
          <div className={styles.quote}>Great stories are made in the edit.</div>
          <div className={styles.rightCopy}>
            From raw footage to final cut, I shape films, ads and content that hold
            attention.
          </div>
          <a className={styles.reel} href="#work">
            See the reel
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
