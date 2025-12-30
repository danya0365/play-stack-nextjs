// Mock Course Repository
// Uses static master data - will be replaced with Supabase later

import type { Lesson } from "@/src/data/master/lessons";
import type { Module } from "@/src/data/master/modules";
import type { Phase } from "@/src/data/master/phases";
import type { Project } from "@/src/data/master/projects";
import type { ICourseRepository } from "@/src/domain/repositories/ICourseRepository";

import {
    getLessonById,
    getLessonsByModuleId,
    lessons,
} from "@/src/data/master/lessons";
import {
    getModuleById,
    getModulesByPhaseId,
    modules,
} from "@/src/data/master/modules";
import {
    getPhaseById,
    getPhaseByNumber,
    phases,
} from "@/src/data/master/phases";
import {
    getProjectById,
    getProjectsByModuleId,
    projects,
} from "@/src/data/master/projects";

export class MockCourseRepository implements ICourseRepository {
  // Phases
  async getAllPhases(): Promise<Phase[]> {
    return Promise.resolve(phases);
  }

  async getPhaseById(id: string): Promise<Phase | null> {
    return Promise.resolve(getPhaseById(id) || null);
  }

  async getPhaseByNumber(number: number): Promise<Phase | null> {
    return Promise.resolve(getPhaseByNumber(number) || null);
  }

  // Modules
  async getAllModules(): Promise<Module[]> {
    return Promise.resolve(modules);
  }

  async getModuleById(id: string): Promise<Module | null> {
    return Promise.resolve(getModuleById(id) || null);
  }

  async getModulesByPhaseId(phaseId: string): Promise<Module[]> {
    return Promise.resolve(getModulesByPhaseId(phaseId));
  }

  // Lessons
  async getAllLessons(): Promise<Lesson[]> {
    return Promise.resolve(lessons);
  }

  async getLessonById(id: string): Promise<Lesson | null> {
    return Promise.resolve(getLessonById(id) || null);
  }

  async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    return Promise.resolve(getLessonsByModuleId(moduleId));
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Promise.resolve(projects);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return Promise.resolve(getProjectById(id) || null);
  }

  async getProjectsByModuleId(moduleId: string): Promise<Project[]> {
    return Promise.resolve(getProjectsByModuleId(moduleId));
  }
}

// Singleton instance
let mockCourseRepository: MockCourseRepository | null = null;

export function getMockCourseRepository(): MockCourseRepository {
  if (!mockCourseRepository) {
    mockCourseRepository = new MockCourseRepository();
  }
  return mockCourseRepository;
}
