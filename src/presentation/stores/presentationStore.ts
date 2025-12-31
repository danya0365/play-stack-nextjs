"use client";

import { create } from "zustand";

interface Slide {
  html: string;
  title?: string;
}

interface PresentationState {
  // State
  isPresenting: boolean;
  currentSlide: number;
  slides: Slide[];

  // Actions
  enterPresentation: (slides: Slide[]) => void;
  exitPresentation: () => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const usePresentationStore = create<PresentationState>()((set, get) => ({
  // Initial state
  isPresenting: false,
  currentSlide: 0,
  slides: [],

  // Enter presentation mode with slides data
  enterPresentation: (slides) =>
    set({
      isPresenting: true,
      currentSlide: 0,
      slides,
    }),

  // Exit presentation mode
  exitPresentation: () =>
    set({
      isPresenting: false,
      currentSlide: 0,
      slides: [],
    }),

  // Navigate to specific slide
  goToSlide: (index) => {
    const { slides } = get();
    if (index >= 0 && index < slides.length) {
      set({ currentSlide: index });
    }
  },

  // Next slide
  nextSlide: () => {
    const { currentSlide, slides } = get();
    if (currentSlide < slides.length - 1) {
      set({ currentSlide: currentSlide + 1 });
    }
  },

  // Previous slide
  prevSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 0) {
      set({ currentSlide: currentSlide - 1 });
    }
  },
}));
