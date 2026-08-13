import { ChevronRight, Lock } from "@/components/icons";
import { emailUrl, site } from "@/lib/site";
import styles from "./offline.module.css";

/**
 * Holding page shown while the portfolio is switched off (`SITE_ENABLED` in
 * `src/app/page.tsx`). None of the real page is rendered behind it.
 */
export default function Offline() {
  return (
    <div className={styles.screen}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.wordmark}>
          {site.name}
          <span className={styles.dot}>.</span>
        </div>
        <span className={styles.iconTile}>
          <Lock size={24} />
        </span>
        <h1 className={styles.heading}>This site is temporarily offline.</h1>
        <p className={styles.copy}>
          The portfolio is on hold while final arrangements are completed. It will be
          back shortly.
        </p>
        <a className={styles.cta} href={emailUrl}>
          Contact
          <span className={styles.ctaBadge}>
            <ChevronRight />
          </span>
        </a>
      </div>
    </div>
  );
}
