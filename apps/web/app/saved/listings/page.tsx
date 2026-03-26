import { ListingCard } from "../../../components/listing/listing-card";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { sampleListings } from "../../../lib/site-data";

export default function SavedListingsPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Saved"
        title="Saved listings"
        description="A placeholder list that will eventually connect to user accounts and persistence."
      />
      <div className="card-grid">
        {sampleListings.slice(0, 2).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </PageShell>
  );
}
