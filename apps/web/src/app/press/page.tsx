import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FEATURES } from "@/content/features";

export const metadata: Metadata = { title: "Press | oenodPay", description: "News, facts and media contacts for oenodPay." };

export default function Press() {
  return (
    <PageShell eyebrow="Press" title="Press and media" lead="Facts about oenodPay, and how to reach our team." crumbs={[{ href: "/press", t: "Press" }]}
      actions={<Link href="/contact?topic=press" className="btn light">Media enquiries</Link>}>
      <section className="pg">
        <div className="wrap">
          <h2>Fast facts</h2>
          <dl className="facts">
            <div><dt>What</dt><dd>All-in-one money app</dd></div>
            <div><dt>Made by</dt><dd>OENOD</dd></div>
            <div><dt>First market</dt><dd>Canada</dd></div>
            <div><dt>Platforms</dt><dd>iPhone, Android, web</dd></div>
            <div><dt>Features</dt><dd>{FEATURES.length}</dd></div>
            <div><dt>Status</dt><dd>Pre-launch, early access open</dd></div>
          </dl>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div><h2>News</h2><div className="box"><span className="tag">November 2026</span><h3>oenodPay opens early access in Canada</h3><p>People in Canada can now join the early-access list and try every feature with demo money on oenodpay.com.</p></div></div>
          <div><h2>Brand</h2><div className="box"><h3>Name</h3><p>Write it as oenodPay: lowercase &ldquo;oenod&rdquo;, capital P. Our logo and media kit will be published here at launch.</p></div></div>
        </div>
      </section>
    </PageShell>
  );
}
