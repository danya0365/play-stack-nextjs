"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainLearnCourseView } from "./MainLearnCourseView";
import { RetroLearnCourseView } from "./RetroLearnCourseView";

interface LearnCourseViewProps {
  courseType: string;
}

export function LearnCourseView({ courseType }: LearnCourseViewProps) {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroLearnCourseView courseType={courseType} />;
  }

  return <MainLearnCourseView courseType={courseType} />;
}
