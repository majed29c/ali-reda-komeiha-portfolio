import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ali Komeiha — Video Editor & Filmmaker",
  description:
    "Video editor and filmmaker. Montage, cinematic shots, talking-head, VSL and UGC — from a basic cut to 3D and advanced edits.",
  openGraph: {
    title: "Ali Komeiha — Video Editor & Filmmaker",
    description:
      "Montage, cinematic shots, UGC, ads and 3D animation — edited end to end.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
