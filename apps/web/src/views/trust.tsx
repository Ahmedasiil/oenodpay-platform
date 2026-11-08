import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Icon, IconChip } from "@/components/icon";
import { ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

/** Trust centre, newcomers, business and scams pages. */

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
] as const;

const PROMISES = ["We never lend or invest your balance", "Every fee shown before you confirm", "We never sell your personal data", "Data stored in Canada", "A real person answers complaints"];

export const trustMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/trust", t("Trust centre"), t("How oenodPay protects your money, how we're regulated, our security and privacy practices, and live service status."));
};

export function Trust({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  return (
    <PageShell lang={lang} path="/trust" eyebrow={t("Trust centre")} title={t("Trust is the product.")} accent={t("Here's how we earn it.")} crumbs={[{ href: "/trust", t: t("Trust centre") }]}
      lead={t("Everything about how oenodPay protects your money and data, how we're regulated, and how we handle problems, in one place.")}
      actions={<><Link href={l("/status")} className="btn light">{t("Live status")}</Link><Link href={l("/security")} className="btn line">{t("Security details")}</Link></>}
      aside={
        <div className="glass">
          <h3>{t("Our promises")}</h3>
          {PROMISES.map((x) => (
            <div key={x} className="gl-row" style={{ justifyContent: "flex-start", alignItems: "center" }}><span style={{ color: "#4CC796", display: "grid" }}><Icon name="check" size={20} /></span><b style={{ textAlign: "start" }}>{t(x)}</b></div>
          ))}
        </div>
      }>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Six commitments")}</span>
          <h2>{t("What you can count on")}</h2>
          <div className="grid3">
            {PILLARS.map((p) => (
              <Link key={p.t} href={l(p.href)} className="box"><IconChip name={p.i} /><h3>{t(p.t)}</h3><p>{t(p.b)}</p><span className="more">{t(p.l)} →</span></Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap split2">
          <div>
            <span className="eyebrow">{t("Honest about what we are")}</span>
            <h2>{t("A payment company, not a bank")}</h2>
            <p className="sub" style={{ margin: 0 }}>{t("oenodPay is a money services business and payment service provider. Money in your oenodPay account is safeguarded, but it is not a bank deposit and is not covered by CDIC deposit insurance. We tell you this plainly because trust starts with being clear.")}</p>
          </div>
          <ul className="list-ic">
            <li><IconChip name="bank" /><div><b>{t("Safeguarded")}</b><p>{t("Held in trust at a Canadian financial institution, separate from company money.")}</p></div></li>
            <li><IconChip name="doc" /><div><b>{t("Audited")}</b><p>{t("Our safeguarding and anti-money-laundering programs are reviewed independently, as the law requires.")}</p></div></li>
            <li><IconChip name="alert" /><div><b>{t("Reported")}</b><p>{t("Significant incidents are reported to the Bank of Canada and to the people affected.")}</p></div></li>
          </ul>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Documents")}</span>
          <h2>{t("Read the fine print")}</h2>
          <div className="grid3">{DOCS.map(([x, h]) => <Link key={h} href={l(h)} className="box" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><b>{t(x)}</b><span className="arrow-ic" style={{ color: "var(--accent)", display: "grid" }}><Icon name="arrow" size={18} /></span></Link>)}</div>
        </div>
      </section>
    </PageShell>
  );
}

const STEPS = [
  { i: "user", t: "Open your account with the ID you have", b: "A valid passport, permanent resident card or work or study permit with photo works. No Canadian credit history needed." },
  { i: "wallet", t: "Get paid", b: "Give your employer your oenodPay account details for direct deposit, or add money from any Canadian bank." },
  { i: "send", t: "Send money home", b: "See the fee and rate before you pay. Mobile wallet, bank or cash pickup in 7 countries." },
  { i: "gauge", t: "Build your credit", b: "Check your score for free and, after launch, use the credit builder to start a Canadian credit history." },
];

const ID = [
  ["Canadian or foreign passport", "Accepted"], ["Permanent resident card", "Accepted"], ["Work or study permit (with a photo ID)", "Accepted"],
  ["Provincial driver's licence or photo ID card", "Accepted"], ["Social Insurance Number", "Needed only for investing and some lending"], ["Canadian credit history", "Not needed"],
] as const;

export const newcomersMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/newcomers", t("New to Canada"), t("Open an account with your passport or PR card, send money home, and start building Canadian credit."));
};

export function Newcomers({ lang }: { lang: Locale }) {
  const { t, l, r } = ctx(lang);
  return (
    <PageShell lang={lang} path="/newcomers" eyebrow={t("New to Canada")} title={t("Welcome to Canada.")} accent={t("Your money is ready.")} crumbs={[{ href: "/newcomers", t: t("New to Canada") }]}
      lead={t("Whether you just landed or arrived a few years ago, oenodPay gives you one account to get paid, spend, send money home and build credit.")}
      actions={<><Link href={l("/#join")} className="btn light">{t("Get early access")}</Link><Link href={l("/send-money")} className="btn line">{t("Send money home")}</Link></>}
      aside={<div className="glass"><h3>{t("What you can use to sign up")}</h3>{ID.slice(0, 5).map(([k, v]) => <div key={k} className="gl-row"><span>{t(k)}</span><b>{t(v)}</b></div>)}</div>}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Your first month")}</span>
          <h2>{t("Four steps to settled")}</h2>
          <div className="grid2">{STEPS.map((s) => <div key={s.t} className="box"><IconChip name={s.i} /><h3>{t(s.t)}</h3><p>{t(s.b)}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap split2">
          <div>
            <span className="eyebrow">{t("Identification")}</span>
            <h2>{t("What ID you need")}</h2>
            <p className="sub" style={{ margin: 0 }}>{t("Canadian law requires us to check who you are. You can do it in the app in about two minutes with a photo of your ID and a short selfie video.")}</p>
          </div>
          <div className="tblwrap" style={{ margin: 0 }}><table className="tbl"><tbody>{ID.map(([k, v]) => <tr key={k}><td>{t(k)}</td><td>{t(v)}</td></tr>)}</tbody></table></div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Good to know")}</span>
          <h2>{t("Settling in, money-wise")}</h2>
          <div className="grid3">
            <div className="box"><IconChip name="alert" /><h3>{t("Watch out for scams")}</h3><p>{r(t("The CRA, IRCC and police never ask for payment by gift card, crypto or money transfer. <0>Learn the common scams</0>."), ["/scams"])}</p></div>
            <div className="box"><IconChip name="doc" /><h3>{t("Taxes")}</h3><p>{t("You file a Canadian tax return each spring, even in your first year. It can unlock benefits like the GST/HST credit.")}</p></div>
            <div className="box"><IconChip name="gauge" /><h3>{t("Credit starts at zero")}</h3><p>{t("Your credit history from home doesn't transfer. Paying bills on time and using a small credit product builds it from scratch.")}</p></div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const FEATS = [
  { i: "wallet", t: "Business account", b: "A CAD account for your company, with direct deposit details for customers and payment processors." },
  { i: "card", t: "Team cards", b: "Visa debit cards for employees with their own limits, merchant controls and instant freeze." },
  { i: "globe", t: "Pay suppliers abroad", b: "The same clear fees and rates as personal transfers, with bulk payments by file upload." },
  { i: "doc", t: "Invoices and receipts", b: "Send invoices, match payments automatically and attach receipts to card spending from your phone." },
  { i: "chart", t: "Accounting sync", b: "Export to the accounting software you already use, with categories and GST/HST captured." },
  { i: "briefcase", t: "Works with OENOD", b: "Already on OENOD for point of sale, payroll or HR? Your oenodPay Business account will connect directly." },
];

export const businessMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/business", t("oenodPay for Business"), t("Business accounts, team cards, international supplier payments and invoicing. Coming after our personal launch."));
};

export function Business({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  return (
    <PageShell lang={lang} path="/business" eyebrow={`${t("Business")} · ${t("Coming after launch")}`} title={t("oenodPay for Business.")} accent={t("Built for owners.")} crumbs={[{ href: "/business", t: t("Business") }]}
      lead={t("Everything a small business needs to get paid, pay people and see where money goes. Business accounts open after our personal launch.")}
      actions={<><Link href={l("/contact?topic=partnerships")} className="btn light">{t("Register interest")}</Link><Link href={l("/pricing")} className="btn line">{t("See personal pricing")}</Link></>}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("What's planned")}</span>
          <h2>{t("One account for the whole business")}</h2>
          <div className="grid3">{FEATS.map((f) => <div key={f.t} className="box"><IconChip name={f.i} /><h3>{t(f.t)}</h3><p>{t(f.b)}</p></div>)}</div>
          <p className="note" style={{ marginTop: 28 }}>{t("Business accounts are not available yet. Features and pricing may change before launch, and business customers will need to verify the company and its owners, as Canadian law requires.")}</p>
        </div>
      </section>
    </PageShell>
  );
}

const SCAMS = [
  { t: "Government impersonation", b: "Someone says they're from the CRA, IRCC, Service Canada or the police and that you owe money or will be deported or arrested. Real agencies never demand payment by transfer, gift card or crypto." },
  { t: "“This is oenodPay security”", b: "A call or text says your account is at risk and asks for a code, your passkey approval or to move money to a “safe account”. We will never ask for any of these." },
  { t: "Romance and friendship", b: "Someone you met online, often never in person, asks for money for an emergency, a ticket or an investment." },
  { t: "Investment and crypto", b: "Guaranteed high returns, pressure to act fast, or a “mentor” on social media. If it sounds too good to be true, it is." },
  { t: "Job offers", b: "A job that pays you to receive money and send it on is money laundering, and you can be held responsible." },
  { t: "Online shopping", b: "Deals on marketplaces where the seller insists on a transfer instead of a protected payment, then disappears." },
];
const NEVER = ["Ask for a one-time code", "Ask you to approve a sign-in you didn't start", "Ask you to move money to a “safe account”", "Call you about a prize or refund", "Ask for your card PIN"];

export const scamsMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/scams", t("Scams and fraud"), t("How to spot the most common scams in Canada and what to do if you've been targeted."));
};

export function Scams({ lang }: { lang: Locale }) {
  const { t, r } = ctx(lang);
  return (
    <PageShell lang={lang} path="/scams" eyebrow={t("Stay safe")} title={t("Spot a scam")} accent={t("before it costs you.")} crumbs={[{ href: "/security", t: t("Security") }, { href: "/scams", t: t("Scams and fraud") }]}
      lead={t("Scammers are good at sounding official and urgent. Here's what they look like in Canada and exactly what to do.")}
      aside={<div className="glass"><h3>{t("oenodPay will never")}</h3>{NEVER.map((x) => <div key={x} className="gl-row"><b style={{ textAlign: "start" }}>✕&nbsp;&nbsp;{t(x)}</b></div>)}</div>}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Common scams")}</span>
          <h2>{t("Six to know")}</h2>
          <div className="grid3">{SCAMS.map((s) => <div key={s.t} className="box"><IconChip name="alert" /><h3>{t(s.t)}</h3><p>{t(s.b)}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap split2">
          <div>
            <span className="eyebrow">{t("If it happened to you")}</span>
            <h2>{t("Act fast")}</h2>
            <p className="sub" style={{ margin: 0 }}>{t("The sooner you tell us, the better the chance of stopping a payment. You won't be judged; scams catch careful people every day.")}</p>
          </div>
          <ol className="list-ic">
            <li><IconChip name="card" /><div><b>{t("Freeze your card")}</b><p>{t("One tap in the app stops new card payments.")}</p></div></li>
            <li><IconChip name="chat" /><div><b>{t("Contact us")}</b><p>{r(t("Open Help in the app or use our <0>contact form</0>. Tell us what happened and when."), ["/contact?topic=support"])}</p></div></li>
            <li><IconChip name="doc" /><div><b>{t("Report it")}</b><p>{t("Report to the Canadian Anti-Fraud Centre at 1-888-495-8501 and to your local police.")}</p></div></li>
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
