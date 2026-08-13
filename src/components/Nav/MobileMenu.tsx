"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronRight, Close, Menu } from "@/components/icons";
import { site } from "@/lib/site";
import styles from "./mobileMenu.module.css";

/** Matches the `max-width: 720px` breakpoint the burger appears at. */
const DESKTOP_QUERY = "(min-width: 721px)";

export type NavLink = { href: string; label: string };

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock the page behind the drawer, move focus into it, close on Escape.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Growing past the breakpoint brings the inline nav back, so drop the drawer.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const close = () => {
    setOpen(false);
    burgerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className={styles.burger}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </button>

      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        id={panelId}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        inert={!open}
      >
        <div className={styles.panelHeader}>
          <div className={styles.wordmark}>
            {site.name}
            <span className={styles.dot}>.</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={close}
          >
            <Close />
          </button>
        </div>

        <div className={styles.links}>
          {links.map((link) => (
            <a
              key={link.href}
              className={styles.link}
              href={link.href}
              onClick={close}
            >
              {link.label}
              <span className={styles.linkChevron}>
                <ChevronRight size={16} strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>

        <a className={styles.cta} href="#contact" onClick={close}>
          Get in touch
          <span className={styles.ctaBadge}>
            <ChevronRight size={15} />
          </span>
        </a>

        <span className={styles.availability}>
          <span className={styles.availabilityDot} />
          Available for new projects
        </span>
      </div>
    </>
  );
}
