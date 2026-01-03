import { getTopicBySlug, learnTopics } from "@/src/data/master/learnTopics";
import { LearnTopicView } from "@/src/presentation/components/learn/LearnTopicView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  // Only JS topics (exclude typescript)
  return learnTopics
    .filter(t => t.id !== "topic-typescript")
    .map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  
  return {
    title: topic ? `${topic.titleTh} | JavaScript | Play Stack` : "Not Found",
    description: topic?.descriptionTh,
  };
}

export default async function LearnJSTopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  
  if (!topic || topic.id === "topic-typescript") {
    notFound();
  }

  return <LearnTopicView topicSlug={topicSlug} courseType="javascript" />;
}
