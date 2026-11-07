"use client";

import { useMemo, useState } from "react";
import { CORRIDORS, formatMoney, quoteTransfer } from "@oenodpay/shared";

const AMOUNTS = [10_000, 25_000, 50_000, 100_000];

export function QuoteCalculator() {
  const [countryCode, setCountryCode] = useState("PH");
  const corridor = CORRIDORS.find((c) => c.countryCode === countryCode) ?? CORRIDORS[0]!;
  const [methodId, setMethodId] = useState(corridor.methods[0]!.id);
  const [amountMinor, setAmountMinor] = useState(50_000);
  const method = corridor.methods.find((m) => m.id === methodId) ?? corridor.methods[0]!;
  const quote = useMemo(() => quoteTransfer(corridor.countryCode, method.id, amountMinor), [corridor, method, amountMinor]);

  return (
    <section className="rounded-3xl bg-white border border-line p-6 flex flex-col gap-5" aria-labelledby="send-abroad">
      <h2 id="send-abroad" className="font-display text-2xl font-semibold">Send abroad</h2>
      <label className="flex flex-col gap-1.5 text-sm text-muted">
        Country
        <select
          value={corridor.countryCode}
          onChange={(e) => {
            const next = CORRIDORS.find((c) => c.countryCode === e.target.value)!;
            setCountryCode(next.countryCode);
            setMethodId(next.methods[0]!.id);
          }}
          className="h-12 rounded-xl border border-[#D5D9E4] px-3 text-base text-ink bg-white"
        >
          {CORRIDORS.map((c) => (
            <option key={c.countryCode} value={c.countryCode}>{c.countryName}</option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-muted mb-1.5">How they receive it</legend>
        {corridor.methods.map((m) => (
          <label
            key={m.id}
            className={`flex items-center justify-between rounded-2xl p-4 cursor-pointer border ${m.id === method.id ? "border-2 border-brand" : "border-line"}`}
          >
            <span className="flex items-center gap-3">
              <input type="radio" name="method" checked={m.id === method.id} onChange={() => setMethodId(m.id)} className="accent-brand" />
              <span className="flex flex-col">
                <span className="font-semibold">{m.name}</span>
                <span className="text-xs text-muted">{m.eta}</span>
              </span>
            </span>
            <span className="text-sm font-semibold text-muted">Fee {formatMoney({ minor: m.feeMinor, currency: "CAD" })}</span>
          </label>
        ))}
      </fieldset>
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Amount to send">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmountMinor(a)}
            aria-pressed={a === amountMinor}
            className={`h-11 rounded-xl font-semibold border ${a === amountMinor ? "bg-ink text-white border-ink" : "bg-white border-[#D5D9E4]"}`}
          >
            {formatMoney({ minor: a, currency: "CAD" }).replace(".00", "")}
          </button>
        ))}
      </div>
      <dl className="rounded-2xl bg-ink text-white p-5 grid grid-cols-2 gap-y-2 text-sm">
        <dt className="text-mist">You send</dt><dd className="text-right">{formatMoney(quote.send)}</dd>
        <dt className="text-mist">Fee</dt><dd className="text-right">{formatMoney(quote.fee)}</dd>
        <dt className="text-mist">Rate</dt><dd className="text-right">1 CAD = {quote.rate} {quote.receive.currency}</dd>
        <dt className="text-mist pt-2 border-t border-[#2A3048]">They receive</dt>
        <dd className="text-right pt-2 border-t border-[#2A3048] font-display text-xl font-semibold text-mint">{formatMoney(quote.receive)}</dd>
      </dl>
      <p className="text-xs text-muted">Arrives: {quote.eta.toLowerCase()} · sample rates for development</p>
    </section>
  );
}
