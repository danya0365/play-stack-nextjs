"use client";

import { useCallback, useEffect, useState } from "react";
import {
    CoursesViewModel,
    createClientCoursesPresenter,
} from "./CoursesPresenter";

const presenter = createClientCoursesPresenter();

export interface CoursesPresenterState {
  viewModel: CoursesViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface CoursesPresenterActions {
  loadData: () => Promise<void>;
}

export function useCoursesPresenter(
  initialViewModel?: CoursesViewModel
): [CoursesPresenterState, CoursesPresenterActions] {
  const [viewModel, setViewModel] = useState<CoursesViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await presenter.getViewModel();
      setViewModel(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  return [{ viewModel, loading, error }, { loadData }];
}
