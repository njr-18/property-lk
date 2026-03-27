"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, Drawer, buttonClassName } from "@property-lk/ui";
import { mobileNavLinks, navLinks } from "../../lib/site-data";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav aria-label="Primary" className="site-nav">
        {navLinks.map((link) => (
          <Link
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            className="site-nav__link"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="site-nav__mobile-toggle">
        <Button onClick={() => setIsOpen(true)} size="sm" variant="secondary">
          Menu
        </Button>
      </div>

      <Drawer
        description="Quick links to the MVP routes and saved areas."
        onClose={() => setIsOpen(false)}
        open={isOpen}
        side="right"
        title="Browse Property LK"
      >
        <div className="mobile-drawer__section">
          {navLinks.map((link) => (
            <Link
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className="mobile-drawer__link"
              href={link.href}
              key={link.href}
              onClick={() => setIsOpen(false)}
            >
              <span>{link.label}</span>
              <span aria-hidden="true">/</span>
            </Link>
          ))}
        </div>
        <div className="mobile-drawer__section">
          <p className="mobile-drawer__eyebrow">Popular shortcuts</p>
          {mobileNavLinks.map((link) => (
            <Link
              className="mobile-drawer__shortcut"
              href={link.href}
              key={link.href}
              onClick={() => setIsOpen(false)}
            >
              <span>{link.label}</span>
              <span className="muted">{link.description}</span>
            </Link>
          ))}
        </div>
        <div className="mobile-drawer__footer">
          <Link
            className={buttonClassName({ size: "md", variant: "primary" })}
            href="/post-property"
            onClick={() => setIsOpen(false)}
          >
            Post a property
          </Link>
        </div>
      </Drawer>
    </>
  );
}
