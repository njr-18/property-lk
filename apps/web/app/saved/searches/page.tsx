import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";

export default function SavedSearchesPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Saved"
        title="Saved searches"
        description="A simple surface for alerts, filters, and notification preferences."
      />
      <div className="panel">
        <p className="muted">No saved searches have been added yet.</p>
      </div>
    </PageShell>
  );
}
