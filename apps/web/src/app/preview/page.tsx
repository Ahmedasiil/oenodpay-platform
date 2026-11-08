import type { Metadata } from "next";
import "./preview.css";
import { Hub } from "./hub";

export const metadata: Metadata = {
  title: "oenodPay live preview: website, app and admin",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return <Hub />;
}
