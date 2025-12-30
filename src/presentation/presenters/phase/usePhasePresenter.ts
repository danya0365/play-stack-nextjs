"use client";

import { useCallback, useEffect, useState } from "react";
import { PhaseViewModel, createClientPhasePresenter } from "./PhasePresenter";

const presenter = createClientPhasePresenter();

export interface PhasePresenterState {
  viewModel: PhaseViewModel | null;
  loading: boolean;
  error: string | null;
}

export function usePhasePresenter(
  phaseNumber: number,
  initialViewModel?: PhaseViewModel
): [PhasePresenterState, { loadData: () => Promise<void> }] {
  const [viewModel, setViewModel] = useState<PhaseViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await presenter.getViewModel(phaseNumber);
      setViewModel(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [phaseNumber]);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  return [{ viewModel, loading, error }, { loadData }];
}
