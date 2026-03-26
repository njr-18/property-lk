import { verificationQueue } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function VerificationPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Verification</p>
        <h1 className="page-title">Trust checks</h1>
        <p className="subtle">Review identity, contact, and availability checks in one place.</p>
      </header>

      <SectionCard title="Queue">
        <table className="table">
          <thead>
            <tr>
              <th>Check</th>
              <th>Listing</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {verificationQueue.map((item) => (
              <tr key={`${item.name}-${item.item}`}>
                <td>{item.name}</td>
                <td>{item.item}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
