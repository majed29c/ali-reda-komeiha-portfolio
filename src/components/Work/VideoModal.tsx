"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Close } from "@/components/icons";
import { useScrollLock } from "@/lib/useScrollLock";
import styles from "./videoModal.module.css";

const FOCUSABLE =
  'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/*
 * Off by default, and it has to be.
 *
 * The native <video> path streams through /api/video/[fileId], which reads the
 * bytes from Drive with an API key. Drive serves *metadata* to an API key fine,
 * but refuses the media itself with an "automated queries" abuse page — every
 * request, not intermittently. So the player would always fail and fall back,
 * which just makes playback slow and unpredictable.
 *
 * Turning this on needs auth Drive accepts for media: a service account (share
 * the folder with its email and send a Bearer token from the route) or OAuth.
 * With that in place, set NEXT_PUBLIC_DRIVE_NATIVE_PLAYER=true.
 */
const NATIVE_PLAYER_ENABLED =
  process.env.NEXT_PUBLIC_DRIVE_NATIVE_PLAYER === "true";

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
  /** Drive's player is the default; the native one is opt-in and falls back here. */
  const [useIframe, setUseIframe] = useState(!NATIVE_PLAYER_ENABLED);
  const panelRef = useRef<HTMLDivElement>(null);
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
    // Focus the dialog itself, not the close button — focusing a button paints
    // an orange ring on it the moment the modal opens, which reads as a defect.
    //
    // preventScroll matters: without it the browser scrolls the newly focused
    // element into view, which yanks the page to the top as the modal opens.
    panelRef.current?.focus({ preventScroll: true });

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
        tabIndex={-1}
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

          {useIframe ? (
            <>
              <iframe
                className={styles.iframe}
                data-loaded={loaded}
                src={`https://drive.google.com/file/d/${fileId}/preview`}
                title={title}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                onLoad={() => setLoaded(true)}
              />
              {/* Only the iframe needs this — it covers Drive's own top chrome. */}
              <span className={styles.topMask} aria-hidden="true" />
            </>
          ) : (
            /* Native player: controls are the browser's, so they scale properly
               and carry none of Drive's chrome. */
            <video
              className={styles.video}
              data-loaded={loaded}
              src={`/api/video/${fileId}`}
              poster={`https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onLoadedMetadata={() => setLoaded(true)}
              // If the proxy cannot serve the file (e.g. the API key is not yet
              // allowed to call Drive), fall back to Drive's own player.
              onError={() => {
                setUseIframe(true);
                setLoaded(false);
              }}
            />
          )}
        </div>

        <p className={styles.hint}>Press Esc or click outside to close</p>
      </div>
    </div>,
    document.body,
  );
}
