import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="brand-kicker">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="subtle">{description}</p>
      </div>
      {actions ? <div className="action-row">{actions}</div> : null}
    </header>
  );
}
