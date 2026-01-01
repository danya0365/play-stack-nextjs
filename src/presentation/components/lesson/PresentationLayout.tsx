"use client";

import { animated, config, useSpring } from "@react-spring/web";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePresentationStore } from "../../stores/presentationStore";

export function PresentationLayout() {
  const {
    isPresenting,
    currentSlide,
    slides,
    exitPresentation,
    nextSlide,
    prevSlide,
    goToSlide,
  } = usePresentationStore();

  const touchStartX = useRef(0);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Spring animation for slide transitions - only initialize when presenting
  const [springStyle, api] = useSpring(
    () => ({
      opacity: 1,
      x: 0,
      config: config.gentle,
    }),
    []
  );

  // Animation helper
  const animateSlide = useCallback(
    (direction: "next" | "prev") => {
      const offset = direction === "next" ? -30 : 30;
      api.start({
        from: { opacity: 0.5, x: offset },
        to: { opacity: 1, x: 0 },
      });
    },
    [api]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isPresenting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid repeated triggers from held keys
      if (e.repeat) return;
      
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          e.stopImmediatePropagation();
          nextSlide();
          animateSlide("next");
          break;
        case "ArrowLeft":
          e.preventDefault();
          e.stopImmediatePropagation();
          prevSlide();
          animateSlide("prev");
          break;
        case "Escape":
          e.preventDefault();
          e.stopImmediatePropagation();
          exitPresentation();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [isPresenting, nextSlide, prevSlide, exitPresentation, animateSlide]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
        animateSlide("next");
      } else {
        prevSlide();
        animateSlide("prev");
      }
    }
  };

  const handleNext = () => {
    nextSlide();
    animateSlide("next");
  };

  const handlePrev = () => {
    prevSlide();
    animateSlide("prev");
  };

  if (!isPresenting || slides.length === 0) {
    return null;
  }

  const totalSlides = slides.length;
  const currentHTML = slides[currentSlide]?.html || "";

  return (
    <div
      className="h-screen w-screen flex flex-col bg-slate-100 dark:bg-slate-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="flex-shrink-0 h-14 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <button
          onClick={exitPresentation}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Exit presentation mode"
        >
          <span>✕</span>
          <span className="hidden sm:inline">Exit</span>
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                goToSlide(idx);
                animateSlide(idx > currentSlide ? "next" : "prev");
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-indigo-600 scale-125"
                  : "bg-slate-300 dark:bg-slate-600 hover:bg-indigo-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {currentSlide + 1} / {totalSlides}
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto h-full">
          <animated.div
            style={springStyle}
            className="slide-content prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentHTML }}
          />
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="flex-shrink-0 h-16 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-slate-800 border-t dark:border-slate-700">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          <span>←</span>
          <span className="hidden sm:inline">ก่อนหน้า</span>
        </button>

        <div className="text-sm text-slate-400">
          ⌨️ ← → Space ESC
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <span className="hidden sm:inline">ถัดไป</span>
          <span>→</span>
        </button>
      </footer>
    </div>
  );
}
