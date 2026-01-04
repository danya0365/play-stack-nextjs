"use client";

import { getCourseBySlug } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

interface LearnTopicViewProps {
  topicSlug: string;
  courseSlug: string;
}

export function MainLearnTopicView({ topicSlug, courseSlug }: LearnTopicViewProps) {
  const { isLessonComplete } = useProgressStore();
  
  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  const lessons = topic ? getLessonsByTopic(topic.id) : [];

  const basePath = `/learn/${courseSlug}/${topicSlug}`;
  const backPath = `/learn/${courseSlug}`;

  if (!topic || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white">❌ ไม่พบหัวข้อนี้</h1>
        <Link href="/learn" className="text-indigo-400 hover:underline mt-4 block">
          ← กลับไปหน้า Learn
        </Link>
      </div>
    );
  }

  const completedCount = lessons.filter(l => isLessonComplete(l.id)).length;
  
  // Dynamic color classes based on course
  const colorClasses: Record<string, { gradient: string; brand: string; text: string }> = {
    javascript: { gradient: "from-yellow-600 to-orange-600", brand: "yellow", text: "text-yellow-400" },
    typescript: { gradient: "from-blue-600 to-indigo-600", brand: "blue", text: "text-blue-400" },
    go: { gradient: "from-cyan-600 to-teal-600", brand: "cyan", text: "text-cyan-400" },
  };
  
  const colors = colorClasses[courseSlug] || colorClasses.javascript;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/learn" className="hover:text-indigo-400">Learn</Link>
        <span>/</span>
        <Link href={backPath} className={`hover:${colors.text}`}>{course.title}</Link>
        <span>/</span>
        <span className="text-white">{topic.titleTh}</span>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 mb-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-3xl`}>
            {topic.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{topic.titleTh}</h1>
            <p className="text-white/80">{topic.descriptionTh}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80">ความคืบหน้า</span>
          <span className="text-white font-medium">{completedCount}/{lessons.length}</span>
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white"
            style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isComplete = isLessonComplete(lesson.id);
          const lessonPath = `${basePath}/${lesson.slug}`;
          
          return (
            <Link
              key={lesson.id}
              href={lessonPath}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                isComplete
                  ? "bg-green-900/20 border-green-500/30"
                  : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                isComplete
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 text-gray-300"
              }`}>
                {isComplete ? "✓" : index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{lesson.titleTh}</h3>
                <p className="text-sm text-gray-400">{lesson.description}</p>
              </div>
              <div className="text-sm text-gray-500">
                {lesson.duration} นาที
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back button */}
      <div className="mt-8">
        <Link
          href={backPath}
          className={`${colors.text} hover:opacity-80 transition-colors`}
        >
          ← กลับไปหน้า {course.title}
        </Link>
      </div>
    </div>
  );
}
