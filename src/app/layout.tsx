import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ali Komeiha — Video Editor & Visual Storyteller",
  description:
    "Video Editor specializing in talking-head, VSL, UGC, ads and cinematic edits — from basic cuts to advanced 3D and motion design.",
  openGraph: {
    title: "Ali Komeiha — Video Editor & Visual Storyteller",
    description:
      "Talking-head, VSL, UGC, ads and cinematic edits — from basic cuts to advanced 3D and motion design.",
    type: "website",
  },
};

/**
 * Runs synchronously while the browser parses the HTML — before first paint,
 * before the browser restores a scroll offset, and before the `#work` element
 * exists to jump to. Doing this in an effect is too late: on iOS both have
 * already happened by then.
 *
 * Tapping a nav link leaves `#work` in the URL, so a plain refresh would land
 * back on that section. On a reload the hash is stripped and the URL cleaned;
 * on a fresh navigation it is kept, so a shared link to a section still works.
 */
const RESET_SCROLL_ON_LOAD = `(function(){try{
if('scrollRestoration' in history)history.scrollRestoration='manual';
var n=performance.getEntriesByType('navigation')[0];
if((!n||n.type==='reload')&&location.hash)history.replaceState(null,'',location.pathname+location.search);
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * suppressHydrationWarning covers only this element's own attributes.
     * Browser extensions and in-app browsers stamp things like
     * `__gcrremoteframetoken` onto <html> before React hydrates, which we
     * cannot prevent. Mismatches inside the app still surface normally.
     */
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: RESET_SCROLL_ON_LOAD }} />
        {children}
      </body>
    </html>
  );
}
