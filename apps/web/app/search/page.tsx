import { ListingCard } from "../../components/listing/listing-card";
import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";
import { searchListings } from "../../lib/search";

export default async function SearchPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const results = searchListings(params);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Search"
        title="Search listings with space for filters and compare flows."
        description="This page is intentionally lightweight now, but the data path is ready for richer search logic."
      />
      <div className="card-grid">
        {results.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </PageShell>
  );
}
