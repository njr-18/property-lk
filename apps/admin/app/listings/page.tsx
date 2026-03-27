import Link from "next/link";
import { listAdminListings, type AdminListingStatusFilter } from "@property-lk/db";
import { PageHeader } from "../../components/page-header";
import { SectionCard } from "../../components/section-card";
import { StatePanel } from "../../components/state-panel";
import { StatusBadge } from "../../components/status-badge";
import {
  formatCurrencyLkr,
  formatDateTime,
  formatScore,
  formatStatusLabel
} from "../../lib/format";

const filters: Array<{ label: string; value?: AdminListingStatusFilter }> = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" }
];

type ListingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const resolvedSearchParams = (await Promise.resolve(searchParams ?? {})) as Record<
    string,
    string | string[] | undefined
  >;
  const statusParam = resolvedSearchParams.status;
  const status =
    typeof statusParam === "string" &&
    filters.some((filter) => filter.value === statusParam)
      ? (statusParam as AdminListingStatusFilter)
      : undefined;

  try {
    const listings = await listAdminListings(status);

    return (
      <div className="stack">
        <PageHeader
          eyebrow="Listings"
          title="Listing moderation"
          description="Review all listings, narrow the queue by status, and inspect full listing details."
        />

        <div className="filter-row" aria-label="Listing status filters">
          {filters.map((filter) => {
            const href = filter.value ? `/listings?status=${filter.value}` : "/listings";
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

        <SectionCard title="Listings queue">
          {listings.length === 0 ? (
            <StatePanel
              title="No listings found"
              description="There are no listings for the selected moderation status yet."
            />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Scores</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <strong>{listing.title}</strong>
                      <div className="muted">
                        {listing.publicId} · {formatStatusLabel(listing.propertyType)} ·{" "}
                        {listing.locationLabel}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={listing.moderationStatus} />
                    </td>
                    <td>{formatCurrencyLkr(listing.priceLkr)}</td>
                    <td className="muted">
                      Trust {formatScore(listing.trustScore)} · Quality{" "}
                      {formatScore(listing.qualityScore)}
                    </td>
                    <td>{formatDateTime(listing.updatedAt)}</td>
                    <td>
                      <Link className="table-link" href={`/listings/${listing.id}`}>
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
        title="Listings unavailable"
        description="The listings moderation view could not be loaded right now."
      />
    );
  }
}
