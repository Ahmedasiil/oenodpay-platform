import { AdminHead } from "../head";
import { Review } from "./review";

export const metadata = { title: "Customers and ID checks · oenodPay Admin (preview)" };

export default function Customers() {
  return (
    <>
      <AdminHead title="Customers and ID checks" sub="41 waiting · oldest first · pick a customer to review">
        <button className="btn" type="button">Filters</button>
      </AdminHead>
      <section className="grid g5">
        {[["Waiting", "41"], ["Approved today", "186"], ["New photo asked", "22"], ["Rejected today", "3"], ["Average review time", "4 m 10 s"]].map(([l, v]) => (
          <div key={l} className="adm-card kpi"><span className="lbl">{l}</span><span className="v num">{v}</span></div>
        ))}
      </section>
      <Review />
    </>
  );
}
