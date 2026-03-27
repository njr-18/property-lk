"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavLinks } from "../../lib/site-data";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile" className="mobile-bottom-nav">
      {mobileNavLinks.map((link) => (
        <Link
          aria-current={isActive(pathname, link.href) ? "page" : undefined}
          className="mobile-bottom-nav__link"
          href={link.href}
          key={link.href}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
