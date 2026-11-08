import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PROVINCES, VALUES } from "@/content/company";

export const metadata: Metadata = { title: "About us | oenodPay", description: "Who we are, where we operate and how we're regulated." };

const REGS = [
  ["FINTRAC", "Money services business registration", "Required to send money and hold customer funds", "Applying before launch"],
  ["Bank of Canada", "Payment service provider registration (Retail Payment Activities Act)", "Required to hold funds and process payments", "Applying before launch"],
  ["Quebec AMF", "Money services business licence", "Required to serve customers in Quebec", "After launch"],
  ["Card issuing partner", "Visa debit cards issued by a Canadian member financial institution", "Required for the oenodPay card", "Partner selection"],
  ["Investment dealer partner", "CIRO-regulated dealer", "Required for investing", "Before investing launches"],
];

export default function About() {
  return (
    <PageShell eyebrow="Company" title="One app for all your money, made in Canada" lead="oenodPay is built by OENOD for people who live in Canada and have family, plans and money that cross borders." crumbs={[{ href: "/about", t: "About us" }]}
      actions={<><Link href="/careers" className="btn light">Join the team</Link><Link href="/press" className="btn line">Press</Link></>}>
      <section className="pg">
        <div className="wrap">
          <h2>Why we exist</h2>
          <p className="sub">Newcomers and families in Canada juggle a bank, a transfer app, a prepaid card, a travel site and a credit app. Each has its own fees and its own sign-in. oenodPay puts them in one place with one balance, clear prices and strong security.</p>
          <div className="grid2">{VALUES.map((v) => <div key={v.t} className="box"><h3>{v.t}</h3><p>{v.b}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap">
          <h2>Where we operate</h2>
          <p className="sub">We&apos;re launching across Canada. Quebec follows once we hold our licence from the Autorité des marchés financiers.</p>
          <div className="grid3">{PROVINCES.map((p) => <div key={p.name} className="box"><h3>{p.name}</h3><span className={`tag${p.status === "At launch" ? " ok" : " later"}`}>{p.status}</span></div>)}</div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <h2>How we&apos;re regulated</h2>
          <p className="sub">We register with every regulator that oversees what we do, before we do it. This table shows honest, current status.</p>
          <div className="tblwrap"><table className="tbl">
            <thead><tr><th>Regulator or partner</th><th>What</th><th>Why</th><th>Status</th></tr></thead>
            <tbody>{REGS.map(([a, b, c, d]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>)}</tbody>
          </table></div>
          <p className="note">oenodPay is not a bank and does not take deposits. See <Link href="/legal/regulatory">licences and registrations</Link> for details.</p>
        </div>
      </section>
    </PageShell>
  );
}
