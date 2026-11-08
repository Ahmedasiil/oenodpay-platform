// The page lives in src/views; this file only wires up the route.
import { LegalDoc, docMeta, docParams } from "@/views/legal";

export const generateStaticParams = docParams;
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => docMeta("en", (await params).slug);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <LegalDoc lang="en" slug={(await params).slug} />;
}
