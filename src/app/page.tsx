import type { Metadata } from "next";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LiveRefresh from "@/components/LiveRefresh";
import Nav from "@/components/Nav";
import Offline from "@/components/Offline";
import Services from "@/components/Services";
import Work from "@/components/Work";
import { getProjects, groupBySection } from "@/lib/getProjects";
import styles from "./page.module.css";

/**
 * Master switch for the portfolio.
 *
 *   true  — the full site renders.
 *   false — only the holding page renders; none of the real markup is sent to
 *           the browser, and the page is marked noindex.
 *
 * Flip this and redeploy. To toggle it without a redeploy, read an environment
 * variable instead: `const SITE_ENABLED = process.env.SITE_ENABLED !== "false";`
 */
const SITE_ENABLED = true;

export const metadata: Metadata = SITE_ENABLED
  ? {}
  : {
      // Also overrides the layout's title/description so the portfolio is not
      // described in the page source or in link previews while it is off.
      title: "Temporarily offline",
      description: "This site is temporarily offline.",
      robots: { index: false, follow: false },
      openGraph: {
        title: "Temporarily offline",
        description: "This site is temporarily offline.",
        type: "website",
      },
    };

export default async function Home() {
  if (!SITE_ENABLED) return <Offline />;

  const sections = groupBySection(await getProjects());

  return (
    <div className={styles.shell}>
      <div id="top" className={styles.inner}>
        {/* Picks up sheet edits in tabs that are already open. */}
        <LiveRefresh />
        <Nav />
        <Hero />
        <About />
        <Work sections={sections} />
        <Services />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
