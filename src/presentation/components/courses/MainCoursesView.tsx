"use client";

import { getModulesByPhaseId } from "@/src/data/master/modules";
import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import { animated, useSpring, useTrail } from "@react-spring/web";
import Link from "next/link";

interface MainCoursesViewProps {
  viewModel: CoursesViewModel;
}

export function MainCoursesView({ viewModel }: MainCoursesViewProps) {
  const { phases, courseConfig, learningPaths, certificates } = viewModel;

  // Header animation
  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
  });

  // Cards trail
  const trail = useTrail(phases.length, {
    from: { opacity: 0, y: 30, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1 },
    delay: 200,
  });

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <animated.div style={headerSpring} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📚 คอร์สเรียนทั้งหมด
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {courseConfig.descriptionTh}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>⏱️ {courseConfig.totalDuration}</span>
            <span>📦 {courseConfig.totalModules} modules</span>
            <span>🎯 {courseConfig.totalPhases} phases</span>
          </div>
        </animated.div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-2">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            >
              📊 Grid
            </button>
            <Link
              href="/courses/tree"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
            >
              🌲 Tree
            </Link>
            <Link
              href="/courses/cinema"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
            >
              🎬 Cinema
            </Link>
            <Link
              href="/courses/podcast"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
            >
              🎧 Podcast
            </Link>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="space-y-6 mb-12">
          {trail.map((style, index) => {
            const phase = phases[index];
            const phaseModules = getModulesByPhaseId(phase.id);
            const cert = certificates.find((c) => c.phase === phase.number);

            return (
              <animated.div key={phase.id} style={style}>
                <Link
                  href={`/courses/${phase.number}`}
                  className="block main-card hover:shadow-2xl group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Icon */}
                    <div className="text-5xl flex-shrink-0">{phase.icon}</div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${phase.color} text-white`}
                        >
                          Phase {phase.number}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {phase.level}
                        </span>
                        {cert && (
                          <span className="text-xs" title={cert.name}>
                            {cert.icon}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {phase.titleTh}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {phase.descriptionTh}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>⏱️ {phase.duration}</span>
                        <span>📦 {phaseModules.length} modules</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-2xl text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              </animated.div>
            );
          })}
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🎯 เส้นทางการเรียนรู้
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="main-card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {path.titleTh}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {path.goalTh}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>⏱️ {path.duration}</span>
                  <span>{path.phases.length} phases</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
