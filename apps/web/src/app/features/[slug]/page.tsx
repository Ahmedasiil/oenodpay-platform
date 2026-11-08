// The page lives in src/views; this file only wires up the route.
import View, { meta, params } from "@/views/feature";

export const generateStaticParams = params;
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => meta("en", (await params).slug);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <View lang="en" slug={(await params).slug} />;
}
