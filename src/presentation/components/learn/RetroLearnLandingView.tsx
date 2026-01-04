"use client";

import { getLessonsByTopic, learnLessons } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

export function RetroLearnLandingView() {
  const { isLessonComplete } = useProgressStore();

  // Separate JS and TS topics
  const jsTopics = learnTopics.filter(t => t.id !== "topic-typescript");
  const tsTopics = learnTopics.filter(t => t.id === "topic-typescript");

  const getProgress = (topicIds: string[]) => {
    let completed = 0;
    let total = 0;
    topicIds.forEach(id => {
      const lessons = getLessonsByTopic(id);
      completed += lessons.filter(l => isLessonComplete(l.id)).length;
      total += lessons.length;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const jsProgress = getProgress(jsTopics.map(t => t.id));
  const tsProgress = getProgress(tsTopics.map(t => t.id));
  const totalProgress = {
    completed: jsProgress.completed + tsProgress.completed,
    total: jsProgress.total + tsProgress.total,
    percent: jsProgress.total + tsProgress.total > 0 
      ? Math.round(((jsProgress.completed + tsProgress.completed) / (jsProgress.total + tsProgress.total)) * 100) 
      : 0
  };

  return (
    <div className="retro-page h-full overflow-auto">
      {/* Header */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🎓 Learn</span>
        <div className="text-center py-2">
          <h1 className="text-base font-bold mb-1">
            เรียนรู้ JavaScript & TypeScript
          </h1>
          <p className="text-xs mb-2">จากพื้นฐานจนถึงขั้นสูง พร้อม Interactive Code Editor</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>📚 {learnLessons.length} บทเรียน</span>
            <span>📁 {learnTopics.length} หัวข้อ</span>
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

      {/* Courses Table */}
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
            <tr className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer">
              <td className="py-1 px-2">
                <Link href="/learn/javascript" className="block font-bold">
                  📙 JavaScript
                </Link>
              </td>
              <td className="py-1 px-2">
                <Link href="/learn/javascript" className="retro-link">
                  พื้นฐานการเขียนโปรแกรม
                </Link>
              </td>
              <td className="py-1 px-2">{jsTopics.length}</td>
              <td className="py-1 px-2">{jsProgress.total}</td>
              <td className="py-1 px-2">
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-300 border border-gray-500">
                    <div className="h-full bg-yellow-500" style={{ width: `${jsProgress.percent}%` }} />
                  </div>
                  <span>{jsProgress.percent}%</span>
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer">
              <td className="py-1 px-2">
                <Link href="/learn/typescript" className="block font-bold">
                  📘 TypeScript
                </Link>
              </td>
              <td className="py-1 px-2">
                <Link href="/learn/typescript" className="retro-link">
                  Type Safety & Advanced
                </Link>
              </td>
              <td className="py-1 px-2">{tsTopics.length}</td>
              <td className="py-1 px-2">{tsProgress.total}</td>
              <td className="py-1 px-2">
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-300 border border-gray-500">
                    <div className="h-full bg-blue-500" style={{ width: `${tsProgress.percent}%` }} />
                  </div>
                  <span>{tsProgress.percent}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* JavaScript Topics */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📙 JavaScript Topics</span>
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
            {jsTopics.map((topic) => {
              const lessons = getLessonsByTopic(topic.id);
              const completed = lessons.filter(l => isLessonComplete(l.id)).length;
              const isComplete = completed === lessons.length && lessons.length > 0;

              return (
                <tr
                  key={topic.id}
                  className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer"
                >
                  <td className="py-1 px-2">
                    <Link href={`/learn/javascript/${topic.slug}`} className="block">
                      {topic.icon}
                    </Link>
                  </td>
                  <td className="py-1 px-2">
                    <Link href={`/learn/javascript/${topic.slug}`} className="retro-link">
                      {topic.titleTh}
                    </Link>
                  </td>
                  <td className="py-1 px-2">{completed}/{lessons.length}</td>
                  <td className="py-1 px-2">
                    {isComplete ? "✅ Complete" : `🔄 ${Math.round((completed / lessons.length) * 100)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TypeScript Topics */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📘 TypeScript Topics</span>
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
            {tsTopics.map((topic) => {
              const lessons = getLessonsByTopic(topic.id);
              const completed = lessons.filter(l => isLessonComplete(l.id)).length;
              const isComplete = completed === lessons.length && lessons.length > 0;

              return (
                <tr
                  key={topic.id}
                  className="border-b border-gray-300 hover:bg-blue-900 hover:text-white cursor-pointer"
                >
                  <td className="py-1 px-2">
                    <Link href={`/learn/typescript/${topic.slug}`} className="block">
                      {topic.icon}
                    </Link>
                  </td>
                  <td className="py-1 px-2">
                    <Link href={`/learn/typescript/${topic.slug}`} className="retro-link">
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

      {/* Quick Actions */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🚀 Quick Actions</span>
        <div className="flex gap-2 mt-2">
          <Link href="/learn/javascript" className="retro-btn retro-btn-primary text-xs">
            📙 เริ่ม JavaScript
          </Link>
          <Link href="/learn/typescript" className="retro-btn text-xs">
            📘 เริ่ม TypeScript
          </Link>
          <Link href="/playground" className="retro-btn text-xs">
            🎮 Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
