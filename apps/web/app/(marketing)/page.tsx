import Link from "next/link";
import { Badge, Card, CardFooter, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { ListingCard } from "../../components/listing/listing-card";
import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";
import { formatLkr } from "../../lib/format";
import { sampleListings, siteStats } from "../../lib/site-data";

export default function MarketingHomePage() {
  return (
    <PageShell>
      <section className="hero-panel site-grid">
        <SectionHeading
          eyebrow="Property LK"
          title="Search homes, rentals, and local guides with less noise."
          description="A focused foundation for Sri Lankan property discovery, saved searches, and trusted listings."
        />
        <div className="button-row">
          <Link className={buttonClassName({ variant: "primary", size: "md" })} href="/search">
            Start searching
          </Link>
          <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/post-property">
            Post a property
          </Link>
        </div>
        <div className="stats-grid">
          {siteStats.map((stat) => (
            <Card key={stat.label}>
              <strong>{stat.value}</strong>
              <div className="muted">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="split-grid">
        <Card className="panel">
          <CardHeader>
            <CardTitle>Featured listings</CardTitle>
            <p className="muted">
              A small curated set of cards that can grow into search, map, and comparison views.
            </p>
          </CardHeader>
          <div className="card-grid">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </Card>

        <Card className="panel">
          <CardHeader>
            <Badge variant="neutral">MVP shell</Badge>
            <CardTitle>What this foundation supports</CardTitle>
          </CardHeader>
          <div className="table">
            <div className="table-row">
              <strong>Search</strong>
              <span>{formatLkr(185000)} sample rental and sale data</span>
            </div>
            <div className="table-row">
              <strong>SEO</strong>
              <span>Area pages, guides, sitemap, and metadata routes</span>
            </div>
            <div className="table-row">
              <strong>Trust</strong>
              <span>Saved items, inquiries, and future moderation hooks</span>
            </div>
          </div>
          <CardFooter>
            <Link className={buttonClassName({ variant: "ghost", size: "md" })} href="/guides">
              Explore guides
            </Link>
          </CardFooter>
        </Card>
      </section>
    </PageShell>
  );
}
