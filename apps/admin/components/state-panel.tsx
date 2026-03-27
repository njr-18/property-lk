import { EmptyState } from "@property-lk/ui";

type StatePanelProps = {
  title: string;
  description: string;
};

export function StatePanel({ title, description }: StatePanelProps) {
  return (
    <div className="state-panel">
      <EmptyState title={title} description={description} />
    </div>
  );
}
