import { Skeleton } from "@property-lk/ui";

export default function ListingsLoading() {
  return (
    <div className="stack">
      <div className="stack">
        <Skeleton height={14} style={{ width: 90 }} />
        <Skeleton height={40} style={{ width: "36%" }} />
        <Skeleton height={18} style={{ width: "58%" }} />
      </div>

      <div className="filter-row">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={38} style={{ width: 120 }} />
        ))}
      </div>

      <div className="card stack">
        <Skeleton height={24} style={{ width: 180 }} />
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <Skeleton key={rowIndex} height={18} style={{ width: "100%" }} />
        ))}
      </div>
    </div>
  );
}
