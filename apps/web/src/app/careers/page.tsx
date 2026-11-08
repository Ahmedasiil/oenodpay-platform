// The page lives in src/views; this file only wires up the route.
import { Careers, careersMeta } from "@/views/company";

export const metadata = careersMeta("en");

export default function Page() {
  return <Careers lang="en" />;
}
