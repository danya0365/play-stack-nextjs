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
  // Phase 2: 2D Games
  // ==========================================
  
  // Module 2.1: Canvas API
  "lesson-2-1-1": dynamic(() => import("./phase2/Lesson_2_1_1")),
  "lesson-2-1-2": dynamic(() => import("./phase2/Lesson_2_1_2")),
  "lesson-2-1-3": dynamic(() => import("./phase2/Lesson_2_1_3")),
  "lesson-2-1-4": dynamic(() => import("./phase2/Lesson_2_1_4")),
  
  // Module 2.2: Phaser.js
  "lesson-2-2-1": dynamic(() => import("./phase2/Lesson_2_2_1")),
  "lesson-2-2-2": dynamic(() => import("./phase2/Lesson_2_2_2")),
  "lesson-2-2-3": dynamic(() => import("./phase2/Lesson_2_2_3")),
  "lesson-2-2-4": dynamic(() => import("./phase2/Lesson_2_2_4")),
  
  // Module 2.3: PixiJS
  "lesson-2-3-1": dynamic(() => import("./phase2/Lesson_2_3_1")),
  "lesson-2-3-2": dynamic(() => import("./phase2/Lesson_2_3_2")),
  "lesson-2-3-3": dynamic(() => import("./phase2/Lesson_2_3_3")),
  
  // ==========================================
  // Phase 3: Multiplayer
  // ==========================================
  
  // Module 3.1: Colyseus Multiplayer
  "lesson-3-1-1": dynamic(() => import("./phase3/Lesson_3_1_1")),
  "lesson-3-1-2": dynamic(() => import("./phase3/Lesson_3_1_2")),
  "lesson-3-1-3": dynamic(() => import("./phase3/Lesson_3_1_3")),
  "lesson-3-1-4": dynamic(() => import("./phase3/Lesson_3_1_4")),
  
  // Module 3.2: PeerJS P2P
  "lesson-3-2-1": dynamic(() => import("./phase3/Lesson_3_2_1")),
  "lesson-3-2-2": dynamic(() => import("./phase3/Lesson_3_2_2")),
  "lesson-3-2-3": dynamic(() => import("./phase3/Lesson_3_2_3")),
  
  // ==========================================
  // Phase 4: 3D Game Development
  // ==========================================
  
  // Module 4.1: Three.js Fundamentals
  "lesson-4-1-1": dynamic(() => import("./phase4/Lesson_4_1_1")),
  "lesson-4-1-2": dynamic(() => import("./phase4/Lesson_4_1_2")),
  "lesson-4-1-3": dynamic(() => import("./phase4/Lesson_4_1_3")),
  "lesson-4-1-4": dynamic(() => import("./phase4/Lesson_4_1_4")),
  
  // Module 4.2: Babylon.js
  "lesson-4-2-1": dynamic(() => import("./phase4/Lesson_4_2_1")),
  "lesson-4-2-2": dynamic(() => import("./phase4/Lesson_4_2_2")),
  "lesson-4-2-3": dynamic(() => import("./phase4/Lesson_4_2_3")),
  "lesson-4-2-4": dynamic(() => import("./phase4/Lesson_4_2_4")),
  
  // Module 4.3: PlayCanvas
  "lesson-4-3-1": dynamic(() => import("./phase4/Lesson_4_3_1")),
  "lesson-4-3-2": dynamic(() => import("./phase4/Lesson_4_3_2")),
  
  // Module 4.4: Unity WebGL
  "lesson-4-4-1": dynamic(() => import("./phase4/Lesson_4_4_1")),
  "lesson-4-4-2": dynamic(() => import("./phase4/Lesson_4_4_2")),
  "lesson-4-4-3": dynamic(() => import("./phase4/Lesson_4_4_3")),
  
  // ==========================================
  // Phase 5: Advanced Topics
  // ==========================================
  
  // Module 5.1: Game Architecture Patterns
  "lesson-5-1-1": dynamic(() => import("./phase5/Lesson_5_1_1")),
  "lesson-5-1-2": dynamic(() => import("./phase5/Lesson_5_1_2")),
  "lesson-5-1-3": dynamic(() => import("./phase5/Lesson_5_1_3")),
};

export function getLessonComponent(lessonId: string): ComponentType | null {
  return lessonComponents[lessonId] || null;
}

export function hasLessonComponent(lessonId: string): boolean {
  return lessonId in lessonComponents;
}

// Export lesson components map for reference
export { lessonComponents };

