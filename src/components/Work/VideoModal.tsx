"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Close } from "@/components/icons";
import { useScrollLock } from "@/lib/useScrollLock";
import styles from "./videoModal.module.css";

const FOCUSABLE =
  'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function VideoModal({
  fileId,
  title,
  description,
  onClose,
}: {
  fileId: string;
  title: string;
  description: string;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  /** Plays the exit animation first; onClose fires when it finishes. */
  const requestClose = useCallback(() => setClosing(true), []);

  // Mounted only while open, so the lock is unconditional here.
  useScrollLock(true);

  useEffect(() => {
    const { body } = document;
    // Read by LiveRefresh, which skips its poll while a video is playing so a
    // background refresh cannot remount the player mid-watch.
    body.dataset.modalOpen = "true";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep tabbing inside the dialog while it is open.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      delete body.dataset.modalOpen;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  return createPortal(
    <div
      className={`${styles.backdrop} ${closing ? styles.closing : ""}`}
      onClick={requestClose}
      onAnimationEnd={(event) => {
        // Ignore bubbled animations from the panel and its children.
        if (closing && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Now playing
            </span>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={requestClose}
            aria-label="Close video"
          >
            <Close size={18} />
          </button>
        </div>

        <div className={styles.stage}>
          {!loaded && (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              Loading video
            </div>
          )}
          <iframe
            className={styles.iframe}
            data-loaded={loaded}
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            title={title}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
          {/* Covers Drive's pop-out button and absorbs clicks on it. */}
          <span className={styles.cornerMask} aria-hidden="true" />
        </div>

        <p className={styles.hint}>Press Esc or click outside to close</p>
      </div>
    </div>,
    document.body,
  );
}
