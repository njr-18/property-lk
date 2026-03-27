import { EmptyState } from "../components/ui/empty-state";

export default function NotFound() {
  return (
    <div style={{ marginTop: 32 }}>
      <EmptyState
        actionLabel="Return home"
        description="The page you tried to open is not part of the current MVP shell."
        href="/"
        title="Page not found"
      />
    </div>
  );
}
