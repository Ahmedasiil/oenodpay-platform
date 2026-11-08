import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell eyebrow="Error 404" title="We couldn't find" accent="that page." lead="It may have moved, or the link may be wrong. These are good places to start." cta={false}
      actions={<><Link href="/" className="btn light">Go home</Link><Link href="/help" className="btn line">Help centre</Link></>}>
      <section className="pg"><div className="wrap grid3">
        <Link href="/features" className="box"><h3>Features</h3><p>Everything oenodPay does.</p></Link>
        <Link href="/send-money" className="box"><h3>Send money</h3><p>Countries, fees and requirements.</p></Link>
        <Link href="/contact" className="box"><h3>Contact us</h3><p>A real person will reply.</p></Link>
      </div></section>
    </PageShell>
  );
}
