import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Calculator } from "@/components/calculator";
import { COUNTRIES, LABEL, RECIPIENT_NEEDS, SENDER_NEEDS, countryBySlug } from "@/content/countries";

export const generateStaticParams = () => COUNTRIES.map((c) => ({ country: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const c = countryBySlug((await params).country);
  return c ? { title: `Send money to ${c.countryName} from Canada | oenodPay`, description: `Fees, delivery times and requirements for sending money to ${c.countryName}.` } : {};
}

const cad = (m: number) => `$${(m / 100).toFixed(2)}`;

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const c = countryBySlug((await params).country);
  if (!c) notFound();
  const types = [...new Set(c.methods.map((m) => m.type))];
  return (
    <PageShell eyebrow={`Send money · ${c.currency}`} title={`Send money to ${c.countryName}`}
      lead={`Send Canadian dollars and your recipient gets ${c.currency}. The most popular way is ${c.popular.toLowerCase()}.`}
      crumbs={[{ href: "/send-money", t: "Send money" }, { href: `/send-money/${c.slug}`, t: c.countryName }]}
      actions={<Link href="/#join" className="btn light">Get early access</Link>}
      aside={<Calculator country={c.countryCode} />}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Fees and speed</span>
          <h2>Ways to send and fees</h2>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>How it arrives</th><th>Type</th><th>Usually arrives</th><th>Fee</th></tr></thead>
              <tbody>{c.methods.map((m) => <tr key={m.id}><td>{m.name}</td><td>{LABEL[m.type]}</td><td>{m.eta}</td><td>{cad(m.feeMinor)}</td></tr>)}</tbody>
            </table>
          </div>
          <dl className="facts">
            <div><dt>Currency received</dt><dd>{c.currency}</dd></div>
            <div><dt>Example rate</dt><dd className="num">1 CAD ≈ {c.sampleRate} {c.currency}</dd></div>
            <div><dt>Per transfer (new accounts)</dt><dd>Up to $3,000</dd></div>
            <div><dt>Rate shown</dt><dd>Before you pay, locked for 30 min</dd></div>
          </dl>
          <p className="note" style={{ marginTop: 20 }}>The rate above is an example only. You see the live rate and the exact amount your recipient gets before you confirm.</p>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <h2>What your recipient needs</h2>
            {types.map((t) => <div key={t} style={{ marginBottom: 20 }}><h3>{LABEL[t]}</h3><ul className="checks">{RECIPIENT_NEEDS[t].map((n) => <li key={n}>{n}</li>)}</ul></div>)}
            <h3>Good to know about {c.countryName}</h3>
            <ul className="checks">{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
          <div>
            <h2>What you need</h2>
            <ul className="checks">{SENDER_NEEDS.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <h2>Other countries</h2>
          <div className="grid3">{COUNTRIES.filter((o) => o.slug !== c.slug).map((o) => <Link key={o.slug} href={`/send-money/${o.slug}`} className="box"><h3>{o.countryName}</h3><p>{o.methods.map((m) => m.name).join(" · ")}</p></Link>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
