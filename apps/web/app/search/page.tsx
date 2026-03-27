import { listSeoLocations } from "../../lib/areas";
import { SearchResultsPage } from "../../components/search/search-results-page";
import { createBreadcrumbSchema, createMetadata, buildAreaPath } from "../../lib/seo";
import { buildSearchPath } from "@property-lk/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>): Promise<Metadata> {
  const resolvedSearchParams: Record<string, string | string[] | undefined> = await Promise.resolve(
    searchParams ?? {}
  );
  const listingType =
    typeof resolvedSearchParams["listingType"] === "string" ? resolvedSearchParams["listingType"] : "rent";
  const area = typeof resolvedSearchParams["area"] === "string" ? resolvedSearchParams["area"] : undefined;
  const query =
    typeof resolvedSearchParams["query"] === "string" ? resolvedSearchParams["query"] : undefined;
  const title = area
    ? `${listingType === "sale" ? "Properties for Sale" : "Properties for Rent"} in ${area}`
    : query
      ? `Search property for ${query}`
      : "Search property listings";
  const description = area
    ? `Browse live ${listingType === "sale" ? "sale" : "rental"} listings in ${area}, Sri Lanka.`
    : "Search Sri Lankan property listings by area, property type, and budget.";

  return createMetadata({
    title,
    description,
    path: buildSearchPath({
      listingType: listingType === "sale" ? "sale" : "rent",
      areaSlug: area
    })
  });
}

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
  const seoLocations = await listSeoLocations(6);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" }
  ];

  return (
    <SearchResultsPage
      breadcrumbItems={breadcrumbItems}
      contextDescription="Use area hubs and shortcut routes to move between listings, local pages, and focused search results."
      contextLinks={seoLocations.flatMap((location) => [
        { href: buildAreaPath(location.slug), label: `${location.areaName} area guide` },
        {
          href: buildSearchPath({ listingType: "rent", areaSlug: location.slug }),
          label: `Rent in ${location.areaName}`
        }
      ]).slice(0, 6)}
      contextTitle="Popular SEO routes"
      description="Fast server-rendered search pages with shareable URLs and direct links into area hubs."
      eyebrow="Search"
      searchParams={params}
      structuredData={[createBreadcrumbSchema(breadcrumbItems)]}
      title="Search Sri Lanka property listings"
    />
  );
}
