// The page lives in src/views; this file only wires up the route.
import { Scams, scamsMeta } from "@/views/trust";

export const metadata = scamsMeta("en");

export default function Page() {
  return <Scams lang="en" />;
}
