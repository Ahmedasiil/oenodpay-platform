import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { Calculator } from "@/components/calculator";
import { Icon, IconChip } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { EarlyAccess } from "@/components/landing/early-access";
import { Playground } from "@/components/landing/playground";

const STEPS = [
  { t: "Open your account", b: "Download the app and verify your ID in about five minutes." },
  { t: "Add money", b: "Move money in from any Canadian bank, or get paid straight into oenodPay." },
  { t: "Do everything", b: "Send, spend, pay bills, travel and invest from one balance." },
];

const SECURITY = [
  { t: "Passkey sign-in", b: "Log in with Face ID or your fingerprint. There's no password to steal." },
  { t: "Instant card controls", b: "Freeze your card, block online payments or set limits in one tap." },
  { t: "Alerts on every payment", b: "Know the second money moves, so you can spot anything strange right away." },
  { t: "Encrypted data", b: "Your information is encrypted in transit and at rest, and kept in Canada." },
];

const FAQ = [
  { q: "What is oenodPay?", a: "One app for your everyday money in Canada: sending abroad, bills, a Visa debit card, travel, eSIMs, credit score, investing and lending." },
  { q: "Is the money in the demos real?", a: "No. The demos use pretend money so you can see how the app works. Nothing is charged and nothing is sent." },
  { q: "When can I open an account?", a: "We're launching in Canada first. Join early access and we'll email you when your account is ready." },
  { q: "How much does it cost?", a: "Opening an account is free. You always see any fee, like the transfer fee, before you confirm." },
  { q: "Are the rates on this page real?", a: "They're examples. In the app you see the live rate before you send." },
];

export default function Home() {
  return (
    <div className="lp" style={{ flex: 1 }}>
      <SiteHeader />
      <Reveal />

      <header className="top">
        <div className="wrap">
          <div>
            <span className="pill">Launching first in Canada</span>
            <h1>All your money.<br /><em className="grad">One simple app.</em></h1>
            <p className="lead">
              Send money abroad, pay bills, spend with a Visa card, travel, and grow your savings. oenodPay puts it all in
              one place, with clear prices and strong security.
            </p>
            <div className="ctas">
              <a className="btn light" href="#features">See what you can do</a>
              <a className="btn line" href="#join">Get early access</a>
            </div>
            <p className="small">Every feature below has a free demo. No sign-up needed.</p>
          </div>
          <div className="hero-vis" aria-hidden="true">
          <div className="float-card fc1"><span className="dot"><Icon name="check" size={18} /></span><span><b>Maria received ₱20,750</b><small>Manila · just now</small></span></div>
          <div className="float-card fc2" style={{ animationDelay: "1.5s" }}><span className="dot" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}><Icon name="shield" size={18} /></span><span><b>New device approved</b><small>With your passkey</small></span></div>
          <div className="float-card fc3" style={{ animationDelay: "3s" }}><span className="dot"><Icon name="gauge" size={18} /></span><span><b>Credit score 762</b><small>Up 14 this month</small></span></div>
          <div className="phone">
            <div className="screen">
              <div className="hi"><span>Good morning, Ahmed</span><span className="av">AA</span></div>
              <div className="bal"><span>Balance · CAD</span><b>$2,480.50</b></div>
              <div className="acts"><div><i />Send</div><div><i />Bills</div><div><i />Card</div><div><i />Travel</div></div>
              <div className="tx">
                <div><span>Maria · Manila</span><b>−$500.00</b></div>
                <div><span>Toronto Hydro</span><b>−$84.20</b></div>
                <div><span>Payroll</span><b className="pos">+$2,150.00</b></div>
                <div><span>Lend interest</span><b className="pos">+$6.12</b></div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </header>

      <div className="trust">
        <div className="wrap">
          <span>Made for Canada</span><span>Passkey sign-in</span><span>Encrypted end to end</span><span>Freeze your card anytime</span><span>Send to 7 countries</span><span>No monthly fee</span>
        </div>
      </div>

      <section className="sec alt" id="how">
        <div className="wrap">
          <div className="head"><span className="eyebrow">How it works</span><h2>Up and running in three steps</h2></div>
          <ol className="steps3">
            {STEPS.map((s) => <li key={s.t}><h3>{s.t}</h3><p>{s.b}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="sec" id="features">
        <div className="wrap">
          <div className="head row2">
            <div><span className="eyebrow">Features</span><h2>Everything you need. Nothing you don&apos;t.</h2></div>
            <p>Eight features, one balance. Tap &ldquo;Try it now&rdquo; on any of them to test it with demo money.</p>
          </div>
          <Playground />
        </div>
      </section>

      <section className="sec alt" id="send">
        <div className="wrap split2">
          <div>
            <div className="head" style={{ marginBottom: 28 }}><span className="eyebrow">Send money abroad</span><h2>Know the price <span style={{ color: "var(--accent)" }}>before</span> you send.</h2><p>Pick a country and an amount. You see the fee, the rate and exactly what arrives. No surprises, no hidden markup.</p></div>
            <ul className="list-ic">
              <li><IconChip name="globe" /><div><b>7 countries at launch</b><p>Philippines, India, Pakistan, Nigeria, Egypt, Mexico and the UK.</p></div></li>
              <li><IconChip name="send" /><div><b>Wallet, bank or cash pickup</b><p>Most transfers arrive within minutes.</p></div></li>
              <li><IconChip name="doc" /><div><b>Every requirement explained</b><p><Link href="/send-money">See what you and your recipient need</Link>.</p></div></li>
            </ul>
          </div>
          <Calculator />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="statband">
            <div><b>$0</b><span>Monthly fee. Opening an account is free.</span></div>
            <div><b>11</b><span>Features in one app, from one balance.</span></div>
            <div><b>7</b><span>Countries you can send to at launch.</span></div>
            <div><b>~2 min</b><span>To verify your identity in the app.</span></div>
          </div>
          <div className="grid2" style={{ marginTop: 16 }}>
            <Link href="/newcomers" className="box made"><IconChip name="globe" /><h3>New to Canada?</h3><p>Sign up with your passport or PR card, get paid, send money home and build Canadian credit.</p><span className="more">Made for newcomers →</span></Link>
            <Link href="/business" className="box made"><IconChip name="briefcase" /><h3>Run a business?</h3><p>Business accounts, team cards and supplier payments are coming after our personal launch.</p><span className="more">oenodPay for Business →</span></Link>
          </div>
        </div>
      </section>

      <section className="sec secure" id="security">
        <div className="wrap">
          <div className="head"><span className="eyebrow">Security</span><h2>Your money is protected at every step</h2><p>Security is built into oenodPay from day one, not added later.</p></div>
          <div className="sgrid">
            {SECURITY.map((s, i) => <div key={s.t}><IconChip name={["key", "card", "bell", "lock"][i] ?? "check"} dark /><h3 style={{ marginTop: 14 }}>{s.t}</h3><p>{s.b}</p></div>)}
          </div>
          <div className="ctas" style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}><Link href="/trust" className="btn light">Visit the trust centre</Link><Link href="/security" className="btn line">How we protect you</Link></div>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap">
          <div className="head"><span className="eyebrow">Questions</span><h2>Common questions</h2></div>
          <div className="faq2">
            {FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="sec" id="join" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="join">
            <div><h2>Be first when oenodPay launches</h2><p>Leave your email and we&apos;ll let you know when you can open your account.</p></div>
            <EarlyAccess />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
