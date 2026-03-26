import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";

export default function PostPropertyPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Post property"
        title="Start a listing"
        description="This can later become a guided listing creation flow with validation and uploads."
      />
      <div className="panel">
        <p className="muted">Placeholder form entry point.</p>
      </div>
    </PageShell>
  );
}
