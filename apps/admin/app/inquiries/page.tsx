import { inquiries } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function InquiriesPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Inquiries</p>
        <h1 className="page-title">Lead triage</h1>
        <p className="subtle">Review incoming contact requests and route them to the right owner or agent.</p>
      </header>

      <SectionCard title="Inbox">
        <table className="table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={`${item.subject}-${item.contact}`}>
                <td>{item.subject}</td>
                <td>{item.contact}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
