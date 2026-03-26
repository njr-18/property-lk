import Link from "next/link";
import type { ReactNode } from "react";
import { navItems } from "../lib/mock-data";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-kicker">Property LK Admin</p>
          <h1>Moderation desk</h1>
          <p className="subtle">
            Review listings, confirm trust signals, and keep the marketplace clean.
          </p>
        </div>

        <nav className="nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <strong>{item.label}</strong>
              <div className="muted">{item.description}</div>
            </Link>
          ))}
        </nav>

        <div className="sidebar-note">
          All actions here are placeholders wired for future moderation workflows.
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}
