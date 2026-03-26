import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";

export default function InquiriesPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account"
        title="Inquiries"
        description="A placeholder for contact intent history, status updates, and follow-up actions."
      />
      <div className="panel">
        <p className="muted">No inquiries yet.</p>
      </div>
    </PageShell>
  );
}
