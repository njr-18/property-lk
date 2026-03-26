import Link from "next/link";
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
          <Link className="button primary" href="/search">
            Start searching
          </Link>
          <Link className="button" href="/post-property">
            Post a property
          </Link>
        </div>
        <div className="stats-grid">
          {siteStats.map((stat) => (
            <div className="card" key={stat.label}>
              <strong>{stat.value}</strong>
              <div className="muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="split-grid">
        <div className="panel">
          <h2>Featured listings</h2>
          <p className="muted">
            A small curated set of cards that can grow into search, map, and comparison views.
          </p>
          <div className="card-grid">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>What this foundation supports</h2>
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
        </div>
      </section>
    </PageShell>
  );
}
