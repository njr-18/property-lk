import type { PropsWithChildren } from "react";

export function Surface({
  children,
  title
}: PropsWithChildren<{ title: string }>) {
  return (
    <section
      style={{
        border: "1px solid #d0d7de",
        borderRadius: "16px",
        padding: "1rem",
        backgroundColor: "#ffffff"
      }}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
}
