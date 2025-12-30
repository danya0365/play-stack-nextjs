"use client";

import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import { useCoursesPresenter } from "@/src/presentation/presenters/courses/useCoursesPresenter";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainCoursesView } from "./MainCoursesView";
import { RetroCoursesView } from "./RetroCoursesView";

interface CoursesViewProps {
  initialViewModel?: CoursesViewModel;
}

export function CoursesView({ initialViewModel }: CoursesViewProps) {
  const { layout } = useLayoutStore();
  const [state, actions] = useCoursesPresenter(initialViewModel);

  if (state.loading && !state.viewModel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-600 dark:text-gray-400">
            กำลังโหลดคอร์สเรียน...
          </p>
        </div>
      </div>
    );
  }

  if (state.error && !state.viewModel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-2">{state.error}</p>
          <button
            onClick={actions.loadData}
            className="main-btn main-btn-primary"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!state.viewModel) return null;

  if (layout === "retro") {
    return <RetroCoursesView viewModel={state.viewModel} />;
  }

  return <MainCoursesView viewModel={state.viewModel} />;
}
