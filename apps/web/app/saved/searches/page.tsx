import { PageShell } from "../../../components/layout/page-shell";
import { EmptyState } from "../../../components/ui/empty-state";
import { SectionHeading } from "../../../components/ui/section-heading";

export default function SavedSearchesPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Saved"
        title="Saved searches"
        description="A simple surface for alerts, filters, and notification preferences."
      />
      <EmptyState
        actionLabel="Start searching"
        description="Saved search alerts, summary emails, and new-match prompts will plug into this shell next."
        href="/search"
        title="No saved searches yet"
      />
    </PageShell>
  );
}
