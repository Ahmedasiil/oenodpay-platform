// The page lives in src/views; this file only wires up the route.
import { Newcomers, newcomersMeta } from "@/views/trust";

export const metadata = newcomersMeta("en");

export default function Page() {
  return <Newcomers lang="en" />;
}
