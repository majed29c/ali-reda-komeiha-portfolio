import WorkCarousel from "./WorkCarousel";
import type { WorkSection } from "@/lib/work";
import styles from "./work.module.css";

export default function Work({ sections }: { sections: WorkSection[] }) {
  return (
    <section id="work" className={styles.work}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Work</h3>
        <div className={styles.headerNote}>Organised by category</div>
      </div>
      {sections.map((section) => (
        <WorkCarousel key={section.name} section={section} />
      ))}
    </section>
  );
}
