import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { MobileBottomNav } from "../components/layout/mobile-bottom-nav";
import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { getMetadataBase } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Property LK",
    template: "%s | Property LK"
  },
  description: "A calm, searchable property experience for Sri Lankan homes, rentals, and guides.",
  openGraph: {
    siteName: "Property LK",
    locale: "en_LK",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <MobileBottomNav />
      </body>
    </html>
  );
}
