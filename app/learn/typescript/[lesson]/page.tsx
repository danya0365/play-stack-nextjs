import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { LearnLessonView } from "@/src/presentation/components/learn/LearnLessonView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ lesson: string }>;
}

export async function generateStaticParams() {
  const lessons = getLessonsByTopic("topic-typescript");
  return lessons.map((lesson) => ({ lesson: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson: lessonSlug } = await params;
  const lessons = getLessonsByTopic("topic-typescript");
  const lesson = lessons.find(l => l.slug === lessonSlug);
  
  return {
    title: lesson ? `${lesson.titleTh} | TypeScript | Play Stack` : "Not Found",
    description: lesson?.description,
  };
}

export default async function LearnTSLessonPage({ params }: Props) {
  const { lesson: lessonSlug } = await params;
  const lessons = getLessonsByTopic("topic-typescript");
  const lesson = lessons.find(l => l.slug === lessonSlug);
  
  if (!lesson) {
    notFound();
  }

  return <LearnLessonView topicSlug="typescript" lessonSlug={lessonSlug} courseType="typescript" />;
}
