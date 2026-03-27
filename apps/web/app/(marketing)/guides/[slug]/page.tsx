import { Card, CardContent, CardHeader, CardTitle } from "@property-lk/ui";
import { notFound } from "next/navigation";
import { PageShell } from "../../../../components/layout/page-shell";
import { SectionHeading } from "../../../../components/ui/section-heading";
import { getGuideBySlug } from "../../../../lib/site-data";

export default async function GuidePage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <PageShell>
      <SectionHeading eyebrow="Guide" title={guide.title} description={guide.excerpt} />
      <Card className="panel">
        <CardHeader>
          <CardTitle>Guide content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{guide.body}</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
