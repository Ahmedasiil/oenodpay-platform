import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ROLES, VALUES } from "@/content/company";

export const metadata: Metadata = { title: "Careers | oenodPay", description: "Open roles at oenodPay." };

export default function Careers() {
  return (
    <PageShell eyebrow="Careers" title="Help build the money app for everyone in Canada" lead="We're a small team building payments, cards, travel and investing in one secure app." crumbs={[{ href: "/careers", t: "Careers" }]}>
      <section className="pg">
        <div className="wrap">
          <h2>Open roles</h2>
          <div className="tblwrap"><table className="tbl">
            <thead><tr><th>Role</th><th>Team</th><th>Location</th></tr></thead>
            <tbody>{ROLES.map((r) => <tr key={r.t}><td><b>{r.t}</b></td><td>{r.team}</td><td>{r.where}</td></tr>)}</tbody>
          </table></div>
          <p className="note">To apply, <Link href="/contact?topic=careers">send us a message</Link> with the role name and a link to your CV or LinkedIn. We welcome applications from people of every background, and we provide accommodations during hiring on request.</p>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap">
          <h2>How we work</h2>
          <div className="grid2">{VALUES.map((v) => <div key={v.t} className="box"><h3>{v.t}</h3><p>{v.b}</p></div>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
