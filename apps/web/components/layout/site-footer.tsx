import Link from "next/link";
import { footerLinkGroups } from "../../lib/site-data";

export function SiteFooter() {
  return (
    <footer className="footer site-shell">
      <div className="footer__grid">
        <div className="footer__intro">
          <p className="pill">Greater Colombo rentals first</p>
          <h2>Built for calm property decisions, not listing overload.</h2>
          <p className="muted">
            The shell is ready for search, saved workflows, trust signals, guides, and moderation-backed publishing.
          </p>
        </div>
        {footerLinkGroups.map((group) => (
          <div className="footer__column" key={group.title}>
            <h3>{group.title}</h3>
            <div className="footer__links">
              {group.links.map((link) => (
                <Link href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
