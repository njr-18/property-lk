"use client";

import { StatePanel } from "../components/state-panel";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset: _reset }: ErrorPageProps) {
  return (
    <StatePanel
      title="Something went wrong"
      description={error.message || "The admin view failed to render."}
    />
  );
}
