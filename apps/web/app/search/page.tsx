import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Pagination, Select } from "@property-lk/ui";
import { ListingCard } from "../../components/listing/listing-card";
import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";
import { searchListings } from "../../lib/search";
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

  const results = searchListings(params);
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
              defaultValue={params.get("q") ?? ""}
              hint="Try an area, district, or headline."
              label="Search term"
              name="q"
              placeholder="Colombo 07, Rajagiriya, apartment..."
            />
            <Select
              defaultValue={params.get("type") ?? ""}
              label="Listing type"
              name="type"
              options={listingTypeOptions}
              placeholder="Any type"
            />
            <Select
              defaultValue={params.get("propertyType") ?? ""}
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
      <div className="card-grid">
        {results.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <Pagination currentPage={1} getHref={hrefBuilder} totalPages={3} />
    </PageShell>
  );
}
