"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps an already-open tab current.
 *
 * The /api/revalidate webhook only refreshes the *server* cache — it cannot push
 * into an idle browser. This polls for a new server render, so a visitor sitting
 * on the page picks up sheet edits without touching reload.
 *
 * `router.refresh()` re-fetches the RSC payload and merges it in place: no full
 * page load, scroll position and client state (an open video modal, carousel
 * scroll) all survive. It does not invalidate the server cache, so each call is
 * a cheap hit against the already-cached page.
 *
 * Hidden tabs are not polled — background tabs should not burn requests.
 *
 * The interval is deliberately lazy. Refresh-on-focus already covers the case
 * that matters (edit the Sheet, switch back to the site, see it update), so the
 * poll only has to catch a tab left open and untouched.
 */
export default function LiveRefresh({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    // Never refresh mid-playback: if the sheet order changed, re-rendering would
    // remount the player and restart the video under the viewer.
    const refresh = () => {
      if (document.body.dataset.modalOpen) return;
      router.refresh();
    };

    const start = () => {
      stop();
      timer = setInterval(refresh, intervalMs);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh(); // Catch up straight away on return, then resume polling.
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router, intervalMs]);

  return null;
}
