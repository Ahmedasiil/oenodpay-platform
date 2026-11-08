// The page lives in src/views; this file only wires up the route.
import { Trust, trustMeta } from "@/views/trust";

export const metadata = trustMeta("en");

export default function Page() {
  return <Trust lang="en" />;
}
