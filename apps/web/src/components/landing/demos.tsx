"use client";

import { useState } from "react";
import { CORRIDORS, formatMoney, quoteTransfer } from "@oenodpay/shared";
import { LEND_RATES, cad, creditScore, lendEarnings, spend, touch, type DemoState, type FeatureId } from "./demo-state";

export interface DemoProps { s: DemoState; set: (next: DemoState) => void }

const Ok = ({ children }: { children: React.ReactNode }) => <div className="result ok" role="status">{children}</div>;
const No = ({ children }: { children: React.ReactNode }) => <div className="result no" role="status">{children}</div>;

function Switch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return <button type="button" className="switch" role="switch" aria-checked={on} aria-label={label} onClick={onToggle} />;
}

/* Send abroad: uses the same corridors and quote maths as the real API. */
function Send({ s, set }: DemoProps) {
  const [country, setCountry] = useState("PH");
  const corridor = CORRIDORS.find((c) => c.countryCode === country) ?? CORRIDORS[0]!;
  const [methodId, setMethodId] = useState(corridor.methods[0]!.id);
  const method = corridor.methods.find((m) => m.id === methodId) ?? corridor.methods[0]!;
  const [amount, setAmount] = useState(100);
  const [msg, setMsg] = useState<React.ReactNode>(null);
  const cents = Math.round(Math.min(3000, Math.max(1, amount || 0)) * 100);
  const quote = quoteTransfer(corridor.countryCode, method.id, cents);
  const total = cents + quote.fee.minor;
  return (
    <>
      <div className="row">
        <div className="field"><label htmlFor="d-country">Country</label>
          <select id="d-country" className="input" value={country} onChange={(e) => {
            const next = CORRIDORS.find((c) => c.countryCode === e.target.value)!;
            setCountry(next.countryCode); setMethodId(next.methods[0]!.id); setMsg(null);
          }}>
            {CORRIDORS.map((c) => <option key={c.countryCode} value={c.countryCode}>{c.countryName}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="d-amount">You send (CAD)</label>
          <input id="d-amount" className="input num" type="number" min={1} max={3000} value={amount}
            onChange={(e) => { setAmount(Number(e.target.value)); setMsg(null); }} />
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>How they receive it in {corridor.countryName}</div>
        <div className="chips">
          {corridor.methods.map((m) => (
            <button key={m.id} type="button" className="chip" aria-pressed={m.id === method.id} onClick={() => setMethodId(m.id)}>{m.name}</button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="kv"><span>Rate</span><span className="num">1 CAD = {quote.rate} {corridor.currency}</span></div>
        <div className="kv"><span>Fee</span><span className="num">{formatMoney(quote.fee)}</span></div>
        <div className="kv"><span>Arrives</span><span>{quote.eta}</span></div>
        <div className="kv" style={{ borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 12 }}>
          <span>They get</span><span className="num big" style={{ fontSize: 24 }}>{formatMoney(quote.receive)}</span>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => {
          const next = spend(s, "send", total, `Sent to Maria · ${corridor.countryName} · ${method.name}`);
          if (next) { set(next); setMsg(<Ok>Sent. Maria gets {formatMoney(quote.receive)} ({quote.eta.toLowerCase()}). +50 points.</Ok>); }
          else setMsg(<No>Not enough demo money. Lower the amount or start over.</No>);
        }}>Send {cad(total)}</button>
      </div>
      {msg}
    </>
  );
}

function Card({ s, set }: DemoProps) {
  const [msg, setMsg] = useState<React.ReactNode>(null);
  const c = s.card;
  const pay = (cents: number, what: string, online: boolean) => {
    if (c.frozen) return setMsg(<No>Declined: your card is frozen. Unfreeze it above to pay.</No>);
    if (online && !c.online) return setMsg(<No>Declined: online payments are turned off.</No>);
    if (cents > c.limitCents) return setMsg(<No>Declined: over your daily limit of {cad(c.limitCents)}.</No>);
    const next = spend(s, "card", cents, what);
    if (!next) return setMsg(<No>Not enough demo money.</No>);
    set(next); setMsg(<Ok>Approved. {what} · {cad(cents)}. You earned 1% back in points.</Ok>);
  };
  return (
    <>
      <div className="row" style={{ alignItems: "flex-start", gap: 24 }}>
        <div className={`card${c.frozen ? " frozen" : ""}`}>
          <div className="frost">FROZEN</div>
          <div className="top"><span style={{ fontWeight: 700 }}>oenod<span style={{ opacity: 0.7 }}>Pay</span></span><span className="chipico" /></div>
          <div className="pan">•••• •••• •••• 4821</div>
          <div className="bot"><span className="num" style={{ fontSize: 12, opacity: 0.8 }}>A. ASIL · 08/30</span><span className="visa">VISA</span></div>
        </div>
        <div className="list" style={{ flex: 1, minWidth: 220 }}>
          <div className="item"><div className="grow"><div>Freeze card</div><div className="sub">Lost it? Freeze it, then unfreeze when you find it.</div></div>
            <Switch on={c.frozen} label="Freeze card" onToggle={() => { set(touch({ ...s, card: { ...c, frozen: !c.frozen } }, "card", c.frozen ? "Card unfrozen" : "Card frozen")); setMsg(null); }} /></div>
          <div className="item"><div className="grow"><div>Online payments</div><div className="sub">Turn off when you&apos;re not shopping online.</div></div>
            <Switch on={c.online} label="Online payments" onToggle={() => { set({ ...s, card: { ...c, online: !c.online } }); setMsg(null); }} /></div>
          <div className="item"><div className="grow">
            <div style={{ display: "flex", justifyContent: "space-between" }}><label htmlFor="d-limit">Daily limit</label><span className="num">{cad(c.limitCents)}</span></div>
            <input id="d-limit" type="range" min={5000} max={100000} step={5000} value={c.limitCents}
              onChange={(e) => set({ ...s, card: { ...c, limitCents: Number(e.target.value) } })} />
          </div></div>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => pay(475, "Coffee · Balzac's", false)}>Tap to pay · Coffee $4.75</button>
        <button type="button" className="btn ghost" onClick={() => pay(8900, "Headphones · online", true)}>Buy online · Headphones $89</button>
      </div>
      {msg}
    </>
  );
}

const BILLS = [
  { id: "hydro", name: "Toronto Hydro", due: "Due Nov 14", cents: 8420 },
  { id: "rogers", name: "Rogers Mobile", due: "Due Nov 18", cents: 6500 },
  { id: "insurance", name: "Car insurance", due: "Due Nov 30", cents: 14250 },
];

function Bills({ s, set }: DemoProps) {
  return (
    <>
      <div className="panel" style={{ padding: "4px 18px" }}><div className="list">
        {BILLS.map((b) => (
          <div className="item" key={b.id}>
            <div className="grow"><div>{b.name}</div><div className="sub">{s.bills[b.id] ? "Paid. Thank you." : b.due}</div></div>
            <span className="num">{cad(b.cents)}</span>
            {s.bills[b.id]
              ? <span className="chip" aria-pressed="true">Paid</span>
              : <button type="button" className="btn" style={{ padding: "8px 16px" }} onClick={() => {
                  const next = spend(s, "bills", b.cents, `Paid ${b.name}`);
                  if (next) set({ ...next, bills: { ...next.bills, [b.id]: true } });
                }}>Pay</button>}
          </div>
        ))}
      </div></div>
      <div className="list"><div className="item"><div className="grow"><div>Autopay for all bills</div><div className="sub">We pay each bill 2 days before it&apos;s due.</div></div>
        <Switch on={s.autopay} label="Autopay" onToggle={() => set(touch({ ...s, autopay: !s.autopay }, "bills", s.autopay ? "Autopay off" : "Autopay on"))} /></div></div>
    </>
  );
}

const PLANS = [{ gb: "1 GB", days: "7 days", cents: 500 }, { gb: "5 GB", days: "30 days", cents: 1400 }, { gb: "10 GB", days: "30 days", cents: 2200 }];
const PLACES = ["Portugal", "Japan", "Mexico", "Egypt", "United States", "Philippines"];

function Esim({ s, set }: DemoProps) {
  const [place, setPlace] = useState("Portugal");
  const [plan, setPlan] = useState(1);
  const p = PLANS[plan]!;
  return (
    <>
      <div className="chips">{PLACES.map((x) => <button key={x} type="button" className="chip" aria-pressed={x === place} onClick={() => setPlace(x)}>{x}</button>)}</div>
      <div className="row">
        {PLANS.map((pl, i) => (
          <button key={pl.gb} type="button" className="panel" aria-pressed={i === plan} onClick={() => setPlan(i)}
            style={{ flex: 1, minWidth: 130, textAlign: "left", cursor: "pointer", ...(i === plan ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : {}) }}>
            <div className="big" style={{ fontSize: 24 }}>{pl.gb}</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{pl.days} in {place}</div>
            <div className="num" style={{ marginTop: 8, fontWeight: 600 }}>{cad(pl.cents)}</div>
          </button>
        ))}
      </div>
      {s.esim && <Ok>Your {s.esim} eSIM is ready. Scan the code in your phone settings and it turns on when you land.</Ok>}
      <div className="row"><button type="button" className="btn" onClick={() => {
        const next = spend(s, "esim", p.cents, `eSIM · ${place} ${p.gb}`);
        if (next) set({ ...next, esim: `${place} ${p.gb}` });
      }}>Buy {p.gb} for {cad(p.cents)}</button></div>
    </>
  );
}

const FLIGHTS = [
  { airline: "Air Canada", times: "18:40 → 07:15", cents: 68900 },
  { airline: "TAP Air Portugal", times: "21:55 → 10:20", cents: 61200 },
  { airline: "Air Transat", times: "19:30 → 08:05", cents: 57400 },
];

function Travel({ s, set }: DemoProps) {
  const [sel, setSel] = useState(2);
  const [usePoints, setUsePoints] = useState(false);
  const f = FLIGHTS[sel]!;
  const pointsCents = usePoints ? Math.min(s.points, f.cents) : 0; // 100 points = $1
  const pay = f.cents - pointsCents;
  return (
    <>
      <div className="row panel" style={{ justifyContent: "space-between" }}>
        <div><div className="eyebrow">From</div><div className="big" style={{ fontSize: 26 }}>YYZ</div><div className="note">Toronto</div></div>
        <div style={{ flex: 1, borderTop: "1.5px dashed var(--line)", margin: "0 12px", minWidth: 30 }} />
        <div style={{ textAlign: "right" }}><div className="eyebrow">To</div><div className="big" style={{ fontSize: 26 }}>LIS</div><div className="note">Lisbon · Dec 12</div></div>
      </div>
      <div className="list">
        {FLIGHTS.map((x, i) => (
          <button key={x.airline} type="button" className="item" aria-pressed={i === sel} onClick={() => setSel(i)}
            style={{ border: 0, borderBottom: "1px solid var(--line)", background: i === sel ? "var(--accent-soft)" : "transparent", textAlign: "left", padding: "14px 12px", borderRadius: 10 }}>
            <div className="grow"><div>{x.airline} · <span className="num">{x.times}</span></div><div className="sub">Direct</div></div>
            <span className="num" style={{ fontWeight: 600 }}>{cad(x.cents)}</span>
          </button>
        ))}
      </div>
      <div className="list"><div className="item"><div className="grow"><div>Use my reward points</div>
        <div className="sub"><span className="num">{s.points.toLocaleString()}</span> points = {cad(s.points)} off. Try other features to earn more.</div></div>
        <Switch on={usePoints} label="Use reward points" onToggle={() => setUsePoints(!usePoints)} /></div></div>
      {s.flight && <Ok>Booked: {s.flight}. Your boarding pass is in the app.</Ok>}
      <div className="row"><button type="button" className="btn" onClick={() => {
        const next = spend(s, "travel", pay, `Flight · ${f.airline} YYZ→LIS`);
        if (next) set({ ...next, points: next.points - pointsCents, flight: `${f.airline}, Toronto to Lisbon` });
      }}>Book for {cad(pay)}</button></div>
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
  const total = Object.values(s.stocks).reduce((a, b) => a + b, 0);
  return (
    <>
      <div className="panel row" style={{ justifyContent: "space-between" }}>
        <div><div className="eyebrow">Your portfolio</div><div className="big num">{cad(total)}</div></div>
        <div className="note">{Object.keys(s.stocks).length || "No"} holdings</div>
      </div>
      <div className="list">
        {STOCKS.map((x) => (
          <div className="item" key={x.t}>
            <div className="grow"><div><b>{x.t}</b> <span className="sub">{x.n}</span></div>
              <div className="sub num">{cad(x.cents)} · {s.stocks[x.t] ? `${cad(s.stocks[x.t]!)} owned (${(s.stocks[x.t]! / x.cents).toFixed(3)} sh)` : "Not owned"}</div></div>
            <Spark d={x.d} />
            <button type="button" className="btn" style={{ padding: "8px 14px" }} onClick={() => {
              const next = spend(s, "invest", 2500, `Bought ${x.t} · part of a share`);
              if (next) set({ ...next, stocks: { ...next.stocks, [x.t]: (next.stocks[x.t] ?? 0) + 2500 } });
            }}>Buy $25</button>
          </div>
        ))}
      </div>
    </>
  );
}

function Lend({ s, set }: DemoProps) {
  const [cents, setCents] = useState(10_000);
  const [months, setMonths] = useState(12);
  const loans = Math.max(1, Math.floor(cents / 2500));
  return (
    <>
      <div className="field"><label htmlFor="d-lend">Amount to lend · <span className="num">{cad(cents)}</span></label>
        <input id="d-lend" type="range" min={2500} max={100000} step={2500} value={cents} onChange={(e) => setCents(Number(e.target.value))} /></div>
      <div><div className="eyebrow" style={{ marginBottom: 8 }}>Term</div><div className="chips">
        {[6, 12, 24].map((m) => <button key={m} type="button" className="chip" aria-pressed={m === months} onClick={() => setMonths(m)}>{m} months · {LEND_RATES[m]}%</button>)}
      </div></div>
      <div className="row">
        <div className="panel" style={{ flex: 1, minWidth: 150 }}><div className="eyebrow">You earn</div><div className="big num" style={{ color: "var(--good)" }}>+{cad(lendEarnings(cents, months))}</div></div>
        <div className="panel" style={{ flex: 1, minWidth: 150 }}><div className="eyebrow">Spread across</div><div className="big num">{loans} loans</div></div>
        <div className="panel" style={{ flex: 1, minWidth: 150 }}><div className="eyebrow">Already lent</div><div className="big num">{cad(s.lentCents)}</div></div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => {
          const next = spend(s, "lend", cents, `Lent across ${loans} loans · ${months} months`);
          if (next) set({ ...next, lentCents: next.lentCents + cents });
        }}>Lend {cad(cents)}</button>
        <span className="note">Lending carries risk. Rates shown are examples.</span>
      </div>
    </>
  );
}

function Credit({ s, set }: DemoProps) {
  const c = s.credit;
  const score = creditScore(c);
  const a = Math.PI * (1 - (score - 300) / 600);
  const x = 150 + 110 * Math.cos(a), y = 140 - 110 * Math.sin(a);
  const band = score >= 760 ? "Excellent" : score >= 700 ? "Very good" : score >= 650 ? "Good" : "Fair";
  const habits: [keyof typeof c, string, string][] = [
    ["onTime", "Pay everything on time", "Payment history matters most."],
    ["lowUse", "Keep card use under 30%", "Lower use shows you don't rely on credit."],
    ["builder", "Open a credit builder", "Small monthly savings reported to the bureaus."],
  ];
  return (
    <div className="row" style={{ gap: 24, alignItems: "center" }}>
      <div className="gauge" style={{ flex: 1, minWidth: 240 }}>
        <svg viewBox="0 0 300 160" role="img" aria-label={`Score ${score} of 900`}>
          <path d="M40 140 A110 110 0 0 1 260 140" fill="none" stroke="var(--sunk)" strokeWidth="18" strokeLinecap="round" />
          <path d={`M40 140 A110 110 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" stroke="var(--accent)" strokeWidth="18" strokeLinecap="round" />
        </svg>
        <div className="val"><div className="big num" style={{ fontSize: 46 }}>{score}</div><div className="note">{band} · scale 300 to 900</div></div>
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
  send: { title: "Send money abroad", body: "Pick a country and see exactly how your family gets paid. The fee and rate are shown before you send.", View: Send },
  bills: { title: "Pay your bills", body: "All your Canadian billers in one list. Pay now, or turn on autopay and stop thinking about it.", View: Bills },
  card: { title: "Your Visa debit card", body: "Freeze it, block online payments or set a limit, instantly. Then try paying and see what happens.", View: Card },
  esim: { title: "Travel eSIM", body: "Land with data already working. Pick where you're going, choose a plan, scan the code.", View: Esim },
  travel: { title: "Flights & hotels", body: "Book trips inside the app and pay with your balance, your reward points, or both.", View: Travel },
  invest: { title: "Stocks & ETFs", body: "Buy Canadian and US stocks from $1 with part shares. Here every buy is $25.", View: Invest },
  lend: { title: "oenodPay Lend", body: "Your amount is split across many small, checked loans to other members, and you earn the interest they pay.", View: Lend },
  credit: { title: "Credit score", body: "Your Canadian credit score for free. Checking never lowers it. Flip the habits and watch what moves it.", View: Credit },
};
