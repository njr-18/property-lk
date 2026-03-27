"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from "@property-lk/ui";
import type { AuthFormState } from "../../lib/auth";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (state: AuthFormState | void, formData: FormData) => Promise<AuthFormState | void>;
  next?: string;
};

const initialState: AuthFormState = {};

export function AuthForm({ mode, action, next }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isSignup = mode === "signup";
  const formState = state ?? initialState;

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle>{isSignup ? "Create your account" : "Log in to your account"}</CardTitle>
        <CardDescription>
          {isSignup
            ? "Save listings now and leave room for saved searches later."
            : "Pick up saved listings and account activity from where you left off."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="route-stack">
          {next ? <input name="next" type="hidden" value={next} /> : null}
          {isSignup ? (
            <Input
              autoComplete="name"
              defaultValue=""
              error={formState.fieldErrors?.name}
              label="Name"
              name="name"
              placeholder="Your name"
            />
          ) : null}
          <Input
            autoComplete="email"
            defaultValue=""
            error={formState.fieldErrors?.email}
            label="Email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
          <Input
            autoComplete={isSignup ? "new-password" : "current-password"}
            defaultValue=""
            error={formState.fieldErrors?.password}
            label="Password"
            name="password"
            placeholder={isSignup ? "At least 8 characters" : "Your password"}
            type="password"
          />
          {formState.error ? (
            <p aria-live="polite" className="ui-field__message ui-field__message--error" role="alert">
              {formState.error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <SubmitButton label={isSignup ? "Create account" : "Log in"} />
          <Link href={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Already have an account?" : "Need an account?"}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Working..." : label}
    </Button>
  );
}
