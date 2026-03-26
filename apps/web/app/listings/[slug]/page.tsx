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
        <div className="panel">
          <h2>{formatLkr(listing.priceLkr)}</h2>
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
        </div>
        <div className="panel">
          <h3>Future-ready details</h3>
          <p className="muted">
            This template can absorb verification badges, contact actions, image galleries, and map coordinates.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
