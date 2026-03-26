import { sampleListings } from "./site-data";

export function searchListings(searchParams: URLSearchParams) {
  const query = searchParams.get("q")?.trim().toLowerCase();
  const type = searchParams.get("type");
  const propertyType = searchParams.get("propertyType");

  return sampleListings.filter((listing) => {
    const matchesQuery =
      !query ||
      [listing.title, listing.area, listing.district, listing.description]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesType = !type || listing.listingType === type;
    const matchesPropertyType = !propertyType || listing.propertyType === propertyType;

    return matchesQuery && matchesType && matchesPropertyType;
  });
}
