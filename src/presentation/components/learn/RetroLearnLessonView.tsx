"use client";

import { getCourseBySlug } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RetroLearnLessonViewProps {
  topicSlug: string;
  lessonSlug: string;
  courseSlug: string;
}

export function RetroLearnLessonView({ topicSlug, lessonSlug, courseSlug }: RetroLearnLessonViewProps) {
  const { isLessonComplete, markLessonComplete, totalPoints } = useProgressStore();
  const [isCompleted, setIsCompleted] = useState(false);

  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  const lessons = topic ? getLessonsByTopic(topic.id) : [];
  const lesson = lessons.find(l => l.slug === lessonSlug);
  const lessonIndex = lessons.findIndex(l => l.slug === lessonSlug);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  const basePath = `/learn/${courseSlug}/${topicSlug}`;
  const topicPath = `/learn/${courseSlug}/${topicSlug}`;
  const coursePath = `/learn/${courseSlug}`;

  useEffect(() => {
    if (lesson) {
      setIsCompleted(isLessonComplete(lesson.id));
    }
  }, [lesson, isLessonComplete]);

  if (!topic || !lesson || !course) {
    return (
      <div className="retro-page h-full overflow-auto">
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">❌ Error</span>
          <div className="text-center py-4">
            <p>ไม่พบบทเรียนนี้</p>
            <Link href="/learn" className="retro-link">← กลับหน้า Learn</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    setIsCompleted(true);
  };

  return (
    <div className="retro-page h-full overflow-auto">
      {/* Breadcrumb */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📍 Navigation</span>
        <div className="text-xs mt-1">
          <Link href="/learn" className="retro-link">Learn</Link>
          {" / "}
          <Link href={coursePath} className="retro-link">{course.title}</Link>
          {" / "}
          <Link href={topicPath} className="retro-link">{topic.titleTh}</Link>
          {" / "}
          <span>{lesson.titleTh}</span>
        </div>
      </div>

      {/* Header */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📖 {lesson.titleTh}</span>
        <div className="py-2">
          <div className="flex items-center justify-between text-xs">
            <span>⏱️ {lesson.duration} นาที</span>
            <span>📚 บทที่ {lesson.order}</span>
            {isCompleted && <span className="text-green-600 font-bold">✅ Complete</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📝 Content</span>
        <div className="mt-2 text-xs retro-content whitespace-pre-wrap">
          {lesson.content.split('\n').map((line, i) => {
            // Simple markdown rendering for retro
            if (line.startsWith('### ')) {
              return <h3 key={i} className="font-bold mt-2 mb-1">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="font-bold text-sm mt-3 mb-1">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={i} className="font-bold text-base mt-3 mb-2">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4">• {line.replace('- ', '')}</li>;
            }
            if (line.startsWith('```')) {
              return null; // Skip code block markers
            }
            if (line.trim() === '') {
              return <br key={i} />;
            }
            return <p key={i} className="mb-1">{line}</p>;
          })}
        </div>
      </div>

      {/* Code Example */}
      {lesson.codeExample && (
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">💻 Code Example</span>
          <pre className="mt-2 text-xs bg-gray-100 p-2 border border-gray-400 overflow-x-auto whitespace-pre-wrap">
            {lesson.codeExample}
          </pre>
        </div>
      )}

      {/* Challenge */}
      {lesson.challenge && (
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">🎯 Challenge</span>
          <div className="mt-2 text-xs">
            <p className="mb-2 font-bold">{lesson.challenge.description}</p>
            <p className="mb-1">Expected: <code className="bg-gray-100 px-1">{lesson.challenge.expectedOutput}</code></p>
            {lesson.challenge.hints && lesson.challenge.hints.length > 0 && (
              <div className="mt-2">
                <p className="font-bold">Hints:</p>
                <ul className="list-disc ml-4">
                  {lesson.challenge.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">❓ Quiz</span>
          <div className="mt-2 text-xs space-y-3">
            {lesson.quiz.map((q, i) => (
              <div key={i} className="border-b border-gray-300 pb-2">
                <p className="font-bold">{i + 1}. {q.question}</p>
                <ul className="ml-4 mt-1">
                  {q.options.map((opt, j) => (
                    <li key={j}>
                      {String.fromCharCode(65 + j)}. {opt}
                      {j === q.correctAnswer && " ✓"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🚀 Navigation</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {prevLesson ? (
            <Link href={`${basePath}/${prevLesson.slug}`} className="retro-btn text-xs">
              ← {prevLesson.titleTh}
            </Link>
          ) : (
            <Link href={topicPath} className="retro-btn text-xs">
              ← กลับ
            </Link>
          )}

          {!isCompleted && (
            <button onClick={handleComplete} className="retro-btn retro-btn-primary text-xs">
              ✅ เรียนจบ (+10 pts)
            </button>
          )}

          {nextLesson ? (
            <Link href={`${basePath}/${nextLesson.slug}`} className="retro-btn retro-btn-primary text-xs">
              {nextLesson.titleTh} →
            </Link>
          ) : (
            <Link href={topicPath} className="retro-btn retro-btn-primary text-xs">
              เรียนจบหัวข้อ ✓
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
