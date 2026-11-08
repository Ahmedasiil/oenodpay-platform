// The page lives in src/views; this file only wires up the route.
import { Contact, contactMeta } from "@/views/support";

export const metadata = contactMeta("en");

export default function Page() {
  return <Contact lang="en" />;
}
