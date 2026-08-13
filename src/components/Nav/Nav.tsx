import MobileMenu, { type NavLink } from "./MobileMenu";
import { ChevronRight } from "@/components/icons";
import { site } from "@/lib/site";
import styles from "./nav.module.css";

const links: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.wordmark}>
        {site.name}
        <span className={styles.dot}>.</span>
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <a key={link.href} className={styles.link} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <a className={styles.cta} href="#contact">
        Get in touch
        <span className={styles.ctaBadge}>
          <ChevronRight />
        </span>
      </a>
      <MobileMenu links={links} />
    </nav>
  );
}
