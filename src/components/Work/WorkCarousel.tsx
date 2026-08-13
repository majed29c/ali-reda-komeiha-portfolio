"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import type { WorkSection } from "@/lib/work";
import styles from "./work.module.css";

const EDGE_TOLERANCE = 8;

export default function WorkCarousel({ section }: { section: WorkSection }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false, overflows: false });

  const measure = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({
      prev: el.scrollLeft > EDGE_TOLERANCE,
      next: el.scrollLeft < max - EDGE_TOLERANCE,
      overflows: max > EDGE_TOLERANCE,
    });
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const scrollBy = (direction: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(340, el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  const count = section.videos.length;

  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader}>
        <div className={styles.categoryDot} />
        <div className={styles.categoryName}>{section.name}</div>
        <div className={styles.spacer} />
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
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label={`Next ${section.name} films`}
            className={`${styles.arrow} ${edges.next ? "" : styles.arrowDisabled}`}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div ref={rowRef} className={styles.row} onScroll={measure}>
        {section.videos.map((video, index) => (
          <div key={`${video.title}-${index}`} className={styles.card}>
            <div className={styles.thumb}>
              {video.thumb ? (
                /* Thumbnails come from an arbitrary sheet URL, so they are served
                   as-is rather than through the Next.js image optimizer. */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.thumbImage}
                  src={video.thumb}
                  alt={video.title}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              {video.duration ? (
                <div className={styles.duration}>▶ {video.duration}</div>
              ) : null}
            </div>
            <div className={styles.cardTitle}>{video.title}</div>
            {video.description ? (
              <div className={styles.cardDescription}>{video.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
