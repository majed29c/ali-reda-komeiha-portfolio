"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProjectVideo from "./ProjectVideo";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import type { ProjectSection } from "@/lib/getProjects";
import styles from "./work.module.css";

const EDGE_TOLERANCE = 8;

/**
 * Where each card starts inside the scrollable content, in scrollLeft units.
 * Derived from live rects plus the current scrollLeft, so the numbers stay
 * the same whether or not a smooth scroll is still animating.
 */
const cardStarts = (row: HTMLElement) => {
  const rowLeft = row.getBoundingClientRect().left;
  const padLeft = parseFloat(getComputedStyle(row).paddingLeft) || 0;
  return (Array.from(row.children) as HTMLElement[]).map(
    (card) => card.getBoundingClientRect().left - rowLeft + row.scrollLeft - padLeft,
  );
};

export default function WorkCarousel({ section }: { section: ProjectSection }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false, overflows: false });

  const frameRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = {
      prev: el.scrollLeft > EDGE_TOLERANCE,
      // Reaching the far right means the last card is fully in view — nothing
      // left to reveal, so the arrow goes away.
      next: el.scrollLeft < max - EDGE_TOLERANCE,
      overflows: max > EDGE_TOLERANCE,
    };

    // Hand back the identical object when nothing changed so React bails out.
    // Building a fresh one every scroll event re-rendered the whole row — and
    // its cards — dozens of times a second for no visible difference.
    setEdges((current) =>
      current.prev === next.prev &&
      current.next === next.next &&
      current.overflows === next.overflows
        ? current
        : next,
    );
  }, []);

  /** Scroll fires far faster than paint; collapse it to one measure per frame. */
  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [measure, scheduleMeasure]);

  /** Step to the neighbouring card by index, then let the scroller clamp. */
  const scrollByCard = (direction: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    const starts = cardStarts(el);
    if (!starts.length) return;

    // Skip card starts that sit a sliver away from where we are: the row can
    // rest just past one (clamped at the far right, or after a swipe), and
    // stepping onto it would shift a few pixels and look like a dead arrow.
    const pitch = starts.length > 1 ? starts[1] - starts[0] : el.clientWidth;
    const threshold = Math.max(EDGE_TOLERANCE, pitch / 2);

    const target =
      direction === 1
        ? starts.find((start) => start > el.scrollLeft + threshold)
        : starts.filter((start) => start < el.scrollLeft - threshold).pop();

    // Past the last card start there is still the tail of that card to reveal,
    // so fall back to the far edge rather than ignoring the click.
    const left = target ?? (direction === 1 ? el.scrollWidth : 0);
    el.scrollTo({ left, behavior: "smooth" });
  };

  const count = section.projects.length;

  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader}>
        <div className={styles.categoryDot} />
        <div className={styles.categoryName}>{section.name}</div>
        <div className={styles.categoryMeta}>
          {count} {count === 1 ? "film" : "films"}
        </div>
        <div
          className={`${styles.arrows} ${edges.overflows ? "" : styles.arrowsHidden}`}
        >
          <button
            type="button"
            aria-label={`Previous ${section.name} films`}
            className={`${styles.arrow} ${edges.prev ? "" : styles.arrowDisabled}`}
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label={`Next ${section.name} films`}
            className={`${styles.arrow} ${edges.next ? "" : styles.arrowDisabled}`}
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div ref={rowRef} className={styles.row} onScroll={scheduleMeasure}>
        {section.projects.map((project, index) => (
          <div key={`${project.title}-${index}`} className={styles.card}>
            <ProjectVideo
              fileId={project.fileId}
              title={project.title}
              description={project.description}
            />
            <div className={styles.cardTitle}>{project.title}</div>
            {project.description ? (
              <div className={styles.cardDescription}>{project.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
