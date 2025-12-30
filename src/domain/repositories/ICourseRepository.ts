// Domain interfaces for Course Repository
// Following Clean Architecture - this is the interface that the domain layer expects

import type { Lesson } from "@/src/data/master/lessons";
import type { Module } from "@/src/data/master/modules";
import type { Phase } from "@/src/data/master/phases";
import type { Project } from "@/src/data/master/projects";

export interface ICourseRepository {
  // Phases
  getAllPhases(): Promise<Phase[]>;
  getPhaseById(id: string): Promise<Phase | null>;
  getPhaseByNumber(number: number): Promise<Phase | null>;

  // Modules
  getAllModules(): Promise<Module[]>;
  getModuleById(id: string): Promise<Module | null>;
  getModulesByPhaseId(phaseId: string): Promise<Module[]>;

  // Lessons
  getAllLessons(): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | null>;
  getLessonsByModuleId(moduleId: string): Promise<Lesson[]>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  getProjectsByModuleId(moduleId: string): Promise<Project[]>;
}
