"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DICTS, isLocale } from "@/i18n";

const KEY = "oenodpay.cookies.v1";
type Choice = { essential: true; analytics: boolean; at: string };

/** Asks before any non-essential cookie is set (Quebec Law 25 and PIPEDA consent). Essential cookies only by default. */
export function CookieConsent() {
  const seg = usePathname()?.split("/")[1];
  // The staff console and the preview hub are not public pages and set no cookies of their own.
  const hidden = seg === "admin" || seg === "preview";
  const t = DICTS[isLocale(seg) ? seg : "en"].cookie;
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

  if (!open || hidden) return null;
  return (
    <div className="cookie" dir={isLocale(seg) && (seg === "ar" || seg === "ur") ? "rtl" : undefined} role="dialog" aria-labelledby="ck-title" aria-live="polite">
      <h2 id="ck-title">{t.title}</h2>
      <p>{t.body} <Link href="/legal/cookies">{t.policy}</Link>.</p>
      {custom && (
        <>
          <label><input type="checkbox" checked disabled /> <span><b>{t.essential}</b><br />{t.essentialB}</span></label>
          <label><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> <span><b>{t.analytics}</b><br />{t.analyticsB}</span></label>
        </>
      )}
      <div className="row">
        {custom
          ? <button type="button" className="btn pri" onClick={() => save(analytics)}>{t.save}</button>
          : <>
              <button type="button" className="btn pri" onClick={() => save(true)}>{t.acceptAll}</button>
              <button type="button" className="btn ghost" onClick={() => save(false)}>{t.essentialOnly}</button>
              <button type="button" className="btn ghost" onClick={() => setCustom(true)}>{t.choose}</button>
            </>}
      </div>
    </div>
  );
}

export function CookieSettingsButton({ label = "Cookie settings" }: { label?: string }) {
  return <button type="button" className="linkbtn" onClick={() => window.dispatchEvent(new Event("oenodpay:cookie-settings"))}>{label}</button>;
}
