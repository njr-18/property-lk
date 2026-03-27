import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminInquiryById } from "@property-lk/db";
import { buttonClassName } from "@property-lk/ui";
import { PageHeader } from "../../../components/page-header";
import { SectionCard } from "../../../components/section-card";
import { StatePanel } from "../../../components/state-panel";
import { StatusBadge } from "../../../components/status-badge";
import { formatDateTime } from "../../../lib/format";

type InquiryDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InquiryDetailsPage({ params }: InquiryDetailsPageProps) {
  const { id } = await params;

  try {
    const inquiry = await getAdminInquiryById(id);

    if (!inquiry) {
      notFound();
    }

    return (
      <div className="stack">
        <PageHeader
          eyebrow="Inquiries"
          title={inquiry.name ?? inquiry.email ?? "Anonymous inquiry"}
          description={`${inquiry.listingPublicId} · ${inquiry.listingTitle}`}
          actions={
            <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/inquiries">
              Back to inquiries
            </Link>
          }
        />

        <div className="action-row">
          <StatusBadge status={inquiry.status} />
          <StatusBadge status={inquiry.listingStatus} />
        </div>

        <div className="grid two">
          <SectionCard title="Inquiry details">
            <dl className="detail-list">
              <div>
                <dt>Received</dt>
                <dd>{formatDateTime(inquiry.createdAt)}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatDateTime(inquiry.updatedAt)}</dd>
              </div>
              <div>
                <dt>Preferred contact</dt>
                <dd>{inquiry.preferredContactMethod ?? "Not provided"}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{inquiry.source ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{inquiry.email ?? "N/A"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{inquiry.phone ?? "N/A"}</dd>
              </div>
            </dl>
            <div className="message-block">
              <strong>Message</strong>
              <p className="subtle">{inquiry.message ?? "No message supplied."}</p>
            </div>
          </SectionCard>

          <SectionCard title="Related records">
            <dl className="detail-list">
              <div>
                <dt>Listing</dt>
                <dd>
                  <Link className="table-link" href={`/listings/${inquiry.listingId}`}>
                    {inquiry.listingTitle}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{inquiry.listingLocationLabel}</dd>
              </div>
              <div>
                <dt>User account</dt>
                <dd>{inquiry.user?.name ?? inquiry.user?.email ?? "Guest inquiry"}</dd>
              </div>
              <div>
                <dt>User role</dt>
                <dd>{inquiry.user?.role ?? "Guest"}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </div>
    );
  } catch {
    return (
      <StatePanel
        title="Inquiry detail unavailable"
        description="The inquiry detail view could not be loaded right now."
      />
    );
  }
}
