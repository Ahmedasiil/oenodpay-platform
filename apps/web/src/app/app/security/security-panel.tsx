"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { startRegistration } from "@simplewebauthn/browser";
import { ClientError, call } from "@/lib/client";

interface Me { user: { fullName: string; email: string; handle: string; kycStatus: string } }
interface Device { id: string; deviceName: string; createdAt: string; lastUsedAt: string; current: boolean }
interface Passkey { id: string; nickname: string; synced: boolean; createdAt: string; lastUsedAt: string | null }

type Loaded =
  | { kind: "ok"; me: Me["user"]; devices: Device[]; passkeys: Passkey[] }
  | { kind: "signed_out" | "offline" };

async function fetchAll(): Promise<Loaded> {
  try {
    const [m, s, p] = await Promise.all([
      call<Me>("/api/v1/me"),
      call<{ sessions: Device[] }>("/api/v1/sessions"),
      call<{ passkeys: Passkey[] }>("/api/v1/passkeys"),
    ]);
    return { kind: "ok", me: m.user, devices: s.sessions, passkeys: p.passkeys };
  } catch (e) {
    return { kind: e instanceof ClientError && e.status === 401 ? "signed_out" : "offline" };
  }
}

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }) : "Never";

export function SecurityPanel() {
  const [me, setMe] = useState<Me["user"] | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "signed_out" | "offline">("loading");
  const [notice, setNotice] = useState<string | null>(null);

  const apply = useCallback((r: Loaded) => {
    if (r.kind === "ok") {
      setMe(r.me);
      setDevices(r.devices);
      setPasskeys(r.passkeys);
      setState("ready");
    } else {
      setState(r.kind);
    }
  }, []);

  const load = useCallback(async () => apply(await fetchAll()), [apply]);

  useEffect(() => {
    let alive = true;
    void fetchAll().then((r) => { if (alive) apply(r); });
    return () => { alive = false; };
  }, [apply]);

  const addPasskey = async () => {
    setNotice(null);
    try {
      const { challengeId, options } = await call<{ challengeId: string; options: Parameters<typeof startRegistration>[0]["optionsJSON"] }>(
        "/api/v1/passkeys/register/options", { method: "POST" },
      );
      const response = await startRegistration({ optionsJSON: options });
      const nickname = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "Apple passkey" : /Android/.test(navigator.userAgent) ? "Android passkey" : "Passkey";
      await call("/api/v1/passkeys/register/verify", { method: "POST", body: { challengeId, response, nickname } });
      setNotice("Passkey added. Next time, sign in with Face ID, Touch ID or your fingerprint.");
      await load();
    } catch (e) {
      setNotice(e instanceof Error && e.name === "NotAllowedError" ? "Passkey setup was cancelled." : "Couldn’t add the passkey. Try again.");
    }
  };

  const remove = async (kind: "sessions" | "passkeys", id: string) => {
    await call(`/api/v1/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  };

  const signOut = async () => {
    await call("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
    // Full page load, so no account data stays in the browser's memory after signing out.
    window.location.assign("/signin");
  };

  if (state === "loading") return <p className="text-muted">Loading your security settings…</p>;
  if (state === "signed_out" || state === "offline") {
    return (
      <div className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-3">
        <h1 className="font-display text-2xl font-semibold">{state === "signed_out" ? "Sign in to continue" : "Can’t reach oenodPay"}</h1>
        <p className="text-muted">{state === "signed_out" ? "Your security settings are only shown to you." : "The service isn’t responding. Try again shortly."}</p>
        <Link href="/signin" className="self-start h-11 px-5 rounded-xl bg-brand text-white flex items-center font-semibold">Sign in</Link>
      </div>
    );
  }

  const card = "rounded-3xl border border-line bg-white p-6 flex flex-col gap-4";
  const row = "flex flex-wrap items-center justify-between gap-3 py-3 border-t border-line first:border-t-0";
  const ghost = "h-10 px-4 rounded-xl border border-[#D5D9E4] text-sm font-semibold hover:border-ink";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Signed in as {me?.email} · @{me?.handle}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Security</h1>
        </div>
        <button onClick={signOut} className={ghost}>Sign out</button>
      </div>

      {me?.kycStatus !== "verified" ? (
        <div className="rounded-3xl border-2 border-brand bg-brand-soft p-5 text-sm">
          <strong>Verify your identity to send money.</strong> Open the oenodPay app and tap “Verify now”. It takes about two minutes.
        </div>
      ) : null}

      <section className={card} aria-labelledby="pk">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="pk" className="font-semibold text-lg">Passkeys</h2>
            <p className="text-sm text-muted">Sign in with Face ID, Touch ID, your fingerprint or Windows Hello. Nothing to phish, nothing to leak.</p>
          </div>
          <button onClick={addPasskey} className="h-11 px-5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark">Add a passkey</button>
        </div>
        {notice ? <p role="status" className="text-sm text-positive">{notice}</p> : null}
        <div>
          {passkeys.length === 0 ? <p className="text-sm text-muted">No passkeys yet. Add one to stop using your password.</p> : null}
          {passkeys.map((p) => (
            <div key={p.id} className={row}>
              <div>
                <p className="font-medium">{p.nickname}{p.synced ? " · synced" : " · this device only"}</p>
                <p className="text-xs text-muted">Added {when(p.createdAt)} · last used {when(p.lastUsedAt)}</p>
              </div>
              <button onClick={() => remove("passkeys", p.id)} className={ghost}>Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section className={card} aria-labelledby="dev">
        <div>
          <h2 id="dev" className="font-semibold text-lg">Signed-in devices</h2>
          <p className="text-sm text-muted">Don’t recognise one? Sign it out. It loses access straight away.</p>
        </div>
        <div>
          {devices.map((d) => (
            <div key={d.id} className={row}>
              <div>
                <p className="font-medium">{d.deviceName}{d.current ? " · this device" : ""}</p>
                <p className="text-xs text-muted">Signed in {when(d.createdAt)} · active {when(d.lastUsedAt)}</p>
              </div>
              {d.current ? null : <button onClick={() => remove("sessions", d.id)} className={ghost}>Sign out</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
