import { Pagination } from "@property-lk/ui";
import { ListingCard } from "../../../components/listing/listing-card";
import { PageShell } from "../../../components/layout/page-shell";
import { EmptyState } from "../../../components/ui/empty-state";
import { SectionHeading } from "../../../components/ui/section-heading";
import { requireSessionUser } from "../../../lib/auth";
import { getSavedListingsPageData } from "../../../lib/saved-listings";

export default async function SavedListingsPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await requireSessionUser("/saved/listings");
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const pageData = await getSavedListingsPageData(user.id, resolvedSearchParams);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Saved"
        title="Saved listings"
        description="Your saved homes, apartments, annexes, and rooms in one place."
      />
      {pageData.listings.length > 0 ? (
        <>
          <div className="card-grid">
            {pageData.listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={{
                  ...listing,
                  isAuthenticated: true,
                  isSaved: true
                }}
              />
            ))}
          </div>
          <Pagination
            currentPage={pageData.page}
            getHref={(page) => `/saved/listings?page=${page}`}
            totalPages={pageData.totalPages}
          />
        </>
      ) : (
        <EmptyState
          actionLabel="Browse listings"
          description="Save a few listings from search results or listing pages and they will show up here."
          href="/search"
          title="No saved listings yet"
        />
      )}
    </PageShell>
  );
}
