"use client";

import { getModulesByPhaseId } from "@/src/data/master/modules";
import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import Link from "next/link";

interface RetroCoursesViewProps {
  viewModel: CoursesViewModel;
}

export function RetroCoursesView({ viewModel }: RetroCoursesViewProps) {
  const { phases, courseConfig, learningPaths, certificates } = viewModel;

  return (
    <div className="retro-page h-full overflow-auto">
      {/* Header */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📚 Courses</span>
        <div className="text-center py-2">
          <h1 className="text-base font-bold mb-1">
            {courseConfig.nameTh} - คอร์สเรียนทั้งหมด
          </h1>
          <p className="text-xs mb-2">{courseConfig.descriptionTh}</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>⏱️ {courseConfig.totalDuration}</span>
            <span>📦 {courseConfig.totalModules} modules</span>
            <span>🎯 {courseConfig.totalPhases} phases</span>
          </div>
        </div>
      </div>

      {/* Phase List */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📁 Phases</span>
        <table className="w-full text-xs mt-2">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-1 px-2">Phase</th>
              <th className="text-left py-1 px-2">Title</th>
              <th className="text-left py-1 px-2">Duration</th>
              <th className="text-left py-1 px-2">Modules</th>
              <th className="text-left py-1 px-2">Level</th>
              <th className="text-left py-1 px-2">Cert</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase) => {
              const phaseModules = getModulesByPhaseId(phase.id);
              const cert = certificates.find((c) => c.phase === phase.number);

              return (
                <tr
                  key={phase.id}
                  className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer"
                >
                  <td className="py-1 px-2">
                    <Link href={`/courses/${phase.number}`} className="block">
                      {phase.icon} Phase {phase.number}
                    </Link>
                  </td>
                  <td className="py-1 px-2">
                    <Link
                      href={`/courses/${phase.number}`}
                      className="retro-link"
                    >
                      {phase.titleTh}
                    </Link>
                  </td>
                  <td className="py-1 px-2">{phase.duration}</td>
                  <td className="py-1 px-2">{phaseModules.length}</td>
                  <td className="py-1 px-2 capitalize">{phase.level}</td>
                  <td className="py-1 px-2">{cert?.icon || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Learning Paths */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🎯 Learning Paths</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {learningPaths.map((path) => (
            <div key={path.id} className="retro-card">
              <div className="font-bold text-xs mb-1">{path.titleTh}</div>
              <div className="text-xs mb-1">{path.goalTh}</div>
              <div className="text-xs text-gray-600">
                ⏱️ {path.duration} | {path.phases.length} phases
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🏆 Certificates</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-400 text-xs"
            >
              <span>{cert.icon}</span>
              <span>{cert.name}</span>
              <span className="text-gray-500">(Phase {cert.phase})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
