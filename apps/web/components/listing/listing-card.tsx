import Link from "next/link";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { formatLkr } from "../../lib/format";
import type { Listing } from "../../lib/site-data";

export function ListingCard({ listing }: { listing: Listing }) {
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
          <span>{listing.area}</span>
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
