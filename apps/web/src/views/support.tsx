import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";
import { StatusBoard } from "@/components/status-board";
import { CONTACT_TOPICS } from "@oenodpay/shared";
import { ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";
import { FORM_TEXT, STATUS_TEXT, TOPIC_LABEL, type FormText, type StatusText } from "./support-text";

/** Contact and status pages. Their client-side widgets get their words passed in. */


export const contactMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/contact", t("Contact us"), t("Get help, make a complaint, ask about privacy or report a security issue."));
};

export function Contact({ lang }: { lang: Locale }) {
  const { t, r } = ctx(lang);
  const text: FormText = {
    ...(Object.fromEntries(Object.entries(FORM_TEXT).map(([k, v]) => [k, t(v)])) as typeof FORM_TEXT),
    topics: Object.fromEntries(CONTACT_TOPICS.map((k) => [k, t(TOPIC_LABEL[k])])),
  };
  return (
    <PageShell lang={lang} path="/contact" eyebrow={t("Support")} title={t("Contact us")} lead={t("A real person reads every message. We reply within one business day.")} crumbs={[{ href: "/contact", t: t("Contact us") }]}>
      <section className="pg">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 48 }}>
          <div><h2>{t("Send us a message")}</h2><Suspense fallback={<p className="sub">{t("Loading form…")}</p>}><ContactForm text={text} /></Suspense></div>
          <div style={{ display: "grid", gap: 16 }}>
            <div className="box"><h3>{t("Already a customer?")}</h3><p>{t("The fastest way to get help is in the app: open Help and start a chat. We can see your account there, so you won't have to repeat yourself.")}</p></div>
            <div className="box"><h3>{t("Lost card or suspicious payment")}</h3><p>{r(t("Freeze your card in the app right away, then contact us. You aren't responsible for payments you didn't make, as set out in the <0>cardholder agreement</0>."), ["/legal/cardholder-agreement"])}</p></div>
            <div className="box"><h3>{t("Complaints")}</h3><p>{r(t("Choose “Make a complaint”. Our <0>complaint process</0> explains each step and your right to go to an external body."), ["/legal/complaints"])}</p></div>
            <div className="box"><h3>{t("Privacy")}</h3><p>{r(t("Choose “Privacy” to reach our Privacy Officer, ask for a copy of your data or have it corrected. See our <0>privacy policy</0>."), ["/legal/privacy"])}</p></div>
            <div className="box"><h3>{t("Security researchers")}</h3><p>{r(t("Read our <0>responsible disclosure policy</0>, then choose “Report a security issue”."), ["/legal/responsible-disclosure"])}</p></div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const COMPONENTS = ["Website and app API", "Accounts and balances", "Transfers in Canada", "International transfers", "Identity verification"];

export const statusMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/status", t("System status"), t("Live health of every part of oenodPay."));
};

export function Status({ lang }: { lang: Locale }) {
  const { t, r } = ctx(lang);
  const text: StatusText = {
    ...(Object.fromEntries(Object.entries(STATUS_TEXT).map(([k, v]) => [k, t(v)])) as typeof STATUS_TEXT),
    names: Object.fromEntries(COMPONENTS.map((n) => [n, t(n)])),
    locale: lang === "en" ? "en-CA" : lang,
  };
  return (
    <PageShell lang={lang} path="/status" eyebrow={t("Status")} title={t("System status")} lead={t("Checked live against our servers every 30 seconds.")} crumbs={[{ href: "/trust", t: t("Trust centre") }, { href: "/status", t: t("Status") }]} cta={false}>
      <section className="pg">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <StatusBoard text={text} />
          <p className="note" style={{ marginTop: 24 }}>{r(t("If something isn't working and this page says everything is fine, please <0>tell us</0>."), ["/contact?topic=support"])}</p>
        </div>
      </section>
    </PageShell>
  );
}
