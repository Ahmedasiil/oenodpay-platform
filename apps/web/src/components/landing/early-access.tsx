"use client";

import { useState } from "react";
import { waitlistSchema } from "@oenodpay/shared";
import { en } from "@/i18n/en";
import type { Dict } from "@/i18n/types";

/** Real sign-up: posts to the API through the website's server, which stores the email once. */
export function EarlyAccess({ t = en.join, source = "website" }: { t?: Dict["join"]; source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = waitlistSchema.safeParse({ email, source });
    if (!parsed.success) {
      setState("error");
      setMessage(t.errEmail);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json", "x-oenodpay-csrf": "1" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 429) throw new Error(t.errBusy);
      if (!res.ok) throw new Error(t.errGeneric);
      setState("done");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : t.errGeneric);
    }
  }

  if (state === "done") {
    return <p role="status" style={{ fontWeight: 600 }}>{t.done}</p>;
  }
  return (
    <form onSubmit={submit} noValidate>
      <input
        id="early-email" type="email" required autoComplete="email" placeholder={t.placeholder} dir="ltr" aria-label="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state === "error"} aria-describedby="early-msg"
      />
      <button className="btn light" type="submit" disabled={state === "sending"}>
        {state === "sending" ? t.sending : t.button}
      </button>
      <p id="early-msg" role="alert" style={{ width: "100%", margin: 0, fontSize: 13, color: "#FFB4AC", minHeight: 18 }}>
        {state === "error" ? message : ""}
      </p>
    </form>
  );
}
