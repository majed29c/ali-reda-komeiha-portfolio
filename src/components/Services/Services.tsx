import {
  Camera,
  Clapperboard,
  Cube,
  Cut,
  Monitor,
  Montage,
  Person,
  Phone,
  Sparkle,
  Speaker,
} from "@/components/icons";
import styles from "./services.module.css";

const services = [
  {
    Icon: Montage,
    title: "Montage Editing",
    description: "Rhythm-led montages that cut footage down to its strongest moments.",
  },
  {
    Icon: Clapperboard,
    title: "Cinematic Shots",
    description: "Filmed and edited sequences with deliberate pacing and grade.",
  },
  {
    Icon: Camera,
    title: "Photography",
    description: "Stills shot and retouched to sit alongside the video work.",
  },
  {
    Icon: Person,
    title: "Talking-Head Edits",
    description: "Interviews and to-camera content paced, cleaned and captioned.",
  },
  {
    Icon: Monitor,
    title: "VSL Editing",
    description: "Sales videos structured to hold attention through the full pitch.",
  },
  {
    Icon: Phone,
    title: "UGC Content",
    description: "Creator-style edits that feel native to the feed and convert.",
  },
  {
    Icon: Cube,
    title: "3D Animation",
    description: "3D sequences and animated inserts for ads and brand content.",
  },
  {
    Icon: Sparkle,
    title: "Advanced Edits",
    description: "VFX, compositing and multi-layer work when the concept demands it.",
  },
  {
    Icon: Cut,
    title: "Basic Edits",
    description: "Fast, clean cuts with sound and colour handled — quick turnaround.",
  },
  {
    Icon: Speaker,
    title: "Ads & Promos",
    description: "Promotional creatives built to stop the scroll and drive action.",
  },
];

export default function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>What I Do</div>
          <h3 className={styles.heading}>Services</h3>
        </div>
        <div className={styles.note}>
          Pick what your project needs, or hand over the whole edit.
        </div>
      </div>

      <div className={styles.grid}>
        {services.map(({ Icon, title, description }, i) => (
          <div key={title} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.cardIcon}>
                <Icon size={20} />
              </span>
              <span className={styles.cardIndex}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className={styles.cardTitle}>{title}</div>
            <div className={styles.cardDescription}>{description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
