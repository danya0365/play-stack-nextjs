"use client";

import { getCourseBySlug } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

interface RetroLearnTopicViewProps {
  topicSlug: string;
  courseSlug: string;
}

export function RetroLearnTopicView({ topicSlug, courseSlug }: RetroLearnTopicViewProps) {
  const { isLessonComplete } = useProgressStore();
  
  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  const lessons = topic ? getLessonsByTopic(topic.id) : [];

  const basePath = `/learn/${courseSlug}/${topicSlug}`;
  const backPath = `/learn/${courseSlug}`;

  if (!topic || !course) {
    return (
      <div className="retro-page h-full overflow-auto">
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">❌ Error</span>
          <div className="text-center py-4">
            <p>ไม่พบหัวข้อนี้</p>
            <Link href="/learn" className="retro-link">← กลับหน้า Learn</Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(l => isLessonComplete(l.id)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Dynamic color based on course
  const progressColors: Record<string, string> = {
    javascript: "bg-yellow-500",
    typescript: "bg-blue-500",
    go: "bg-cyan-500",
  };
  const progressColor = progressColors[courseSlug] || "bg-yellow-500";

  return (
    <div className="retro-page h-full overflow-auto">
      {/* Header */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">{topic.icon} {topic.titleTh}</span>
        <div className="text-center py-2">
          <p className="text-xs mb-2">{topic.descriptionTh}</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>📚 {lessons.length} บทเรียน</span>
            <span>✅ {completedCount} เสร็จ</span>
            <span>📊 {progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📍 Navigation</span>
        <div className="text-xs mt-1">
          <Link href="/learn" className="retro-link">Learn</Link>
          {" / "}
          <Link href={backPath} className="retro-link">{course.title}</Link>
          {" / "}
          <span>{topic.titleTh}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📊 Progress</span>
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>ความคืบหน้า</span>
            <span>{completedCount}/{lessons.length}</span>
          </div>
          <div className="h-3 bg-gray-300 border border-gray-500">
            <div 
              className={`h-full ${progressColor}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📚 Lessons</span>
        <table className="w-full text-xs mt-2">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-1 px-2">#</th>
              <th className="text-left py-1 px-2">Title</th>
              <th className="text-left py-1 px-2">Duration</th>
              <th className="text-left py-1 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, index) => {
              const isComplete = isLessonComplete(lesson.id);
              const lessonPath = `${basePath}/${lesson.slug}`;
              
              return (
                <tr
                  key={lesson.id}
                  className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer"
                >
                  <td className="py-1 px-2">
                    <Link href={lessonPath} className="block">
                      {isComplete ? "✅" : index + 1}
                    </Link>
                  </td>
                  <td className="py-1 px-2">
                    <Link href={lessonPath} className="retro-link font-bold">
                      {lesson.titleTh}
                    </Link>
                    <div className="text-xs text-gray-500">{lesson.description}</div>
                  </td>
                  <td className="py-1 px-2">{lesson.duration} นาที</td>
                  <td className="py-1 px-2">
                    {isComplete ? (
                      <span className="text-green-600 font-bold">Complete</span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🚀 Actions</span>
        <div className="flex gap-2 mt-2">
          <Link href={backPath} className="retro-btn text-xs">
            ← กลับ {course.title}
          </Link>
          {lessons.length > 0 && (
            <Link href={`${basePath}/${lessons[0].slug}`} className="retro-btn retro-btn-primary text-xs">
              ▶ เริ่มเรียน
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
