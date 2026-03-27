import { Badge, Card, CardContent, CardGrid, CardHeader, CardTitle } from "@property-lk/ui";
import { notFound } from "next/navigation";
import { PageShell } from "../../../../components/layout/page-shell";
import { SectionHeading } from "../../../../components/ui/section-heading";
import { getAreaBySlug } from "../../../../lib/site-data";

export default async function AreaPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  return (
    <PageShell>
      <SectionHeading eyebrow={area.district} title={area.title} description={area.summary} />
      <CardGrid>
        <Card>
          <CardHeader>
            <Badge>Area overview</Badge>
            <CardTitle>Liveability signals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">
              Area pages can eventually include local demand insights, nearby schools, commute notes, and linked listings.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Search handoff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">This shell can later prefill nearby listings, filters, and guide links for {area.title}.</p>
          </CardContent>
        </Card>
      </CardGrid>
    </PageShell>
  );
}
