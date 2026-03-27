import Link from "next/link";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { notFound } from "next/navigation";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { formatLkr } from "../../../lib/format";
import { getListingBySlug } from "../../../lib/site-data";

export default async function ListingDetailsPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  return (
    <PageShell>
      <SectionHeading
        eyebrow={listing.listingType === "rent" ? "For rent" : "For sale"}
        title={listing.title}
        description={listing.description}
      />
      <div className="split-grid">
        <Card className="panel">
          <CardHeader>
            <Badge>{listing.area}</Badge>
            <CardTitle>{formatLkr(listing.priceLkr)}</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="muted">
            {listing.area}, {listing.district}
          </p>
          <div className="table">
            <div className="table-row">
              <strong>Bedrooms</strong>
              <span>{listing.bedrooms ?? "N/A"}</span>
            </div>
            <div className="table-row">
              <strong>Bathrooms</strong>
              <span>{listing.bathrooms ?? "N/A"}</span>
            </div>
            <div className="table-row">
              <strong>Property type</strong>
              <span>{listing.propertyType}</span>
            </div>
          </div>
          </CardContent>
          <CardFooter>
            <Button disabled>Save listing</Button>
            <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/compare">
              Compare
            </Link>
          </CardFooter>
        </Card>
        <Card className="panel">
          <CardHeader>
            <CardTitle>Future-ready details</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="muted">
            This template can absorb verification badges, contact actions, image galleries, and map coordinates.
          </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
