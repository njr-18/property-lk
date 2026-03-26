import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel" style={{ marginTop: 32 }}>
      <h1>Page not found</h1>
      <p className="muted">The page you tried to open does not exist yet.</p>
      <Link className="button primary" href="/">
        Return home
      </Link>
    </div>
  );
}
