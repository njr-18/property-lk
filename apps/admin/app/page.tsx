import Link from "next/link";
import { getAdminDashboardStats, listAdminInquiries, listAdminListings } from "@property-lk/db";
import { buttonClassName } from "@property-lk/ui";
import { PageHeader } from "../components/page-header";
import { SectionCard } from "../components/section-card";
import { StatePanel } from "../components/state-panel";
import { StatCard } from "../components/stat-card";
import { StatusBadge } from "../components/status-badge";
import { formatDateTime, formatStatusLabel } from "../lib/format";

export default async function DashboardPage() {
  try {
    const [stats, pendingListings, newInquiries] = await Promise.all([
      getAdminDashboardStats(),
      listAdminListings("pending"),
      listAdminInquiries("NEW")
    ]);

    const recentPendingListings = pendingListings.slice(0, 5);
    const recentInquiries = newInquiries.slice(0, 5);

    return (
      <div className="stack">
        <PageHeader
          eyebrow="Dashboard"
          title="Moderation overview"
          description="A read-only view of the queues that need attention before moderation actions are introduced."
        />

        <div className="grid stats">
          <StatCard
            label="Listings awaiting review"
            value={String(stats.pendingListings)}
            foot="Pending review status"
          />
          <StatCard
            label="Approved listings"
            value={String(stats.approvedListings)}
            foot="Currently visible inventory"
          />
          <StatCard
            label="Rejected listings"
            value={String(stats.rejectedListings)}
            foot="Read-only archive count"
          />
          <StatCard
            label="New inquiries"
            value={String(stats.newInquiries)}
            foot="Fresh messages needing triage"
          />
        </div>

        <div className="grid two">
          <SectionCard title="Pending listings">
            {recentPendingListings.length === 0 ? (
              <StatePanel
                title="No pending listings"
                description="Pending review listings will appear here when new inventory enters the moderation queue."
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPendingListings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <Link className="table-link" href={`/listings/${listing.id}`}>
                          <strong>{listing.title}</strong>
                        </Link>
                        <div className="muted">
                          {listing.publicId} · {formatStatusLabel(listing.listingType)} ·{" "}
                          {listing.locationLabel}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={listing.moderationStatus} />
                      </td>
                      <td>{formatDateTime(listing.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>

          <SectionCard title="New inquiries">
            {recentInquiries.length === 0 ? (
              <StatePanel
                title="No new inquiries"
                description="New inquiries will show up here when buyers or renters contact listing owners."
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Status</th>
                    <th>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td>
                        <Link className="table-link" href={`/inquiries/${inquiry.id}`}>
                          <strong>{inquiry.name ?? inquiry.email ?? "Anonymous inquiry"}</strong>
                        </Link>
                        <div className="muted">{inquiry.listingTitle}</div>
                      </td>
                      <td>
                        <StatusBadge status={inquiry.status} />
                      </td>
                      <td>{formatDateTime(inquiry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>
        </div>

        <div className="action-row">
          <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/listings">
            Open listings queue
          </Link>
          <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/inquiries">
            Open inquiry queue
          </Link>
        </div>
      </div>
    );
  } catch {
    return (
      <StatePanel
        title="Dashboard unavailable"
        description="The moderation overview could not be loaded right now. Try again after the database is available."
      />
    );
  }
}
