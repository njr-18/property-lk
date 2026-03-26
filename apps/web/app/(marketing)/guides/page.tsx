import Link from "next/link";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { sampleGuides } from "../../../lib/site-data";

export default function GuidesIndexPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Guides"
        title="Practical property guides for buyers, renters, and owners."
        description="A content system that can grow into templates, internal links, and location-specific advice."
      />
      <div className="card-grid">
        {sampleGuides.map((guide) => (
          <article className="card" key={guide.slug}>
            <h3>{guide.title}</h3>
            <p className="muted">{guide.excerpt}</p>
            <Link className="button" href={`/guides/${guide.slug}`}>
              Read guide
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
