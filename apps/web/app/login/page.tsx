import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "../../components/layout/page-shell";
import { AuthForm } from "../../components/auth/auth-form";
import { SectionHeading } from "../../components/ui/section-heading";
import { getSessionUser, loginAction } from "../../lib/auth";

export default async function LoginPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await getSessionUser();

  if (user) {
    redirect("/account");
  }

  const resolvedSearchParams = (await Promise.resolve(searchParams ?? {})) as Record<
    string,
    string | string[] | undefined
  >;
  const nextParam = resolvedSearchParams["next"];
  const nextPath = typeof nextParam === "string" ? nextParam : undefined;

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account"
        title="Log in"
        description="Use your email and password to manage saved listings."
      />
      <AuthForm action={loginAction} mode="login" next={nextPath} />
      <p className="muted">
        New here? <Link href="/signup">Create an account</Link>.
      </p>
    </PageShell>
  );
}
