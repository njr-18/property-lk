import Link from "next/link";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { formatLkr } from "../../lib/format";
import type { ListingSummary } from "@property-lk/db";
import { SaveListingButton } from "../saved-listings/save-listing-button";
import { buildAreaPath, buildSearchPath } from "../../lib/seo";

type ListingCardModel = Omit<
  ListingSummary,
  "locationLabel" | "publicId" | "propertyType" | "featured"
> & {
  locationLabel?: string;
  featured?: boolean;
  isSaved?: boolean;
  isAuthenticated?: boolean;
};

export function ListingCard({ listing }: { listing: ListingCardModel }) {
  return (
    <Card className="listing-card">
      <CardHeader>
        <Badge>
        {listing.listingType === "rent" ? "For rent" : "For sale"}
        </Badge>
        <CardTitle>{listing.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="muted">{listing.description}</p>
        <p className="meta-row">
          <Link href={buildAreaPath(listing.areaSlug)}>{listing.locationLabel ?? `${listing.area}, ${listing.district}`}</Link>
          <span>{listing.bedrooms ?? "N/A"} bed</span>
          <span>{listing.bathrooms ?? "N/A"} bath</span>
        </p>
        <p className="meta-row">
          <Link href={buildSearchPath({ areaSlug: listing.areaSlug, listingType: listing.listingType })}>
            More {listing.listingType === "rent" ? "rentals" : "sales"} in {listing.area}
          </Link>
        </p>
        <strong>{formatLkr(listing.priceLkr)}</strong>
      </CardContent>
      <CardFooter>
        <Link className={buttonClassName({ variant: "secondary", size: "md" })} href={`/listings/${listing.slug}`}>
          View listing
        </Link>
        <SaveListingButton
          initialSaved={listing.isSaved ?? false}
          isAuthenticated={listing.isAuthenticated ?? false}
          listingId={listing.id}
          variant="ghost"
        />
      </CardFooter>
    </Card>
  );
}
