"use client";

import { getCourseBySlug, getTopicFilterForCourse } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

interface RetroLearnCourseViewProps {
  courseType: string;
}

export function RetroLearnCourseView({ courseType }: RetroLearnCourseViewProps) {
  const { isLessonComplete } = useProgressStore();

  const course = getCourseBySlug(courseType);
  const topicFilter = getTopicFilterForCourse(courseType);
  const topics = learnTopics.filter(t => topicFilter(t.id));

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
  const progressPercent = totalProgress.total > 0 
    ? Math.round((totalProgress.completed / totalProgress.total) * 100) 
    : 0;

  return (
    <div className="retro-page h-full overflow-auto">
      {/* Header */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">
          {course?.icon || "📚"} {course?.title || courseType}
        </span>
        <div className="text-center py-2">
          <h1 className="text-base font-bold mb-1">
            {course?.titleTh || course?.title || courseType}
          </h1>
          <p className="text-xs mb-2">{course?.descriptionTh || course?.description}</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>📁 {topics.length} หัวข้อ</span>
            <span>📚 {totalProgress.total} บทเรียน</span>
            <span>✅ {progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📊 Progress</span>
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>ความคืบหน้า</span>
            <span>{totalProgress.completed}/{totalProgress.total} บทเรียน</span>
          </div>
          <div className="h-3 bg-gray-300 border border-gray-500">
            <div 
              className={`h-full ${courseType === "javascript" ? "bg-yellow-500" : "bg-blue-500"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics Table */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📁 Topics</span>
        <table className="w-full text-xs mt-2">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-1 px-2">Icon</th>
              <th className="text-left py-1 px-2">Topic</th>
              <th className="text-left py-1 px-2">Description</th>
              <th className="text-left py-1 px-2">Progress</th>
              <th className="text-left py-1 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => {
              const progress = getTopicProgress(topic.id);
              const isComplete = progress.completed === progress.total && progress.total > 0;
              const percent = progress.total > 0 
                ? Math.round((progress.completed / progress.total) * 100) 
                : 0;

              return (
                <tr
                  key={topic.id}
                  className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer"
                >
                  <td className="py-1 px-2">
                    <Link href={`/learn/${courseType}/${topic.slug}`} className="block">
                      {topic.icon}
                    </Link>
                  </td>
                  <td className="py-1 px-2">
                    <Link href={`/learn/${courseType}/${topic.slug}`} className="retro-link font-bold">
                      {topic.titleTh}
                    </Link>
                  </td>
                  <td className="py-1 px-2 text-gray-600">
                    {topic.descriptionTh}
                  </td>
                  <td className="py-1 px-2">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-2 bg-gray-300 border border-gray-500">
                        <div 
                          className={`h-full ${isComplete ? "bg-green-500" : courseType === "javascript" ? "bg-yellow-500" : "bg-blue-500"}`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                      <span>{progress.completed}/{progress.total}</span>
                    </div>
                  </td>
                  <td className="py-1 px-2">
                    {isComplete ? "✅" : `🔄 ${percent}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🚀 Actions</span>
        <div className="flex gap-2 mt-2">
          <Link href="/learn" className="retro-btn text-xs">
            ← กลับหน้า Learn
          </Link>
          {topics.length > 0 && (
            <Link href={`/learn/${courseType}/${topics[0].slug}`} className="retro-btn retro-btn-primary text-xs">
              ▶ เริ่มเรียน
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
