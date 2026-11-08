"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { contactSchema, CONTACT_TOPICS } from "@oenodpay/shared";

const TOPIC_LABEL: Record<(typeof CONTACT_TOPICS)[number], string> = {
  support: "Help with my account", privacy: "Privacy or my personal information", complaint: "Make a complaint",
  security: "Report a security issue", press: "Press and media", partnerships: "Partnerships", careers: "Careers",
};

export function ContactForm() {
  const initialTopic = useSearchParams().get("topic") ?? undefined;
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      const f = parsed.error.issues[0];
      setError(f?.path[0] === "email" ? "Enter a valid email address." : f?.path[0] === "name" ? "Enter your name." : f?.message ?? "Check the form and try again.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-oenodpay-csrf": "1" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 429) throw new Error("Too many messages. Wait a minute and try again.");
      if (!res.ok) throw new Error("We couldn't send your message. Try again in a moment.");
      const body = (await res.json()) as { reference: string };
      setReference(body.reference);
      setState("done");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return <p className="okmsg" role="status">Thanks, we&apos;ve got your message. Your reference is {reference}. We&apos;ll reply by email within one business day.</p>;
  }
  return (
    <form className="formx" onSubmit={onSubmit} noValidate>
      <label>Your name<input name="name" autoComplete="name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>What is it about?
        <select name="topic" defaultValue={CONTACT_TOPICS.includes(initialTopic as never) ? initialTopic : "support"}>
          {CONTACT_TOPICS.map((t) => <option key={t} value={t}>{TOPIC_LABEL[t]}</option>)}
        </select>
      </label>
      <label>Message<textarea name="message" required placeholder="Don't include card numbers or passwords." /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <div><button className="btn pri" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button></div>
    </form>
  );
}
