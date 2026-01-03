import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug, learnTopics } from "@/src/data/master/learnTopics";
import { LearnLessonView } from "@/src/presentation/components/learn/LearnLessonView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ topic: string; lesson: string }>;
}

export async function generateStaticParams() {
  const paths: { topic: string; lesson: string }[] = [];
  
  learnTopics
    .filter(t => t.id !== "topic-typescript")
    .forEach((topic) => {
      const lessons = getLessonsByTopic(topic.id);
      lessons.forEach((lesson) => {
        paths.push({ topic: topic.slug, lesson: lesson.slug });
      });
    });
  
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, lesson: lessonSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  
  if (!topic) return { title: "Not Found" };

  const lessons = getLessonsByTopic(topic.id);
  const lesson = lessons.find(l => l.slug === lessonSlug);
  
  return {
    title: lesson ? `${lesson.titleTh} | JavaScript | Play Stack` : "Not Found",
    description: lesson?.description,
  };
}

export default async function LearnJSLessonPage({ params }: Props) {
  const { topic: topicSlug, lesson: lessonSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  
  if (!topic || topic.id === "topic-typescript") {
    notFound();
  }

  return <LearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseType="javascript" />;
}
