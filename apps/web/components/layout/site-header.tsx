import Link from "next/link";
import { navLinks } from "../../lib/site-data";

export function SiteHeader() {
  return (
    <header className="header site-shell">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true" />
        <span>Property LK</span>
      </Link>
      <nav aria-label="Primary">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
