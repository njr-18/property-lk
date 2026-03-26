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
          <article className="card" key={listing.id}>
            <h3>{listing.title}</h3>
            <p className="muted">{listing.area}</p>
            <p>{listing.description}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
