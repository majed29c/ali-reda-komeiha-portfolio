import Image from "next/image";
import Stats from "./Stats";
import { ChevronRight, Clapperboard, Cube, Cut, Phone } from "@/components/icons";
import { site } from "@/lib/site";
import styles from "./about.module.css";

const highlights = [
  {
    Icon: Cut,
    title: "Video Editing",
    sub: "Talking-head, VSL & social media content.",
  },
  {
    Icon: Clapperboard,
    title: "Cinematic Filmmaking",
    sub: "Cinematic storytelling, commercials & product films.",
  },
  {
    Icon: Phone,
    title: "UGC & Ads",
    sub: "UGC content, performance ads & branded content.",
  },
  {
    Icon: Cube,
    title: "3D Animation",
    sub: "3D animation, motion design & advanced edits.",
  },
];

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.photoColumn}>
        <div className={styles.photoWrap}>
          <div className={styles.frame}>
            {site.images.aboutPortrait ? (
              <Image
                className={styles.photo}
                src={site.images.aboutPortrait}
                alt={`${site.name} at work`}
                fill
                sizes="(max-width: 780px) 90vw, 440px"
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                About portrait (4:5)
                <br />
                public/images/
              </div>
            )}
          </div>
          <div className={styles.wash} />
        </div>
        <Stats />
      </div>

      <div className={styles.copy}>
        <div className={styles.eyebrow}>About Me</div>
        <h2 className={styles.heading}>
          I edit videos that keep people{" "}
          <span className={styles.accentWord}>watching</span>
        </h2>
        <p className={styles.intro}>
          Video Editor specializing in talking-head, VSL, UGC, ads and cinematic
          edits — from basic cuts to advanced 3D and motion design.
        </p>

        {highlights.map(({ Icon, title, sub }) => (
          <div key={title} className={styles.row}>
            <span className={styles.rowIcon}>
              <Icon size={19} />
            </span>
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>{title}</span>
              <span className={styles.rowSub}>{sub}</span>
            </span>
          </div>
        ))}

        <div className={styles.actions}>
          <a className={styles.cta} href="#work">
            View my work
            <span className={styles.ctaBadge}>
              <ChevronRight />
            </span>
          </a>
          <span className={styles.availability}>
            <span className={styles.availabilityDot} />
            Available for new projects
          </span>
        </div>
      </div>
    </section>
  );
}
