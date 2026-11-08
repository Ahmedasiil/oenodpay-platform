import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { IconChip } from "@/components/icon";

export const metadata: Metadata = { title: "oenodPay for Business | oenodPay", description: "Business accounts, team cards, international supplier payments and invoicing. Coming after our personal launch." };

const FEATS = [
  { i: "wallet", t: "Business account", b: "A CAD account for your company, with direct deposit details for customers and payment processors." },
  { i: "card", t: "Team cards", b: "Visa debit cards for employees with their own limits, merchant controls and instant freeze." },
  { i: "globe", t: "Pay suppliers abroad", b: "The same clear fees and rates as personal transfers, with bulk payments by file upload." },
  { i: "doc", t: "Invoices and receipts", b: "Send invoices, match payments automatically and attach receipts to card spending from your phone." },
  { i: "chart", t: "Accounting sync", b: "Export to the accounting software you already use, with categories and GST/HST captured." },
  { i: "briefcase", t: "Works with OENOD", b: "Already on OENOD for point of sale, payroll or HR? Your oenodPay Business account will connect directly." },
];

export default function Business() {
  return (
    <PageShell eyebrow="Business · Coming after launch" title="oenodPay for Business." accent="Built for owners." crumbs={[{ href: "/business", t: "Business" }]}
      lead="Everything a small business needs to get paid, pay people and see where money goes. Business accounts open after our personal launch."
      actions={<><Link href="/contact?topic=partnerships" className="btn light">Register interest</Link><Link href="/pricing" className="btn line">See personal pricing</Link></>}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">What&apos;s planned</span>
          <h2>One account for the whole business</h2>
          <div className="grid3">{FEATS.map((f) => <div key={f.t} className="box"><IconChip name={f.i} /><h3>{f.t}</h3><p>{f.b}</p></div>)}</div>
          <p className="note" style={{ marginTop: 28 }}>Business accounts are not available yet. Features and pricing may change before launch, and business customers will need to verify the company and its owners, as Canadian law requires.</p>
        </div>
      </section>
    </PageShell>
  );
}
