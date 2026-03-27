import Link from "next/link";
import { listAdminDuplicateClusters } from "@property-lk/db";
import type { AdminDuplicateClusterStatus } from "@property-lk/types";
import { DuplicateClusterReviewForm } from "../../components/duplicate-cluster-review-form";
import { PageHeader } from "../../components/page-header";
import { SectionCard } from "../../components/section-card";
import { StatePanel } from "../../components/state-panel";
import { StatusBadge } from "../../components/status-badge";
import { formatCurrencyLkr, formatDateTime, formatScore } from "../../lib/format";

const filters: Array<{ label: string; value?: AdminDuplicateClusterStatus }> = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed duplicate", value: "CONFIRMED_DUPLICATE" },
  { label: "Not duplicate", value: "NOT_DUPLICATE" },
  { label: "Merge candidate", value: "MERGE_CANDIDATE" }
];

type DuplicatesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DuplicatesPage({ searchParams }: DuplicatesPageProps) {
  const resolvedSearchParams = (await Promise.resolve(searchParams ?? {})) as Record<
    string,
    string | string[] | undefined
  >;
  const statusParam = resolvedSearchParams.status;
  const status =
    typeof statusParam === "string" &&
    filters.some((filter) => filter.value === statusParam)
      ? (statusParam as AdminDuplicateClusterStatus)
      : undefined;

  try {
    const clusters = await listAdminDuplicateClusters(status);

    return (
      <div className="stack">
        <PageHeader
          eyebrow="Duplicates"
          title="Duplicate cluster review"
          description="Review explainable duplicate candidates, record an outcome, and leave any merge or cleanup work for a separate manual step."
        />

        <nav aria-label="Duplicate cluster status filters" className="filter-row">
          {filters.map((filter) => {
            const href = filter.value ? `/duplicates?status=${filter.value}` : "/duplicates";
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

        {clusters.length === 0 ? (
          <StatePanel
            title="No duplicate clusters found"
            description="There are no duplicate clusters for the selected review state right now."
          />
        ) : (
          clusters.map((cluster) => (
            <SectionCard
              key={cluster.id}
              title={`${cluster.clusterKey} - ${cluster.items.length} listings`}
            >
              <div className="duplicate-cluster">
                <div className="duplicate-cluster__summary">
                  <div className="stack compact">
                    <div className="inline-status">
                      <div className="stack compact">
                        <div className="brand-kicker">Review status</div>
                        <StatusBadge status={cluster.status} />
                      </div>
                      <div className="cluster-score">
                        <strong>{formatConfidence(cluster.confidenceScore)}</strong>
                        <span className="muted">
                          Confidence score {formatScore(cluster.confidenceScore)}
                        </span>
                      </div>
                    </div>

                    <p className="muted duplicate-note">
                      Review only. This workflow does not merge, delete, or suppress listings.
                    </p>

                    <div className="duplicate-meta">
                      <span className="detail-chip">
                        Created {formatDateTime(cluster.createdAt)}
                      </span>
                      {cluster.reviewedAt ? (
                        <span className="detail-chip">
                          Reviewed {formatDateTime(cluster.reviewedAt)}
                        </span>
                      ) : null}
                      {cluster.reviewedBy ? (
                        <span className="detail-chip">
                          Reviewer {cluster.reviewedBy.name ?? cluster.reviewedBy.email}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <DuplicateClusterReviewForm
                    clusterId={cluster.id}
                    currentStatus={cluster.status}
                  />
                </div>

                <div className="duplicate-cluster__items">
                  {cluster.items.map((item) => (
                    <article key={item.id} className="duplicate-item">
                      <div className="duplicate-item__header">
                        <div>
                          <strong>{item.listing.title}</strong>
                          <div className="muted">
                            {item.listing.publicId} - {item.listing.locationLabel}
                          </div>
                        </div>
                        <div className="list-row-meta">
                          <span className="detail-chip">
                            Match {formatConfidence(item.matchScore)}
                          </span>
                          <Link className="table-link" href={`/listings/${item.listing.id}`}>
                            View listing
                          </Link>
                        </div>
                      </div>

                      <div className="duplicate-item__facts">
                        <span className="detail-chip">{formatCurrencyLkr(item.listing.priceLkr)}</span>
                        {item.listing.contactPhone ? (
                          <span className="detail-chip">Phone {item.listing.contactPhone}</span>
                        ) : null}
                        {item.listing.contactWhatsapp ? (
                          <span className="detail-chip">
                            WhatsApp {item.listing.contactWhatsapp}
                          </span>
                        ) : null}
                      </div>

                      {item.matchReasons.length === 0 ? (
                        <p className="muted">
                          Match reasons were not stored for this listing item.
                        </p>
                      ) : (
                        <ul className="duplicate-reasons">
                          {item.matchReasons.map((reason) => (
                            <li key={`${item.id}-${reason.code}`}>
                              <strong>{reason.label}:</strong> {reason.detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </SectionCard>
          ))
        )}
      </div>
    );
  } catch {
    return (
      <StatePanel
        title="Duplicate review unavailable"
        description="The duplicate review queue could not be loaded right now."
      />
    );
  }
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}
