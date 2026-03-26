import Link from "next/link";
import { listings } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function ListingsPage() {
  return (
    <div className="stack">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Listings</p>
          <h1 className="page-title">Listing moderation</h1>
          <p className="subtle">Track supply, review quality, and move verified listings live.</p>
        </div>
        <div className="action-row">
          <Link className="button" href="/listings/new">
            New listing
          </Link>
        </div>
      </header>

      <SectionCard title="Current inventory">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.id}</td>
                <td>{listing.title}</td>
                <td>{listing.type}</td>
                <td>{listing.status}</td>
                <td>{listing.price}</td>
                <td>
                  <Link className="pill" href={`/listings/${listing.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
