import { ListingCard } from "../../../components/listing/listing-card";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { sampleListings } from "../../../lib/site-data";

export default function BuyPage() {
  const saleListings = sampleListings.filter((listing) => listing.listingType === "sale");

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Buy"
        title="Ownership listings with space for trust and detail."
        description="Use this area for listing quality signals, verification flags, and buyer workflows."
      />
      <div className="card-grid">
        {saleListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </PageShell>
  );
}
