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
      <div className="panel">
        <p className="muted">
          Area pages can eventually include local demand insights, nearby schools, commute notes, and linked listings.
        </p>
      </div>
    </PageShell>
  );
}
