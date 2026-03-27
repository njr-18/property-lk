import { ListingCard } from "../../../components/listing/listing-card";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { getSessionUser } from "../../../lib/auth";
import { searchListings } from "../../../lib/listings";
import { getSavedListingIdsForUser } from "../../../lib/saved-listings";

export default async function RentPage() {
  const results = await searchListings(new URLSearchParams({ listingType: "rent" }));
  const user = await getSessionUser();
  const savedListingIds = user
    ? await getSavedListingIdsForUser(user.id, results.listings.map((listing) => listing.id))
    : [];
  const savedListingIdSet = new Set(savedListingIds);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Rent"
        title="Rental listings built for fast scanning."
        description="This page is ready for filters, map/list interactions, and saved search entry points."
      />
      <div className="card-grid">
        {results.listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={{
              ...listing,
              isAuthenticated: Boolean(user),
              isSaved: savedListingIdSet.has(listing.id)
            }}
          />
        ))}
      </div>
    </PageShell>
  );
}
