import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { IconChip } from "@/components/icon";

export const metadata: Metadata = { title: "New to Canada | oenodPay", description: "Open an account with your passport or PR card, send money home, and start building Canadian credit." };

const STEPS = [
  { i: "user", t: "Open your account with the ID you have", b: "A valid passport, permanent resident card or work or study permit with photo works. No Canadian credit history needed." },
  { i: "wallet", t: "Get paid", b: "Give your employer your oenodPay account details for direct deposit, or add money from any Canadian bank." },
  { i: "send", t: "Send money home", b: "See the fee and rate before you pay. Mobile wallet, bank or cash pickup in 7 countries." },
  { i: "gauge", t: "Build your credit", b: "Check your score for free and, after launch, use the credit builder to start a Canadian credit history." },
];

const ID = [
  ["Canadian or foreign passport", "Accepted"], ["Permanent resident card", "Accepted"], ["Work or study permit (with a photo ID)", "Accepted"],
  ["Provincial driver's licence or photo ID card", "Accepted"], ["Social Insurance Number", "Needed only for investing and some lending"], ["Canadian credit history", "Not needed"],
];

export default function Newcomers() {
  return (
    <PageShell eyebrow="New to Canada" title="Welcome to Canada." accent="Your money is ready." crumbs={[{ href: "/newcomers", t: "New to Canada" }]}
      lead="Whether you just landed or arrived a few years ago, oenodPay gives you one account to get paid, spend, send money home and build credit."
      actions={<><Link href="/#join" className="btn light">Get early access</Link><Link href="/send-money" className="btn line">Send money home</Link></>}
      aside={<div className="glass"><h3>What you can use to sign up</h3>{ID.slice(0, 5).map(([k, v]) => <div key={k} className="gl-row"><span>{k}</span><b>{v}</b></div>)}</div>}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Your first month</span>
          <h2>Four steps to settled</h2>
          <div className="grid2">{STEPS.map((s) => <div key={s.t} className="box"><IconChip name={s.i} /><h3>{s.t}</h3><p>{s.b}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap split2">
          <div>
            <span className="eyebrow">Identification</span>
            <h2>What ID you need</h2>
            <p className="sub" style={{ margin: 0 }}>Canadian law requires us to check who you are. You can do it in the app in about two minutes with a photo of your ID and a short selfie video.</p>
          </div>
          <div className="tblwrap" style={{ margin: 0 }}><table className="tbl"><tbody>{ID.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table></div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">Good to know</span>
          <h2>Settling in, money-wise</h2>
          <div className="grid3">
            <div className="box"><IconChip name="alert" /><h3>Watch out for scams</h3><p>The CRA, IRCC and police never ask for payment by gift card, crypto or money transfer. <Link href="/scams">Learn the common scams</Link>.</p></div>
            <div className="box"><IconChip name="doc" /><h3>Taxes</h3><p>You file a Canadian tax return each spring, even in your first year. It can unlock benefits like the GST/HST credit.</p></div>
            <div className="box"><IconChip name="gauge" /><h3>Credit starts at zero</h3><p>Your credit history from home doesn&apos;t transfer. Paying bills on time and using a small credit product builds it from scratch.</p></div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
