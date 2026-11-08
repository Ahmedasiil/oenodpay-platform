import { AdminHead } from "../head";

export const metadata = { title: "Team, roles and audit · oenodPay Admin (preview)" };

const PERMS = ["See customers", "Approve ID checks", "Close alerts", "File reports", "Move money", "Change limits", "Manage staff", "Emergency controls"];
const ROLES: [string, string, boolean[]][] = [
  ["Super admin", "2 people", [true, true, true, true, true, true, true, true]],
  ["Compliance", "4 people", [true, true, true, true, false, true, false, false]],
  ["Support", "9 people", [true, false, false, false, false, false, false, false]],
  ["Finance", "3 people", [true, false, false, false, true, false, false, false]],
  ["Read-only", "5 people", [true, false, false, false, false, false, false, false]],
];

const LOG = [
  ["Nov 8 09:42", "Compliance analyst", "Approved ID check", "C-10482", "Key"],
  ["Nov 8 09:31", "Support agent", "Reset card PIN attempts", "C-08817", "Passkey"],
  ["Nov 8 09:05", "Finance", "Confirmed safeguarding match", "Ledger", "Key"],
  ["Nov 8 08:50", "Super admin", "Changed new-account daily limit to $3,000", "Limits", "Key + 2nd approver"],
  ["Nov 8 08:12", "Compliance lead", "Opened report draft AL-2291", "C-07731", "Key"],
  ["Nov 7 22:40", "System", "Blocked sign-in from unknown country", "Staff account", "Rule"],
  ["Nov 7 17:03", "Super admin", "Added Support agent (role: Support)", "Staff", "Key + 2nd approver"],
];

export default function Team() {
  return (
    <>
      <AdminHead title="Team, roles and audit" sub="Who can do what, and a record of everything staff do">
        <button className="btn pri" type="button">Invite staff</button>
      </AdminHead>

      <section className="grid g3">
        {[["Staff accounts", "23", "All with hardware keys or passkeys"], ["Actions today", "412", "Every one is logged and can't be edited"], ["Waiting for a second approver", "2", "Limit change · account hold"]].map(([l, v, d]) => (
          <div key={l} className="adm-card kpi"><span className="lbl">{l}</span><span className="v num">{v}</span><span className="d">{d}</span></div>
        ))}
      </section>

      <div className="adm-card" style={{ overflowX: "auto" }}>
        <h2>Roles and permissions</h2>
        <p className="sub">Least access by default. Money movement and emergency controls always need two people.</p>
        <table className="tbl">
          <thead><tr><th>Role</th>{PERMS.map((p) => <th key={p} style={{ textAlign: "center" }}>{p}</th>)}</tr></thead>
          <tbody>
            {ROLES.map(([r, n, ok]) => (
              <tr key={r} style={{ cursor: "default" }}>
                <td><b style={{ fontWeight: 600 }}>{r}</b><div style={{ color: "var(--muted)", fontSize: 12 }}>{n}</div></td>
                {ok.map((y, i) => <td key={i} style={{ textAlign: "center" }}><span className={`chk ${y ? "y" : "n"}`} aria-label={y ? "Allowed" : "Not allowed"}>{y ? "✓" : "–"}</span></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adm-card" style={{ overflowX: "auto" }}>
        <h2>Audit log</h2>
        <p className="sub">Append-only. Kept for at least 5 years, as Canadian record-keeping rules require.</p>
        <table className="tbl">
          <thead><tr><th>Time</th><th>Staff role</th><th>Action</th><th>On</th><th>Signed with</th></tr></thead>
          <tbody>
            {LOG.map((l) => (
              <tr key={l[0] + l[2]} style={{ cursor: "default" }}>
                <td className="num" style={{ whiteSpace: "nowrap" }}>{l[0]}</td><td>{l[1]}</td><td>{l[2]}</td><td className="num">{l[3]}</td>
                <td><span className={`pill ${l[4].includes("2nd") ? "p-blue" : "p-grey"}`}>{l[4]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
