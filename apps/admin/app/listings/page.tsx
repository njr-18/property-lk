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

        <nav aria-label="Listing status filters" className="filter-row">
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
        </nav>

        <SectionCard title="Listings queue">
          {listings.length === 0 ? (
            <StatePanel
              title="No listings found"
              description="There are no listings for the selected moderation status yet."
            />
          ) : (
            <div className="table-shell">
              <table className="table">
                <caption className="sr-only">Listings moderation queue</caption>
                <thead>
                  <tr>
                    <th scope="col">Listing</th>
                    <th scope="col">Status</th>
                    <th scope="col">Price</th>
                    <th scope="col">Scores</th>
                    <th scope="col">Updated</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <strong>{listing.title}</strong>
                        <div className="muted">
                          {listing.publicId} - {formatStatusLabel(listing.propertyType)} -{" "}
                          {listing.locationLabel}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={listing.moderationStatus} />
                      </td>
                      <td>{formatCurrencyLkr(listing.priceLkr)}</td>
                      <td className="muted">
                        Trust {formatScore(listing.trustScore)} - Quality{" "}
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
            </div>
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
