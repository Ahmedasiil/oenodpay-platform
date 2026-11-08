import type { ReactNode } from "react";

export function AdminHead({ title, sub, children }: { title: string; sub: string; children?: ReactNode }) {
  return (
    <>
      <div className="adm-sample" role="note">
        Preview with made-up sample data. No real customers, money or reports are shown, and buttons do not change anything.
      </div>
      <div className="adm-head">
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <h1>{title}</h1><span className="pill p-amber">Sandbox · sample data</span>
          </div>
          <p>{sub}</p>
        </div>
        <div className="adm-tools">
          <input className="adm-search" type="search" placeholder="Search customer, transfer or card…" aria-label="Search" />
          {children}
        </div>
      </div>
    </>
  );
}
