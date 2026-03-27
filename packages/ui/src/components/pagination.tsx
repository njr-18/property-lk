import { cn } from "./utils";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref?: (page: number) => string;
  className?: string;
};

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

export function Pagination({ currentPage, totalPages, getHref, className }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = clampPage(currentPage, totalPages);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className={cn("ui-pagination", className)}>
      {renderPaginationLink("Previous", safeCurrentPage - 1, safeCurrentPage === 1, getHref)}
      <div className="ui-pagination__pages">
        {pages.map((page) =>
          renderPaginationLink(String(page), page, false, getHref, page === safeCurrentPage)
        )}
      </div>
      {renderPaginationLink("Next", safeCurrentPage + 1, safeCurrentPage === totalPages, getHref)}
    </nav>
  );
}

function renderPaginationLink(
  label: string,
  page: number,
  disabled: boolean,
  getHref?: (page: number) => string,
  active = false
) {
  const className = cn(
    "ui-pagination__link",
    active && "ui-pagination__link--active",
    disabled && "ui-pagination__link--disabled"
  );

  if (!getHref || disabled) {
    return (
      <span aria-current={active ? "page" : undefined} className={className} key={label}>
        {label}
      </span>
    );
  }

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={className}
      href={getHref(page)}
      key={label}
    >
      {label}
    </a>
  );
}
