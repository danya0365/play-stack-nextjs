"use client";

import { useCallback, useEffect, useState } from "react";
import { ModuleViewModel, createClientModulePresenter } from "./ModulePresenter";

const presenter = createClientModulePresenter();

export interface ModulePresenterState {
  viewModel: ModuleViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useModulePresenter(
  phaseNumber: number,
  moduleNumber: string,
  initialViewModel?: ModuleViewModel
): [ModulePresenterState, { loadData: () => Promise<void> }] {
  const [viewModel, setViewModel] = useState<ModuleViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await presenter.getViewModel(phaseNumber, moduleNumber);
      setViewModel(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [phaseNumber, moduleNumber]);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  return [{ viewModel, loading, error }, { loadData }];
}
