"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEMOS } from "./demos";
import { FEATURES, ORDER, PAGE, cad, initialState, type FeatureId } from "./demo-state";
import { DemoWords, useX, type X } from "./demo-text";

interface Tile { id: FeatureId; span: 4 | 5 | 7; cat: string; title: string; body: string; dark?: boolean; preview: (x: X) => React.ReactNode }


const TILES: Tile[] = [
  { id: "send", span: 7, cat: "Move money", title: "Send money abroad", body: "Seven countries. See the rate and fee first, then pick wallet, bank or cash pickup.",
    preview: (x) => <div className="q"><div className="qrow"><span>{x("You send")}</span><b className="num">500.00 CAD</b></div><div className="qmid"><span className="num">1 CAD = 41.5 PHP</span><span className="num">{x("Fee {amount}", { amount: "$2.99" })}</span></div><div className="qrow"><span>{x("Maria gets")}</span><b className="num">20,750.00 PHP</b></div><div className="qchips"><span className="on">{x("Mobile wallet")}</span><span>{x("Bank")}</span><span>{x("Cash pickup")}</span></div></div> },
  { id: "card", span: 5, cat: "Spend", title: "Visa debit card", body: "Freeze it, set limits and earn 1% back in points.", dark: true,
    preview: (x) => <div className="mcard"><div className="r"><b>oenod<span>Pay</span></b><i /></div><div className="num pan">•••• 4821</div><div className="r"><span className="frz">● {x("Active")}</span><em>VISA</em></div></div> },
  { id: "bills", span: 4, cat: "Move money", title: "Pay bills", body: "Every Canadian biller in one list, with autopay.",
    preview: (x) => <div className="rows"><div><span>Toronto Hydro</span><b className="ok">{x("Paid")}</b></div><div><span>Rogers Mobile</span><b>{x("Nov 18")}</b></div><div><span>{x("Car insurance")}</span><b>{x("Nov 30")}</b></div></div> },
  { id: "esim", span: 4, cat: "Travel", title: "Travel eSIM", body: "Data that works the moment you land. From $5.",
    preview: (x) => <div className="esim"><div className="bars"><i /><i /><i /><i /></div><div><b>{x("Portugal")} · 5 GB</b><span>{x("{days} days · {amount}", { days: 30, amount: "$14" })}</span></div></div> },
  { id: "travel", span: 4, cat: "Travel", title: "Flights & hotels", body: "Book trips in the app. Pay with points.",
    preview: (x) => <div className="fly"><div><b>YYZ</b><span>{x("Toronto")}</span></div><div className="line" /><div style={{ textAlign: "right" }}><b>LIS</b><span>{x("Lisbon")}</span></div></div> },
  { id: "invest", span: 4, cat: "Grow", title: "Stocks & ETFs", body: "Canadian and US stocks from $1.",
    preview: () => <div className="stk"><div><b>SHOP</b><span className="up num">+4.2%</span></div><svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 48 L25 44 L50 46 L75 34 L100 38 L125 26 L150 28 L175 14 L200 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /></svg></div> },
  { id: "lend", span: 4, cat: "Grow", title: "oenodPay Lend", body: "Fund small loans to members and earn interest.", dark: true,
    preview: (x) => <div className="lendv"><b className="num">+$7.20</b><span>{x("a year on {amount} · {n} months", { amount: "$100", n: 12 })}</span><div className="lb"><i style={{ width: "25%" }} /><i style={{ width: "25%" }} /><i style={{ width: "25%" }} /><i style={{ width: "25%" }} /></div><span>{x("Spread across {n} loans", { n: 4 })}</span></div> },
  { id: "credit", span: 4, cat: "Grow", title: "Credit score", body: "Free score. Checking never lowers it.",
    preview: (x) => <div className="gv"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" /><path d="M10 62 A50 50 0 0 1 96 27" fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" /></svg><b className="num">762</b><span>{x("Very good")}</span></div> },
];

/** The features grid plus the "Try it now" demos. Demos use pretend money and never call the API. */
export interface PlayText { try: string; more: string; tried: string; tiles?: Partial<Record<FeatureId, { cat: string; title: string; body: string }>> }

/** `words` maps English demo text to the reader's language; `base` is the language's address prefix, such as /fr. */
export function Playground({ t, words = {}, base = "" }: { t?: PlayText; words?: Record<string, string>; base?: string }) {
  return <DemoWords value={words}><Inner t={t} base={base} /></DemoWords>;
}

function Inner({ t, base }: { t?: PlayText; base: string }) {
  const x = useX();
  const [s, set] = useState(initialState);
  const [open, setOpen] = useState<FeatureId | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dlg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) closeBtn.current?.focus();
    else opener.current?.focus();
  }, [open]);

  const go = (id: FeatureId) => { setOpen(id); dlg.current?.scrollTo({ top: 0 }); };
  const i = open ? ORDER.indexOf(open) : -1;
  const tried = Object.keys(s.tried).length;
  const demo = open ? DEMOS[open] : null;

  return (
    <>
      <div className="bento">
        {TILES.map((base) => { const tx = t?.tiles?.[base.id]; const tile = tx ? { ...base, ...tx } : base; return (
          <article key={tile.id} className={`tile s${tile.span}${tile.dark ? " dark" : ""}`}>
            <div className="vis">{tile.preview(x)}</div>
            <div className="tx">
              <span className="cat">{tile.cat}</span>
              <h3>{tile.title}</h3>
              <p>{tile.body}</p>
              <div className="tfoot">
                <button type="button" className="try" onClick={(e) => { opener.current = e.currentTarget; setOpen(tile.id); }}>
                  {t?.try ?? "Try it now"} <span aria-hidden="true">→</span>
                </button>
                <Link href={`${base}/features/${PAGE[tile.id]}`} className="tmore">{t?.more ?? "Learn more"}</Link>
                <span className="tried">{s.tried[tile.id] ? (t?.tried ?? "✓ Tried") : ""}</span>
              </div>
            </div>
          </article>
        ); })}
      </div>

      {open && demo && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="demo-title" ref={dlg}>
            <div>
              <article className="stage">
                <header>
                  <span className="eyebrow">{x("Demo · {n} of 8 · pretend money", { n: i + 1 })}</span>
                  <h2 id="demo-title">{x(demo.title)}</h2>
                  <p>{x(demo.body)}</p>
                  <div className="hint"><b>{x("Try this")}</b>{x(FEATURES[open].hint)}</div>
                </header>
                <div className="demo" key={open}><demo.View s={s} set={set} /></div>
              </article>
              <div className="dnav">
                <button type="button" className="btn ghost" disabled={i === 0} onClick={() => go(ORDER[i - 1]!)}>{x("← Previous")}</button>
                {i < 7
                  ? <button type="button" className="btn" onClick={() => go(ORDER[i + 1]!)}>{x("Next: {name} →", { name: x(FEATURES[ORDER[i + 1]!].name) })}</button>
                  : <button type="button" className="btn" onClick={() => setOpen(null)}>{x("Done")}</button>}
              </div>
            </div>
            <aside className="side">
              <button type="button" className="close" ref={closeBtn} aria-label={x("Close demo")} onClick={() => setOpen(null)}>✕</button>
              <div className="mini">
                <span className="eyebrow">{x("Demo balance")}</span>
                <div className="big num">{cad(s.balance)}</div>
                <div className="note">{x("{points} reward points", { points: s.points.toLocaleString() })}</div>
                <div className="prog">
                  <div className="prog-top"><span>{x("Features tried")}</span><span className="num">{x("{n} of 8", { n: tried })}</span></div>
                  <div className="prog-bar"><i style={{ width: `${(tried / 8) * 100}%` }} /></div>
                </div>
              </div>
              <div className="box">
                <span className="eyebrow">{x("Recent activity")}</span>
                <div className="feed" style={{ marginTop: 8 }}>
                  {s.activity.length === 0
                    ? <div className="empty">{x("What you do shows up here.")}</div>
                    : s.activity.map((a) => <div className="f" key={a.id}><span className="grow">{a.text}</span><span className="amt num">{a.cents ? cad(a.cents) : ""}</span></div>)}
                </div>
              </div>
              <button type="button" className="btn ghost" onClick={() => set(initialState())}>{x("Start over")}</button>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
