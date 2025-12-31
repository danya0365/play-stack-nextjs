"use client";

import { getLessonsByModuleId, Lesson } from "@/src/data/master/lessons";
import { getModulesByPhaseId, Module } from "@/src/data/master/modules";
import { Phase } from "@/src/data/master/phases";
import { getLessonComponent, hasLessonComponent } from "@/src/presentation/components/lessons";
import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { useEffect, useMemo, useState } from "react";

interface FullScreenTreeViewProps {
  viewModel: CoursesViewModel;
  onExit: () => void;
}

interface TreeState {
  [key: string]: boolean;
}

interface LessonWithContext {
  lesson: Lesson;
  phase: Phase;
  module: Module;
}

export function FullScreenTreeView({ viewModel, onExit }: FullScreenTreeViewProps) {
  const { phases } = viewModel;
  const { isLessonComplete, markLessonComplete } = useProgressStore();
  
  // Build flat list of all lessons with their context
  const allLessons = useMemo<LessonWithContext[]>(() => {
    const list: LessonWithContext[] = [];
    phases.forEach(phase => {
      const modules = getModulesByPhaseId(phase.id);
      modules.forEach(mod => {
        const lessons = getLessonsByModuleId(mod.id);
        lessons.forEach(lesson => {
          list.push({ lesson, phase, module: mod });
        });
      });
    });
    return list;
  }, [phases]);
  
  // Selected lesson
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  
  // Current index in flat list
  const currentIndex = useMemo(() => {
    if (!selectedLesson) return -1;
    return allLessons.findIndex(l => l.lesson.id === selectedLesson.id);
  }, [selectedLesson, allLessons]);
  
  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Track which phases and modules are expanded
  const [expandedPhases, setExpandedPhases] = useState<TreeState>(() => {
    const initial: TreeState = {};
    phases.forEach((phase, idx) => {
      initial[phase.id] = idx === 0;
    });
    return initial;
  });
  
  const [expandedModules, setExpandedModules] = useState<TreeState>({});

  // Select first available lesson on mount
  useEffect(() => {
    if (!selectedLesson && allLessons.length > 0) {
      const first = allLessons[0];
      setSelectedLesson(first.lesson);
      setSelectedPhase(first.phase);
      setSelectedModule(first.module);
      setExpandedModules({ [first.module.id]: true });
    }
  }, [allLessons, selectedLesson]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSelectLesson = (lesson: Lesson, phase: Phase, module: Module) => {
    setSelectedLesson(lesson);
    setSelectedPhase(phase);
    setSelectedModule(module);
    // Auto-expand the phase and module
    setExpandedPhases(prev => ({ ...prev, [phase.id]: true }));
    setExpandedModules(prev => ({ ...prev, [module.id]: true }));
  };

  // Navigation functions
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prev = allLessons[currentIndex - 1];
      handleSelectLesson(prev.lesson, prev.phase, prev.module);
    }
  };

  const goToNext = () => {
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      handleSelectLesson(next.lesson, next.phase, next.module);
    }
  };

  // Mark complete and go next
  const handleCompleteAndNext = () => {
    if (selectedLesson) {
      markLessonComplete(selectedLesson.id);
      goToNext();
    }
  };

  // Get lesson component
  const LessonComponent = selectedLesson ? getLessonComponent(selectedLesson.id) : null;

  // Check if at first or last lesson
  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === allLessons.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-100 dark:bg-slate-900">
      {/* Left Sidebar */}
      <aside 
        className={`flex-shrink-0 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700">
          <h2 className="font-bold text-gray-900 dark:text-white">📚 เนื้อหาทั้งหมด</h2>
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            title="ออกจาก Tree Mode"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="px-4 py-2 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>ความคืบหน้า</span>
            <span>{currentIndex + 1} / {allLessons.length}</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Tree Navigation */}
        <div className="flex-1 overflow-y-auto">
          {phases.map((phase) => {
            const phaseModules = getModulesByPhaseId(phase.id);
            const isExpanded = expandedPhases[phase.id];
            
            // Calculate progress
            let totalLessons = 0;
            let completedLessons = 0;
            phaseModules.forEach(mod => {
              const lessons = getLessonsByModuleId(mod.id);
              totalLessons += lessons.length;
              lessons.forEach(l => {
                if (isLessonComplete(l.id)) completedLessons++;
              });
            });

            return (
              <div key={phase.id} className="border-b dark:border-slate-700/50">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                  <span className="text-lg">{phase.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {phase.titleTh}
                  </span>
                  <span className="text-xs text-gray-400">{completedLessons}/{totalLessons}</span>
                </button>

                {/* Modules */}
                {isExpanded && (
                  <div className="bg-slate-50 dark:bg-slate-900/30">
                    {phaseModules.map((mod) => {
                      const lessons = getLessonsByModuleId(mod.id);
                      const isModuleExpanded = expandedModules[mod.id];
                      const modCompleted = lessons.filter(l => isLessonComplete(l.id)).length;

                      return (
                        <div key={mod.id}>
                          {/* Module Header */}
                          <button
                            onClick={() => toggleModule(mod.id)}
                            className="w-full pl-8 pr-4 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors text-left"
                          >
                            <span className={`text-xs transition-transform ${isModuleExpanded ? 'rotate-90' : ''}`}>▶</span>
                            <span>{mod.icon}</span>
                            <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">
                              {mod.number} {mod.titleTh}
                            </span>
                            <span className="text-xs text-gray-400">{modCompleted}/{lessons.length}</span>
                          </button>

                          {/* Lessons */}
                          {isModuleExpanded && (
                            <div className="bg-white dark:bg-slate-800/50">
                              {lessons.map((lesson) => {
                                const isComplete = isLessonComplete(lesson.id);
                                const isSelected = selectedLesson?.id === lesson.id;
                                
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => handleSelectLesson(lesson, phase, mod)}
                                    className={`w-full pl-14 pr-4 py-2 flex items-center gap-2 transition-colors text-left ${
                                      isSelected 
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 border-l-2 border-indigo-500' 
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'
                                    }`}
                                  >
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                      isComplete 
                                        ? 'bg-green-500 text-white' 
                                        : isSelected
                                          ? 'bg-indigo-500 text-white'
                                          : 'border border-gray-300 dark:border-gray-600'
                                    }`}>
                                      {isComplete ? '✓' : isSelected ? '●' : ''}
                                    </span>
                                    <span className={`flex-1 text-xs truncate ${
                                      isSelected 
                                        ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                      {lesson.number} {lesson.titleTh}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarCollapsed(prev => !prev)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-r-lg flex items-center justify-center transition-all"
        style={{ left: sidebarCollapsed ? 0 : '320px' }}
      >
        <span className={`text-xs transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}>▶</span>
      </button>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between">
          <div>
            {selectedLesson && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>{selectedPhase?.icon}</span>
                  <span>{selectedPhase?.titleTh}</span>
                  <span>→</span>
                  <span>{selectedModule?.titleTh}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedLesson.number} - {selectedLesson.titleTh}
                </h1>
              </>
            )}
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors"
          >
            ออก
          </button>
        </header>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedLesson && LessonComponent ? (
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <LessonComponent />
            </div>
          ) : selectedLesson && !hasLessonComponent(selectedLesson.id) ? (
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedLesson.titleTh}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedLesson.descriptionTh}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                🚧 เนื้อหากำลังจัดทำ
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">👈</div>
                <p>เลือกบทเรียนจากเมนูด้านซ้าย</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <footer className="flex-shrink-0 px-6 py-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={isFirstLesson}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFirstLesson
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>←</span>
              <span>ก่อนหน้า</span>
            </button>

            {/* Center - Complete & Next / or just Next if completed */}
            <div className="flex items-center gap-3">
              {selectedLesson && !isLessonComplete(selectedLesson.id) && !isLastLesson && (
                <button
                  onClick={handleCompleteAndNext}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/25"
                >
                  ✓ เรียนจบ → ถัดไป
                </button>
              )}
              {selectedLesson && !isLessonComplete(selectedLesson.id) && isLastLesson && (
                <button
                  onClick={() => markLessonComplete(selectedLesson.id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/25"
                >
                  ✓ เรียนจบหลักสูตร! 🎉
                </button>
              )}
              {selectedLesson && isLessonComplete(selectedLesson.id) && (
                <span className="text-green-500 font-medium">✓ เรียนจบแล้ว</span>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={isLastLesson}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLastLesson
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>ถัดไป</span>
              <span>→</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

