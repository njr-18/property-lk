"use client";

import { RouteError } from "../components/ui/route-error";

export default function Error({
  reset
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return <RouteError reset={reset} />;
}
