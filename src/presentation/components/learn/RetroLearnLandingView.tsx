"use client";

import { getTopicFilterForCourse, learnCourses } from "@/src/data/master/learnCourses";
import { getLessonsByTopic, learnLessons } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

export function RetroLearnLandingView() {
  const { isLessonComplete } = useProgressStore();

  const getProgressForCourse = (courseSlug: string) => {
    const topicFilter = getTopicFilterForCourse(courseSlug);
    const courseTopics = learnTopics.filter(t => topicFilter(t.id));
    let completed = 0;
    let total = 0;
    courseTopics.forEach(topic => {
      const lessons = getLessonsByTopic(topic.id);
      completed += lessons.filter(l => isLessonComplete(l.id)).length;
      total += lessons.length;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getCourseTopics = (courseSlug: string) => {
    const filter = getTopicFilterForCourse(courseSlug);
    return learnTopics.filter(t => filter(t.id));
  };

  const totalProgress = (() => {
    let completed = 0;
    let total = 0;
    learnCourses.forEach(course => {
      const progress = getProgressForCourse(course.slug);
      completed += progress.completed;
      total += progress.total;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  })();

  const progressColors: Record<string, string> = {
    javascript: "bg-yellow-500",
    typescript: "bg-blue-500",
    go: "bg-cyan-500",
  };

  return (
    <div className="retro-page h-full overflow-auto">
      {/* Header */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🎓 Learn</span>
        <div className="text-center py-2">
          <h1 className="text-base font-bold mb-1">
            เรียนรู้การเขียนโปรแกรม
          </h1>
          <p className="text-xs mb-2">เลือกภาษาที่ต้องการเรียนรู้ พร้อม Interactive Code Editor</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>📚 {learnLessons.length} บทเรียน</span>
            <span>📁 {learnCourses.length} คอร์ส</span>
            <span>✅ {totalProgress.percent}% เสร็จแล้ว</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📊 Progress</span>
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>ความคืบหน้ารวม</span>
            <span>{totalProgress.completed}/{totalProgress.total} บทเรียน</span>
          </div>
          <div className="h-3 bg-gray-300 border border-gray-500">
            <div 
              className="h-full bg-blue-600"
              style={{ width: `${totalProgress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Courses Table - Dynamic */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📁 Courses</span>
        <table className="w-full text-xs mt-2">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-1 px-2">Course</th>
              <th className="text-left py-1 px-2">Description</th>
              <th className="text-left py-1 px-2">Topics</th>
              <th className="text-left py-1 px-2">Lessons</th>
              <th className="text-left py-1 px-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {learnCourses.map(course => {
              const progress = getProgressForCourse(course.slug);
              const topics = getCourseTopics(course.slug);
              const progressColor = progressColors[course.slug] || "bg-blue-500";
              
              return (
                <tr key={course.id} className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer">
                  <td className="py-1 px-2">
                    <Link href={`/learn/${course.slug}`} className="block font-bold">
                      {course.icon} {course.title}
                    </Link>
                  </td>
                  <td className="py-1 px-2">
                    <Link href={`/learn/${course.slug}`} className="retro-link">
                      {course.description}
                    </Link>
                  </td>
                  <td className="py-1 px-2">{topics.length}</td>
                  <td className="py-1 px-2">{progress.total}</td>
                  <td className="py-1 px-2">
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-gray-300 border border-gray-500">
                        <div className={`h-full ${progressColor}`} style={{ width: `${progress.percent}%` }} />
                      </div>
                      <span>{progress.percent}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Topics by Course - Dynamic */}
      {learnCourses.map(course => {
        const topics = getCourseTopics(course.slug);
        
        return (
          <div key={course.id} className="retro-groupbox">
            <span className="retro-groupbox-title">{course.icon} {course.title} Topics</span>
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="text-left py-1 px-2">Topic</th>
                  <th className="text-left py-1 px-2">Title</th>
                  <th className="text-left py-1 px-2">Lessons</th>
                  <th className="text-left py-1 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => {
                  const lessons = getLessonsByTopic(topic.id);
                  const completed = lessons.filter(l => isLessonComplete(l.id)).length;
                  const isComplete = completed === lessons.length && lessons.length > 0;

                  return (
                    <tr
                      key={topic.id}
                      className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer"
                    >
                      <td className="py-1 px-2">
                        <Link href={`/learn/${course.slug}/${topic.slug}`} className="block">
                          {topic.icon}
                        </Link>
                      </td>
                      <td className="py-1 px-2">
                        <Link href={`/learn/${course.slug}/${topic.slug}`} className="retro-link">
                          {topic.titleTh}
                        </Link>
                      </td>
                      <td className="py-1 px-2">{completed}/{lessons.length}</td>
                      <td className="py-1 px-2">
                        {isComplete ? "✅ Complete" : lessons.length > 0 ? `🔄 ${Math.round((completed / lessons.length) * 100)}%` : "🔄 0%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Features */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">✨ Features</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {[
            { icon: "💻", title: "Interactive Editor", desc: "เขียนโค้ดและรันได้ทันที" },
            { icon: "🎯", title: "Challenges", desc: "ฝึกฝนด้วยโจทย์ท้าทาย" },
            { icon: "📊", title: "Progress Tracking", desc: "ติดตามความก้าวหน้า" },
            { icon: "🎮", title: "Game-Focused", desc: "ตัวอย่างจากการพัฒนาเกม" },
          ].map((feature, i) => (
            <div key={i} className="retro-card">
              <div className="font-bold text-xs">{feature.icon} {feature.title}</div>
              <div className="text-xs text-gray-600">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions - Dynamic */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🚀 Quick Actions</span>
        <div className="flex gap-2 mt-2 flex-wrap">
          {learnCourses.map((course, index) => (
            <Link 
              key={course.id}
              href={`/learn/${course.slug}`} 
              className={`retro-btn text-xs ${index === 0 ? 'retro-btn-primary' : ''}`}
            >
              {course.icon} เริ่ม {course.title}
            </Link>
          ))}
          <Link href="/playground" className="retro-btn text-xs">
            🎮 Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
