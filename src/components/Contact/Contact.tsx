import { ChevronRight, Instagram, Mail, WhatsApp } from "@/components/icons";
import { emailUrl, site, whatsappUrl } from "@/lib/site";
import styles from "./contact.module.css";

export default function Contact() {
  const actions = [
    {
      href: whatsappUrl,
      Icon: WhatsApp,
      label: "Message on WhatsApp",
      sub: "Fastest reply — usually within an hour",
      primary: true,
      external: true,
    },
    {
      href: emailUrl,
      Icon: Mail,
      label: "Send an email",
      sub: site.contact.email,
      primary: false,
      external: false,
    },
    {
      href: site.contact.instagram,
      Icon: Instagram,
      label: "Instagram",
      sub: "Latest cuts and behind the scenes",
      primary: false,
      external: true,
    },
  ];

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.panel}>
        <div>
          <div className={styles.eyebrow}>Get In Touch</div>
          <h3 className={styles.heading}>Let&rsquo;s create something great.</h3>
          <p className={styles.copy}>
            Have a project in mind? A brand ad, a short-form reel, or a full cinematic
            piece — I&rsquo;m one message away.
          </p>
        </div>

        <div className={styles.actions}>
          {actions.map(({ href, Icon, label, sub, primary, external }) => (
            <a
              key={label}
              href={href}
              className={`${styles.action} ${
                primary ? styles.actionPrimary : styles.actionSecondary
              }`}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <span className={styles.actionMain}>
                <span className={styles.actionIcon}>
                  <Icon size={22} />
                </span>
                <span>
                  <span className={styles.actionLabel}>{label}</span>
                  <span className={styles.actionSub}>{sub}</span>
                </span>
              </span>
              <span className={styles.actionChevron}>
                <ChevronRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
