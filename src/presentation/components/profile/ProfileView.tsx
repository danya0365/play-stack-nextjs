"use client";

import { certificates } from "@/src/data/master";
import { useAuthStore } from "@/src/presentation/stores/authStore";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import Link from "next/link";

export function ProfileView() {
  const { user, isLoggedIn, logout, openLoginModal } = useAuthStore();
  const { layout } = useLayoutStore();

  if (!isLoggedIn || !user) {
    if (layout === "retro") {
      return (
        <div className="retro-page h-full flex items-center justify-center">
          <div className="retro-groupbox text-center p-8">
            <div className="text-4xl mb-4">🔒</div>
            <p className="text-xs mb-4">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
            <button onClick={openLoginModal} className="retro-btn retro-btn-primary">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์
          </p>
          <button onClick={openLoginModal} className="main-btn main-btn-primary">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  const earnedCerts = certificates.filter((c) =>
    user.certificates.includes(c.id)
  );
  const progress = Math.round((user.completedLessons.length / 10) * 100); // Assume 10 lessons total for demo

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">👤 Profile</span>
          <div className="flex items-center gap-4 py-2">
            <div className="text-4xl">{user.avatar}</div>
            <div>
              <div className="font-bold">{user.displayName}</div>
              <div className="text-xs text-gray-600">{user.email}</div>
              <div className="text-xs mt-1">
                📅 เข้าร่วมเมื่อ {user.joinedAt}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📊 Stats</span>
          <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{user.points}</div>
              <div>Points</div>
            </div>
            <div className="p-2 bg-gray-200">
              <div className="font-bold">Phase {user.currentPhase}</div>
              <div>Current</div>
            </div>
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{user.completedLessons.length}</div>
              <div>Lessons</div>
            </div>
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{earnedCerts.length}</div>
              <div>Certs</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📈 Progress</span>
          <div className="mt-2">
            <div className="text-xs mb-1">Overall: {progress}%</div>
            <div className="h-4 bg-gray-300 border-2 border-gray-600">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Certificates */}
        {earnedCerts.length > 0 && (
          <div className="retro-groupbox">
            <span className="retro-groupbox-title">🏆 Certificates</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {earnedCerts.map((cert) => (
                <div key={cert.id} className="retro-card text-xs">
                  {cert.icon} {cert.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link href="/courses" className="retro-btn">
            📚 Continue Learning
          </Link>
          <button onClick={logout} className="retro-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="main-card mb-6">
          <div className="flex items-center gap-6">
            <div className="text-6xl">{user.avatar}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.displayName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                📅 เข้าร่วมเมื่อ {user.joinedAt}
              </p>
            </div>
            <button
              onClick={logout}
              className="main-btn main-btn-secondary text-sm"
            >
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {user.points}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Points
            </div>
          </div>
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-purple-600">
              Phase {user.currentPhase}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current
            </div>
          </div>
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-pink-600">
              {user.completedLessons.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lessons
            </div>
          </div>
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-orange-600">
              {earnedCerts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Certificates
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="main-card mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
            📈 Overall Progress
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {progress}%
            </span>
          </div>
        </div>

        {/* Certificates */}
        {earnedCerts.length > 0 && (
          <div className="main-card mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
              🏆 Earned Certificates
            </h2>
            <div className="flex flex-wrap gap-3">
              {earnedCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg"
                >
                  <span className="text-2xl">{cert.icon}</span>
                  <span className="font-medium">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link
            href="/courses"
            className="main-btn main-btn-primary flex-1 text-center"
          >
            📚 Continue Learning
          </Link>
          <Link
            href="/playground"
            className="main-btn main-btn-secondary flex-1 text-center"
          >
            🎮 Go to Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
