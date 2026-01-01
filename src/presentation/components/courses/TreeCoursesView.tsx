"use client";

import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import { useCoursesPresenter } from "@/src/presentation/presenters/courses/useCoursesPresenter";
import { FullScreenTreeView } from "./FullScreenTreeView";

interface TreeCoursesViewProps {
  initialViewModel?: CoursesViewModel;
}

export function TreeCoursesView({ initialViewModel }: TreeCoursesViewProps) {
  const [state] = useCoursesPresenter(initialViewModel);

  if (state.loading && !state.viewModel) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🌲</div>
          <p className="text-gray-600 dark:text-gray-400">
            กำลังโหลด Tree View...
          </p>
        </div>
      </div>
    );
  }

  if (state.error && !state.viewModel) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400">{state.error}</p>
        </div>
      </div>
    );
  }

  if (!state.viewModel) return null;

  return <FullScreenTreeView viewModel={state.viewModel} />;
}
