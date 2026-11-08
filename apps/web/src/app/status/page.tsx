import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { StatusBoard } from "@/components/status-board";

export const metadata: Metadata = { title: "System status | oenodPay", description: "Live health of every part of oenodPay." };

export default function Status() {
  return (
    <PageShell eyebrow="Status" title="System status" lead="Checked live against our servers every 30 seconds." crumbs={[{ href: "/trust", t: "Trust centre" }, { href: "/status", t: "Status" }]} cta={false}>
      <section className="pg">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <StatusBoard />
          <p className="note" style={{ marginTop: 24 }}>If something isn&apos;t working and this page says everything is fine, please <a href="/contact?topic=support">tell us</a>.</p>
        </div>
      </section>
    </PageShell>
  );
}
