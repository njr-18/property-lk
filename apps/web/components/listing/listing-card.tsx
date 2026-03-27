import Link from "next/link";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { formatLkr } from "../../lib/format";
import type { ListingSummary } from "@property-lk/db";

type ListingCardModel = Omit<
  ListingSummary,
  "locationLabel" | "publicId" | "propertyType" | "featured"
> & {
  locationLabel?: string;
  featured?: boolean;
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
          <span>{listing.locationLabel ?? `${listing.area}, ${listing.district}`}</span>
          <span>{listing.bedrooms ?? "N/A"} bed</span>
          <span>{listing.bathrooms ?? "N/A"} bath</span>
        </p>
        <strong>{formatLkr(listing.priceLkr)}</strong>
      </CardContent>
      <CardFooter>
        <Link className={buttonClassName({ variant: "secondary", size: "md" })} href={`/listings/${listing.slug}`}>
          View listing
        </Link>
        <Button disabled variant="ghost">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
