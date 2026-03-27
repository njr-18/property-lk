"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@property-lk/ui";
import type { InquiryContactMethod } from "@property-lk/types";

type InquiryFormProps = {
  listingId: string;
  defaultName?: string;
  defaultEmail?: string;
};

type InquiryErrors = Partial<Record<"name" | "email" | "phone" | "message" | "preferredContactMethod", string>>;

const contactMethodOptions: Array<{ label: string; value: InquiryContactMethod }> = [
  { label: "Email", value: "email" },
  { label: "Call", value: "call" },
  { label: "WhatsApp", value: "whatsapp" }
];

export function InquiryForm({ listingId, defaultName, defaultEmail }: InquiryFormProps) {
  const [form, setForm] = useState({
    name: defaultName ?? "",
    email: defaultEmail ?? "",
    phone: "",
    message: "",
    preferredContactMethod: "email" as InquiryContactMethod
  });
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrors({});
    setSubmissionError(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          listingId,
          ...form
        })
      });

      const payload = await response.json().catch(() => ({ ok: false }));

      if (!response.ok || !payload.ok) {
        const nextErrors: InquiryErrors = {};

        if (Array.isArray(payload.fieldErrors)) {
          for (const fieldError of payload.fieldErrors) {
            if (typeof fieldError.field === "string" && typeof fieldError.message === "string") {
              nextErrors[fieldError.field as keyof InquiryErrors] = fieldError.message;
            }
          }
        }

        setErrors(nextErrors);
        setSubmissionError(payload.error ?? "Inquiry could not be submitted.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmissionError("Inquiry could not be submitted.");
    } finally {
      setIsPending(false);
    }
  }

  if (submitted) {
    return (
      <Card className="panel">
        <CardHeader>
          <CardTitle>Inquiry sent</CardTitle>
        </CardHeader>
        <CardContent className="stack-sm">
          <p className="muted">
            Your message has been saved and is ready for follow-up. You can review it later from
            your account if you are signed in.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle>Send an inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="stack-sm" onSubmit={handleSubmit}>
          <Input
            autoComplete="name"
            disabled={isPending}
            error={errors.name}
            id="inquiry-name"
            label="Name"
            name="name"
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            value={form.name}
          />
          <Input
            autoComplete="email"
            disabled={isPending}
            error={errors.email}
            id="inquiry-email"
            label="Email"
            name="email"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            type="email"
            value={form.email}
          />
          <Input
            autoComplete="tel"
            disabled={isPending}
            error={errors.phone}
            hint="Optional for email inquiries, required for call or WhatsApp."
            id="inquiry-phone"
            label="Phone"
            name="phone"
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            value={form.phone}
          />
          <Select
            disabled={isPending}
            error={errors.preferredContactMethod}
            id="inquiry-preferred-contact-method"
            label="Preferred contact method"
            name="preferredContactMethod"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                preferredContactMethod: event.target.value as InquiryContactMethod
              }))
            }
            options={contactMethodOptions}
            value={form.preferredContactMethod}
          />
          <label className="ui-field" htmlFor="inquiry-message">
            <span className="ui-field__label">Message</span>
            <textarea
              aria-describedby={errors.message ? undefined : "inquiry-message-hint"}
              className={`ui-input ui-textarea${errors.message ? " ui-input--error" : ""}`}
              disabled={isPending}
              id="inquiry-message"
              name="message"
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              rows={6}
              value={form.message}
            />
            {errors.message ? (
              <span className="ui-field__message ui-field__message--error">{errors.message}</span>
            ) : (
              <span className="ui-field__message" id="inquiry-message-hint">
                Share the basics you want to confirm before the next step.
              </span>
            )}
          </label>
          {submissionError ? (
            <p className="ui-field__message ui-field__message--error" role="alert">
              {submissionError}
            </p>
          ) : null}
          <div className="button-row">
            <Button disabled={isPending} type="submit">
              {isPending ? "Sending..." : "Send inquiry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
