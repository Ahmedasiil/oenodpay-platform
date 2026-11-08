import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Icon, IconChip } from "@/components/icon";

export const metadata: Metadata = { title: "Trust centre | oenodPay", description: "How oenodPay protects your money, how we're regulated, our security and privacy practices, and live service status." };

const PILLARS = [
  { i: "bank", t: "Your money is kept separate", b: "Customer money is held in a dedicated account at a Canadian financial institution, apart from the money we use to run the company. That's what the Retail Payment Activities Act requires, and it means your money is not used to pay our bills.", href: "/legal/regulatory", l: "How safeguarding works" },
  { i: "scale", t: "Regulated before we launch", b: "We register with FINTRAC and the Bank of Canada before accepting any customer money, and with Quebec's AMF before serving Quebec. We publish the honest status of every registration.", href: "/about#regulation", l: "Registration status" },
  { i: "shield", t: "Security from day one", b: "Passkey sign-in, new-device approval, encryption in transit and at rest, card data handled only by a PCI DSS certified processor, and fraud checks on every payment.", href: "/security", l: "Our security" },
  { i: "eye", t: "Privacy you control", b: "We follow PIPEDA and Quebec's Law 25, store data in Canada, never sell it, and let you see, correct or delete your information.", href: "/legal/privacy", l: "Privacy policy" },
  { i: "pulse", t: "Open about outages", b: "Our status page shows the live health of every part of oenodPay, checked against our servers, so you never have to guess.", href: "/status", l: "Live status" },
  { i: "chat", t: "Fair when things go wrong", b: "A clear complaint process with deadlines, a named escalation path and the right to go to an external body if you're not satisfied.", href: "/legal/complaints", l: "Complaint process" },
];

const DOCS = [
  ["Account agreement", "/legal/account-agreement"], ["Cardholder agreement", "/legal/cardholder-agreement"], ["Privacy policy", "/legal/privacy"],
  ["Anti-money laundering and sanctions", "/legal/aml-sanctions"], ["Licences and registrations", "/legal/regulatory"], ["Responsible disclosure", "/legal/responsible-disclosure"],
  ["Accessibility", "/legal/accessibility"], ["Cookie policy", "/legal/cookies"], ["Fees and limits", "/pricing"],
];

export default function Trust() {
  return (
    <PageShell eyebrow="Trust centre" title="Trust is the product." accent="Here's how we earn it." crumbs={[{ href: "/trust", t: "Trust centre" }]}
      lead="Everything about how oenodPay protects your money and data, how we're regulated, and how we handle problems, in one place."
      actions={<><Link href="/status" className="btn light">Live status</Link><Link href="/security" className="btn line">Security details</Link></>}
      aside={
        <div className="glass">
          <h3>Our promises</h3>
          {["We never lend or invest your balance", "Every fee shown before you confirm", "We never sell your personal data", "Data stored in Canada", "A real person answers complaints"].map((t) => (
            <div key={t} className="gl-row" style={{ justifyContent: "flex-start", alignItems: "center" }}><span style={{ color: "#4CC796", display: "grid" }}><Icon name="check" size={20} /></span><b style={{ textAlign: "left" }}>{t}</b></div>
          ))}
        </div>
      }>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Six commitments</span>
          <h2>What you can count on</h2>
          <div className="grid3">
            {PILLARS.map((p) => (
              <Link key={p.t} href={p.href} className="box"><IconChip name={p.i} /><h3>{p.t}</h3><p>{p.b}</p><span className="more">{p.l} →</span></Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap split2">
          <div>
            <span className="eyebrow">Honest about what we are</span>
            <h2>A payment company, not a bank</h2>
            <p className="sub" style={{ margin: 0 }}>oenodPay is a money services business and payment service provider. Money in your oenodPay account is safeguarded, but it is not a bank deposit and is not covered by CDIC deposit insurance. We tell you this plainly because trust starts with being clear.</p>
          </div>
          <ul className="list-ic">
            <li><IconChip name="bank" /><div><b>Safeguarded</b><p>Held in trust at a Canadian financial institution, separate from company money.</p></div></li>
            <li><IconChip name="doc" /><div><b>Audited</b><p>Our safeguarding and anti-money-laundering programs are reviewed independently, as the law requires.</p></div></li>
            <li><IconChip name="alert" /><div><b>Reported</b><p>Significant incidents are reported to the Bank of Canada and to the people affected.</p></div></li>
          </ul>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Documents</span>
          <h2>Read the fine print</h2>
          <div className="grid3">{DOCS.map(([t, h]) => <Link key={h} href={h!} className="box" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><b>{t}</b><span style={{ color: "var(--accent)", display: "grid" }}><Icon name="arrow" size={18} /></span></Link>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
