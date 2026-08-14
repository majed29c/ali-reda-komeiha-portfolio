"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import styles from "./stats.module.css";

const DURATION_MS = 1600;

/**
 * Counts up once, the first time the row scrolls into view.
 *
 * The numbers are written straight to the DOM via refs rather than through
 * state: a state update per frame would re-render this subtree ~90 times during
 * the animation for no benefit. React renders the final values, so the markup is
 * correct with JavaScript disabled and for crawlers.
 */
export default function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const write = (index: number, n: number) => {
      const el = valueRefs.current[index];
      if (el) el.textContent = `${n}${site.stats[index].suffix}`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // Leave the rendered final values in place.
    }

    // Reset to zero. About sits well below the fold, so this is never seen.
    site.stats.forEach((_, i) => write(i, 0));

    let frame: number | null = null;

    const start = () => {
      const startedAt = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - startedAt) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        site.stats.forEach((stat, i) => write(i, Math.round(stat.value * eased)));
        frame = t < 1 ? requestAnimationFrame(tick) : null;
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect(); // Run once.
        start();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.stats}>
      {site.stats.map((stat, index) => (
        <div
          key={stat.label}
          className={styles.stat}
          /* Screen readers get the final figure, never a mid-count value. */
          aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
        >
          <span
            className={styles.value}
            ref={(el) => {
              valueRefs.current[index] = el;
            }}
          >
            {stat.value}
            {stat.suffix}
          </span>
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
