import Link from "next/link";
import { Card, CardContent, CardFooter, CardGrid, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
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
      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">Track incoming messages and future lead quality indicators.</p>
          </CardContent>
          <CardFooter>
            <Link className={buttonClassName({ variant: "primary", size: "md" })} href="/account/inquiries">
              View inquiries
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saved items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">Jump back into tracked listings and search alerts from one place.</p>
          </CardContent>
          <CardFooter>
            <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/saved/listings">
              View saved listings
            </Link>
          </CardFooter>
        </Card>
      </CardGrid>
    </PageShell>
  );
}
