"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { ClientError, call } from "@/lib/client";

const messages: Record<string, string> = {
  invalid_credentials: "That email and password don’t match.",
  email_taken: "An account with this email already exists. Sign in instead.",
  invalid_request: "Check the details and try again. Passwords need at least 12 characters.",
  too_many_requests: "Too many tries. Wait a minute and try again.",
  unknown_passkey: "This passkey isn’t linked to an oenodPay account.",
  verification_failed: "The passkey check didn’t pass. Try again.",
  challenge_expired: "That took too long. Try again.",
};

export function SignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = (e: unknown) => {
    if (e instanceof ClientError) setError(messages[e.code] ?? "Something went wrong. Try again.");
    else if (e instanceof Error && e.name === "NotAllowedError") setError("Passkey sign-in was cancelled.");
    else setError("Can’t reach oenodPay right now. Try again shortly.");
  };

  const submit = async (form: FormData) => {
    setBusy(true);
    setError(null);
    try {
      const body = Object.fromEntries(form.entries());
      await call(mode === "signup" ? "/api/auth/register" : "/api/auth/login", { method: "POST", body });
      router.push("/app/security");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const passkey = async () => {
    setBusy(true);
    setError(null);
    try {
      const { challengeId, options } = await call<{ challengeId: string; options: Parameters<typeof startAuthentication>[0]["optionsJSON"] }>(
        "/api/auth/passkey/options", { method: "POST" },
      );
      const response = await startAuthentication({ optionsJSON: options });
      await call("/api/auth/passkey/verify", { method: "POST", body: { challengeId, response } });
      router.push("/app/security");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const tab = (m: "signin" | "signup", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => { setMode(m); setError(null); }}
      className={`flex-1 h-10 rounded-[11px] text-sm font-semibold ${mode === m ? "bg-brand text-navy shadow-sm" : "text-muted"}`}
    >
      {label}
    </button>
  );

  const field = "h-12 rounded-[14px] border border-line bg-navy px-4 text-[15px] placeholder:text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{mode === "signin" ? "Welcome back" : "Open your account"}</h1>
        <p className="text-muted">One oenodPay account for the website and the iOS and Android apps.</p>
      </div>

      <div role="tablist" className="flex gap-1 rounded-[14px] bg-surface p-1">
        {tab("signin", "Sign in")}
        {tab("signup", "Create account")}
      </div>

      {mode === "signin" ? (
        <>
          <button
            type="button"
            onClick={passkey}
            disabled={busy}
            className="h-13 min-h-[52px] rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="8" r="4"/><path d="M3 21v-1a6 6 0 0 1 9-5.2"/><circle cx="18" cy="15" r="2.5"/><path d="M18 17.5V22m0-2h2"/></svg>
            Sign in with a passkey
          </button>
          <div className="flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or use your password<span className="h-px flex-1 bg-line" /></div>
        </>
      ) : null}

      <form action={submit} className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-5">
        {mode === "signup" ? (
          <label className="flex flex-col gap-1.5 text-sm text-muted">Full legal name
            <input name="fullName" required autoComplete="name" placeholder="As shown on your ID" className={field} />
          </label>
        ) : null}
        <label className="flex flex-col gap-1.5 text-sm text-muted">Email
          <input name="email" type="email" required autoComplete={mode === "signin" ? "username webauthn" : "email"} className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">Password
          <input name="password" type="password" required minLength={mode === "signup" ? 12 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"} className={field} />
        </label>
        {error ? <p role="alert" className="text-sm text-[#FF8A8A]">{error}</p> : null}
        <button type="submit" disabled={busy} className="h-[52px] rounded-2xl bg-brand text-navy font-semibold hover:bg-brand-dark disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="text-xs text-muted text-center">
        Your session is kept in a secure, HttpOnly cookie. Passkeys never leave your device.
      </p>
    </div>
  );
}
