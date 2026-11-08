import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calculator } from "@/components/calculator";
import { Icon, IconChip } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { EarlyAccess } from "@/components/landing/early-access";
import { Playground, type PlayText } from "@/components/landing/playground";
import { ORDER, PAGE } from "@/components/landing/demo-state";
import { FEATURES, FEATURE_ICON } from "@/content/features";
import { DICTS, homeHref, localeInfo, type Locale } from "@/i18n";

const ORG_JSONLD = {
  "@context": "https://schema.org", "@type": "Organization", name: "oenodPay", parentOrganization: { "@type": "Organization", name: "OENOD", url: "https://oenod.com" },
  url: "https://oenodpay.com", areaServed: "CA", description: "All your money in one simple app: send money abroad, pay bills, Visa debit card, travel, credit score, investing and lending.",
};

/** The home page in any supported language. English lives at /, the others at /fr, /es and so on. */
export function HomePage({ lang }: { lang: Locale }) {
  const t = DICTS[lang];
  const { dir } = localeInfo(lang);
  const join = `${homeHref(lang)}#join`;
  const cat = { "Move money": t.groups.move, "Spend & travel": t.groups.spend, "Grow your money": t.groups.grow } as const;
  const play: PlayText | undefined = lang === "en" ? undefined : {
    try: t.bento.try, more: t.bento.more, tried: t.bento.tried,
    tiles: Object.fromEntries(ORDER.map((id) => {
      const f = FEATURES.find((x) => x.slug === PAGE[id])!;
      return [id, { cat: cat[f.group], title: t.f[f.slug as keyof typeof t.f].n, body: t.f[f.slug as keyof typeof t.f].t }];
    })),
  };

  return (
    <div className="lp" style={{ flex: 1 }} lang={lang} dir={dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
      <SiteHeader lang={lang} />
      <Reveal />

      <header className="top">
        <div className="wrap">
          <div>
            <span className="pill">{t.hero.pill}</span>
            <h1>{t.hero.h1a}<br /><em className="grad">{t.hero.h1b}</em></h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="ctas">
              <a className="btn light" href="#everything">{t.hero.cta1}</a>
              <a className="btn line" href="#join">{t.hero.cta2}</a>
            </div>
            <p className="small">{t.hero.small}</p>
          </div>
          <div className="hero-vis" aria-hidden="true" dir="ltr">
            <div className="float-card fc1"><span className="dot"><Icon name="check" size={18} /></span><span><b>{t.fc.maria}</b><small>{t.fc.mariaSub}</small></span></div>
            <div className="float-card fc2" style={{ animationDelay: "1.5s" }}><span className="dot" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}><Icon name="shield" size={18} /></span><span><b>{t.fc.device}</b><small>{t.fc.deviceSub}</small></span></div>
            <div className="float-card fc3" style={{ animationDelay: "3s" }}><span className="dot"><Icon name="gauge" size={18} /></span><span><b>{t.fc.score}</b><small>{t.fc.scoreSub}</small></span></div>
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

      <div className="trust"><div className="wrap">{t.trust.map((x) => <span key={x}>{x}</span>)}</div></div>

      <section className="sec" id="everything">
        <div className="wrap">
          <div className="head row2">
            <div><span className="eyebrow">{t.all.eyebrow}</span><h2>{t.all.h2}</h2></div>
            <p>{t.all.p}</p>
          </div>
          <div className="svc-groups">
            {(["Move money", "Spend & travel", "Grow your money"] as const).map((g) => (
              <div key={g} className="svc-group">
                <span className="svc-h">{cat[g]}</span>
                <div className="svc-grid">
                  {FEATURES.filter((f) => f.group === g).map((f) => {
                    const tx = t.f[f.slug as keyof typeof t.f];
                    return (
                      <Link key={f.slug} href={`/features/${f.slug}`} className="svc">
                        <IconChip name={FEATURE_ICON[f.slug] ?? "check"} />
                        <span className="svc-tx"><b>{tx.n}</b><span>{tx.t}</span></span>
                        {f.status !== "At launch" && <em className="svc-soon">{t.soon}</em>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec alt" id="how">
        <div className="wrap">
          <div className="head"><span className="eyebrow">{t.how.eyebrow}</span><h2>{t.how.h2}</h2></div>
          <ol className="steps3">{t.how.steps.map((s) => <li key={s.t}><h3>{s.t}</h3><p>{s.b}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec" id="features">
        <div className="wrap">
          <div className="head row2">
            <div><span className="eyebrow">{t.bento.eyebrow}</span><h2>{t.bento.h2}</h2></div>
            <p>{t.bento.p}</p>
          </div>
          <Playground t={play} />
        </div>
      </section>

      <section className="sec alt" id="send">
        <div className="wrap split2">
          <div>
            <div className="head" style={{ marginBottom: 28 }}><span className="eyebrow">{t.send.eyebrow}</span><h2>{t.send.h2a} <span style={{ color: "var(--accent)" }}>{t.send.h2b}</span> {t.send.h2c}</h2><p>{t.send.p}</p></div>
            <ul className="list-ic">
              {t.send.items.map((it, i) => (
                <li key={it.t}><IconChip name={["globe", "send", "doc"][i]!} /><div><b>{it.t}</b><p>{i === 2 ? <Link href="/send-money">{it.b}</Link> : it.b}</p></div></li>
              ))}
            </ul>
          </div>
          <Calculator t={t.calc} joinHref={join} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="statband">{t.stats.map((s) => <div key={s.b}><b dir="ltr">{s.b}</b><span>{s.s}</span></div>)}</div>
          <div className="grid2" style={{ marginTop: 16 }}>
            <Link href="/newcomers" className="box made"><IconChip name="globe" /><h3>{t.made.nt}</h3><p>{t.made.nb}</p><span className="more">{t.made.nm}</span></Link>
            <Link href="/business" className="box made"><IconChip name="briefcase" /><h3>{t.made.bt}</h3><p>{t.made.bb}</p><span className="more">{t.made.bm}</span></Link>
          </div>
        </div>
      </section>

      <section className="sec secure" id="security">
        <div className="wrap">
          <div className="head"><span className="eyebrow">{t.sec.eyebrow}</span><h2>{t.sec.h2}</h2><p>{t.sec.p}</p></div>
          <div className="sgrid">
            {t.sec.items.map((s, i) => <div key={s.t}><IconChip name={["key", "card", "bell", "lock"][i] ?? "check"} dark /><h3 style={{ marginTop: 14 }}>{s.t}</h3><p>{s.b}</p></div>)}
          </div>
          <div className="ctas" style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}><Link href="/trust" className="btn light">{t.sec.trust}</Link><Link href="/security" className="btn line">{t.sec.how}</Link></div>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap">
          <div className="head"><span className="eyebrow">{t.faq.eyebrow}</span><h2>{t.faq.h2}</h2></div>
          <div className="faq2">{t.faq.items.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="sec" id="join" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="join">
            <div><h2>{t.join.h2}</h2><p>{t.join.p}</p></div>
            <EarlyAccess t={t.join} source={lang === "en" ? "website" : `website-${lang}`} />
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
