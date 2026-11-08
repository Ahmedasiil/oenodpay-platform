"use client";

import { useEffect, useState } from "react";

interface Status { status: "operational" | "degraded"; checkedAt: string; components: { id: string; name: string; status: "operational" | "outage" }[] }

export function StatusBoard() {
  const [data, setData] = useState<Status | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/v1/status", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const body = (await res.json()) as Status;
        if (alive) { setData(body); setDown(false); }
      } catch { if (alive) setDown(true); }
    };
    void load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  if (down) return <div className="st-head bad" role="status"><span className="st-dot" />We can&apos;t reach our servers right now. We&apos;re looking into it.</div>;
  if (!data) return <div className="st-head" role="status" style={{ background: "var(--sunk)", color: "var(--muted)" }}><span className="st-dot" />Checking…</div>;
  const ok = data.status === "operational";
  return (
    <>
      <div className={`st-head${ok ? "" : " bad"}`} role="status"><span className="st-dot" />{ok ? "All systems operational" : "Some systems are having problems"}</div>
      <div className="st-list">
        {data.components.map((c) => (
          <div key={c.id}><span>{c.name}</span><span className={c.status === "operational" ? "st-ok" : "st-bad"}>{c.status === "operational" ? "Operational" : "Outage"}</span></div>
        ))}
      </div>
      <p className="calc-note" style={{ marginTop: 12 }}>Last checked {new Date(data.checkedAt).toLocaleTimeString("en-CA")}.</p>
    </>
  );
}
