import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AdminShell } from "../components/admin-shell";
import { StatePanel } from "../components/state-panel";
import { getAdminAccessState } from "../lib/auth";

export const metadata: Metadata = {
  title: "Property LK Admin",
  description: "Admin and moderation workspace for Property LK."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const accessState = await getAdminAccessState();

  return (
    <html lang="en">
      <body>
        {accessState.kind === "authorized" ? (
          <AdminShell user={accessState.user}>{children}</AdminShell>
        ) : accessState.kind === "forbidden" ? (
          <main className="access-shell">
            <StatePanel
              title="Admin access required"
              description={`${accessState.user.name ?? accessState.user.email} is signed in, but this account does not have admin access.`}
            />
          </main>
        ) : (
          <main className="access-shell">
            <StatePanel
              title="Sign in to continue"
              description="This admin workspace reuses the shared Property LK session and only allows admin accounts."
            />
          </main>
        )}
      </body>
    </html>
  );
}
