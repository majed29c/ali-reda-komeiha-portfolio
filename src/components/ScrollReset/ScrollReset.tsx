"use client";

import { useEffect } from "react";

/**
 * Opens the page at the top on every load.
 *
 * Browsers restore the previous scroll offset on reload, which on a one-page
 * site drops you back into the middle of it — the "sometimes it's scrolled
 * down" behaviour. Turning restoration off makes reloads deterministic.
 *
 * The inline script in the root layout does the heavy lifting: it runs during
 * HTML parsing and, on a reload, strips any `#section` from the URL so the
 * browser never jumps there. By the time this effect runs the hash is already
 * gone, and the guard below only survives for genuine deep links.
 */
export default function ScrollReset() {
  useEffect(() => {
    // Belt and braces: the inline script in the root layout already sets this
    // far earlier, which is what actually beats mobile Safari's restore.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Only a genuine deep link still has a hash at this point; keep its anchor.
    if (window.location.hash) return;

    // "instant" so the global `scroll-behavior: smooth` does not animate the
    // page down-to-up on load, and so the position lands immediately.
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();

    /*
     * Mobile Safari restores its saved offset asynchronously, sometimes after
     * this effect has already run — so re-assert on the next frame and once the
     * load event fires. `pageshow` with `persisted` covers coming back from the
     * bfcache, where no effect runs at all.
     */
    const frame = requestAnimationFrame(toTop);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) toTop();
    };

    window.addEventListener("load", toTop);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", toTop);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
