import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Pagination, Select } from "@property-lk/ui";
import { ListingCard } from "../../components/listing/listing-card";
import { PageShell } from "../../components/layout/page-shell";
import { SaveSearchForm } from "../../components/saved-searches/save-search-form";
import { SectionHeading } from "../../components/ui/section-heading";
import { getSessionUser } from "../../lib/auth";
import { searchListings } from "../../lib/listings";
import { getSavedListingIdsForUser } from "../../lib/saved-listings";
import { getDefaultSavedSearchName } from "../../lib/saved-searches";
import { listingTypeOptions, propertyTypeOptions } from "../../lib/site-data";

export default async function SearchPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const results = await searchListings(params);
  const user = await getSessionUser();
  const savedListingIds = user
    ? await getSavedListingIdsForUser(user.id, results.listings.map((listing) => listing.id))
    : [];
  const savedListingIdSet = new Set(savedListingIds);
  const hrefBuilder = (page: number) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(page));
    return `/search?${nextParams.toString()}`;
  };

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Search"
        title="Search listings with space for filters and compare flows."
        description="This page is intentionally lightweight now, but the data path is ready for richer search logic."
      />
      <Card className="panel">
        <CardHeader>
          <CardTitle>Filter shell</CardTitle>
        </CardHeader>
        <CardContent className="toolbar toolbar--filters">
          <form action="/search" className="search-form-grid">
            <Input
              defaultValue={results.filters.query ?? params.get("q") ?? ""}
              hint="Try an area, district, or headline."
              label="Search term"
              name="query"
              placeholder="Colombo 07, Rajagiriya, apartment..."
            />
            <Select
              defaultValue={results.filters.listingType}
              label="Listing type"
              name="listingType"
              options={listingTypeOptions}
              placeholder="Any type"
            />
            <Select
              defaultValue={results.filters.propertyType ?? ""}
              label="Property type"
              name="propertyType"
              options={propertyTypeOptions}
              placeholder="Any property"
            />
            <div className="toolbar toolbar--actions">
              <Checkbox
                description="Reserved for the verification layer."
                disabled
                label="Verified only"
                name="verifiedOnly"
              />
              <Button type="submit">Apply filters</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <SaveSearchForm
        defaultName={getDefaultSavedSearchName(results.filters)}
        isAuthenticated={Boolean(user)}
      />
      {results.issues.length > 0 ? (
        <Card className="panel">
          <CardHeader>
            <CardTitle>Some filters were ignored</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">
              We applied the valid filters and skipped any values that did not pass validation.
            </p>
          </CardContent>
        </Card>
      ) : null}
      {results.listings.length > 0 ? (
        <>
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
          <Pagination
            currentPage={results.filters.page}
            getHref={hrefBuilder}
            totalPages={results.totalPages}
          />
        </>
      ) : (
        <Card className="panel">
          <CardHeader>
            <CardTitle>No listings matched these filters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">
              Try broadening the search term, changing the listing type, or clearing some filters.
            </p>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
