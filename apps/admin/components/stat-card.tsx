import { Card, CardContent } from "@property-lk/ui";

type StatCardProps = {
  label: string;
  value: string;
  foot: string;
};

export function StatCard({ label, value, foot }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-foot">{foot}</p>
      </CardContent>
    </Card>
  );
}
