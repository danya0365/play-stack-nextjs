"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainLearnTopicView } from "./MainLearnTopicView";
import { RetroLearnTopicView } from "./RetroLearnTopicView";

interface LearnTopicViewProps {
  topicSlug: string;
  courseSlug: string;
}

export function LearnTopicView({ topicSlug, courseSlug }: LearnTopicViewProps) {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroLearnTopicView topicSlug={topicSlug} courseSlug={courseSlug} />;
  }

  return <MainLearnTopicView topicSlug={topicSlug} courseSlug={courseSlug} />;
}
