import {
  Clapperboard,
  Cube,
  Cut,
  Monitor,
  Motion,
  Person,
  Phone,
  Sparkle,
  Speaker,
  VideoCamera,
} from "@/components/icons";
import styles from "./services.module.css";

const services = [
  {
    Icon: Person,
    title: "Talking Head Editing",
    description:
      "Engaging talking-head content with captions, B-roll, sound design, animations & retention-focused pacing.",
  },
  {
    Icon: Phone,
    title: "UGC Editing",
    description:
      "Fast-paced UGC edits with strong hooks, captions, dynamic cuts & retention-focused editing.",
  },
  {
    Icon: Speaker,
    title: "Commercial Ad Editing",
    description:
      "Product ads, promotional videos & social media campaigns designed to capture attention & drive results.",
  },
  {
    Icon: Monitor,
    title: "VSL Editing",
    description:
      "Sales videos structured with strong hooks, pacing, storytelling & visual elements designed to drive action.",
  },
  {
    Icon: Clapperboard,
    title: "Cinematic Video Editing",
    description:
      "Cinematic storytelling, polished cuts, color grading & sound design with a strong visual style.",
  },
  {
    Icon: Motion,
    title: "Motion Graphics & Editing",
    description:
      "Dynamic text animation, transitions, visual effects & motion design that enhance the story & keep viewers engaged.",
  },
  {
    Icon: Sparkle,
    title: "AI Video & Visuals",
    description:
      "AI-generated scenes, visuals, creative effects & AI-enhanced content used to create unique & engaging videos.",
  },
  {
    Icon: Cube,
    title: "3D Animation & Editing",
    description:
      "3D sequences, animated assets, product visuals & advanced visual elements for ads & branded content.",
  },
  {
    Icon: Cut,
    title: "Basic Video Editing",
    description:
      "Clean & efficient edits with cuts, sound, color correction, simple captions & smooth pacing.",
  },
  {
    Icon: VideoCamera,
    title: "Commercial & Cinematic Filming",
    description:
      "Commercial ads, cinematic shots & branded visual content filmed with a professional camera & crafted for a polished final look.",
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
