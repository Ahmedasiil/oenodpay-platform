// The page lives in src/views; this file only wires up the route.
import { Status, statusMeta } from "@/views/support";

export const metadata = statusMeta("en");

export default function Page() {
  return <Status lang="en" />;
}
