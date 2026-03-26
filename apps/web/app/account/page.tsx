import Link from "next/link";
import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";

export default function AccountPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account"
        title="Account basics"
        description="A future home for profile details, preferences, and notification settings."
      />
      <div className="panel">
        <div className="button-row">
          <Link className="button primary" href="/account/inquiries">
            View inquiries
          </Link>
          <Link className="button" href="/saved/listings">
            View saved listings
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
