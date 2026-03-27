import { Badge, Card, CardContent, CardHeader, CardTitle } from "@property-lk/ui";
import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";
import { sampleListings } from "../../lib/site-data";

export default function ComparePage() {
  const [first, second] = sampleListings;

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Compare"
        title="A simple comparison surface for two listings."
        description="This can later grow into selectable columns, trade-off flags, and recommendation logic."
      />
      <div className="split-grid">
        {[first, second].map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <Badge variant="neutral">{listing.listingType}</Badge>
              <CardTitle>{listing.title}</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="muted">{listing.area}</p>
            <p>{listing.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
