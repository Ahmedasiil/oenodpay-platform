import { SiteHeader } from "@/components/site-header";
import { SecurityPanel } from "./security-panel";

export const metadata = { title: "Security · oenodPay" };

export default function SecurityPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-10">
        <SecurityPanel />
      </main>
    </>
  );
}
