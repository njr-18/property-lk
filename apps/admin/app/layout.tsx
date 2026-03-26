import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AdminShell } from "../components/admin-shell";

export const metadata: Metadata = {
  title: "Property LK Admin",
  description: "Admin and moderation workspace for Property LK."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
