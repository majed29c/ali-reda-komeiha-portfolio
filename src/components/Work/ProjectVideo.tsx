"use client";

import { useEffect, useRef, useState } from "react";
import VideoModal from "./VideoModal";
import { Play } from "@/components/icons";
import styles from "./projectVideo.module.css";

type PosterStatus = "loading" | "ready" | "error";

/**
 * The card deliberately does NOT embed Drive's player. Drive's iframe brings its
 * own chrome — an off-centre play button and a pop-out button that escapes to a
 * new tab — none of which can be restyled. So the card shows Drive's poster with
 * our own badge, and the player only appears inside the modal.
 */
export default function ProjectVideo({
  fileId,
  title,
  description,
}: {
  fileId: string | null;
  title: string;
  description: string;
}) {
  const [poster, setPoster] = useState<PosterStatus>("loading");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  // A cached poster can finish loading before hydration, so the onLoad below
  // never fires and the card would shimmer forever. Catch that on mount.
  useEffect(() => {
    const img = posterRef.current;
    if (img?.complete) setPoster(img.naturalWidth > 0 ? "ready" : "error");
  }, []);

  if (!fileId) {
    return (
      <div className={`${styles.frame} ${styles.unavailable}`}>Video unavailable</div>
    );
  }

  const close = () => {
    setOpen(false);
    // preventScroll: restoring focus must not jump the page to this card.
    triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.frame}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Play ${title}`}
      >
        {poster !== "error" && (
          /* Drive sizes its own poster; see README for why this is not next/image. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            ref={posterRef}
            className={`${styles.layer} ${styles.poster}`}
            data-status={poster}
            src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w640`}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setPoster("ready")}
            onError={() => setPoster("error")}
          />
        )}
        {poster === "loading" && (
          <span className={`${styles.layer} ${styles.skeleton}`} aria-hidden="true" />
        )}
        <span className={`${styles.layer} ${styles.scrim}`} aria-hidden="true" />
        <span className={styles.playBadge}>
          <Play size={20} />
        </span>
      </button>

      {open && (
        <VideoModal
          fileId={fileId}
          title={title}
          description={description}
          onClose={close}
        />
      )}
    </>
  );
}
