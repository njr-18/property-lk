import Link from "next/link";
import { Badge, Card, CardContent, CardFooter, CardGrid, CardHeader, CardTitle, buttonClassName } from "@property-lk/ui";
import { PageShell } from "../../../components/layout/page-shell";
import { SectionHeading } from "../../../components/ui/section-heading";
import { sampleGuides } from "../../../lib/site-data";

export default function GuidesIndexPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Guides"
        title="Practical property guides for buyers, renters, and owners."
        description="A content system that can grow into templates, internal links, and location-specific advice."
      />
      <CardGrid>
        {sampleGuides.map((guide) => (
          <Card key={guide.slug}>
            <CardHeader>
              <Badge variant="neutral">Guide</Badge>
              <CardTitle>{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{guide.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link className={buttonClassName({ variant: "secondary", size: "md" })} href={`/guides/${guide.slug}`}>
                Read guide
              </Link>
            </CardFooter>
          </Card>
        ))}
      </CardGrid>
    </PageShell>
  );
}
