import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Calculator } from "@/components/calculator";
import { IconChip } from "@/components/icon";
import { COUNTRIES, LABEL, RECIPIENT_NEEDS, SENDER_NEEDS } from "@/content/countries";

export const metadata: Metadata = { title: "Send money abroad from Canada | oenodPay", description: "Countries you can send to, how the money arrives, fees, and what you and your recipient need." };

const cad = (m: number) => `$${(m / 100).toFixed(2)}`;

export default function SendMoney() {
  return (
    <PageShell eyebrow="Send money" title="Send money home." accent="See the price first." lead="See the fee and the exchange rate before you pay. Most transfers arrive within minutes." crumbs={[{ href: "/send-money", t: "Send money" }]}
      actions={<Link href="/features/send-money-abroad" className="btn light">How sending works</Link>}
      aside={<Calculator />}
      stats={[{ k: "Countries", v: "7" }, { k: "Fees from", v: "$1.99" }, { k: "Most arrive", v: "In minutes" }]}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Countries</span>
          <h2>Where you can send at launch</h2>
          <p className="sub">We&apos;re adding more countries after launch. Rates shown in the app are live; fees below are fixed per transfer.</p>
          <div className="grid3">
            {COUNTRIES.map((c) => (
              <Link key={c.slug} href={`/send-money/${c.slug}`} className="box">
                <span className="tag">{c.currency}</span>
                <h3>{c.countryName}</h3>
                <p>{c.methods.map((m) => m.name).join(" · ")}</p>
                <p>From {cad(Math.min(...c.methods.map((m) => m.feeMinor)))} per transfer</p>
                <span className="more">Requirements and fees →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <h2>What you need</h2>
            <ul className="checks">{SENDER_NEEDS.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
          <div>
            <h2>What your recipient needs</h2>
            {(Object.keys(RECIPIENT_NEEDS) as (keyof typeof RECIPIENT_NEEDS)[]).map((k) => (
              <div key={k} style={{ marginBottom: 20 }}><h3>{LABEL[k]}</h3><ul className="checks">{RECIPIENT_NEEDS[k].map((n) => <li key={n}>{n}</li>)}</ul></div>
            ))}
          </div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <h2>Rules every transfer follows</h2>
          <div className="grid3">
            <div className="box"><IconChip name="user" /><h3>Identity checks</h3><p>Canadian law requires us to verify who you are before your first transfer, and to keep records of every transfer.</p></div>
            <div className="box"><IconChip name="globe" /><h3>Sanctions screening</h3><p>Every sender and recipient is checked against Canadian and international sanctions lists. We can&apos;t send to sanctioned people or places.</p></div>
            <div className="box"><IconChip name="doc" /><h3>Large transfers</h3><p>Transfers of $10,000 or more, alone or within 24 hours, are reported to FINTRAC as the law requires. We may ask where the money came from.</p></div>
          </div>
          <p className="note" style={{ marginTop: 24 }}>Full details are in our <Link href="/legal/aml-sanctions">anti-money-laundering and sanctions policy</Link> and the <Link href="/legal/account-agreement">account agreement</Link>.</p>
        </div>
      </section>
    </PageShell>
  );
}
