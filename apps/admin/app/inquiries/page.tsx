import Link from "next/link";
import { listAdminInquiries, type AdminInquiryStatusFilter } from "@property-lk/db";
import { PageHeader } from "../../components/page-header";
import { SectionCard } from "../../components/section-card";
import { StatePanel } from "../../components/state-panel";
import { StatusBadge } from "../../components/status-badge";
import { formatDateTime } from "../../lib/format";

const filters: Array<{ label: string; value?: AdminInquiryStatusFilter }> = [
  { label: "All" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Spam", value: "SPAM" }
];

type InquiriesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InquiriesPage({ searchParams }: InquiriesPageProps) {
  const resolvedSearchParams = (await Promise.resolve(searchParams ?? {})) as Record<
    string,
    string | string[] | undefined
  >;
  const statusParam = resolvedSearchParams.status;
  const status =
    typeof statusParam === "string" &&
    filters.some((filter) => filter.value === statusParam)
      ? (statusParam as AdminInquiryStatusFilter)
      : undefined;

  try {
    const inquiries = await listAdminInquiries(status);

    return (
      <div className="stack">
        <PageHeader
          eyebrow="Inquiries"
          title="Inquiry management"
          description="Review inbound messages, filter by status, and inspect inquiry details without taking actions yet."
        />

        <div className="filter-row" aria-label="Inquiry status filters">
          {filters.map((filter) => {
            const href = filter.value ? `/inquiries?status=${filter.value}` : "/inquiries";
            const isActive = filter.value === status || (!filter.value && !status);

            return (
              <Link
                key={filter.label}
                className={isActive ? "filter-pill is-active" : "filter-pill"}
                href={href}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <SectionCard title="Inquiry inbox">
          {inquiries.length === 0 ? (
            <StatePanel
              title="No inquiries found"
              description="There are no inquiries for the selected status."
            />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Listing</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <strong>{inquiry.name ?? inquiry.email ?? "Anonymous inquiry"}</strong>
                      <div className="muted">
                        {inquiry.email ?? "No email"} · {inquiry.phone ?? "No phone"}
                      </div>
                    </td>
                    <td>
                      <div>{inquiry.listingTitle}</div>
                      <div className="muted">{inquiry.listingLocationLabel}</div>
                    </td>
                    <td>
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td>{formatDateTime(inquiry.createdAt)}</td>
                    <td>
                      <Link className="table-link" href={`/inquiries/${inquiry.id}`}>
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      </div>
    );
  } catch {
    return (
      <StatePanel
        title="Inquiries unavailable"
        description="The inquiry moderation view could not be loaded right now."
      />
    );
  }
}
