"use client";

import { ModuleViewModel } from "@/src/presentation/presenters/module/ModulePresenter";
import { useModulePresenter } from "@/src/presentation/presenters/module/useModulePresenter";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import Link from "next/link";

interface ModuleViewProps {
  phaseNumber: number;
  moduleNumber: string;
  initialViewModel?: ModuleViewModel;
}

export function ModuleView({
  phaseNumber,
  moduleNumber,
  initialViewModel,
}: ModuleViewProps) {
  const { layout } = useLayoutStore();
  const [state] = useModulePresenter(phaseNumber, moduleNumber, initialViewModel);

  if (state.loading && !state.viewModel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📦</div>
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
          <p className="text-gray-600 dark:text-gray-400">ไม่พบ Module นี้</p>
          <Link
            href={`/courses/${phaseNumber}`}
            className="main-btn main-btn-primary mt-4"
          >
            กลับ
          </Link>
        </div>
      </div>
    );
  }

  const { phase, module, lessons, projects, prevModule, nextModule } =
    state.viewModel;

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Breadcrumb */}
        <div className="text-xs mb-2">
          <Link href="/courses" className="retro-link">Courses</Link>
          {" > "}
          <Link href={`/courses/${phaseNumber}`} className="retro-link">
            Phase {phaseNumber}
          </Link>
          {" > "}
          <span>Module {module.number}</span>
        </div>

        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">
            {module.icon} Module {module.number}
          </span>
          <div className="py-2">
            <h1 className="text-base font-bold mb-1">{module.titleTh}</h1>
            <p className="text-xs mb-2">{module.descriptionTh}</p>
            <div className="flex gap-4 text-xs">
              <span>⏱️ {module.duration}</span>
              <span>📖 {lessons.length} lessons</span>
              <span>🛠️ {projects.length} projects</span>
              {module.engine && <span>🔧 {module.engine}</span>}
            </div>
          </div>
        </div>

        {/* Lessons */}
        {lessons.length > 0 && (
          <div className="retro-groupbox">
            <span className="retro-groupbox-title">📖 Lessons</span>
            <div className="space-y-1 mt-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-2 p-2 border border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer text-xs"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold">{lesson.titleTh}</div>
                    <div className="text-xs opacity-75">
                      {lesson.descriptionTh}
                    </div>
                  </div>
                  <span className="text-xs">{lesson.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="retro-groupbox">
            <span className="retro-groupbox-title">🛠️ Projects</span>
            <div className="space-y-1 mt-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="retro-card hover:bg-blue-900 hover:text-white"
                >
                  <div className="font-bold text-xs">{project.titleTh}</div>
                  <div className="text-xs">{project.descriptionTh}</div>
                  <div className="text-xs mt-1 capitalize">
                    📊 {project.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {prevModule ? (
            <Link
              href={`/courses/${phaseNumber}/${prevModule.number}`}
              className="retro-btn"
            >
              ← {prevModule.number}
            </Link>
          ) : (
            <Link href={`/courses/${phaseNumber}`} className="retro-btn">
              ← Back
            </Link>
          )}
          {nextModule && (
            <Link
              href={`/courses/${phaseNumber}/${nextModule.number}`}
              className="retro-btn"
            >
              {nextModule.number} →
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
          <Link
            href={`/courses/${phaseNumber}`}
            className="text-indigo-600 hover:underline"
          >
            Phase {phaseNumber}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">
            {module.number}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{module.icon}</span>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Module {module.number}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {module.titleTh}
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {module.descriptionTh}
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            <span>⏱️ {module.duration}</span>
            <span>📖 {lessons.length} lessons</span>
            <span>🛠️ {projects.length} projects</span>
            {module.engine && <span>🔧 {module.engine}</span>}
          </div>
          {module.tools && module.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {module.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lessons */}
        {lessons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📖 Lessons
            </h2>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="main-card flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {lesson.titleTh}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lesson.descriptionTh}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">{lesson.duration}</div>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      lesson.type === "theory"
                        ? "bg-blue-100 text-blue-700"
                        : lesson.type === "practice"
                        ? "bg-green-100 text-green-700"
                        : lesson.type === "project"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {lesson.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🛠️ Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="main-card">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {project.titleTh}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {project.descriptionTh}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span
                      className={`px-2 py-0.5 rounded-full capitalize ${
                        project.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : project.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    <span>{project.features.length} features</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          {prevModule ? (
            <Link
              href={`/courses/${phaseNumber}/${prevModule.number}`}
              className="main-btn main-btn-secondary"
            >
              ← {prevModule.number}: {prevModule.titleTh}
            </Link>
          ) : (
            <Link
              href={`/courses/${phaseNumber}`}
              className="main-btn main-btn-secondary"
            >
              ← กลับ
            </Link>
          )}
          {nextModule && (
            <Link
              href={`/courses/${phaseNumber}/${nextModule.number}`}
              className="main-btn main-btn-primary"
            >
              {nextModule.number}: {nextModule.titleTh} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
