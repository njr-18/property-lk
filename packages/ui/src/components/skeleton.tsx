import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  height?: number | string;
};

export function Skeleton({ className, height, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("ui-skeleton", className)}
      style={{ ...style, height }}
      {...props}
    />
  );
}
