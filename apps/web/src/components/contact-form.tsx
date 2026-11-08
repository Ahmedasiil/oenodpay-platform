"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { contactSchema, CONTACT_TOPICS } from "@oenodpay/shared";
import { FORM_TEXT, TOPIC_LABEL, type FormText } from "@/views/support-text";

export function ContactForm({ text = { ...FORM_TEXT, topics: TOPIC_LABEL } }: { text?: FormText }) {
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
      setError(f?.path[0] === "email" ? text.errEmail : f?.path[0] === "name" ? text.errName : text.errForm);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-oenodpay-csrf": "1" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 429) throw new Error(text.errBusy);
      if (!res.ok) throw new Error(text.errSend);
      const body = (await res.json()) as { reference: string };
      setReference(body.reference);
      setState("done");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : text.errGeneric);
    }
  }

  if (state === "done") {
    return <p className="okmsg" role="status">{text.done.replace("{reference}", reference)}</p>;
  }
  return (
    <form className="formx" onSubmit={onSubmit} noValidate>
      <label>{text.name}<input name="name" autoComplete="name" required /></label>
      <label>{text.email}<input name="email" type="email" autoComplete="email" required /></label>
      <label>{text.topic}
        <select name="topic" defaultValue={CONTACT_TOPICS.includes(initialTopic as never) ? initialTopic : "support"}>
          {CONTACT_TOPICS.map((t) => <option key={t} value={t}>{text.topics[t] ?? TOPIC_LABEL[t]}</option>)}
        </select>
      </label>
      <label>{text.message}<textarea name="message" required placeholder={text.placeholder} /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <div><button className="btn pri" disabled={state === "sending"}>{state === "sending" ? text.sending : text.send}</button></div>
    </form>
  );
}
