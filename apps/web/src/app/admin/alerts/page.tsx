import { AdminHead } from "../head";
import { Alerts } from "./alerts";

export const metadata = { title: "Transaction alerts · oenodPay Admin (preview)" };

export default function AlertsPage() {
  return (
    <>
      <AdminHead title="Transaction alerts" sub="23 open · 4 high risk · rules check every transfer and card payment">
        <button className="btn" type="button">Rules</button>
      </AdminHead>
      <Alerts />
    </>
  );
}
