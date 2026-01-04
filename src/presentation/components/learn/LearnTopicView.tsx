"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainLearnTopicView } from "./MainLearnTopicView";
import { RetroLearnTopicView } from "./RetroLearnTopicView";

interface LearnTopicViewProps {
  topicSlug: string;
  courseType?: "javascript" | "typescript";
}

export function LearnTopicView({ topicSlug, courseType = "javascript" }: LearnTopicViewProps) {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroLearnTopicView topicSlug={topicSlug} courseType={courseType} />;
  }

  return <MainLearnTopicView topicSlug={topicSlug} courseType={courseType} />;
}
