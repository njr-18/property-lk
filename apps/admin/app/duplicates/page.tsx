import { duplicateClusters } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function DuplicatesPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Duplicates</p>
        <h1 className="page-title">Cluster review</h1>
        <p className="subtle">Inspect suspicious listings and merge or dismiss duplicate matches.</p>
      </header>

      <SectionCard title="Clusters">
        <table className="table">
          <thead>
            <tr>
              <th>Cluster</th>
              <th>Members</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {duplicateClusters.map((cluster) => (
              <tr key={cluster.id}>
                <td>{cluster.id}</td>
                <td>{cluster.members}</td>
                <td>{cluster.confidence}</td>
                <td>{cluster.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
