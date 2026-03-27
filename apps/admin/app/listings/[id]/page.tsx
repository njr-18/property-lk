type ListingDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="stack">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Listings</p>
          <h1 className="page-title">Listing {id}</h1>
          <p className="subtle">Detailed moderation view for review notes and trust signals.</p>
        </div>
        <span className="pill">Pending review</span>
      </header>

      <div className="grid two">
        <section className="card">
          <h2>Listing summary</h2>
          <p className="subtle">
            3 bedroom house in Nugegoda with verified contact details and a fresh photo set.
          </p>
          <p className="subtle">
            Ownership check is incomplete and the location pin still needs confirmation.
          </p>
        </section>

        <section className="card">
          <h2>Moderation checklist</h2>
          <ul className="subtle">
            <li>Confirm phone and WhatsApp</li>
            <li>Review image authenticity</li>
            <li>Check duplicate similarity</li>
            <li>Approve or reject publication</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
