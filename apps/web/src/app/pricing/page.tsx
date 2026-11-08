import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PRICING } from "@/content/company";

export const metadata: Metadata = { title: "Fees and limits | oenodPay", description: "Every oenodPay fee and limit in one place. No monthly fee." };

export default function Pricing() {
  return (
    <PageShell eyebrow="Fees and limits" title="Every price, in one place" lead="No monthly fee and no hidden exchange markups. If something costs money, it's on this page and shown before you confirm." crumbs={[{ href: "/pricing", t: "Fees and limits" }]}>
      <section className="pg">
        <div className="wrap" style={{ maxWidth: 900 }}>
          {PRICING.map((g) => (
            <div key={g.group}>
              <h2>{g.group}</h2>
              <div className="tblwrap"><table className="tbl"><tbody>{g.rows.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table></div>
            </div>
          ))}
          <p className="note">Exchange rates on international transfers are shown before you send and locked for 30 minutes. Limits go up as your account history grows, and can be lowered at any time in Settings. See the <Link href="/legal/account-agreement">account agreement</Link> and <Link href="/legal/cardholder-agreement">cardholder agreement</Link> for full terms. Fees for loans, investing and Lend are set out in their own disclosures.</p>
        </div>
      </section>
    </PageShell>
  );
}
