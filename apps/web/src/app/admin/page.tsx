import Link from "next/link";
import { AdminHead } from "./head";

// Every number on this page is sample data for the design preview.
const KPIS = [
  { l: "Customers", v: "12,480", d: "+312 this week", up: true },
  { l: "ID verified", v: "9,912", d: "79% of customers" },
  { l: "Money moved today", v: "$1.84M", d: "6,204 transfers" },
  { l: "Customer funds held", v: "$6.20M", d: "Safeguarded · matched 06:00" },
  { l: "Open alerts", v: "23", d: "4 high risk" },
];

// 14 days of [sent abroad, wallet and bank, card and bills], in $ thousands.
const DAYS = [
  [620, 410, 300], [580, 440, 310], [700, 460, 330], [660, 420, 350], [740, 480, 340], [520, 360, 280], [480, 330, 260],
  [690, 470, 360], [720, 500, 370], [760, 490, 380], [800, 520, 390], [780, 530, 400], [610, 400, 300], [840, 560, 440],
];
const COLORS = ["#2252D1", "#7C9BFF", "#C9D5FA"];

const QUEUES = [
  { l: "ID checks", n: 41, s: "Oldest waiting 3 h", href: "/admin/customers", tone: "p-amber" },
  { l: "Transaction alerts", n: 23, s: "4 high risk", href: "/admin/alerts", tone: "p-red" },
  { l: "Card disputes", n: 7, s: "2 due this week", tone: "p-blue" },
  { l: "Failed payouts", n: 5, s: "All Nigeria · partner slow", tone: "p-amber" },
  { l: "Support tickets", n: 58, s: "Median first reply 14 min", tone: "p-grey" },
];

const REPORTS = [
  { l: "Large cash transaction reports", s: "Due within 15 days", v: "0 due", tone: "p-green" },
  { l: "Electronic funds transfer reports", s: "International $10,000+, due within 5 working days", v: "6 due Nov 13", tone: "p-amber" },
  { l: "Suspicious transaction reports", s: "File as soon as practicable", v: "1 draft to approve", tone: "p-red" },
  { l: "Ledger and bank match", s: "Customer funds vs. safeguarding account", v: "Matched · $0.00 gap", tone: "p-green" },
];

const COUNTRIES = [
  ["Philippines", 34], ["India", 22], ["Pakistan", 14], ["Nigeria", 11], ["Mexico", 9], ["Egypt and UK", 10],
] as const;

const PARTNERS = [
  ["Bank account partner (Canada)", "Working"], ["Card issuing partner", "Working"], ["ID check provider", "Working"],
  ["International payout network", "Slow · Nigeria"], ["Bill payment network", "Working"], ["Fraud scoring", "Working"],
] as const;

const ACTIONS = [
  ["09:42", "Compliance analyst", "Approved ID check for customer C-10482"],
  ["09:31", "Support agent", "Reset card PIN attempts for customer C-08817"],
  ["09:05", "Finance", "Confirmed daily safeguarding match"],
  ["08:50", "Super admin", "Changed daily send limit for new accounts to $3,000"],
];

export default function AdminOverview() {
  const max = Math.max(...DAYS.map((d) => d[0] + d[1] + d[2]));
  return (
    <>
      <AdminHead title="Overview" sub="Saturday, November 8 · Canada">
        <button className="btn" type="button">Export</button>
      </AdminHead>

      <section className="grid g5" aria-label="Key numbers">
        {KPIS.map((k) => (
          <div key={k.l} className="adm-card kpi">
            <span className="lbl">{k.l}</span>
            <span className="v num">{k.v}</span>
            <span className={`d${k.up ? " up" : ""}`}>{k.d}</span>
          </div>
        ))}
      </section>

      <section className="grid g2">
        <div className="adm-card">
          <div className="adm-head" style={{ marginBottom: 12 }}>
            <div><h2>Money moved · last 14 days</h2><p className="sub">In Canadian dollars, thousands</p></div>
            <div className="legend">
              {["Sent abroad", "Wallet and bank", "Card and bills"].map((s, i) => <span key={s}><i style={{ background: COLORS[i] }} />{s}</span>)}
            </div>
          </div>
          <svg viewBox="0 0 700 240" width="100%" role="img" aria-label="Stacked bar chart of money moved each day, sample data">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1="0" x2="700" y1={220 - f * 200} y2={220 - f * 200} stroke="#EEF1F6" />
            ))}
            {DAYS.map((d, i) => {
              let y = 220;
              return (
                <g key={i}>
                  {d.map((v, j) => {
                    const h = (v / max) * 200;
                    y -= h;
                    return <rect key={j} x={i * 50 + 10} y={y} width="30" height={Math.max(h - 2, 0)} rx="3" fill={COLORS[j]} />;
                  })}
                  <text x={i * 50 + 25} y="236" textAnchor="middle" fontSize="11" fill="#5A6480">{`${i + 26 > 31 ? i - 5 : i + 26}`}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="adm-card">
          <h2>Work queues</h2>
          <p className="sub">Oldest first. Each item needs a named reviewer.</p>
          {QUEUES.map((q) => (
            <div key={q.l} className="row">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {q.href ? <Link href={q.href} style={{ fontWeight: 600 }}>{q.l}</Link> : <b style={{ fontWeight: 600 }}>{q.l}</b>}
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>{q.s}</span>
              </div>
              <span className={`pill num ${q.tone}`}>{q.n}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid g2">
        <div className="adm-card">
          <h2>FINTRAC reporting</h2>
          <p className="sub">Deadlines from Canada&apos;s money services business rules. Draft until a compliance officer files.</p>
          {REPORTS.map((r) => (
            <div key={r.l} className="row">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <b style={{ fontWeight: 600 }}>{r.l}</b>
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>{r.s}</span>
              </div>
              <span className={`pill ${r.tone}`}>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="adm-card">
          <h2>Sent abroad by country</h2>
          <p className="sub">Share of today&apos;s international transfers</p>
          <div className="steps" style={{ gap: 12 }}>
            {COUNTRIES.map(([c, p]) => (
              <div key={c} style={{ display: "grid", gridTemplateColumns: "110px 1fr 40px", gap: 10, alignItems: "center" }}>
                <span>{c}</span><div className="bar"><i style={{ width: `${p * 2.5}%` }} /></div><span className="num" style={{ textAlign: "right" }}>{p}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid g3">
        <div className="adm-card">
          <h2>Partner connections</h2>
          <p className="sub">Live health checks every minute</p>
          {PARTNERS.map(([p, s]) => (
            <div key={p} className="row"><span>{p}</span><span className={`pill ${s === "Working" ? "p-green" : "p-amber"}`}>{s}</span></div>
          ))}
        </div>
        <div className="adm-card">
          <h2>Emergency controls</h2>
          <p className="sub">Each one needs a second super admin to approve within 10 minutes, and is written to the audit log.</p>
          <div className="steps" style={{ marginTop: 8 }}>
            <button className="btn dng" type="button">Pause all outgoing transfers</button>
            <button className="btn dng" type="button">Pause new card payments</button>
            <button className="btn dng" type="button">Sign out every customer</button>
          </div>
        </div>
        <div className="adm-card">
          <h2>Latest staff actions</h2>
          <p className="sub"><Link href="/admin/team">Full audit log</Link></p>
          {ACTIONS.map(([t, who, what]) => (
            <div key={t} className="row" style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
              <span className="num" style={{ color: "var(--muted)", minWidth: 44 }}>{t}</span>
              <div><b style={{ fontWeight: 600 }}>{who}</b><div style={{ color: "var(--muted)", fontSize: 13 }}>{what}</div></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
