import Link from "next/link";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { notFound } from "next/navigation";
import { PageShell } from "../../../components/layout/page-shell";
import { InquiryForm } from "../../../components/inquiries/inquiry-form";
import { ListingCard } from "../../../components/listing/listing-card";
import { SaveListingButton } from "../../../components/saved-listings/save-listing-button";
import { SectionHeading } from "../../../components/ui/section-heading";
import { getSessionUser } from "../../../lib/auth";
import { formatLkr } from "../../../lib/format";
import { getListingPageData } from "../../../lib/listings";
import { getSavedListingIdsForUser } from "../../../lib/saved-listings";

export default async function ListingDetailsPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const pageData = await getListingPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { listing, relatedListings } = pageData;
  const user = await getSessionUser();
  const savedListingIds = user
    ? await getSavedListingIdsForUser(
        user.id,
        [listing.id, ...relatedListings.map((relatedListing) => relatedListing.id)]
      )
    : [];
  const savedListingIdSet = new Set(savedListingIds);

  return (
    <PageShell>
      <SectionHeading
        eyebrow={listing.listingType === "rent" ? "For rent" : "For sale"}
        title={listing.title}
        description={listing.description}
      />
      <div className="split-grid">
        <Card className="panel">
          <CardHeader>
            <Badge>{listing.area}</Badge>
            <CardTitle>{formatLkr(listing.priceLkr)}</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="muted">
            {listing.locationLabel}
          </p>
          <div className="table">
            <div className="table-row">
              <strong>Bedrooms</strong>
              <span>{listing.bedrooms ?? "N/A"}</span>
            </div>
            <div className="table-row">
              <strong>Bathrooms</strong>
              <span>{listing.bathrooms ?? "N/A"}</span>
            </div>
            <div className="table-row">
              <strong>Property type</strong>
              <span>{listing.propertyType}</span>
            </div>
            <div className="table-row">
              <strong>Listed by</strong>
              <span>{listing.listedByType}</span>
            </div>
          </div>
          </CardContent>
          <CardFooter>
            <SaveListingButton
              initialSaved={savedListingIdSet.has(listing.id)}
              isAuthenticated={Boolean(user)}
              listingId={listing.id}
              variant="primary"
            />
            <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/compare">
              Compare
            </Link>
          </CardFooter>
        </Card>
        <Card className="panel">
          <CardHeader>
            <CardTitle>Listing details and contact path</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="muted">
            Contact info, verification signals, and richer media are now coming from the database-backed read path.
          </p>
          <div className="table">
            <div className="table-row">
              <strong>Phone verified</strong>
              <span>{listing.verification.phoneVerified ? "Yes" : "No"}</span>
            </div>
            <div className="table-row">
              <strong>WhatsApp verified</strong>
              <span>{listing.verification.whatsappVerified ? "Yes" : "No"}</span>
            </div>
            <div className="table-row">
              <strong>Parking</strong>
              <span>{listing.parkingSlots ?? "N/A"}</span>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
      <InquiryForm
        defaultEmail={user?.email}
        defaultName={user?.name}
        listingId={listing.id}
      />
      <section>
        <SectionHeading
          eyebrow="Related"
          title="Similar listings"
          description="Nearby or closely matched properties from the live listing dataset."
        />
        {relatedListings.length > 0 ? (
          <div className="card-grid">
            {relatedListings.map((relatedListing) => (
              <ListingCard
                key={relatedListing.id}
                listing={{
                  ...relatedListing,
                  isAuthenticated: Boolean(user),
                  isSaved: savedListingIdSet.has(relatedListing.id)
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="panel">
            <CardContent>
              <p className="muted">No related listings are available for this property yet.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </PageShell>
  );
}
