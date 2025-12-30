// Courses Presenter
// Following Clean Architecture pattern

import { certificates, courseConfig, learningPaths } from "@/src/data/master";
import type { Module } from "@/src/data/master/modules";
import type { Phase } from "@/src/data/master/phases";
import type { ICourseRepository } from "@/src/domain/repositories/ICourseRepository";
import { getMockCourseRepository } from "@/src/infrastructure/repositories/MockCourseRepository";

export interface CoursesViewModel {
  phases: Phase[];
  modules: Module[];
  courseConfig: typeof courseConfig;
  learningPaths: typeof learningPaths;
  certificates: typeof certificates;
}

export class CoursesPresenter {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getViewModel(): Promise<CoursesViewModel> {
    const [phases, modules] = await Promise.all([
      this.courseRepository.getAllPhases(),
      this.courseRepository.getAllModules(),
    ]);

    return {
      phases,
      modules,
      courseConfig,
      learningPaths,
      certificates,
    };
  }

  generateMetadata() {
    return {
      title: "คอร์สเรียน | Play Stack",
      description: "เรียนรู้การพัฒนาเกมตั้งแต่พื้นฐานจนถึงระดับมืออาชีพ ครอบคลุม 5 เฟส",
    };
  }
}

// Server factory
export async function createServerCoursesPresenter(): Promise<CoursesPresenter> {
  const repository = getMockCourseRepository();
  return new CoursesPresenter(repository);
}

// Client factory
export function createClientCoursesPresenter(): CoursesPresenter {
  const repository = getMockCourseRepository();
  return new CoursesPresenter(repository);
}
