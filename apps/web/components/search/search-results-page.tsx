import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Pagination, Select, buttonClassName } from "@property-lk/ui";
import { ListingCard } from "../listing/listing-card";
import { PageShell } from "../layout/page-shell";
import { SaveSearchForm } from "../saved-searches/save-search-form";
import { BreadcrumbLinks, JsonLd } from "../seo";
import { SectionHeading } from "../ui/section-heading";
import { getSessionUser } from "../../lib/auth";
import { searchListings } from "../../lib/listings";
import { getSavedListingIdsForUser } from "../../lib/saved-listings";
import { getDefaultSavedSearchName } from "../../lib/saved-search-links";
import { listingTypeOptions, propertyTypeOptions } from "../../lib/site-data";
import type { BreadcrumbItem } from "../../lib/seo";

type ContextLink = {
  href: string;
  label: string;
};

type SearchResultsPageProps = {
  searchParams: URLSearchParams;
  eyebrow: string;
  title: string;
  description: string;
  paginationBasePath?: string;
  breadcrumbItems?: BreadcrumbItem[];
  structuredData?: Array<Record<string, unknown>>;
  contextTitle?: string;
  contextDescription?: string;
  contextLinks?: ContextLink[];
};

export async function SearchResultsPage({
  searchParams,
  eyebrow,
  title,
  description,
  paginationBasePath = "/search",
  breadcrumbItems = [],
  structuredData = [],
  contextTitle,
  contextDescription,
  contextLinks = []
}: SearchResultsPageProps) {
  const results = await searchListings(searchParams);
  const user = await getSessionUser();
  const savedListingIds = user
    ? await getSavedListingIdsForUser(user.id, results.listings.map((listing) => listing.id))
    : [];
  const savedListingIdSet = new Set(savedListingIds);
  const hrefBuilder = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    const search = nextParams.toString();
    return search ? `${paginationBasePath}?${search}` : paginationBasePath;
  };

  return (
    <PageShell>
      {structuredData.map((data, index) => (
        <JsonLd data={data} key={index} />
      ))}
      <BreadcrumbLinks items={breadcrumbItems} />
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      {contextLinks.length > 0 ? (
        <Card className="panel">
          <CardHeader>
            <CardTitle>{contextTitle ?? "Explore nearby routes"}</CardTitle>
          </CardHeader>
          <CardContent>
            {contextDescription ? <p className="muted">{contextDescription}</p> : null}
            <div className="button-row">
              {contextLinks.map((link) => (
                <Link
                  className={buttonClassName({ variant: "ghost", size: "md" })}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Card className="panel">
        <CardHeader>
          <CardTitle>Filter shell</CardTitle>
        </CardHeader>
        <CardContent className="toolbar toolbar--filters">
          <form action="/search" className="search-form-grid">
            <Input
              defaultValue={results.filters.query ?? searchParams.get("q") ?? ""}
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
