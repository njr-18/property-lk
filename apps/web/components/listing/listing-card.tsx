import Link from "next/link";
import { formatLkr } from "../../lib/format";
import type { Listing } from "../../lib/site-data";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="card">
      <span className="badge">
        {listing.listingType === "rent" ? "For rent" : "For sale"}
      </span>
      <h3>{listing.title}</h3>
      <p className="muted">{listing.description}</p>
      <p className="meta-row">
        <span>{listing.area}</span>
        <span>{listing.bedrooms ?? "N/A"} bed</span>
        <span>{listing.bathrooms ?? "N/A"} bath</span>
      </p>
      <strong>{formatLkr(listing.priceLkr)}</strong>
      <div className="button-row" style={{ marginTop: 16 }}>
        <Link className="button" href={`/listings/${listing.slug}`}>
          View listing
        </Link>
      </div>
    </article>
  );
}
