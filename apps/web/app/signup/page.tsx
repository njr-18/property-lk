import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "../../components/layout/page-shell";
import { AuthForm } from "../../components/auth/auth-form";
import { SectionHeading } from "../../components/ui/section-heading";
import { getSessionUser, signupAction } from "../../lib/auth";

export default async function SignupPage({
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
        title="Create an account"
        description="Start saving listings now and keep room for future account features."
      />
      <AuthForm action={signupAction} mode="signup" next={nextPath} />
      <p className="muted">
        Already have an account? <Link href="/login">Log in</Link>.
      </p>
    </PageShell>
  );
}
