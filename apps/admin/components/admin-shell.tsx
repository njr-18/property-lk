import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminSessionUser } from "../lib/auth";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    description: "Moderation overview"
  },
  {
    href: "/listings",
    label: "Listings",
    description: "Read-only listing review"
  },
  {
    href: "/inquiries",
    label: "Inquiries",
    description: "Lead and message review"
  },
  {
    href: "/duplicates",
    label: "Duplicates",
    description: "Explainable duplicate review"
  }
] as const;

type AdminShellProps = {
  children: ReactNode;
  user: AdminSessionUser;
};

export function AdminShell({ children, user }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">
        Skip to content
      </a>
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-kicker">Property LK Admin</p>
          <h1>Moderation desk</h1>
          <p className="subtle">
            Review supply and inquiry quality before moderation actions go live.
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
          <strong>{user.name ?? user.email}</strong>
          <div className="muted">{user.email}</div>
          <div className="muted">Role: {user.role}</div>
        </div>
      </aside>

      <main className="main" id="admin-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
