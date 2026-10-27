import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Tibeb from "@/components/Tibeb";
import "./globals.css";

const site = process.env.SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Equb · Save together, with receipts", template: "%s · Equb" },
  description: "A free, transparent equb (ekub) manager for students and small traders. Track contributions, see whose turn it is, and share progress without a single spreadsheet.",
  openGraph: { title: "Equb · Save together, with receipts", description: "Transparent savings circles for Ethiopian students and traders.", type: "website", siteName: "Equb" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#0b3d2e", width: "device-width", initialScale: 1 };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Tibeb />
        {children}
        <footer className="foot wrap"><span>Equb · እቁብ</span><span className="muted">Built for students and small traders in Ethiopia. Never enter real bank details.</span><Link href="/">Home</Link></footer>
      </body>
    </html>
  );
}
