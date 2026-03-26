import { reports } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function ReportsPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Reports</p>
        <h1 className="page-title">Issue queue</h1>
        <p className="subtle">Handle fake listings, spam, price issues, and expired supply.</p>
      </header>

      <SectionCard title="Open reports">
        <table className="table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Listing</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={`${report.issue}-${report.listing}`}>
                <td>{report.issue}</td>
                <td>{report.listing}</td>
                <td>{report.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
