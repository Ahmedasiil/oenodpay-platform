// The page lives in src/views; this file only wires up the route.
import { Business, businessMeta } from "@/views/trust";

export const metadata = businessMeta("en");

export default function Page() {
  return <Business lang="en" />;
}
