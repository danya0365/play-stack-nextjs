"use client";

import { LessonContent } from "@/src/data/master/lessonContents";
import { getLessonComponent, hasLessonComponent } from "@/src/presentation/components/lessons";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LessonViewProps {
  lesson: LessonContent;
  phaseId: string;
  moduleId: string;
  nextLesson?: LessonContent;
  prevLesson?: LessonContent;
}

export function LessonView({
  lesson,
  phaseId,
  moduleId,
  nextLesson,
  prevLesson,
}: LessonViewProps) {
  const { layout } = useLayoutStore();
  const { 
    isLessonComplete, 
    markLessonComplete, 
    setCurrentLesson,
    totalPoints,
    getCompletedLessonCount 
  } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState<"content" | "code" | "challenge">("content");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);

  // Check completion status on mount
  useEffect(() => {
    setIsCompleted(isLessonComplete(lesson.id));
    setCurrentLesson(lesson.id, moduleId, phaseId);
  }, [lesson.id, moduleId, phaseId, isLessonComplete, setCurrentLesson]);

  const handleMarkComplete = () => {
    markLessonComplete(lesson.id);
    setIsCompleted(true);
    setShowCompletedMessage(true);
    setTimeout(() => setShowCompletedMessage(false), 3000);
  };

  // Parse markdown to simple HTML
  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-indigo-600 dark:text-indigo-400">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm">$1</code>')
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$2</code></pre>'
      )
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, "</p><p class='mb-4'>")
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
    
    return `<div class="prose dark:prose-invert max-w-none"><p class="mb-4">${html}</p></div>`;
  };

  // Completed toast
  const CompletedToast = () => (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${showCompletedMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg">
        <div className="font-bold">🎉 บทเรียนเสร็จสมบูรณ์!</div>
        <div className="text-sm">+10 Points • รวม {totalPoints + 10} pts • {getCompletedLessonCount() + 1} บทเรียน</div>
      </div>
    </div>
  );

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        <CompletedToast />
        
        {/* Progress Bar */}
        <div className="retro-groupbox mb-2">
          <div className="flex items-center justify-between text-xs">
            <span>🎯 Points: {totalPoints}</span>
            <span>📚 {getCompletedLessonCount()} บทเรียน</span>
          </div>
        </div>
        
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📖 {lesson.titleTh}</span>
          <div className="flex items-center justify-between py-1 text-xs">
            <span>⏱️ {lesson.duration} นาที</span>
            {isCompleted && <span className="text-green-600">✅ Completed</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`retro-btn text-xs ${activeTab === "content" ? "bg-blue-900 text-white" : ""}`}
          >
            📝 เนื้อหา
          </button>
          {lesson.codeExamples.length > 0 && (
            <button
              onClick={() => setActiveTab("code")}
              className={`retro-btn text-xs ${activeTab === "code" ? "bg-blue-900 text-white" : ""}`}
            >
              💻 โค้ด
            </button>
          )}
          {lesson.challenge && (
            <button
              onClick={() => setActiveTab("challenge")}
              className={`retro-btn text-xs ${activeTab === "challenge" ? "bg-blue-900 text-white" : ""}`}
            >
              🎯 Challenge
            </button>
          )}
        </div>

        {/* Content */}
        <div className="retro-groupbox flex-1 overflow-auto">
          {activeTab === "content" && (
            <div className="text-xs p-2">
              {hasLessonComponent(lesson.id) ? (
                (() => {
                  const LessonComponent = getLessonComponent(lesson.id);
                  return LessonComponent ? <LessonComponent /> : null;
                })()
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }} />
              )}
            </div>
          )}
          {activeTab === "code" && (
            <div className="space-y-4 p-2">
              {lesson.codeExamples.map((ex, i) => (
                <div key={i}>
                  <div className="font-bold text-xs mb-1">{ex.title}</div>
                  <pre className="bg-black text-green-400 p-2 text-xs overflow-auto">{ex.code}</pre>
                </div>
              ))}
            </div>
          )}
          {activeTab === "challenge" && lesson.challenge && (
            <div className="p-2 text-xs">
              <p className="mb-2">{lesson.challenge.description}</p>
              <pre className="bg-black text-green-400 p-2 overflow-auto">{lesson.challenge.starterCode}</pre>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-2">
          {prevLesson ? (
            <Link href={`/courses/${phaseId}/${moduleId}/${prevLesson.id}`} className="retro-btn text-xs">
              ← ก่อนหน้า
            </Link>
          ) : (
            <Link href={`/courses/${phaseId}/${moduleId}`} className="retro-btn text-xs">
              ← กลับ
            </Link>
          )}
          {!isCompleted && (
            <button onClick={handleMarkComplete} className="retro-btn retro-btn-primary text-xs">
              ✅ เสร็จสิ้น
            </button>
          )}
          {nextLesson ? (
            <Link href={`/courses/${phaseId}/${moduleId}/${nextLesson.id}`} className="retro-btn text-xs">
              ถัดไป →
            </Link>
          ) : (
            <Link href={`/courses/${phaseId}/${moduleId}`} className="retro-btn text-xs">
              เสร็จ ✓
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="h-full overflow-auto">
      <CompletedToast />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg px-4 py-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">🎯 {totalPoints} Points</span>
            <span>📚 {getCompletedLessonCount()} บทเรียนเสร็จแล้ว</span>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/courses" className="hover:text-indigo-600">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${phaseId}`} className="hover:text-indigo-600">Phase {phaseId}</Link>
          <span>/</span>
          <Link href={`/courses/${phaseId}/${moduleId}`} className="hover:text-indigo-600">Module</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{lesson.titleTh}</span>
        </div>

        {/* Header */}
        <div className="main-card mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                📖 {lesson.titleTh}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>⏱️ {lesson.duration} นาที</span>
                <span>📚 Lesson {lesson.order}</span>
              </div>
            </div>
            {isCompleted && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                ✅ เสร็จแล้ว
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "content"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            📝 เนื้อหา
          </button>
          {lesson.codeExamples.length > 0 && (
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              💻 ตัวอย่างโค้ด
            </button>
          )}
          {lesson.challenge && (
            <button
              onClick={() => setActiveTab("challenge")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "challenge"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              🎯 Challenge
            </button>
          )}
        </div>

        {/* Content */}
        <div className="main-card mb-6">
          {activeTab === "content" && (
            <>
              {hasLessonComponent(lesson.id) ? (
                (() => {
                  const LessonComponent = getLessonComponent(lesson.id);
                  return LessonComponent ? <LessonComponent /> : null;
                })()
              ) : (
                <div className="lesson-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }} />
              )}
            </>
          )}
          {activeTab === "code" && (
            <div className="space-y-6">
              {lesson.codeExamples.map((ex, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{ex.title}</h3>
                  {ex.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{ex.description}</p>}
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{ex.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
          {activeTab === "challenge" && lesson.challenge && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">🎯 {lesson.challenge.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{lesson.challenge.description}</p>
              <div>
                <h4 className="text-sm font-medium mb-2">Starter Code:</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{lesson.challenge.starterCode}</code>
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">💡 Hints:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                  {lesson.challenge.hints.map((hint, i) => <li key={i}>{hint}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {prevLesson ? (
              <Link href={`/courses/${phaseId}/${moduleId}/${prevLesson.id}`} className="main-btn main-btn-secondary">
                ← บทก่อนหน้า
              </Link>
            ) : (
              <Link href={`/courses/${phaseId}/${moduleId}`} className="main-btn main-btn-secondary">
                ← กลับ Module
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            {!isCompleted && (
              <button onClick={handleMarkComplete} className="main-btn main-btn-primary">
                ✅ เรียนจบแล้ว (+10 pts)
              </button>
            )}
            {nextLesson ? (
              <Link href={`/courses/${phaseId}/${moduleId}/${nextLesson.id}`} className="main-btn main-btn-primary">
                บทถัดไป →
              </Link>
            ) : (
              <Link href={`/courses/${phaseId}/${moduleId}`} className="main-btn main-btn-primary">
                เสร็จสิ้น Module ✓
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
