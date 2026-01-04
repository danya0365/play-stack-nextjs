"use client";

import { getLessonsByTopic, learnLessons } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

export function MainLearnLandingView() {
  const { isLessonComplete, totalPoints } = useProgressStore();

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-white dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-300 text-sm mb-6">
              <span>🎓</span>
              <span>Interactive Learning Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              เรียนรู้ <span className="text-yellow-500 dark:text-yellow-400">JavaScript</span> & <span className="text-blue-500 dark:text-blue-400">TypeScript</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              จากพื้นฐานจนถึงขั้นสูง พร้อม Interactive Code Editor และ Challenges
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-12">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{learnLessons.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">บทเรียน</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{learnTopics.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">หัวข้อ</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalProgress.percent}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">เรียนแล้ว</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>ความคืบหน้ารวม</span>
              <span>{totalProgress.completed}/{totalProgress.total} บทเรียน</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 via-indigo-500 to-blue-500 transition-all"
                style={{ width: `${totalProgress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* JavaScript Card */}
          <Link href="/learn/javascript" className="group">
            <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 rounded-3xl p-8 border border-yellow-200 dark:border-yellow-500/20 hover:border-yellow-400 dark:hover:border-yellow-500/40 transition-all hover:scale-[1.02] overflow-hidden shadow-lg dark:shadow-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/30">
                  <span className="font-bold text-black">JS</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{jsProgress.percent}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{jsProgress.completed}/{jsProgress.total}</div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                JavaScript
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                เรียนรู้พื้นฐาน JavaScript ตั้งแต่ตัวแปร, ฟังก์ชัน, Objects, Arrays และอื่นๆ
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {jsTopics.slice(0, 4).map(topic => (
                  <span key={topic.id} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
                    {topic.icon} {topic.titleTh}
                  </span>
                ))}
                {jsTopics.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                    +{jsTopics.length - 4} อื่นๆ
                  </span>
                )}
              </div>

              <div className="h-2 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${jsProgress.percent}%` }} />
              </div>

              <div className="mt-6 flex items-center text-yellow-600 dark:text-yellow-400 font-medium">
                เริ่มเรียน JavaScript
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* TypeScript Card */}
          <Link href="/learn/typescript" className="group">
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-3xl p-8 border border-blue-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/40 transition-all hover:scale-[1.02] overflow-hidden shadow-lg dark:shadow-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30">
                  <span className="font-bold text-white">TS</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tsProgress.percent}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{tsProgress.completed}/{tsProgress.total}</div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                TypeScript
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                ยกระดับด้วย Type Safety เรียนรู้ Types, Interfaces, Generics และอื่นๆ
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  🔷 Types
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  📐 Interfaces
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  🔄 Generics
                </span>
              </div>

              <div className="h-2 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${tsProgress.percent}%` }} />
              </div>

              <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                เริ่มเรียน TypeScript
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-slate-800/30 border-y border-gray-200 dark:border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">ทำไมต้องเรียนที่นี่?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "💻", title: "Interactive Editor", desc: "เขียนโค้ดและรันได้ทันที" },
              { icon: "🎯", title: "Challenges", desc: "ฝึกฝนด้วยโจทย์ท้าทาย" },
              { icon: "📊", title: "Progress Tracking", desc: "ติดตามความก้าวหน้า" },
              { icon: "🎮", title: "Game-Focused", desc: "ตัวอย่างจากการพัฒนาเกม" },
            ].map((feature, i) => (
              <div key={i} className="text-center p-4 bg-white dark:bg-transparent rounded-xl shadow-sm dark:shadow-none">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">พร้อมเริ่มเรียนแล้วหรือยัง?</h3>
        <div className="flex justify-center gap-4">
          <Link href="/learn/javascript" className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl transition-colors shadow-lg shadow-yellow-500/30">
            เริ่มจาก JavaScript
          </Link>
          <Link href="/playground" className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-colors">
            🎮 ลองใน Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
