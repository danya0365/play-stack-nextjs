// Lesson Component Registry
// Maps lesson IDs to their respective component

import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Dynamic imports for each lesson component
const lessonComponents: Record<string, ComponentType> = {
  // ==========================================
  // Phase 1: Foundation
  // ==========================================
  
  // Module 1.1: Programming Basics for Games
  "lesson-1-1-1": dynamic(() => import("./phase1/Lesson_1_1_1")),
  "lesson-1-1-2": dynamic(() => import("./phase1/Lesson_1_1_2")),
  "lesson-1-1-3": dynamic(() => import("./phase1/Lesson_1_1_3")),
  
  // Module 1.2: Text-Based Games
  "lesson-1-2-1": dynamic(() => import("./phase1/Lesson_1_2_1")),
  "lesson-1-2-2": dynamic(() => import("./phase1/Lesson_1_2_2")),
  "lesson-1-2-3": dynamic(() => import("./phase1/Lesson_1_2_3")),
  
  // ==========================================
  // Phase 2: 2D Games (Coming Soon)
  // ==========================================
  // "lesson-2-1-1": dynamic(() => import("./phase2/Lesson_2_1_1")),
};

export function getLessonComponent(lessonId: string): ComponentType | null {
  return lessonComponents[lessonId] || null;
}

export function hasLessonComponent(lessonId: string): boolean {
  return lessonId in lessonComponents;
}

// Export lesson components map for reference
export { lessonComponents };

