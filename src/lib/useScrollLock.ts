"use client";

import { useEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;

/**
 * Freezes the page behind an overlay.
 *
 * `overflow: hidden` on <body> is not enough — iOS Safari ignores it and keeps
 * scrolling the page under the drawer. Pinning the body with `position: fixed`
 * at a negative offset is the reliable cross-browser lock; the offset is
 * restored on release so the page does not jump back to the top.
 *
 * The counter lets overlays nest (drawer + video modal) without the first one
 * to close releasing the lock for both.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;

      // Compensate for the scrollbar we are about to remove, so desktop layout
      // does not shift sideways as the overlay opens.
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

      body.style.position = "fixed";
      body.style.top = `-${savedScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.paddingRight = "";

      // Reading a layout value forces the document to regain its full scroll
      // height first; otherwise the restore below can clamp to a shorter page.
      void document.documentElement.scrollHeight;

      /*
       * behavior: "instant" is essential. globals.css sets
       * `html { scroll-behavior: smooth }`, so a plain scrollTo animates — and
       * anything reading window.scrollY before that animation lands (React's
       * Strict Mode remount, or a lock that reopens quickly) captures a value
       * near zero and pins the page to the top on the next open.
       */
      window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
    };
  }, [active]);
}
