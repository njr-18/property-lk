import { Skeleton } from "@property-lk/ui";

export default function DuplicatesLoading() {
  return (
    <div className="stack">
      <div className="stack">
        <Skeleton height={14} style={{ width: 90 }} />
        <Skeleton height={40} style={{ width: "36%" }} />
        <Skeleton height={18} style={{ width: "58%" }} />
      </div>

      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="card stack">
          <div className="inline-status">
            <div className="stack compact">
              <Skeleton height={12} style={{ width: 100 }} />
              <Skeleton height={28} style={{ width: 140 }} />
            </div>
            <div className="stack compact">
              <Skeleton height={28} style={{ width: 90 }} />
              <Skeleton height={12} style={{ width: 130 }} />
            </div>
          </div>

          <div className="grid two">
            {Array.from({ length: 2 }, (_, itemIndex) => (
              <div key={itemIndex} className="message-block stack compact">
                <Skeleton height={18} style={{ width: "62%" }} />
                <Skeleton height={14} style={{ width: "48%" }} />
                <Skeleton height={14} style={{ width: "100%" }} />
                <Skeleton height={14} style={{ width: "92%" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
