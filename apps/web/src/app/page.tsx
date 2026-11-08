import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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

      <header className="top">
        <div className="wrap">
          <div>
            <span className="pill">Launching first in Canada</span>
            <h1>All your money.<br /><em>One simple app.</em></h1>
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
          <div className="phone" aria-hidden="true">
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
      </header>

      <div className="trust">
        <div className="wrap">
          <span>Made for Canada</span><span>Passkey sign-in</span><span>Encrypted end to end</span><span>Freeze your card anytime</span><span>Send to 7 countries</span>
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

      <section className="sec secure" id="security">
        <div className="wrap">
          <div className="head"><span className="eyebrow">Security</span><h2>Your money is protected at every step</h2><p>Security is built into oenodPay from day one, not added later.</p></div>
          <div className="sgrid">
            {SECURITY.map((s) => <div key={s.t}><h3>{s.t}</h3><p>{s.b}</p></div>)}
          </div>
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
