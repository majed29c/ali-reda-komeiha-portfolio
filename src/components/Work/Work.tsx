import WorkCarousel from "./WorkCarousel";
import type { ProjectSection } from "@/lib/getProjects";
import styles from "./work.module.css";

export default function Work({ sections }: { sections: ProjectSection[] }) {
  return (
    <section id="work" className={styles.work}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Work</h3>
        <div className={styles.headerNote}>Organised by category</div>
      </div>
      {sections.length === 0 ? (
        <p className={styles.empty}>No projects yet.</p>
      ) : (
        sections.map((section) => (
          <WorkCarousel key={section.name} section={section} />
        ))
      )}
    </section>
  );
}
