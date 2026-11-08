// The page lives in src/views; this file only wires up the route.
import View, { meta } from "@/views/help";

export const metadata = meta("en");

export default function Page() {
  return <View lang="en" />;
}
