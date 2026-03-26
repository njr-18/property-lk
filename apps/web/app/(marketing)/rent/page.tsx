import { ListingCard } from "../../../components/listing/listing-card";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { sampleListings } from "../../../lib/site-data";

export default function RentPage() {
  const rentListings = sampleListings.filter((listing) => listing.listingType === "rent");

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Rent"
        title="Rental listings built for fast scanning."
        description="This page is ready for filters, map/list interactions, and saved search entry points."
      />
      <div className="card-grid">
        {rentListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </PageShell>
  );
}
