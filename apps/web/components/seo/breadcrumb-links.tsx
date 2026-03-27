import Link from "next/link";
import type { BreadcrumbItem } from "../../lib/seo";

export function BreadcrumbLinks({ items }: { items: BreadcrumbItem[] }) {
  if (items.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="meta-row">
      {items.map((item, index) => (
        <span key={item.path}>
          {index === items.length - 1 ? (
            <span aria-current="page">{item.name}</span>
          ) : (
            <Link href={item.path}>{item.name}</Link>
          )}
          {index < items.length - 1 ? <span aria-hidden="true"> / </span> : null}
        </span>
      ))}
    </nav>
  );
}
