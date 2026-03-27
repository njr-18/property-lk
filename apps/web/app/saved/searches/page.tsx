import { PageShell } from "../../../components/layout/page-shell";
import { SavedSearchesManager } from "../../../components/saved-searches/saved-searches-manager";
import { EmptyState } from "../../../components/ui/empty-state";
import { SectionHeading } from "../../../components/ui/section-heading";
import { requireSessionUser } from "../../../lib/auth";
import { getSavedSearchesPageData } from "../../../lib/saved-searches";

export default async function SavedSearchesPage() {
  const user = await requireSessionUser("/saved/searches");
  const savedSearches = await getSavedSearchesPageData(user.id);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Saved"
        title="Saved searches"
        description="Review your saved filters, rename them, and keep alerts turned on only where you want them."
      />
      {savedSearches.length > 0 ? (
        <SavedSearchesManager initialSavedSearches={savedSearches} />
      ) : (
        <EmptyState
          actionLabel="Start searching"
          description="Save a search from the search page and it will appear here for quick reuse."
          href="/search"
          title="No saved searches yet"
        />
      )}
    </PageShell>
  );
}
