"use client";
import { useState } from "react";

// Sample alerts for the design preview. Customers are invented.
const ALERTS = [
  { id: "AL-2291", risk: "High", rule: "Many transfers just under $10,000", who: "C-07731 · J. Morales", amount: "$29,400", when: "Today 08:14", why: "Three transfers of $9,800 to the same person in Mexico within 26 hours. Looks like splitting to stay under the reporting amount.", tx: [["Nov 7 06:10", "$9,800", "Mexico · bank"], ["Nov 7 18:22", "$9,800", "Mexico · bank"], ["Nov 8 08:14", "$9,800", "Mexico · bank"]] },
  { id: "AL-2290", risk: "High", rule: "New device and new payee, large amount", who: "C-11204 · P. Reyes", amount: "$4,900", when: "Today 07:51", why: "Signed in from a new phone 6 minutes before sending to a first-time payee. Could be account takeover.", tx: [["Nov 8 07:45", "Sign-in", "New iPhone · Winnipeg"], ["Nov 8 07:51", "$4,900", "Philippines · e-wallet"]] },
  { id: "AL-2288", risk: "Medium", rule: "Card used in two countries in one hour", who: "C-05529 · L. Chen", amount: "$612", when: "Today 06:30", why: "Card payment in Toronto, then an online payment in Singapore 40 minutes later.", tx: [["Nov 8 05:50", "$48", "Toronto · grocery"], ["Nov 8 06:30", "$564", "Singapore · online"]] },
  { id: "AL-2285", risk: "Medium", rule: "Income doesn't match activity", who: "C-09310 · K. Adeyemi", amount: "$18,200", when: "Yesterday", why: "Monthly money in is 4 times what the customer said they earn when they signed up.", tx: [["Nov 1–7", "$18,200", "12 incoming e-Transfers"]] },
  { id: "AL-2281", risk: "Low", rule: "Payee name close to a sanctions list name", who: "C-03317 · S. Ali", amount: "$750", when: "Yesterday", why: "Payee name is similar to a listed name. Date of birth and country are different.", tx: [["Nov 7 14:02", "$750", "Egypt · bank"]] },
];
const tone = (r: string) => (r === "Low" ? "p-blue" : r === "Medium" ? "p-amber" : "p-red");

export function Alerts() {
  const [sel, setSel] = useState(ALERTS[0]);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <section className="grid g2">
      <div className="adm-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="tbl">
          <thead><tr><th>Alert</th><th>Customer</th><th>Amount</th><th>Risk</th><th>When</th></tr></thead>
          <tbody>
            {ALERTS.map((a) => (
              <tr key={a.id} className={a.id === sel.id ? "sel" : undefined} onClick={() => { setSel(a); setMsg(null); }}>
                <td><b style={{ fontWeight: 600 }}>{a.rule}</b><div style={{ color: "var(--muted)", fontSize: 12 }}>{a.id}</div></td>
                <td>{a.who}</td>
                <td className="num">{a.amount}</td>
                <td><span className={`pill ${tone(a.risk)}`}>{a.risk}</span></td>
                <td>{a.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="adm-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div><h2>{sel.rule}</h2><p className="sub" style={{ margin: 0 }}>{sel.id} · {sel.who}</p></div>
          <span className={`pill ${tone(sel.risk)}`}>{sel.risk}</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.5 }}>{sel.why}</p>
        <div>
          <span className="lbl">Activity</span>
          {sel.tx.map(([t, a, d]) => (
            <div key={t + a} className="row"><span className="num" style={{ color: "var(--muted)" }}>{t}</span><span>{d}</span><b className="num">{a}</b></div>
          ))}
        </div>
        {sel.risk === "High" && (
          <div className="adm-card" style={{ background: "#F8FAFD", padding: 14 }}>
            <span className="lbl">Suspicious transaction report · draft</span>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              Pre-filled from this alert. A compliance officer checks it and files it with FINTRAC. The customer is never told a report was made.
            </p>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" type="button" onClick={() => setMsg("Closed as not suspicious, with your reason saved (sample only).")}>Close · not suspicious</button>
          <button className="btn" type="button" onClick={() => setMsg("Customer asked for more information (sample only).")}>Ask customer</button>
          {sel.risk === "High" && <button className="btn pri" type="button" onClick={() => setMsg("Report draft sent to the compliance officer (sample only).")}>Start report</button>}
          <button className="btn dng" type="button" onClick={() => setMsg("Account hold needs a second approver (sample only).")}>Hold account</button>
        </div>
        {msg && <p role="status" style={{ margin: 0, color: "var(--green)", fontWeight: 600 }}>{msg}</p>}
      </div>
    </section>
  );
}
