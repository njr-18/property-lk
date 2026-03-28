import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchResultsPage } from "../../../../../components/search/search-results-page";
import { getSeoLocationBySlug, listAreaPageSlugs, listRelatedSeoLocations } from "../../../../../lib/areas";
import { buildAreaPath, buildSearchPath, createBreadcrumbSchema, createMetadata } from "../../../../../lib/seo";
import { parseListingTypeParam } from "../../../../../lib/search";

type RouteParams = {
  listingType: string;
  areaSlug: string;
};

export async function generateStaticParams() {
  const slugs = await listAreaPageSlugs().catch(() => []);

  return slugs.flatMap((areaSlug) => [
    { listingType: "rent", areaSlug },
    { listingType: "sale", areaSlug }
  ]);
}

export async function generateMetadata({
  params
}: Readonly<{
  params: Promise<RouteParams>;
}>): Promise<Metadata> {
  const { listingType, areaSlug } = await params;
  const normalizedListingType = parseListingTypeParam(listingType);

  if (!normalizedListingType) {
    return createMetadata({
      title: "Search not found",
      description: "The requested search route could not be found.",
      path: "/search"
    });
  }

  const area = await getSeoLocationBySlug(areaSlug);

  if (!area) {
    return createMetadata({
      title: "Search not found",
      description: "The requested search route could not be found.",
      path: buildSearchPath({
        listingType: normalizedListingType,
        areaSlug
      })
    });
  }

  return createMetadata({
    title: `${normalizedListingType === "sale" ? "Properties for Sale" : "Properties for Rent"} in ${area.areaName}`,
    description: `Browse ${normalizedListingType === "sale" ? "sale" : "rental"} listings in ${area.areaName}, with direct links to area pages and related local routes.`,
    path: buildSearchPath({
      listingType: normalizedListingType,
      areaSlug: area.slug
    })
  });
}

export default async function AreaSearchPage({
  params,
  searchParams
}: Readonly<{
  params: Promise<RouteParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ listingType, areaSlug }, resolvedSearchParams] = await Promise.all([
    params,
    Promise.resolve(searchParams ?? {})
  ]);
  const normalizedListingType = parseListingTypeParam(listingType);

  if (!normalizedListingType) {
    notFound();
  }

  const area = await getSeoLocationBySlug(areaSlug);

  if (!area) {
    notFound();
  }
  const relatedAreas = await listRelatedSeoLocations(area.slug, area.district, 4);
  const paramsForSearch = new URLSearchParams();
  paramsForSearch.set("listingType", normalizedListingType);
  paramsForSearch.set("area", area.areaName);

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string" && key !== "listingType" && key !== "area") {
      paramsForSearch.set(key, value);
    }
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: area.areaName, path: buildAreaPath(area.slug) },
    {
      name: normalizedListingType === "sale" ? `Buy in ${area.areaName}` : `Rent in ${area.areaName}`,
      path: buildSearchPath({ listingType: normalizedListingType, areaSlug: area.slug })
    }
  ];

  return (
    <SearchResultsPage
      breadcrumbItems={breadcrumbItems}
      contextDescription="Jump between the area guide, this focused search route, and nearby locations."
      contextLinks={[
        { href: buildAreaPath(area.slug), label: `${area.areaName} area guide` },
        {
          href: buildSearchPath({
            listingType: normalizedListingType === "sale" ? "rent" : "sale",
            areaSlug: area.slug
          }),
          label: normalizedListingType === "sale" ? `Rent in ${area.areaName}` : `Buy in ${area.areaName}`
        },
        ...relatedAreas.map((relatedArea) => ({
          href: buildSearchPath({ listingType: normalizedListingType, areaSlug: relatedArea.slug }),
          label: `${normalizedListingType === "sale" ? "Buy" : "Rent"} in ${relatedArea.areaName}`
        }))
      ]}
      contextTitle={`Local links for ${area.areaName}`}
      description={`Server-rendered ${normalizedListingType === "sale" ? "sale" : "rental"} results for ${area.areaName}, ${area.district}.`}
      eyebrow={normalizedListingType === "sale" ? "Buy" : "Rent"}
      paginationBasePath={buildSearchPath({ listingType: normalizedListingType, areaSlug: area.slug })}
      searchParams={paramsForSearch}
      structuredData={[createBreadcrumbSchema(breadcrumbItems)]}
      title={`${normalizedListingType === "sale" ? "Properties for Sale" : "Properties for Rent"} in ${area.areaName}`}
    />
  );
}
