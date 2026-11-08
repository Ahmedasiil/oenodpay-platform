import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Icon, IconChip } from "@/components/icon";

const IC: Record<string, string> = {"Passkey sign-in": "key", "New device approval": "phone", "Step-up checks": "shield", "Session control": "eye", "Safeguarded funds": "bank", "Card controls": "card", "Real-time alerts": "bell", "Fraud monitoring": "pulse", "Encryption": "lock", "Stored in Canada": "server", "Least access": "user", "No selling data": "eye", "Secure development": "doc", "Independent testing": "check", "Card security": "card", "Incident response": "alert"};

export const metadata: Metadata = { title: "Security | oenodPay", description: "How oenodPay protects your money, your account and your data." };

const LAYERS = [
  { h: "Your account", items: [["Passkey sign-in", "Sign in with Face ID, your fingerprint or your device PIN. There's no password to phish or leak."], ["New device approval", "A new phone or computer must be approved from a device you already trust."], ["Step-up checks", "Large or unusual payments ask you to confirm with your passkey again."], ["Session control", "See every signed-in device and sign any of them out from Settings."]] },
  { h: "Your money", items: [["Safeguarded funds", "Customer money is held separately from our own at a Canadian financial institution, as the Retail Payment Activities Act requires."], ["Card controls", "Freeze your card, block online or overseas payments and set limits instantly."], ["Real-time alerts", "A notification for every payment, so you spot anything strange in seconds."], ["Fraud monitoring", "Automated checks watch for unusual activity around the clock and can pause a payment before it leaves."]] },
  { h: "Your data", items: [["Encryption", "Data is encrypted in transit with TLS 1.2+ and at rest with AES-256."], ["Stored in Canada", "Customer data is stored in Canadian data centres."], ["Least access", "Staff only see the data their job needs, and every access is logged."], ["No selling data", "We never sell your personal information. See the privacy policy."]] },
  { h: "How we build", items: [["Secure development", "Code review, automated security tests and dependency scanning on every change."], ["Independent testing", "Regular penetration tests by outside security firms."], ["Card security", "Card data is handled by our PCI DSS certified card processor and never touches our servers."], ["Incident response", "A tested plan to contain and report incidents, including notice to the Bank of Canada and affected customers."]] },
];

export default function Security() {
  return (
    <PageShell eyebrow="Security" title="Built to keep" accent="your money safe."
      aside={<div className="glass"><h3>Always on</h3>{[["key", "Passkeys, not passwords"], ["lock", "AES-256 encryption at rest"], ["server", "Data kept in Canada"], ["bank", "Customer funds held separately"], ["bell", "An alert for every payment"]].map(([i, t]) => <div key={t} className="gl-row" style={{ justifyContent: "flex-start", alignItems: "center" }}><span style={{ color: "#A9B8FF", display: "grid" }}><Icon name={i!} size={20} /></span><b style={{ textAlign: "left" }}>{t}</b></div>)}</div>} lead="Security isn't a feature we added later. Here is exactly how we protect your account, your money and your data." crumbs={[{ href: "/security", t: "Security" }]}>
      {LAYERS.map((l, i) => (
        <section key={l.h} className={`pg${i % 2 ? " alt" : ""}`}>
          <div className="wrap">
            <span className="eyebrow">Layer {i + 1} of {LAYERS.length}</span>
            <h2>Protecting {l.h.toLowerCase()}</h2>
            <div className="grid2">{l.items.map(([t, b]) => <div key={t} className="box"><IconChip name={IC[t!] ?? "check"} /><h3>{t}</h3><p>{b}</p></div>)}</div>
          </div>
        </section>
      ))}
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <h2>How to stay safe</h2>
            <ul className="checks">
              <li>We will never ask for your passkey, a one-time code or your card PIN by phone, email or text.</li>
              <li>Only download oenodPay from the App Store, Google Play or oenodpay.com.</li>
              <li>Be wary of anyone who pressures you to send money quickly, even if they say they&apos;re from oenodPay, the CRA or the police.</li>
              <li>Turn on notifications so you see every payment.</li>
            </ul>
          </div>
          <div>
            <h2>Report a problem</h2>
            <p className="sub" style={{ margin: 0 }}>Think someone accessed your account? Freeze your card in the app and <Link href="/contact?topic=support">contact us</Link>. Found a security flaw? Follow our <Link href="/legal/responsible-disclosure">responsible disclosure policy</Link>.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
