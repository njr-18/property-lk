import { Skeleton } from "@property-lk/ui";

export default function Loading() {
  return (
    <div className="stack">
      <div className="stack">
        <Skeleton height={14} style={{ width: 110 }} />
        <Skeleton height={40} style={{ width: "40%" }} />
        <Skeleton height={18} style={{ width: "55%" }} />
      </div>

      <div className="grid stats">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="card">
            <Skeleton height={14} style={{ width: "45%" }} />
            <Skeleton height={36} style={{ width: "35%", marginTop: 14 }} />
            <Skeleton height={14} style={{ width: "60%", marginTop: 14 }} />
          </div>
        ))}
      </div>

      <div className="grid two">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="card">
            <Skeleton height={24} style={{ width: "38%", marginBottom: 16 }} />
            {Array.from({ length: 4 }, (_, rowIndex) => (
              <Skeleton key={rowIndex} height={16} style={{ width: "100%", marginTop: 12 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
