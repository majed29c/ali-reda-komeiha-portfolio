import Image from "next/image";
import { ChevronRight, Convert, Cube, Montage } from "@/components/icons";
import { site } from "@/lib/site";
import styles from "./about.module.css";

const highlights = [
  {
    Icon: Montage,
    title: "Montage & cinematic edits",
    sub: "Paced, graded, finished.",
  },
  {
    Icon: Convert,
    title: "UGC, ads & VSL",
    sub: "Built to convert.",
  },
  {
    Icon: Cube,
    title: "3D animation & advanced edits",
    sub: "VFX and compositing.",
  },
];

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.photoColumn}>
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
        <div className={styles.badge}>
          <div className={styles.badgeValue}>+4 years</div>
          <div className={styles.badgeLabel}>of experience</div>
        </div>
      </div>

      <div className={styles.copy}>
        <div className={styles.eyebrow}>About Me</div>
        <h2 className={styles.heading}>I cut video that holds attention.</h2>
        <p className={styles.intro}>
          Video editor and filmmaker. Montage, cinematic shots, talking-head, VSL and
          UGC — from a basic cut to 3D and advanced edits.
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
