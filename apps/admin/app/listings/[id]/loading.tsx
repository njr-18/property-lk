import { Skeleton } from "@property-lk/ui";

export default function ListingDetailsLoading() {
  return (
    <div className="stack">
      <div className="stack">
        <Skeleton height={14} style={{ width: 90 }} />
        <Skeleton height={40} style={{ width: "42%" }} />
        <Skeleton height={18} style={{ width: "56%" }} />
      </div>

      <div className="grid two">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="card stack">
            <Skeleton height={24} style={{ width: "48%" }} />
            {Array.from({ length: 4 }, (_, rowIndex) => (
              <Skeleton key={rowIndex} height={18} style={{ width: "100%" }} />
            ))}
          </div>
        ))}
      </div>

      <div className="grid two">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="card stack">
            <Skeleton height={24} style={{ width: "40%" }} />
            {Array.from({ length: 6 }, (_, rowIndex) => (
              <Skeleton key={rowIndex} height={18} style={{ width: "100%" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
