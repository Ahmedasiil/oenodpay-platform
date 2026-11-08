import { PageShell } from "@/components/page-shell";
import { Icon, IconChip } from "@/components/icon";
import { ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

const PATH = "/security";

const IC: Record<string, string> = { "Passkey sign-in": "key", "New device approval": "phone", "Step-up checks": "shield", "Session control": "eye", "Safeguarded funds": "bank", "Card controls": "card", "Real-time alerts": "bell", "Fraud monitoring": "pulse", "Encryption": "lock", "Stored in Canada": "server", "Least access": "user", "No selling data": "eye", "Secure development": "doc", "Independent testing": "check", "Card security": "card", "Incident response": "alert" };

const LAYERS = [
  { h: "Protecting your account", items: [["Passkey sign-in", "Sign in with Face ID, your fingerprint or your device PIN. There's no password to phish or leak."], ["New device approval", "A new phone or computer must be approved from a device you already trust."], ["Step-up checks", "Large or unusual payments ask you to confirm with your passkey again."], ["Session control", "See every signed-in device and sign any of them out from Settings."]] },
  { h: "Protecting your money", items: [["Safeguarded funds", "Customer money is held separately from our own at a Canadian financial institution, as the Retail Payment Activities Act requires."], ["Card controls", "Freeze your card, block online or overseas payments and set limits instantly."], ["Real-time alerts", "A notification for every payment, so you spot anything strange in seconds."], ["Fraud monitoring", "Automated checks watch for unusual activity around the clock and can pause a payment before it leaves."]] },
  { h: "Protecting your data", items: [["Encryption", "Data is encrypted in transit with TLS 1.2+ and at rest with AES-256."], ["Stored in Canada", "Customer data is stored in Canadian data centres."], ["Least access", "Staff only see the data their job needs, and every access is logged."], ["No selling data", "We never sell your personal information. See the privacy policy."]] },
  { h: "Protecting how we build", items: [["Secure development", "Code review, automated security tests and dependency scanning on every change."], ["Independent testing", "Regular penetration tests by outside security firms."], ["Card security", "Card data is handled by our PCI DSS certified card processor and never touches our servers."], ["Incident response", "A tested plan to contain and report incidents, including notice to the Bank of Canada and affected customers."]] },
] as const;

const ALWAYS = [["key", "Passkeys, not passwords"], ["lock", "AES-256 encryption at rest"], ["server", "Data kept in Canada"], ["bank", "Customer funds held separately"], ["bell", "An alert for every payment"]] as const;

export const meta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, PATH, t("Security"), t("How oenodPay protects your money, your account and your data."));
};

export default function Security({ lang }: { lang: Locale }) {
  const { t, r } = ctx(lang);
  return (
    <PageShell lang={lang} path={PATH} eyebrow={t("Security")} title={t("Built to keep")} accent={t("your money safe.")}
      aside={<div className="glass"><h3>{t("Always on")}</h3>{ALWAYS.map(([i, x]) => <div key={x} className="gl-row" style={{ justifyContent: "flex-start", alignItems: "center" }}><span style={{ color: "#A9B8FF", display: "grid" }}><Icon name={i} size={20} /></span><b style={{ textAlign: "start" }}>{t(x)}</b></div>)}</div>}
      lead={t("Security isn't a feature we added later. Here is exactly how we protect your account, your money and your data.")} crumbs={[{ href: PATH, t: t("Security") }]}>
      {LAYERS.map((ly, i) => (
        <section key={ly.h} className={`pg${i % 2 ? " alt" : ""}`}>
          <div className="wrap">
            <span className="eyebrow">{t("Layer {n} of {total}", { n: i + 1, total: LAYERS.length })}</span>
            <h2>{t(ly.h)}</h2>
            <div className="grid2">{ly.items.map(([x, b]) => <div key={x} className="box"><IconChip name={IC[x] ?? "check"} /><h3>{t(x)}</h3><p>{t(b)}</p></div>)}</div>
          </div>
        </section>
      ))}
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <h2>{t("How to stay safe")}</h2>
            <ul className="checks">
              <li>{t("We will never ask for your passkey, a one-time code or your card PIN by phone, email or text.")}</li>
              <li>{t("Only download oenodPay from the App Store, Google Play or oenodpay.com.")}</li>
              <li>{t("Be wary of anyone who pressures you to send money quickly, even if they say they're from oenodPay, the CRA or the police.")}</li>
              <li>{t("Turn on notifications so you see every payment.")}</li>
            </ul>
          </div>
          <div>
            <h2>{t("Report a problem")}</h2>
            <p className="sub" style={{ margin: 0 }}>{r(t("Think someone accessed your account? Freeze your card in the app and <0>contact us</0>. Found a security flaw? Follow our <1>responsible disclosure policy</1>."), ["/contact?topic=support", "/legal/responsible-disclosure"])}</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
