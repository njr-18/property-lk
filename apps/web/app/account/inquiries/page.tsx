import Link from "next/link";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@property-lk/ui";
import { PageShell } from "../../../components/layout/page-shell";
import { EmptyState } from "../../../components/ui/empty-state";
import { SectionHeading } from "../../../components/ui/section-heading";
import { requireSessionUser } from "../../../lib/auth";
import { getAccountInquiriesPageData } from "../../../lib/inquiries";

export default async function InquiriesPage() {
  const user = await requireSessionUser("/account/inquiries");
  const inquiries = await getAccountInquiriesPageData(user.id);
  const formatter = new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account"
        title="Inquiries"
        description="Review the property inquiries you have sent and jump back into the related listing."
      />
      {inquiries.length > 0 ? (
        <div className="stack-lg">
          {inquiries.map((inquiry) => (
            <Card className="panel" key={inquiry.id}>
              <CardHeader>
                <div className="table-row table-row--compact">
                  <div className="stack-xs">
                    <CardTitle>{inquiry.listingTitle}</CardTitle>
                    <p className="muted">
                      {inquiry.listingLocationLabel} . Sent {formatter.format(inquiry.createdAt)}
                    </p>
                  </div>
                  <Badge variant={inquiry.status === "NEW" ? "warning" : "neutral"}>
                    {inquiry.status.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="stack-sm">
                <div className="table">
                  <div className="table-row">
                    <strong>Contact method</strong>
                    <span>{inquiry.preferredContactMethod ?? "Not set"}</span>
                  </div>
                  <div className="table-row">
                    <strong>Email</strong>
                    <span>{inquiry.email ?? "Not provided"}</span>
                  </div>
                  <div className="table-row">
                    <strong>Phone</strong>
                    <span>{inquiry.phone ?? "Not provided"}</span>
                  </div>
                </div>
                <p>{inquiry.message ?? "No message included."}</p>
              </CardContent>
              <CardFooter>
                <Link
                  className="ui-button ui-button--secondary ui-button--md"
                  href={`/listings/${inquiry.listingSlug}`}
                >
                  View listing
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          actionLabel="Browse listings"
          description="When you send an inquiry from a listing page, it will show up here."
          href="/search"
          title="No inquiries yet"
        />
      )}
    </PageShell>
  );
}
