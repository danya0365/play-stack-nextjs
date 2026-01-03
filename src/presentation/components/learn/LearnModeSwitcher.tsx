"use client";

import { LearnViewMode, useLearnModeStore } from "@/src/presentation/stores/learnModeStore";

const modes: { mode: LearnViewMode; icon: string; label: string }[] = [
  { mode: "normal", icon: "📋", label: "ปกติ" },
  { mode: "presentation", icon: "📊", label: "Presentation" },
  { mode: "cinema", icon: "🎬", label: "Cinema" },
  { mode: "podcast", icon: "🎧", label: "Podcast" },
];

interface LearnModeSwitcherProps {
  brandColor: "yellow" | "blue";
}

export function LearnModeSwitcher({ brandColor }: LearnModeSwitcherProps) {
  const { viewMode, setViewMode, reset } = useLearnModeStore();

  const handleModeChange = (mode: LearnViewMode) => {
    if (mode !== viewMode) {
      reset();
      setViewMode(mode);
    }
  };

  const colorClasses = {
    yellow: {
      active: "bg-yellow-500 text-black",
      hover: "hover:bg-yellow-500/20 hover:text-yellow-300",
    },
    blue: {
      active: "bg-blue-500 text-white",
      hover: "hover:bg-blue-500/20 hover:text-blue-300",
    },
  };

  const colors = colorClasses[brandColor];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
      {modes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => handleModeChange(mode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === mode
              ? colors.active
              : `text-gray-400 ${colors.hover}`
          }`}
        >
          <span>{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
