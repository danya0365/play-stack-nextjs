"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainLearnLessonView } from "./MainLearnLessonView";
import { RetroLearnLessonView } from "./RetroLearnLessonView";

interface LearnLessonViewProps {
  topicSlug: string;
  lessonSlug: string;
  courseSlug: string;
}

export function LearnLessonView({ topicSlug, lessonSlug, courseSlug }: LearnLessonViewProps) {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroLearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseSlug={courseSlug} />;
  }

  return <MainLearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseSlug={courseSlug} />;
}
