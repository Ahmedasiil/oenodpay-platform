import type { Metadata } from "next";
import "./admin.css";
import { AdminNav } from "./nav";

export const metadata: Metadata = {
  title: "oenodPay Admin console (preview)",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/oenodpay-symbol-white.svg" alt="" width={28} height={28} />
          <div><b>OENOD<i>PAY</i></b><small>ADMIN CONSOLE</small></div>
        </div>
        <AdminNav />
        <div className="adm-me"><b>Super admin (you)</b><span>Signed in with a hardware key</span></div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
