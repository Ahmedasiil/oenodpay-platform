"use client";

import { useEffect, useState } from "react";
import { STATUS_TEXT, type StatusText } from "@/views/support-text";

interface Status { status: "operational" | "degraded"; checkedAt: string; components: { id: string; name: string; status: "operational" | "outage" }[] }

export function StatusBoard({ text = { ...STATUS_TEXT, names: {}, locale: "en-CA" } }: { text?: StatusText }) {
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

  if (down) return <div className="st-head bad" role="status"><span className="st-dot" />{text.down}</div>;
  if (!data) return <div className="st-head" role="status" style={{ background: "var(--sunk)", color: "var(--muted)" }}><span className="st-dot" />{text.checking}</div>;
  const ok = data.status === "operational";
  return (
    <>
      <div className={`st-head${ok ? "" : " bad"}`} role="status"><span className="st-dot" />{ok ? text.ok : text.bad}</div>
      <div className="st-list">
        {data.components.map((c) => (
          <div key={c.id}><span>{text.names[c.name] ?? c.name}</span><span className={c.status === "operational" ? "st-ok" : "st-bad"}>{c.status === "operational" ? text.operational : text.outage}</span></div>
        ))}
      </div>
      <p className="calc-note" style={{ marginTop: 12 }}>{text.last.replace("{time}", new Date(data.checkedAt).toLocaleTimeString(text.locale))}</p>
    </>
  );
}
