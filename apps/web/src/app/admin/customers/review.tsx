"use client";
import { useState } from "react";

// Sample people for the design preview. Names are invented.
const QUEUE = [
  { id: "C-10511", name: "Maria Santos", city: "Toronto, ON", waited: "3 h 05 m", doc: "Passport (Philippines)", face: 98, docScore: "Genuine", address: "Matched (credit bureau)", risk: "Low", pep: "No match", limit: "$3,000 / day", note: "" },
  { id: "C-10514", name: "Arjun Mehta", city: "Brampton, ON", waited: "2 h 40 m", doc: "Ontario driver's licence", face: 95, docScore: "Genuine", address: "Matched (bank statement)", risk: "Low", pep: "No match", limit: "$3,000 / day", note: "" },
  { id: "C-10520", name: "Chinedu Okafor", city: "Calgary, AB", waited: "2 h 10 m", doc: "Permanent resident card", face: 71, docScore: "Glare on photo", address: "Not matched yet", risk: "Medium", pep: "No match", limit: "$1,000 / day", note: "Face match below 85%. Ask for a new selfie." },
  { id: "C-10527", name: "Sofia Hernández", city: "Montréal, QC", waited: "1 h 32 m", doc: "Passport (Mexico)", face: 97, docScore: "Genuine", address: "Matched (utility bill)", risk: "Low", pep: "No match", limit: "$3,000 / day", note: "" },
  { id: "C-10533", name: "Ayesha Khan", city: "Mississauga, ON", waited: "58 m", doc: "Passport (Pakistan)", face: 93, docScore: "Genuine", address: "Matched (credit bureau)", risk: "Medium", pep: "Possible match · needs review", limit: "$1,000 / day", note: "Name similar to a listed person. Check date of birth before approving." },
  { id: "C-10540", name: "Daniel Tremblay", city: "Québec, QC", waited: "21 m", doc: "Québec driver's licence", face: 99, docScore: "Genuine", address: "Matched (credit bureau)", risk: "Low", pep: "No match", limit: "$3,000 / day", note: "" },
];

const tone = (r: string) => (r === "Low" ? "p-green" : r === "Medium" ? "p-amber" : "p-red");

export function Review() {
  const [sel, setSel] = useState(QUEUE[2]);
  const [done, setDone] = useState<string | null>(null);
  return (
    <section className="grid g2">
      <div className="adm-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="tbl">
          <thead><tr><th>Customer</th><th>Document</th><th>Face match</th><th>Risk</th><th>Waiting</th></tr></thead>
          <tbody>
            {QUEUE.map((c) => (
              <tr key={c.id} className={c.id === sel.id ? "sel" : undefined} onClick={() => { setSel(c); setDone(null); }}>
                <td><b style={{ fontWeight: 600 }}>{c.name}</b><div style={{ color: "var(--muted)", fontSize: 12 }}>{c.id} · {c.city}</div></td>
                <td>{c.doc}</td>
                <td className="num">{c.face}%</td>
                <td><span className={`pill ${tone(c.risk)}`}>{c.risk}</span></td>
                <td className="num">{c.waited}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adm-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
          <div><h2>{sel.name}</h2><p className="sub" style={{ margin: 0 }}>{sel.id} · {sel.city}</p></div>
          <span className={`pill ${tone(sel.risk)}`}>{sel.risk} risk</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ aspectRatio: "1.55", borderRadius: 12, background: "linear-gradient(135deg,#E7EDFC,#C9D5FA)", display: "grid", placeItems: "center", color: "#163C9E", fontSize: 12, fontWeight: 600 }}>ID document photo</div>
          <div style={{ aspectRatio: "1.55", borderRadius: 12, background: "linear-gradient(135deg,#EEF1F6,#D6DCE8)", display: "grid", placeItems: "center", color: "#5A6480", fontSize: 12, fontWeight: 600 }}>Live selfie</div>
        </div>
        <dl className="kv">
          <dt>Document</dt><dd>{sel.doc} · <span className={`pill ${sel.docScore === "Genuine" ? "p-green" : "p-amber"}`}>{sel.docScore}</span></dd>
          <dt>Face match</dt><dd className="num">{sel.face}%</dd>
          <dt>Address</dt><dd>{sel.address}</dd>
          <dt>Sanctions and PEP</dt><dd>{sel.pep}</dd>
          <dt>Starting limit</dt><dd>{sel.limit}</dd>
        </dl>
        {sel.note && <div className="adm-sample" style={{ background: "#FCE9E7", color: "#A3271D", borderColor: "#F2C6C0" }}>{sel.note}</div>}
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="lbl">Reason (required, saved to the audit log)</span>
          <textarea rows={2} style={{ border: "1px solid #D6DCE8", borderRadius: 10, padding: 10, font: "inherit", resize: "vertical" }} placeholder="Why you made this decision" />
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn pri" type="button" onClick={() => setDone("Approved. Sent to a second reviewer to confirm (sample only).")}>Approve</button>
          <button className="btn" type="button" onClick={() => setDone("New photo requested. The customer gets a notice in the app (sample only).")}>Ask for a new photo</button>
          <button className="btn dng" type="button" onClick={() => setDone("Rejected and frozen. A second reviewer must confirm (sample only).")}>Reject or freeze</button>
        </div>
        {done && <p role="status" style={{ margin: 0, color: "var(--green)", fontWeight: 600 }}>{done}</p>}
      </div>
    </section>
  );
}
