import Link from "next/link";
import { dashboardStats, listings, reports, verificationQueue } from "../lib/mock-data";
import { SectionCard } from "../components/section-card";
import { StatCard } from "../components/stat-card";

export default function DashboardPage() {
  return (
    <div className="stack">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Dashboard</p>
          <h1 className="page-title">Moderation overview</h1>
          <p className="subtle">
            A quick view of the queues that need attention before listings go live.
          </p>
        </div>

        <div className="action-row">
          <Link className="button" href="/listings/new">
            Create listing
          </Link>
          <Link className="ghost-button" href="/verification">
            Review verification
          </Link>
        </div>
      </header>

      <div className="grid stats">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid two">
        <SectionCard title="Review queue">
          <table className="table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <div className="muted">
                      {item.id} · {item.type} · {item.price}
                    </div>
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="Reports and verification">
          <div className="stack">
            <div>
              <h3>Reports</h3>
              {reports.map((report) => (
                <p key={`${report.issue}-${report.listing}`} className="subtle">
                  <span className="pill">{report.severity}</span> {report.issue} on{" "}
                  {report.listing}
                </p>
              ))}
            </div>

            <div>
              <h3>Verification</h3>
              {verificationQueue.map((item) => (
                <p key={`${item.name}-${item.item}`} className="subtle">
                  <strong>{item.name}</strong> for {item.item} is {item.status}.
                </p>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
