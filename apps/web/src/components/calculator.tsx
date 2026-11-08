"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CORRIDORS, formatMoney, quoteTransfer, type Quote } from "@oenodpay/shared";
import { en } from "@/i18n/en";
import type { Dict } from "@/i18n/types";

/** Live price calculator. Prices come from the oenodPay API, the same maths the app uses. */
export function Calculator({ country = "PH", compact, t = en.calc, joinHref = "/#join" }: { country?: string; compact?: boolean; t?: Dict["calc"]; joinHref?: string }) {
  const [code, setCode] = useState(country);
  const corridor = useMemo(() => CORRIDORS.find((c) => c.countryCode === code) ?? CORRIDORS[0]!, [code]);
  const [methodId, setMethodId] = useState(corridor.methods[0]!.id);
  const [amount, setAmount] = useState("500");
  const [server, setServer] = useState<{ key: string; quote: Quote } | null>(null);

  const method = corridor.methods.find((m) => m.id === methodId) ?? corridor.methods[0]!;
  const cents = Math.round(Number(amount.replace(/[^0-9.]/g, "")) * 100) || 0;
  const key = `${code}|${method.id}|${cents}`;
  const error = cents <= method.feeMinor ? `${t.min} ${formatMoney({ minor: method.feeMinor, currency: "CAD" })}`
    : cents > 300000 ? t.max : null;
  // Instant local estimate (same shared maths), replaced by the server's price when it arrives.
  const local = useMemo(() => (error ? null : quoteTransfer(code, method.id, cents)), [error, code, method.id, cents]);
  const live = server?.key === key;
  const quote = error ? null : live ? server!.quote : local;

  useEffect(() => {
    if (error) return;
    const ctl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/v1/public/quotes", {
          method: "POST", signal: ctl.signal,
          headers: { "content-type": "application/json", "x-oenodpay-csrf": "1" },
          body: JSON.stringify({ countryCode: code, methodId: method.id, amountMinor: cents }),
        });
        if (res.ok) setServer({ key, quote: (await res.json()).quote });
      } catch { /* keep the local estimate */ }
    }, 250);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [error, key, code, method.id, cents]);


  return (
    <div className={`calc${compact ? " compact" : ""}`}>
      <div className="calc-row">
        <label className="calc-in">
          <span>{t.send}</span>
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Amount in Canadian dollars" />
        </label>
        <span className="calc-cur"><i className="flag">🇨🇦</i>CAD</span>
      </div>
      <div className="calc-mid">
        <div><span>{t.fee}</span><b className="num">{formatMoney({ minor: method.feeMinor, currency: "CAD" })}</b></div>
        <div><span>{t.rate}</span><b className="num">1 CAD = {corridor.sampleRate} {corridor.currency}</b></div>
        <div><span>{t.arrives}</span><b>{method.eta}</b></div>
      </div>
      <div className="calc-row out">
        <label className="calc-in">
          <span>{t.get}</span>
          <output className="num">{quote ? (quote.receive.minor / 100).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}</output>
        </label>
        <select className="calc-cur" value={code} aria-label="Destination country"
          onChange={(e) => { const c = CORRIDORS.find((x) => x.countryCode === e.target.value)!; setCode(c.countryCode); setMethodId(c.methods[0]!.id); }}>
          {CORRIDORS.map((c) => <option key={c.countryCode} value={c.countryCode}>{c.currency} · {c.countryName}</option>)}
        </select>
      </div>
      <div className="calc-methods" role="radiogroup" aria-label="How they receive it">
        {corridor.methods.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={m.id === method.id} className={m.id === method.id ? "on" : ""} onClick={() => setMethodId(m.id)}>{m.name}</button>
        ))}
      </div>
      {error ? <p className="calc-err" role="alert">{error}</p> : null}
      <Link href={joinHref} className="btn pri calc-cta">{t.cta}</Link>
      <p className="calc-note">{live ? t.live : t.est} {t.note}</p>
    </div>
  );
}
