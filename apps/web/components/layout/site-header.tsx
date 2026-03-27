import Link from "next/link";
import { SiteNavigation } from "./site-navigation";

export function SiteHeader() {
  return (
    <header className="header site-shell">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true" />
        <span>Property LK</span>
      </Link>
      <SiteNavigation />
    </header>
  );
}
