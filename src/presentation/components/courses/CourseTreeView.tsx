"use client";

import { getLessonsByModuleId } from "@/src/data/master/lessons";
import { getModulesByPhaseId } from "@/src/data/master/modules";
import { CoursesViewModel } from "@/src/presentation/presenters/courses/CoursesPresenter";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { useState } from "react";

interface CourseTreeViewProps {
  viewModel: CoursesViewModel;
}

interface TreeState {
  [key: string]: boolean;
}

export function CourseTreeView({ viewModel }: CourseTreeViewProps) {
  const { phases } = viewModel;
  const { isLessonComplete, getCompletedLessonCount } = useProgressStore();
  
  // Track which phases and modules are expanded
  const [expandedPhases, setExpandedPhases] = useState<TreeState>(() => {
    // Default: expand first phase
    const initial: TreeState = {};
    phases.forEach((phase, idx) => {
      initial[phase.id] = idx === 0;
    });
    return initial;
  });
  
  const [expandedModules, setExpandedModules] = useState<TreeState>({});

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Animation for container
  const containerSpring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  });

  return (
    <animated.div style={containerSpring} className="space-y-2">
      {phases.map((phase) => {
        const phaseModules = getModulesByPhaseId(phase.id);
        const isExpanded = expandedPhases[phase.id];
        
        // Calculate progress for phase
        let totalLessons = 0;
        let completedLessons = 0;
        phaseModules.forEach(mod => {
          const lessons = getLessonsByModuleId(mod.id);
          totalLessons += lessons.length;
          lessons.forEach(l => {
            if (isLessonComplete(l.id)) completedLessons++;
          });
        });
        const isPhaseComplete = totalLessons > 0 && completedLessons === totalLessons;

        return (
          <div key={phase.id} className="rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
            {/* Phase Header */}
            <button
              onClick={() => togglePhase(phase.id)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span className={`text-sm transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
              <span className="text-2xl">{phase.icon}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${phase.color} text-white`}>
                    Phase {phase.number}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {phase.titleTh}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{completedLessons}/{totalLessons}</span>
                {isPhaseComplete && <span className="text-green-500">✓</span>}
              </div>
            </button>

            {/* Modules List */}
            {isExpanded && (
              <div className="border-t dark:border-slate-700">
                {phaseModules.map((mod) => {
                  const lessons = getLessonsByModuleId(mod.id);
                  const isModuleExpanded = expandedModules[mod.id];
                  
                  // Module progress
                  const modCompleted = lessons.filter(l => isLessonComplete(l.id)).length;
                  const isModuleComplete = lessons.length > 0 && modCompleted === lessons.length;

                  return (
                    <div key={mod.id}>
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full pl-10 pr-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b dark:border-slate-700/50"
                      >
                        <span className={`text-xs transition-transform ${isModuleExpanded ? 'rotate-90' : ''}`}>
                          ▶
                        </span>
                        <span className="text-lg">{mod.icon}</span>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {mod.number} - {mod.titleTh}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{modCompleted}/{lessons.length}</span>
                          {isModuleComplete && <span className="text-green-500">✓</span>}
                        </div>
                      </button>

                      {/* Lessons List */}
                      {isModuleExpanded && (
                        <div className="bg-slate-50 dark:bg-slate-900/50">
                          {lessons.map((lesson) => {
                            const isComplete = isLessonComplete(lesson.id);
                            
                            return (
                              <Link
                                key={lesson.id}
                                href={`/courses/${phase.number}/${mod.id}/${lesson.id}`}
                                className="flex items-center gap-3 pl-16 pr-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                                  isComplete 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                                }`}>
                                  {isComplete ? '✓' : '○'}
                                </span>
                                <div className="flex-1">
                                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {lesson.number} - {lesson.titleTh}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span className={`px-1.5 py-0.5 rounded ${
                                    lesson.type === 'theory' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                    lesson.type === 'practice' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    lesson.type === 'project' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                    'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                  }`}>
                                    {lesson.type}
                                  </span>
                                  <span>{lesson.duration}</span>
                                </div>
                              </Link>
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
    </animated.div>
  );
}
