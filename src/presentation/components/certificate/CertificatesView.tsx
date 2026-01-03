"use client";

import { Certificate, formatCertificateDate, generateCertificateId } from "@/src/presentation/components/certificate/Certificate";
import { useAuthStore } from "@/src/presentation/stores/authStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";
import { useState } from "react";

interface CourseForCertificate {
  id: string;
  name: string;
  nameTh: string;
  requiredLessons: string[];
}

const coursesForCertificates: CourseForCertificate[] = [
  {
    id: "phase-1",
    name: "Game Development Foundation",
    nameTh: "พื้นฐานการพัฒนาเกม",
    requiredLessons: ["lesson-1-1-1", "lesson-1-1-2", "lesson-1-1-3", "lesson-1-2-1", "lesson-1-2-2", "lesson-1-2-3"],
  },
  {
    id: "phase-2",
    name: "2D Game Development",
    nameTh: "การพัฒนาเกม 2D",
    requiredLessons: ["lesson-2-1-1", "lesson-2-1-2", "lesson-2-1-3", "lesson-2-1-4", "lesson-2-2-1", "lesson-2-2-2", "lesson-2-2-3", "lesson-2-2-4", "lesson-2-3-1", "lesson-2-3-2", "lesson-2-3-3"],
  },
  {
    id: "phase-3",
    name: "Multiplayer Game Development",
    nameTh: "การพัฒนาเกม Multiplayer",
    requiredLessons: ["lesson-3-1-1", "lesson-3-1-2", "lesson-3-1-3", "lesson-3-1-4", "lesson-3-2-1", "lesson-3-2-2", "lesson-3-2-3"],
  },
  {
    id: "phase-4",
    name: "3D Game Development",
    nameTh: "การพัฒนาเกม 3D",
    requiredLessons: ["lesson-4-1-1", "lesson-4-1-2", "lesson-4-1-3", "lesson-4-1-4", "lesson-4-2-1", "lesson-4-2-2", "lesson-4-2-3", "lesson-4-2-4", "lesson-4-3-1", "lesson-4-3-2", "lesson-4-4-1", "lesson-4-4-2", "lesson-4-4-3"],
  },
  {
    id: "phase-5",
    name: "Advanced Game Development",
    nameTh: "การพัฒนาเกมขั้นสูง",
    requiredLessons: ["lesson-5-1-1", "lesson-5-1-2", "lesson-5-1-3", "lesson-5-2-1", "lesson-5-2-2", "lesson-5-2-3", "lesson-5-3-1", "lesson-5-3-2", "lesson-5-3-3", "lesson-5-4-1", "lesson-5-4-2", "lesson-5-4-3", "lesson-5-5-1", "lesson-5-5-2", "lesson-5-5-3", "lesson-5-5-4"],
  },
  {
    id: "full-course",
    name: "PlayStack Game Development Master",
    nameTh: "PlayStack Game Development Master",
    requiredLessons: [], // Will check all lessons
  },
];

export function CertificatesView() {
  const { user, isLoggedIn, isPremium } = useAuthStore();
  const { isLessonComplete, getCompletedLessonCount } = useProgressStore();
  const [selectedCertificate, setSelectedCertificate] = useState<CourseForCertificate | null>(null);

  const checkCourseCompletion = (course: CourseForCertificate): { completed: number; total: number; isComplete: boolean } => {
    if (course.id === "full-course") {
      const total = 53; // Total lessons
      const completed = getCompletedLessonCount();
      return { completed, total, isComplete: completed >= total };
    }
    
    const completed = course.requiredLessons.filter(id => isLessonComplete(id)).length;
    const total = course.requiredLessons.length;
    return { completed, total, isComplete: completed >= total };
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบก่อน</h2>
        <p className="text-gray-400 mb-6">กรุณาเข้าสู่ระบบเพื่อดู Certificates</p>
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">🎓 Certificates</h1>
      <p className="text-gray-400 mb-8">
        เรียนจบแต่ละ Phase เพื่อรับ Certificate
      </p>

      <div className="grid gap-4">
        {coursesForCertificates.map((course) => {
          const { completed, total, isComplete } = checkCourseCompletion(course);
          const progress = total > 0 ? (completed / total) * 100 : 0;

          return (
            <div
              key={course.id}
              className={`p-6 rounded-2xl border transition-all ${
                isComplete
                  ? "bg-green-900/20 border-green-500/50"
                  : "bg-slate-800/50 border-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {isComplete && "🏆 "}{course.nameTh}
                  </h3>
                  <p className="text-sm text-gray-400">{course.name}</p>
                </div>
                
                {isComplete ? (
                  <button
                    onClick={() => setSelectedCertificate(course)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                  >
                    📜 ดู Certificate
                  </button>
                ) : (
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {completed}/{total} บท
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isComplete
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {!isComplete && (
                <p className="text-xs text-gray-500 mt-2">
                  เรียนอีก {total - completed} บทเพื่อรับ Certificate
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && user && (
        <Certificate
          data={{
            studentName: user.displayName,
            courseName: selectedCertificate.nameTh,
            completedDate: formatCertificateDate(),
            certificateId: generateCertificateId(user.id, selectedCertificate.id),
          }}
          onClose={() => setSelectedCertificate(null)}
        />
      )}

      {/* Premium upsell */}
      {!isPremium && (
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">🚀 อัพเกรดเป็น Pro</h3>
              <p className="text-gray-400 text-sm">
                เข้าถึงทุก Phase และรับ Master Certificate
              </p>
            </div>
            <Link
              href="/checkout/pro"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              ฿999 ซื้อเลย
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
