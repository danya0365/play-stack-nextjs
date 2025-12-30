"use client";

import { PhaseViewModel } from "@/src/presentation/presenters/phase/PhasePresenter";
import { usePhasePresenter } from "@/src/presentation/presenters/phase/usePhasePresenter";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import Link from "next/link";

interface PhaseViewProps {
  phaseNumber: number;
  initialViewModel?: PhaseViewModel;
}

export function PhaseView({ phaseNumber, initialViewModel }: PhaseViewProps) {
  const { layout } = useLayoutStore();
  const [state, actions] = usePhasePresenter(phaseNumber, initialViewModel);

  if (state.loading && !state.viewModel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!state.viewModel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400">ไม่พบ Phase นี้</p>
          <Link href="/courses" className="main-btn main-btn-primary mt-4">
            กลับไปหน้าคอร์ส
          </Link>
        </div>
      </div>
    );
  }

  const { phase, modules, lessonsPerModule, projectsPerModule, certificate, prevPhase, nextPhase } = state.viewModel;

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">
            {phase.icon} Phase {phase.number}
          </span>
          <div className="py-2">
            <h1 className="text-base font-bold mb-1">{phase.titleTh}</h1>
            <p className="text-xs mb-2">{phase.descriptionTh}</p>
            <div className="flex gap-4 text-xs">
              <span>⏱️ {phase.duration}</span>
              <span>📦 {modules.length} modules</span>
              <span className="capitalize">📊 {phase.level}</span>
              {certificate && <span>{certificate.icon} {certificate.name}</span>}
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📁 Modules</span>
          <div className="space-y-2 mt-2">
            {modules.map((module) => {
              const moduleLessons = lessonsPerModule[module.id] || [];
              const moduleProjects = projectsPerModule[module.id] || [];

              return (
                <Link
                  key={module.id}
                  href={`/courses/${phaseNumber}/${module.number}`}
                  className="block retro-card hover:bg-blue-900 hover:text-white"
                >
                  <div className="flex items-start gap-2">
                    <span>{module.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs">
                        Module {module.number}: {module.titleTh}
                      </div>
                      <div className="text-xs mt-1">{module.descriptionTh}</div>
                      <div className="text-xs mt-1 text-gray-500">
                        ⏱️ {module.duration} | 📖 {moduleLessons.length} lessons | 🛠️ {moduleProjects.length} projects
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {prevPhase ? (
            <Link href={`/courses/${prevPhase.number}`} className="retro-btn">
              ← Phase {prevPhase.number}
            </Link>
          ) : (
            <div />
          )}
          {nextPhase && (
            <Link href={`/courses/${nextPhase.number}`} className="retro-btn">
              Phase {nextPhase.number} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Main layout
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/courses" className="text-indigo-600 hover:underline">
            คอร์สเรียน
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">
            Phase {phase.number}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{phase.icon}</span>
            <div>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${phase.color} text-white`}
              >
                Phase {phase.number}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {phase.titleTh}
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {phase.descriptionTh}
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            <span>⏱️ {phase.duration}</span>
            <span>📦 {modules.length} modules</span>
            <span className="capitalize">📊 {phase.level}</span>
            {certificate && (
              <span>
                {certificate.icon} {certificate.name}
              </span>
            )}
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📦 Modules
          </h2>
          {modules.map((module) => {
            const moduleLessons = lessonsPerModule[module.id] || [];
            const moduleProjects = projectsPerModule[module.id] || [];

            return (
              <Link
                key={module.id}
                href={`/courses/${phaseNumber}/${module.number}`}
                className="block main-card group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{module.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {module.number}: {module.titleTh}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {module.descriptionTh}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>⏱️ {module.duration}</span>
                      <span>📖 {moduleLessons.length} lessons</span>
                      <span>🛠️ {moduleProjects.length} projects</span>
                      {module.engine && <span>🔧 {module.engine}</span>}
                    </div>
                  </div>
                  <span className="text-2xl text-gray-300 group-hover:text-indigo-500 transition-colors">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          {prevPhase ? (
            <Link
              href={`/courses/${prevPhase.number}`}
              className="main-btn main-btn-secondary"
            >
              ← Phase {prevPhase.number}: {prevPhase.titleTh}
            </Link>
          ) : (
            <Link href="/courses" className="main-btn main-btn-secondary">
              ← กลับ
            </Link>
          )}
          {nextPhase && (
            <Link
              href={`/courses/${nextPhase.number}`}
              className="main-btn main-btn-primary"
            >
              Phase {nextPhase.number}: {nextPhase.titleTh} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
