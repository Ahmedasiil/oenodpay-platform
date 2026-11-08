// The page lives in src/views; this file only wires up the route.
import View, { meta, params } from "@/views/country";

export const generateStaticParams = params;
export const generateMetadata = async ({ params }: { params: Promise<{ country: string }> }) => meta("en", (await params).country);

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  return <View lang="en" slug={(await params).country} />;
}
