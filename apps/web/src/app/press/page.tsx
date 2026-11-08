// The page lives in src/views; this file only wires up the route.
import { Press, pressMeta } from "@/views/company";

export const metadata = pressMeta("en");

export default function Page() {
  return <Press lang="en" />;
}
