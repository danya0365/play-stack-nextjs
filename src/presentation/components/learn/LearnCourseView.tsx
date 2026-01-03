"use client";

import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

interface LearnCourseViewProps {
  courseType: "javascript" | "typescript";
}

export function LearnCourseView({ courseType }: LearnCourseViewProps) {
  const { isLessonComplete, totalPoints } = useProgressStore();

  const isJS = courseType === "javascript";
  const topics = learnTopics.filter(t => 
    isJS ? t.id !== "topic-typescript" : t.id === "topic-typescript"
  );

  const getTopicProgress = (topicId: string) => {
    const lessons = getLessonsByTopic(topicId);
    const completed = lessons.filter(l => isLessonComplete(l.id)).length;
    return { completed, total: lessons.length };
  };

  const getTotalProgress = () => {
    let completed = 0;
    let total = 0;
    topics.forEach(topic => {
      const lessons = getLessonsByTopic(topic.id);
      completed += lessons.filter(l => isLessonComplete(l.id)).length;
      total += lessons.length;
    });
    return { completed, total };
  };

  const totalProgress = getTotalProgress();
  const brandColor = isJS ? "yellow" : "blue";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/learn" className="hover:text-indigo-400">Learn</Link>
        <span>/</span>
        <span className="text-white">{isJS ? "JavaScript" : "TypeScript"}</span>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r ${isJS ? "from-yellow-600 to-orange-600" : "from-blue-600 to-indigo-600"} rounded-2xl p-6 mb-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 ${isJS ? "bg-yellow-500" : "bg-blue-500"} rounded-2xl flex items-center justify-center text-2xl font-bold ${isJS ? "text-black" : "text-white"} shadow-lg`}>
            {isJS ? "JS" : "TS"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isJS ? "JavaScript" : "TypeScript"}
            </h1>
            <p className="text-white/80">
              {isJS 
                ? "พื้นฐานการเขียนโปรแกรมด้วย JavaScript" 
                : "Type safety และ Advanced features"
              }
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80">ความคืบหน้า</span>
          <span className="text-white font-medium">
            {totalProgress.completed}/{totalProgress.total} บทเรียน
          </span>
        </div>
        <div className="h-3 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${totalProgress.total > 0 ? (totalProgress.completed / totalProgress.total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {topics.map((topic) => {
          const progress = getTopicProgress(topic.id);
          const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
          const isComplete = progress.completed === progress.total && progress.total > 0;

          return (
            <Link
              key={topic.id}
              href={`/learn/${courseType}/${topic.slug}`}
              className={`block p-6 rounded-2xl border transition-all hover:scale-[1.01] ${
                isComplete
                  ? "bg-green-900/20 border-green-500/50"
                  : `bg-slate-800/50 border-slate-700/50 hover:border-${brandColor}-500/50`
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl`}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {isComplete && "✅ "}{topic.titleTh}
                    </h3>
                    <p className="text-sm text-gray-400">{topic.descriptionTh}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
              </div>

              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isComplete
                      ? "bg-green-500"
                      : `bg-gradient-to-r ${isJS ? "from-yellow-500 to-orange-500" : "from-blue-500 to-indigo-500"}`
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back Link */}
      <div className="mt-8 flex justify-between">
        <Link href="/learn" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          ← กลับหน้า Learn
        </Link>
        <Link 
          href={isJS ? "/learn/typescript" : "/learn/javascript"} 
          className={`${isJS ? "text-blue-400 hover:text-blue-300" : "text-yellow-400 hover:text-yellow-300"} transition-colors`}
        >
          {isJS ? "ไป TypeScript →" : "ไป JavaScript →"}
        </Link>
      </div>
    </div>
  );
}
