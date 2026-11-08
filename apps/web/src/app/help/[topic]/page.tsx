// The page lives in src/views; this file only wires up the route.
import { HelpTopic, topicMeta, topicParams } from "@/views/help";

export const generateStaticParams = topicParams;
export const generateMetadata = async ({ params }: { params: Promise<{ topic: string }> }) => topicMeta("en", (await params).topic);

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  return <HelpTopic lang="en" slug={(await params).topic} />;
}
