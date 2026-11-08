"use client";

import { useState } from "react";
import { CORRIDORS, formatMoney, quoteTransfer } from "@oenodpay/shared";
import { LEND_RATES, cad, creditScore, lendEarnings, m, spend, touch, type DemoState, type FeatureId } from "./demo-state";
import { useX } from "./demo-text";

export interface DemoProps { s: DemoState; set: (next: DemoState) => void }

const Ok = ({ children }: { children: React.ReactNode }) => <div className="result ok" role="status">{children}</div>;
const No = ({ children }: { children: React.ReactNode }) => <div className="result no" role="status">{children}</div>;

function Switch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return <button type="button" className="switch" role="switch" aria-checked={on} aria-label={label} onClick={onToggle} />;
}

/* Send abroad: uses the same corridors and quote maths as the real API. */
function Send({ s, set }: DemoProps) {
  const x = useX();
  const [country, setCountry] = useState("PH");
  const corridor = CORRIDORS.find((c) => c.countryCode === country) ?? CORRIDORS[0]!;
  const [methodId, setMethodId] = useState(corridor.methods[0]!.id);
  const method = corridor.methods.find((m) => m.id === methodId) ?? corridor.methods[0]!;
  const [amount, setAmount] = useState(100);
  const [msg, setMsg] = useState<React.ReactNode>(null);
  const cents = Math.round(Math.min(3000, Math.max(1, amount || 0)) * 100);
  const quote = quoteTransfer(corridor.countryCode, method.id, Math.max(cents, method.feeMinor + 100));
  const total = cents; // the fee comes out of what you send, as in the app
  return (
    <>
      <div className="row">
        <div className="field"><label htmlFor="d-country">{x("Country")}</label>
          <select id="d-country" className="input" value={country} onChange={(e) => {
            const next = CORRIDORS.find((c) => c.countryCode === e.target.value)!;
            setCountry(next.countryCode); setMethodId(next.methods[0]!.id); setMsg(null);
          }}>
            {CORRIDORS.map((c) => <option key={c.countryCode} value={c.countryCode}>{x(c.countryName)}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="d-amount">{x("You send (CAD)")}</label>
          <input id="d-amount" className="input num" type="number" min={1} max={3000} value={amount}
            onChange={(e) => { setAmount(Number(e.target.value)); setMsg(null); }} />
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{x("How they receive it: {country}", { country: x(corridor.countryName) })}</div>
        <div className="chips">
          {corridor.methods.map((m) => (
            <button key={m.id} type="button" className="chip" aria-pressed={m.id === method.id} onClick={() => setMethodId(m.id)}>{x(m.name)}</button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="kv"><span>{x("Rate")}</span><span className="num">1 CAD = {quote.rate} {corridor.currency}</span></div>
        <div className="kv"><span>{x("Fee (included)")}</span><span className="num">{formatMoney(quote.fee)}</span></div>
        <div className="kv"><span>{x("Arrives")}</span><span>{x(quote.eta)}</span></div>
        <div className="kv" style={{ borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 12 }}>
          <span>{x("They get")}</span><span className="num big" style={{ fontSize: 24 }}>{formatMoney(quote.receive)}</span>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => {
          const next = spend(s, "send", total, x("Sent to Maria · {country} · {method}", { country: x(corridor.countryName), method: x(method.name) }));
          if (next) { set(next); setMsg(<Ok>{x("Sent. Maria gets {amount}. Arrives: {eta}. +50 points.", { amount: formatMoney(quote.receive), eta: x(quote.eta) })}</Ok>); }
          else setMsg(<No>{x("Not enough demo money. Lower the amount or start over.")}</No>);
        }}>{x("Send {amount}", { amount: cad(total) })}</button>
      </div>
      {msg}
    </>
  );
}

function Card({ s, set }: DemoProps) {
  const x = useX();
  const [msg, setMsg] = useState<React.ReactNode>(null);
  const c = s.card;
  const pay = (cents: number, what: string, online: boolean) => {
    if (c.frozen) return setMsg(<No>{x("Declined: your card is frozen. Unfreeze it above to pay.")}</No>);
    if (online && !c.online) return setMsg(<No>{x("Declined: online payments are turned off.")}</No>);
    if (cents > c.limitCents) return setMsg(<No>{x("Declined: over your daily limit of {limit}.", { limit: cad(c.limitCents) })}</No>);
    const next = spend(s, "card", cents, what);
    if (!next) return setMsg(<No>{x("Not enough demo money.")}</No>);
    set(next); setMsg(<Ok>{x("Approved. {what} · {amount}. You earned 1% back in points.", { what, amount: cad(cents) })}</Ok>);
  };
  return (
    <>
      <div className="row" style={{ alignItems: "flex-start", gap: 24 }}>
        <div className={`card${c.frozen ? " frozen" : ""}`}>
          <div className="frost">{x("FROZEN")}</div>
          <div className="top"><span style={{ fontWeight: 700 }}>oenod<span style={{ opacity: 0.7 }}>Pay</span></span><span className="chipico" /></div>
          <div className="pan">•••• •••• •••• 4821</div>
          <div className="bot"><span className="num" style={{ fontSize: 12, opacity: 0.8 }}>A. ASIL · 08/30</span><span className="visa">VISA</span></div>
        </div>
        <div className="list" style={{ flex: 1, minWidth: 220 }}>
          <div className="item"><div className="grow"><div>{x("Freeze card")}</div><div className="sub">{x("Lost it? Freeze it, then unfreeze when you find it.")}</div></div>
            <Switch on={c.frozen} label={x("Freeze card")} onToggle={() => { set(touch({ ...s, card: { ...c, frozen: !c.frozen } }, "card", c.frozen ? x("Card unfrozen") : x("Card frozen"))); setMsg(null); }} /></div>
          <div className="item"><div className="grow"><div>{x("Online payments")}</div><div className="sub">{x("Turn off when you're not shopping online.")}</div></div>
            <Switch on={c.online} label={x("Online payments")} onToggle={() => { set({ ...s, card: { ...c, online: !c.online } }); setMsg(null); }} /></div>
          <div className="item"><div className="grow">
            <div style={{ display: "flex", justifyContent: "space-between" }}><label htmlFor="d-limit">{x("Daily limit")}</label><span className="num">{cad(c.limitCents)}</span></div>
            <input id="d-limit" type="range" min={5000} max={100000} step={5000} value={c.limitCents}
              onChange={(e) => set({ ...s, card: { ...c, limitCents: Number(e.target.value) } })} />
          </div></div>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => pay(475, x("Coffee · Balzac's"), false)}>{x("Tap to pay · Coffee {amount}", { amount: "$4.75" })}</button>
        <button type="button" className="btn ghost" onClick={() => pay(8900, x("Headphones · online"), true)}>{x("Buy online · Headphones {amount}", { amount: "$89" })}</button>
      </div>
      {msg}
    </>
  );
}

const BILLS = [
  { id: "hydro", name: "Toronto Hydro", due: m("Due Nov 14"), cents: 8420 },
  { id: "rogers", name: "Rogers Mobile", due: m("Due Nov 18"), cents: 6500 },
  { id: "insurance", name: m("Car insurance"), due: m("Due Nov 30"), cents: 14250 },
];

function Bills({ s, set }: DemoProps) {
  const x = useX();
  return (
    <>
      <div className="panel" style={{ padding: "4px 18px" }}><div className="list">
        {BILLS.map((b) => (
          <div className="item" key={b.id}>
            <div className="grow"><div>{x(b.name)}</div><div className="sub">{s.bills[b.id] ? x("Paid. Thank you.") : x(b.due)}</div></div>
            <span className="num">{cad(b.cents)}</span>
            {s.bills[b.id]
              ? <span className="chip" aria-pressed="true">{x("Paid")}</span>
              : <button type="button" className="btn" style={{ padding: "8px 16px" }} onClick={() => {
                  const next = spend(s, "bills", b.cents, x("Paid {biller}", { biller: x(b.name) }));
                  if (next) set({ ...next, bills: { ...next.bills, [b.id]: true } });
                }}>{x("Pay")}</button>}
          </div>
        ))}
      </div></div>
      <div className="list"><div className="item"><div className="grow"><div>{x("Autopay for all bills")}</div><div className="sub">{x("We pay each bill 2 days before it's due.")}</div></div>
        <Switch on={s.autopay} label={x("Autopay")} onToggle={() => set(touch({ ...s, autopay: !s.autopay }, "bills", s.autopay ? x("Autopay off") : x("Autopay on")))} /></div></div>
    </>
  );
}

const PLANS = [{ gb: "1 GB", days: 7, cents: 500 }, { gb: "5 GB", days: 30, cents: 1400 }, { gb: "10 GB", days: 30, cents: 2200 }];
const PLACES = [m("Portugal"), m("Japan"), m("Mexico"), m("Egypt"), m("United States"), m("Philippines")];

function Esim({ s, set }: DemoProps) {
  const x = useX();
  const [place, setPlace] = useState("Portugal");
  const [plan, setPlan] = useState(1);
  const p = PLANS[plan]!;
  return (
    <>
      <div className="chips">{PLACES.map((pl) => <button key={pl} type="button" className="chip" aria-pressed={pl === place} onClick={() => setPlace(pl)}>{x(pl)}</button>)}</div>
      <div className="row">
        {PLANS.map((pl, i) => (
          <button key={pl.gb} type="button" className="panel" aria-pressed={i === plan} onClick={() => setPlan(i)}
            style={{ flex: 1, minWidth: 130, textAlign: "left", cursor: "pointer", ...(i === plan ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : {}) }}>
            <div className="big" style={{ fontSize: 24 }}>{pl.gb}</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{x("{days} days · {place}", { days: pl.days, place: x(place) })}</div>
            <div className="num" style={{ marginTop: 8, fontWeight: 600 }}>{cad(pl.cents)}</div>
          </button>
        ))}
      </div>
      {s.esim && <Ok>{x("Your {plan} eSIM is ready. Scan the code in your phone settings and it turns on when you land.", { plan: s.esim })}</Ok>}
      <div className="row"><button type="button" className="btn" onClick={() => {
        const next = spend(s, "esim", p.cents, `eSIM · ${x(place)} ${p.gb}`);
        if (next) set({ ...next, esim: `${x(place)} ${p.gb}` });
      }}>{x("Buy {plan} for {amount}", { plan: p.gb, amount: cad(p.cents) })}</button></div>
    </>
  );
}

const FLIGHTS = [
  { airline: "Air Canada", times: "18:40 → 07:15", cents: 68900 },
  { airline: "TAP Air Portugal", times: "21:55 → 10:20", cents: 61200 },
  { airline: "Air Transat", times: "19:30 → 08:05", cents: 57400 },
];

function Travel({ s, set }: DemoProps) {
  const x = useX();
  const [sel, setSel] = useState(2);
  const [usePoints, setUsePoints] = useState(false);
  const f = FLIGHTS[sel]!;
  const pointsCents = usePoints ? Math.min(s.points, f.cents) : 0; // 100 points = $1
  const pay = f.cents - pointsCents;
  return (
    <>
      <div className="row panel" style={{ justifyContent: "space-between" }}>
        <div><div className="eyebrow">{x("From")}</div><div className="big" style={{ fontSize: 26 }}>YYZ</div><div className="note">{x("Toronto")}</div></div>
        <div style={{ flex: 1, borderTop: "1.5px dashed var(--line)", margin: "0 12px", minWidth: 30 }} />
        <div style={{ textAlign: "right" }}><div className="eyebrow">{x("To")}</div><div className="big" style={{ fontSize: 26 }}>LIS</div><div className="note">{x("Lisbon · Dec 12")}</div></div>
      </div>
      <div className="list">
        {FLIGHTS.map((fl, i) => (
          <button key={fl.airline} type="button" className="item" aria-pressed={i === sel} onClick={() => setSel(i)}
            style={{ border: 0, borderBottom: "1px solid var(--line)", background: i === sel ? "var(--accent-soft)" : "transparent", textAlign: "left", padding: "14px 12px", borderRadius: 10 }}>
            <div className="grow"><div>{fl.airline} · <span className="num">{fl.times}</span></div><div className="sub">{x("Direct")}</div></div>
            <span className="num" style={{ fontWeight: 600 }}>{cad(fl.cents)}</span>
          </button>
        ))}
      </div>
      <div className="list"><div className="item"><div className="grow"><div>{x("Use my reward points")}</div>
        <div className="sub">{x("{points} points = {amount} off. Try other features to earn more.", { points: s.points.toLocaleString(), amount: cad(s.points) })}</div></div>
        <Switch on={usePoints} label={x("Use reward points")} onToggle={() => setUsePoints(!usePoints)} /></div></div>
      {s.flight && <Ok>{x("Booked: {flight}. Your boarding pass is in the app.", { flight: s.flight })}</Ok>}
      <div className="row"><button type="button" className="btn" onClick={() => {
        const next = spend(s, "travel", pay, `Flight · ${f.airline} YYZ→LIS`);
        if (next) set({ ...next, points: next.points - pointsCents, flight: x("{airline}, Toronto to Lisbon", { airline: f.airline }) });
      }}>{x("Book for {amount}", { amount: cad(pay) })}</button></div>
    </>
  );
}

const STOCKS = [
  { t: "SHOP", n: "Shopify", cents: 14230, d: [5, 6, 5, 7, 8, 7, 9, 10] },
  { t: "RY", n: "Royal Bank", cents: 17890, d: [6, 6, 7, 6, 7, 8, 8, 9] },
  { t: "AAPL", n: "Apple", cents: 31840, d: [7, 6, 6, 5, 6, 7, 6, 7] },
  { t: "XEQT", n: "iShares All-Equity ETF", cents: 3610, d: [4, 5, 5, 6, 6, 7, 7, 8] },
];

function Spark({ d }: { d: number[] }) {
  const mx = Math.max(...d), mn = Math.min(...d);
  const pts = d.map((v, i) => `${(i * 90) / (d.length - 1)},${30 - ((v - mn) / (mx - mn || 1)) * 26}`).join(" ");
  return <svg className="spark" viewBox="0 0 90 32" aria-hidden="true"><polyline points={pts} fill="none" stroke="var(--good)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Invest({ s, set }: DemoProps) {
  const x = useX();
  const total = Object.values(s.stocks).reduce((a, b) => a + b, 0);
  return (
    <>
      <div className="panel row" style={{ justifyContent: "space-between" }}>
        <div><div className="eyebrow">{x("Your portfolio")}</div><div className="big num">{cad(total)}</div></div>
        <div className="note">{x("Holdings: {n}", { n: Object.keys(s.stocks).length })}</div>
      </div>
      <div className="list">
        {STOCKS.map((st) => (
          <div className="item" key={st.t}>
            <div className="grow"><div><b>{st.t}</b> <span className="sub">{st.n}</span></div>
              <div className="sub num">{cad(st.cents)} · {s.stocks[st.t] ? x("{amount} owned ({shares} sh)", { amount: cad(s.stocks[st.t]!), shares: (s.stocks[st.t]! / st.cents).toFixed(3) }) : x("Not owned")}</div></div>
            <Spark d={st.d} />
            <button type="button" className="btn" style={{ padding: "8px 14px" }} onClick={() => {
              const next = spend(s, "invest", 2500, x("Bought {ticker} · part of a share", { ticker: st.t }));
              if (next) set({ ...next, stocks: { ...next.stocks, [st.t]: (next.stocks[st.t] ?? 0) + 2500 } });
            }}>{x("Buy {amount}", { amount: "$25" })}</button>
          </div>
        ))}
      </div>
    </>
  );
}

function Lend({ s, set }: DemoProps) {
  const x = useX();
  const [cents, setCents] = useState(10_000);
  const [months, setMonths] = useState(12);
  const loans = Math.max(1, Math.floor(cents / 2500));
  return (
    <>
      <div className="field"><label htmlFor="d-lend">{x("Amount to lend")} · <span className="num">{cad(cents)}</span></label>
        <input id="d-lend" type="range" min={2500} max={100000} step={2500} value={cents} onChange={(e) => setCents(Number(e.target.value))} /></div>
      <div><div className="eyebrow" style={{ marginBottom: 8 }}>{x("Term")}</div><div className="chips">
        {[6, 12, 24].map((m) => <button key={m} type="button" className="chip" aria-pressed={m === months} onClick={() => setMonths(m)}>{x("{n} months · {rate}%", { n: m, rate: LEND_RATES[m] ?? 0 })}</button>)}
      </div></div>
      <div className="row">
        <div className="panel" style={{ flex: 1, minWidth: 150 }}><div className="eyebrow">{x("You earn")}</div><div className="big num" style={{ color: "var(--good)" }}>+{cad(lendEarnings(cents, months))}</div></div>
        <div className="panel" style={{ flex: 1, minWidth: 150 }}><div className="eyebrow">{x("Spread across")}</div><div className="big num">{x("{n} loans", { n: loans })}</div></div>
        <div className="panel" style={{ flex: 1, minWidth: 150 }}><div className="eyebrow">{x("Already lent")}</div><div className="big num">{cad(s.lentCents)}</div></div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => {
          const next = spend(s, "lend", cents, x("Lent across {n} loans · {months} months", { n: loans, months }));
          if (next) set({ ...next, lentCents: next.lentCents + cents });
        }}>{x("Lend {amount}", { amount: cad(cents) })}</button>
        <span className="note">{x("Lending carries risk. Rates shown are examples.")}</span>
      </div>
    </>
  );
}

function Credit({ s, set }: DemoProps) {
  const x = useX();
  const c = s.credit;
  const score = creditScore(c);
  const a = Math.PI * (1 - (score - 300) / 600);
  const gx = 150 + 110 * Math.cos(a), gy = 140 - 110 * Math.sin(a);
  const band = score >= 760 ? x("Excellent") : score >= 700 ? x("Very good") : score >= 650 ? x("Good") : x("Fair");
  const habits: [keyof typeof c, string, string][] = [
    ["onTime", x("Pay everything on time"), x("Payment history matters most.")],
    ["lowUse", x("Keep card use under 30%"), x("Lower use shows you don't rely on credit.")],
    ["builder", x("Open a credit builder"), x("Small monthly savings reported to the bureaus.")],
  ];
  return (
    <div className="row" style={{ gap: 24, alignItems: "center" }}>
      <div className="gauge" style={{ flex: 1, minWidth: 240 }}>
        <svg viewBox="0 0 300 160" role="img" aria-label={x("Score {score} of 900", { score })}>
          <path d="M40 140 A110 110 0 0 1 260 140" fill="none" stroke="var(--sunk)" strokeWidth="18" strokeLinecap="round" />
          <path d={`M40 140 A110 110 0 0 1 ${gx.toFixed(1)} ${gy.toFixed(1)}`} fill="none" stroke="var(--accent)" strokeWidth="18" strokeLinecap="round" />
        </svg>
        <div className="val"><div className="big num" style={{ fontSize: 46 }}>{score}</div><div className="note">{band} · {x("scale 300 to 900")}</div></div>
      </div>
      <div className="list" style={{ flex: 1, minWidth: 240 }}>
        {habits.map(([k, t, sub]) => (
          <div className="item" key={k}><div className="grow"><div>{t}</div><div className="sub">{sub}</div></div>
            <Switch on={c[k]} label={t} onToggle={() => set(touch({ ...s, credit: { ...c, [k]: !c[k] } }, "credit"))} /></div>
        ))}
      </div>
    </div>
  );
}

export const DEMOS: Record<FeatureId, { title: string; body: string; View: (p: DemoProps) => React.ReactNode }> = {
  send: { title: m("Send money abroad"), body: m("Pick a country and see exactly how your family gets paid. The fee and rate are shown before you send."), View: Send },
  bills: { title: m("Pay your bills"), body: m("All your Canadian billers in one list. Pay now, or turn on autopay and stop thinking about it."), View: Bills },
  card: { title: m("Your Visa debit card"), body: m("Freeze it, block online payments or set a limit, instantly. Then try paying and see what happens."), View: Card },
  esim: { title: m("Travel eSIM"), body: m("Land with data already working. Pick where you're going, choose a plan, scan the code."), View: Esim },
  travel: { title: m("Flights & hotels"), body: m("Book trips inside the app and pay with your balance, your reward points, or both."), View: Travel },
  invest: { title: m("Stocks & ETFs"), body: m("Buy Canadian and US stocks from $1 with part shares. Here every buy is $25."), View: Invest },
  lend: { title: m("oenodPay Lend"), body: m("Your amount is split across many small, checked loans to other members, and you earn the interest they pay."), View: Lend },
  credit: { title: m("Credit score"), body: m("Your Canadian credit score for free. Checking never lowers it. Flip the habits and watch what moves it."), View: Credit },
};
