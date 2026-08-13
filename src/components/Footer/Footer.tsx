import { Instagram, Mail, WhatsApp } from "@/components/icons";
import { emailUrl, site, whatsappUrl } from "@/lib/site";
import styles from "./footer.module.css";

const socials = [
  { href: site.contact.instagram, label: "Instagram", Icon: Instagram, external: true },
  { href: whatsappUrl, label: "WhatsApp", Icon: WhatsApp, external: true },
  { href: emailUrl, label: "Email", Icon: Mail, external: false },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        © {site.year} {site.name} — {site.role}
      </div>
      <div className={styles.socials}>
        {socials.map(({ href, label, Icon, external }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className={styles.social}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon size={22} />
          </a>
        ))}
      </div>
    </footer>
  );
}
