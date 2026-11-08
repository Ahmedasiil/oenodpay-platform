"use client";
import { useEffect, useRef, useState } from "react";

type View = "all" | "web" | "app" | "admin";

const WEB_PAGES = [
  ["/", "Home"], ["/features/send-money-abroad", "Send money abroad"], ["/pricing", "Pricing"], ["/security", "Security"],
  ["/app", "Web app"], ["/fr", "Home in French"], ["/ar", "Home in Arabic"], ["/zh", "Home in Chinese"],
] as const;
const ADMIN_PAGES = [["/admin", "Overview"], ["/admin/customers", "Customers and ID checks"], ["/admin/alerts", "Transaction alerts"], ["/admin/team", "Team, roles and audit"]] as const;
const APP = "/mobile-preview";

/** Shows a page at a real desktop width, scaled down to fit the box it sits in. */
function Scaled({ src, width = 1440, title }: { src: string; width?: number; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = size.w ? Math.min(1, size.w / width) : 1;
  return (
    <div ref={box} className="pv-scaled">
      {size.w > 0 && (
        <iframe title={title} src={src} style={{ width, height: size.h / scale, transform: `scale(${scale})` }} />
      )}
    </div>
  );
}

/** A phone at 390 × 844, scaled to fit the height it is given. */
function Phone({ src, title, max = 1 }: { src: string; title: string; max?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(max, (e.contentRect.height - 8) / 876, (e.contentRect.width - 8) / 422)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);
  return (
    <div ref={box} className="pv-phonebox">
      {scale > 0 && (
        <div className="pv-phone" style={{ transform: `scale(${scale})` }}>
          <iframe title={title} src={src} />
        </div>
      )}
    </div>
  );
}

function Picker({ pages, value, onChange, label }: { pages: readonly (readonly [string, string])[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <select className="pv-select" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {pages.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

export function Hub() {
  const [view, setView] = useState<View>("all");
  const [web, setWeb] = useState<string>("/");
  const [webPhone, setWebPhone] = useState(false);
  const [admin, setAdmin] = useState<string>("/admin");

  const tabs: [View, string][] = [["all", "All together"], ["web", "Website"], ["app", "Mobile app"], ["admin", "Admin dashboard"]];

  return (
    <div className="pv">
      <header className="pv-top">
        <a className="pv-brand" href="/" target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/oenodpay-logo-white.svg" alt="OENODPAY" width={117} height={19} />
          <small>LIVE PREVIEW</small>
        </a>
        <nav className="pv-tabs" aria-label="What to show">
          {tabs.map(([v, l]) => (
            <button key={v} type="button" className={view === v ? "on" : undefined} aria-pressed={view === v} onClick={() => setView(v)}>{l}</button>
          ))}
        </nav>
        <div className="pv-tools">
          {view === "web" && (
            <>
              <Picker label="Website page" pages={WEB_PAGES} value={web} onChange={setWeb} />
              <div className="pv-seg" role="group" aria-label="Screen size">
                <button type="button" className={!webPhone ? "on" : undefined} onClick={() => setWebPhone(false)}>Desktop</button>
                <button type="button" className={webPhone ? "on" : undefined} onClick={() => setWebPhone(true)}>Phone</button>
              </div>
              <a className="pv-open" href={web} target="_blank" rel="noreferrer">Open ↗</a>
            </>
          )}
          {view === "admin" && (
            <>
              <Picker label="Admin page" pages={ADMIN_PAGES} value={admin} onChange={setAdmin} />
              <a className="pv-open" href={admin} target="_blank" rel="noreferrer">Open ↗</a>
            </>
          )}
          {view === "app" && <a className="pv-open" href={APP} target="_blank" rel="noreferrer">Open ↗</a>}
        </div>
      </header>

      <main className="pv-stage">
        {view === "all" && (
          <div className="pv-all">
            <section className="pv-pane pv-a-web"><h2>Website</h2><Scaled title="Website" src="/" /></section>
            <section className="pv-pane pv-a-app"><h2>Mobile app · iOS and Android</h2><Phone title="Mobile app" src={APP} /></section>
            <section className="pv-pane pv-a-admin"><h2>Super admin dashboard</h2><Scaled title="Admin dashboard" src="/admin" /></section>
          </div>
        )}
        {view === "web" && (
          <section className="pv-pane pv-full">
            {webPhone ? <Phone key={web} title="Website on a phone" src={web} /> : <Scaled key={web} title="Website" src={web} />}
          </section>
        )}
        {view === "app" && (
          <section className="pv-pane pv-full pv-appview">
            <Phone title="Mobile app" src={APP} max={1} />
            <div className="pv-notes">
              <h2>The real mobile app</h2>
              <p>This is the actual iOS and Android app code, running in your browser. Tap through it like a phone.</p>
              <ul>
                <li>Start from Welcome, then use the tabs at the bottom.</li>
                <li>Change the language in Security (9 languages, Arabic and Urdu read right to left).</li>
                <li>Balances and people are sample data. Sign-in isn&apos;t connected yet because the backend isn&apos;t hosted.</li>
              </ul>
            </div>
          </section>
        )}
        {view === "admin" && (
          <section className="pv-pane pv-full"><Scaled key={admin} title="Admin dashboard" src={admin} /></section>
        )}
      </main>
    </div>
  );
}
