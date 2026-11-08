// The page lives in src/views; this file only wires up the route.
import { Legal, legalMeta } from "@/views/legal";

export const metadata = legalMeta("en");

export default function Page() {
  return <Legal lang="en" />;
}
