import Link from "next/link";
import { Card, CardContent, CardFooter, CardGrid, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { PageShell } from "../../components/layout/page-shell";
import { SectionHeading } from "../../components/ui/section-heading";
import { requireSessionUser } from "../../lib/auth";

export default async function AccountPage() {
  const user = await requireSessionUser("/account");

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account"
        title="Account basics"
        description={`Signed in as ${user.name ?? user.email}. Profile details and preferences can grow here later.`}
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
            <CardTitle>Saved searches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">Rename searches, toggle alerts, and jump back into the exact filter set.</p>
          </CardContent>
          <CardFooter>
            <Link className={buttonClassName({ variant: "secondary", size: "md" })} href="/saved/searches">
              View saved searches
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saved listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">Keep shortlisted properties close by while you compare and inquire.</p>
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
