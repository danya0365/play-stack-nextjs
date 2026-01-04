"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainLearnLessonView } from "./MainLearnLessonView";
import { RetroLearnLessonView } from "./RetroLearnLessonView";

interface LearnLessonViewProps {
  topicSlug: string;
  lessonSlug: string;
  courseType?: "javascript" | "typescript";
}

export function LearnLessonView({ topicSlug, lessonSlug, courseType = "javascript" }: LearnLessonViewProps) {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroLearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseType={courseType} />;
  }

  return <MainLearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseType={courseType} />;
}
