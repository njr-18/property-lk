export function SectionHeading({
  eyebrow,
  title,
  description
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
}>) {
  return (
    <header className="page-hero">
      {eyebrow ? <span className="pill">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
