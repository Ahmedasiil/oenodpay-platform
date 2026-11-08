import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { IconChip } from "@/components/icon";

export const metadata: Metadata = { title: "Scams and fraud | oenodPay", description: "How to spot the most common scams in Canada and what to do if you've been targeted." };

const SCAMS = [
  { t: "Government impersonation", b: "Someone says they're from the CRA, IRCC, Service Canada or the police and that you owe money or will be deported or arrested. Real agencies never demand payment by transfer, gift card or crypto." },
  { t: "\"This is oenodPay security\"", b: "A call or text says your account is at risk and asks for a code, your passkey approval or to move money to a \"safe account\". We will never ask for any of these." },
  { t: "Romance and friendship", b: "Someone you met online, often never in person, asks for money for an emergency, a ticket or an investment." },
  { t: "Investment and crypto", b: "Guaranteed high returns, pressure to act fast, or a \"mentor\" on social media. If it sounds too good to be true, it is." },
  { t: "Job offers", b: "A job that pays you to receive money and send it on is money laundering, and you can be held responsible." },
  { t: "Online shopping", b: "Deals on marketplaces where the seller insists on a transfer instead of a protected payment, then disappears." },
];

export default function Scams() {
  return (
    <PageShell eyebrow="Stay safe" title="Spot a scam" accent="before it costs you." crumbs={[{ href: "/security", t: "Security" }, { href: "/scams", t: "Scams and fraud" }]}
      lead="Scammers are good at sounding official and urgent. Here's what they look like in Canada and exactly what to do."
      aside={<div className="glass"><h3>oenodPay will never</h3>{["Ask for a one-time code", "Ask you to approve a sign-in you didn't start", "Ask you to move money to a \"safe account\"", "Call you about a prize or refund", "Ask for your card PIN"].map((t) => <div key={t} className="gl-row"><b style={{ textAlign: "left" }}>✕&nbsp;&nbsp;{t}</b></div>)}</div>}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Common scams</span>
          <h2>Six to know</h2>
          <div className="grid3">{SCAMS.map((s) => <div key={s.t} className="box"><IconChip name="alert" /><h3>{s.t}</h3><p>{s.b}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap split2">
          <div>
            <span className="eyebrow">If it happened to you</span>
            <h2>Act fast</h2>
            <p className="sub" style={{ margin: 0 }}>The sooner you tell us, the better the chance of stopping a payment. You won&apos;t be judged; scams catch careful people every day.</p>
          </div>
          <ol className="list-ic">
            <li><IconChip name="card" /><div><b>Freeze your card</b><p>One tap in the app stops new card payments.</p></div></li>
            <li><IconChip name="chat" /><div><b>Contact us</b><p>Open Help in the app or use our <Link href="/contact?topic=support">contact form</Link>. Tell us what happened and when.</p></div></li>
            <li><IconChip name="doc" /><div><b>Report it</b><p>Report to the Canadian Anti-Fraud Centre at 1-888-495-8501 and to your local police.</p></div></li>
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
