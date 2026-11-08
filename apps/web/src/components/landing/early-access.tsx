"use client";

import { useState } from "react";
import { waitlistSchema } from "@oenodpay/shared";

/** Real sign-up: posts to the API through the website's server, which stores the email once. */
export function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = waitlistSchema.safeParse({ email, source: "website" });
    if (!parsed.success) {
      setState("error");
      setMessage("Enter an email address like name@example.com.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json", "x-oenodpay-csrf": "1" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 429) throw new Error("Too many tries. Wait a minute and try again.");
      if (!res.ok) throw new Error("We couldn't add you right now. Try again in a moment.");
      setState("done");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return <p role="status" style={{ fontWeight: 600 }}>You&apos;re on the list. We&apos;ll email you when your account is ready.</p>;
  }
  return (
    <form onSubmit={submit} noValidate>
      <input
        id="early-email" type="email" required autoComplete="email" placeholder="you@email.com" aria-label="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state === "error"} aria-describedby="early-msg"
      />
      <button className="btn light" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Adding you…" : "Get early access"}
      </button>
      <p id="early-msg" role="alert" style={{ width: "100%", margin: 0, fontSize: 13, color: "#FFB4AC", minHeight: 18 }}>
        {state === "error" ? message : ""}
      </p>
    </form>
  );
}
