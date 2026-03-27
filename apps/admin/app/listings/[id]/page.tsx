import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminListingByIdentifier } from "@property-lk/db";
import { buttonClassName } from "@property-lk/ui";
import { PageHeader } from "../../../components/page-header";
import { SectionCard } from "../../../components/section-card";
import { StatePanel } from "../../../components/state-panel";
import { StatusBadge } from "../../../components/status-badge";
import {
  formatCurrencyLkr,
  formatDateTime,
  formatScore,
  formatStatusLabel
} from "../../../lib/format";

type ListingDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { id } = await params;

  try {
    const listing = await getAdminListingByIdentifier(id);

    if (!listing) {
      notFound();
    }

    return (
      <div className="stack">
        <PageHeader
          eyebrow="Listings"
          title={listing.title}
          description={`${listing.publicId} · ${listing.locationLabel} · Read-only moderation detail`}
          actions={
            <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/listings">
              Back to listings
            </Link>
          }
        />

        <div className="action-row">
          <StatusBadge status={listing.moderationStatus} />
          <span className="detail-chip">{formatStatusLabel(listing.listingType)}</span>
          <span className="detail-chip">{formatStatusLabel(listing.propertyType)}</span>
        </div>

        <div className="grid two">
          <SectionCard title="Listing summary">
            <dl className="detail-list">
              <div>
                <dt>Price</dt>
                <dd>{formatCurrencyLkr(listing.priceLkr)}</dd>
              </div>
              <div>
                <dt>Bedrooms</dt>
                <dd>{listing.bedrooms ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Bathrooms</dt>
                <dd>{listing.bathrooms ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Listed by</dt>
                <dd>{formatStatusLabel(listing.listedByType)}</dd>
              </div>
              <div>
                <dt>Trust score</dt>
                <dd>{formatScore(listing.trustScore)}</dd>
              </div>
              <div>
                <dt>Quality score</dt>
                <dd>{formatScore(listing.qualityScore)}</dd>
              </div>
              <div>
                <dt>Inquiries</dt>
                <dd>{listing.inquiryCount}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatDateTime(listing.updatedAt)}</dd>
              </div>
            </dl>
            <p className="subtle">{listing.description}</p>
          </SectionCard>

          <SectionCard title="Contacts and ownership">
            <dl className="detail-list">
              <div>
                <dt>Contact name</dt>
                <dd>{listing.contactName ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{listing.contactPhone ?? "N/A"}</dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>{listing.contactWhatsapp ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{listing.contactEmail ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{listing.owner?.name ?? listing.owner?.email ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Agent</dt>
                <dd>{listing.agent?.name ?? listing.agent?.email ?? "N/A"}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>

        <div className="grid two">
          <SectionCard title="Trust signals">
            <div className="stack compact">
              <div className="inline-status">
                <span>Phone</span>
                <StatusBadge status={listing.verification.phoneVerified ? "verified" : "pending"} />
              </div>
              <div className="inline-status">
                <span>WhatsApp</span>
                <StatusBadge
                  status={listing.verification.whatsappVerified ? "verified" : "pending"}
                />
              </div>
              <div className="inline-status">
                <span>Owner</span>
                <StatusBadge status={listing.verification.ownerVerified ? "verified" : "pending"} />
              </div>
              <div className="inline-status">
                <span>Agency</span>
                <StatusBadge
                  status={listing.verification.agencyVerified ? "verified" : "pending"}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Verification records">
            {listing.verifications.length === 0 ? (
              <p className="muted">No verification records yet.</p>
            ) : (
              <div className="stack compact">
                {listing.verifications.map((verification) => (
                  <div key={verification.id} className="list-row">
                    <div>
                      <strong>{formatStatusLabel(verification.verificationType)}</strong>
                      <div className="muted">{verification.notes ?? "No moderator notes yet."}</div>
                    </div>
                    <div className="list-row-meta">
                      <StatusBadge status={verification.verificationStatus} />
                      <div className="muted">
                        {verification.verifiedAt
                          ? `Verified ${formatDateTime(verification.verifiedAt)}`
                          : "Not yet verified"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Features">
          {listing.features.length === 0 ? (
            <p className="muted">No structured features recorded.</p>
          ) : (
            <div className="feature-grid">
              {listing.features.map((feature) => (
                <div key={feature.id} className="detail-chip">
                  {formatStatusLabel(feature.featureKey)}: {feature.featureValue}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    );
  } catch {
    return (
      <StatePanel
        title="Listing detail unavailable"
        description="The listing detail view could not be loaded right now."
      />
    );
  }
}
