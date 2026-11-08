"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "oenodpay.cookies.v1";
type Choice = { essential: true; analytics: boolean; at: string };

/** Asks before any non-essential cookie is set (Quebec Law 25 and PIPEDA consent). Essential cookies only by default. */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* storage blocked: ask each visit */ }
    const t = setTimeout(() => { if (!saved) setOpen(true); }, 400);
    const reopen = () => { setCustom(true); setOpen(true); };
    window.addEventListener("oenodpay:cookie-settings", reopen);
    return () => { clearTimeout(t); window.removeEventListener("oenodpay:cookie-settings", reopen); };
  }, []);

  const save = (a: boolean) => {
    const c: Choice = { essential: true, analytics: a, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* ignore */ }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="cookie" role="dialog" aria-labelledby="ck-title" aria-live="polite">
      <h2 id="ck-title">Your privacy choices</h2>
      <p>We use essential cookies to keep you signed in and secure. With your permission, we&apos;d also like to measure how the site is used so we can improve it. See our <Link href="/legal/cookies">cookie policy</Link>.</p>
      {custom && (
        <>
          <label><input type="checkbox" checked disabled /> <span><b>Essential</b><br />Security and sign-in. Always on.</span></label>
          <label><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> <span><b>Analytics</b><br />Anonymous usage statistics.</span></label>
        </>
      )}
      <div className="row">
        {custom
          ? <button type="button" className="btn pri" onClick={() => save(analytics)}>Save choices</button>
          : <>
              <button type="button" className="btn pri" onClick={() => save(true)}>Accept all</button>
              <button type="button" className="btn ghost" onClick={() => save(false)}>Essential only</button>
              <button type="button" className="btn ghost" onClick={() => setCustom(true)}>Choose</button>
            </>}
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  return <button type="button" className="linkbtn" onClick={() => window.dispatchEvent(new Event("oenodpay:cookie-settings"))}>Cookie settings</button>;
}
