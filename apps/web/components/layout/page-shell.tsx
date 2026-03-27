import type { ReactNode } from "react";

export function PageShell({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <section className="site-grid route-stack">{children}</section>;
}
