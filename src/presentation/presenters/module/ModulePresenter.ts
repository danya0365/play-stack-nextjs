// Module Detail Presenter

import type { Lesson } from "@/src/data/master/lessons";
import type { Module } from "@/src/data/master/modules";
import type { Phase } from "@/src/data/master/phases";
import type { Project } from "@/src/data/master/projects";
import type { ICourseRepository } from "@/src/domain/repositories/ICourseRepository";
import { getMockCourseRepository } from "@/src/infrastructure/repositories/MockCourseRepository";

export interface ModuleViewModel {
  phase: Phase;
  module: Module;
  lessons: Lesson[];
  projects: Project[];
  prevModule: Module | null;
  nextModule: Module | null;
}

export class ModulePresenter {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getViewModel(
    phaseNumber: number,
    moduleNumber: string
  ): Promise<ModuleViewModel | null> {
    const phase = await this.courseRepository.getPhaseByNumber(phaseNumber);
    if (!phase) return null;

    const modules = await this.courseRepository.getModulesByPhaseId(phase.id);
    const module = modules.find((m) => m.number === moduleNumber);
    if (!module) return null;

    const [lessons, projects] = await Promise.all([
      this.courseRepository.getLessonsByModuleId(module.id),
      this.courseRepository.getProjectsByModuleId(module.id),
    ]);

    // Get adjacent modules
    const moduleIndex = modules.findIndex((m) => m.id === module.id);
    const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
    const nextModule =
      moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;

    return {
      phase,
      module,
      lessons,
      projects,
      prevModule,
      nextModule,
    };
  }

  generateMetadata(module: Module, phase: Phase) {
    return {
      title: `${module.number}: ${module.titleTh} | Play Stack`,
      description: module.descriptionTh,
    };
  }
}

export async function createServerModulePresenter(): Promise<ModulePresenter> {
  const repository = getMockCourseRepository();
  return new ModulePresenter(repository);
}

export function createClientModulePresenter(): ModulePresenter {
  const repository = getMockCourseRepository();
  return new ModulePresenter(repository);
}
