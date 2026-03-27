import Link from "next/link";
import type { Metadata } from "next";
import { Badge, Card, CardContent, CardGrid, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { notFound } from "next/navigation";
import { ListingCard } from "../../../../components/listing/listing-card";
import { PageShell } from "../../../../components/layout/page-shell";
import { BreadcrumbLinks, JsonLd } from "../../../../components/seo";
import { SectionHeading } from "../../../../components/ui/section-heading";
import { getSessionUser } from "../../../../lib/auth";
import { getSavedListingIdsForUser } from "../../../../lib/saved-listings";
import { getAreaPageContentBySlug, listAreaListingsBySlug, listAreaPageSlugs, listRelatedSeoLocations } from "../../../../lib/areas";
import { buildAreaPath, buildSearchPath, createBreadcrumbSchema, createMetadata } from "../../../../lib/seo";

export async function generateStaticParams() {
  const slugs = await listAreaPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaPageContentBySlug(slug);

  if (!area) {
    return createMetadata({
      title: "Area not found",
      description: "The requested area page could not be found.",
      path: buildAreaPath(slug)
    });
  }

  return createMetadata({
    title: area.metaTitle ?? `Property in ${area.areaName}`,
    description:
      area.metaDescription ??
      `Browse active listings, local context, and linked searches for ${area.areaName}, ${area.district}.`,
    path: buildAreaPath(area.slug)
  });
}

export default async function AreaPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const [area, listings] = await Promise.all([
    getAreaPageContentBySlug(slug),
    listAreaListingsBySlug(slug, 12)
  ]);

  if (!area) {
    notFound();
  }
  const [relatedAreas, user] = await Promise.all([
    listRelatedSeoLocations(area.slug, area.district, 4),
    getSessionUser()
  ]);
  const savedListingIds = user
    ? await getSavedListingIdsForUser(user.id, listings.map((listing) => listing.id))
    : [];
  const savedListingIdSet = new Set(savedListingIds);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: area.areaName, path: buildAreaPath(area.slug) }
  ];

  return (
    <PageShell>
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <BreadcrumbLinks items={breadcrumbItems} />
      <SectionHeading eyebrow={area.district} title={area.title} description={area.intro} />
      <CardGrid>
        <Card>
          <CardHeader>
            <Badge>Area overview</Badge>
            <CardTitle>Liveability signals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">
              {area.intro}
            </p>
            <div className="button-row">
              <Link className={buttonClassName({ variant: "ghost", size: "md" })} href={buildSearchPath({ listingType: "rent", areaSlug: area.slug })}>
                Rent in {area.areaName}
              </Link>
              <Link className={buttonClassName({ variant: "ghost", size: "md" })} href={buildSearchPath({ listingType: "sale", areaSlug: area.slug })}>
                Buy in {area.areaName}
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Internal linking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">Move between local listings, nearby areas, and filtered search pages without leaving the SSR path.</p>
            <div className="button-row">
              {relatedAreas.map((relatedArea) => (
                <Link
                  className={buttonClassName({ variant: "ghost", size: "md" })}
                  href={buildAreaPath(relatedArea.slug)}
                  key={relatedArea.slug}
                >
                  {relatedArea.areaName}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardGrid>
      <section>
        <SectionHeading
          eyebrow="Listings"
          title={`Active property in ${area.areaName}`}
          description="Live inventory filtered by location and connected to listing detail pages."
        />
        {listings.length > 0 ? (
          <div className="card-grid">
            {listings.map((listing) => (
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
        ) : (
          <Card className="panel">
            <CardContent>
              <p className="muted">No active listings are available in this area yet.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </PageShell>
  );
}
