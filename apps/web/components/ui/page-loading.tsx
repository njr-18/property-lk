import { Card, CardGrid, Skeleton } from "@property-lk/ui";

export function PageLoading({
  title = "Loading page"
}: Readonly<{
  title?: string;
}>) {
  return (
    <section className="site-grid">
      <div className="page-hero">
        <Skeleton height={24} style={{ width: 120 }} />
        <Skeleton height={48} style={{ width: "min(100%, 520px)" }} />
        <Skeleton height={20} style={{ width: "min(100%, 620px)" }} />
      </div>
      <span className="sr-only">{title}</span>
      <CardGrid>
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index}>
            <Skeleton height={18} style={{ width: 88, marginBottom: 16 }} />
            <Skeleton height={30} style={{ width: "72%", marginBottom: 12 }} />
            <Skeleton height={16} style={{ width: "100%", marginBottom: 8 }} />
            <Skeleton height={16} style={{ width: "82%", marginBottom: 24 }} />
            <Skeleton height={46} style={{ width: 140 }} />
          </Card>
        ))}
      </CardGrid>
    </section>
  );
}
