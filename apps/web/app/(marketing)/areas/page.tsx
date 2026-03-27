import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@property-lk/ui";
import { PageShell } from "../../../components/layout/page-shell";
import { BreadcrumbLinks, JsonLd } from "../../../components/seo";
import { SectionHeading } from "../../../components/ui/section-heading";
import { listSeoLocations } from "../../../lib/areas";
import { buildAreaPath, createBreadcrumbSchema, createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Area guides",
  description: "Browse area pages for active Colombo-region property locations and internal links into local search routes.",
  path: "/areas"
});

export default async function AreasIndexPage() {
  const locations = await listSeoLocations(24);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" }
  ];

  return (
    <PageShell>
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <BreadcrumbLinks items={breadcrumbItems} />
      <SectionHeading
        eyebrow="Areas"
        title="Area guides for Greater Colombo"
        description="Browse structured location pages that connect local context, listings, and focused search results."
      />
      <div className="card-grid">
        {locations.map((location) => (
          <Card key={location.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={buildAreaPath(location.slug)}>{location.areaName}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">
                {location.district}
                {location.city ? `, ${location.city}` : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
