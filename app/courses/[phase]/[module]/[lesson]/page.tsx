import { getLessonContent, lessonContents } from "@/src/data/master/lessonContents";
import { LessonView } from "@/src/presentation/components/lesson/LessonView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{
  phase: string;
  module: string;
  lesson: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lesson: lessonId } = await params;
  const lesson = getLessonContent(lessonId);
  
  return {
    title: lesson ? `${lesson.titleTh} | Play Stack` : "Lesson | Play Stack",
    description: lesson ? `เรียนรู้ ${lesson.titleTh}` : "บทเรียน Game Development",
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { phase, module: moduleId, lesson: lessonId } = await params;
  
  const lesson = getLessonContent(lessonId);
  
  if (!lesson) {
    notFound();
  }
  
  // Find prev/next lessons
  const moduleLessons = lessonContents
    .filter((l) => l.moduleId === lesson.moduleId)
    .sort((a, b) => a.order - b.order);
  
  const currentIndex = moduleLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : undefined;
  
  return (
    <LessonView
      lesson={lesson}
      phaseId={phase}
      moduleId={moduleId}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
