// Phase Detail Presenter

import { certificates } from "@/src/data/master";
import type { Lesson } from "@/src/data/master/lessons";
import type { Module } from "@/src/data/master/modules";
import type { Phase } from "@/src/data/master/phases";
import type { Project } from "@/src/data/master/projects";
import type { ICourseRepository } from "@/src/domain/repositories/ICourseRepository";
import { getMockCourseRepository } from "@/src/infrastructure/repositories/MockCourseRepository";

export interface PhaseViewModel {
  phase: Phase;
  modules: Module[];
  lessonsPerModule: Record<string, Lesson[]>;
  projectsPerModule: Record<string, Project[]>;
  certificate: (typeof certificates)[0] | null;
  prevPhase: Phase | null;
  nextPhase: Phase | null;
}

export class PhasePresenter {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getViewModel(phaseNumber: number): Promise<PhaseViewModel | null> {
    const phase = await this.courseRepository.getPhaseByNumber(phaseNumber);
    if (!phase) return null;

    const [modules, allPhases, allLessons, allProjects] = await Promise.all([
      this.courseRepository.getModulesByPhaseId(phase.id),
      this.courseRepository.getAllPhases(),
      this.courseRepository.getAllLessons(),
      this.courseRepository.getAllProjects(),
    ]);

    // Build lessons per module
    const lessonsPerModule: Record<string, Lesson[]> = {};
    const projectsPerModule: Record<string, Project[]> = {};

    modules.forEach((module) => {
      lessonsPerModule[module.id] = allLessons.filter(
        (l) => l.moduleId === module.id
      );
      projectsPerModule[module.id] = allProjects.filter(
        (p) => p.moduleId === module.id
      );
    });

    // Get adjacent phases
    const phaseIndex = allPhases.findIndex((p) => p.id === phase.id);
    const prevPhase = phaseIndex > 0 ? allPhases[phaseIndex - 1] : null;
    const nextPhase =
      phaseIndex < allPhases.length - 1 ? allPhases[phaseIndex + 1] : null;

    // Get certificate
    const certificate =
      certificates.find((c) => c.phase === phase.number) || null;

    return {
      phase,
      modules,
      lessonsPerModule,
      projectsPerModule,
      certificate,
      prevPhase,
      nextPhase,
    };
  }

  generateMetadata(phase: Phase) {
    return {
      title: `Phase ${phase.number}: ${phase.titleTh} | Play Stack`,
      description: phase.descriptionTh,
    };
  }
}

export async function createServerPhasePresenter(): Promise<PhasePresenter> {
  const repository = getMockCourseRepository();
  return new PhasePresenter(repository);
}

export function createClientPhasePresenter(): PhasePresenter {
  const repository = getMockCourseRepository();
  return new PhasePresenter(repository);
}
