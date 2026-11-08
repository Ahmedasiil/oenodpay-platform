import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact us | oenodPay", description: "Get help, make a complaint, ask about privacy or report a security issue." };

export default function Contact() {
  return (
    <PageShell eyebrow="Support" title="Contact us" lead="A real person reads every message. We reply within one business day." crumbs={[{ href: "/contact", t: "Contact us" }]}>
      <section className="pg">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 48 }}>
          <div><h2>Send us a message</h2><Suspense fallback={<p className="sub">Loading form…</p>}><ContactForm /></Suspense></div>
          <div style={{ display: "grid", gap: 16 }}>
            <div className="box"><h3>Already a customer?</h3><p>The fastest way to get help is in the app: open Help and start a chat. We can see your account there, so you won&apos;t have to repeat yourself.</p></div>
            <div className="box"><h3>Lost card or suspicious payment</h3><p>Freeze your card in the app right away, then contact us. You aren&apos;t responsible for payments you didn&apos;t make, as set out in the <Link href="/legal/cardholder-agreement">cardholder agreement</Link>.</p></div>
            <div className="box"><h3>Complaints</h3><p>Choose &ldquo;Make a complaint&rdquo;. Our <Link href="/legal/complaints">complaint process</Link> explains each step and your right to go to an external body.</p></div>
            <div className="box"><h3>Privacy</h3><p>Choose &ldquo;Privacy&rdquo; to reach our Privacy Officer, ask for a copy of your data or have it corrected. See our <Link href="/legal/privacy">privacy policy</Link>.</p></div>
            <div className="box"><h3>Security researchers</h3><p>Read our <Link href="/legal/responsible-disclosure">responsible disclosure policy</Link>, then choose &ldquo;Report a security issue&rdquo;.</p></div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
