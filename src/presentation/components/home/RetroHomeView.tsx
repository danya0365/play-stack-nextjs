"use client";

import Link from "next/link";

const phases = [
  {
    id: 1,
    title: "Foundation",
    icon: "📁",
    description: "JavaScript & Game Basics",
  },
  {
    id: 2,
    title: "2D Games",
    icon: "🎮",
    description: "Canvas, Phaser.js, PixiJS",
  },
  {
    id: 3,
    title: "Multiplayer",
    icon: "🌐",
    description: "Colyseus, PeerJS",
  },
  {
    id: 4,
    title: "3D Development",
    icon: "🎲",
    description: "Three.js, Babylon.js",
  },
  {
    id: 5,
    title: "Advanced",
    icon: "⭐",
    description: "Architecture & Publishing",
  },
];

export function RetroHomeView() {
  return (
    <div className="retro-page h-full overflow-auto">
      {/* Welcome Banner */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">Welcome to Play Stack</span>
        <div className="text-center py-4">
          <h1 className="text-lg font-bold mb-2">
            🎮 Play Stack - Game Development Courses
          </h1>
          <p className="text-xs mb-4">
            เรียนรู้การพัฒนาเกมตั้งแต่พื้นฐานจนถึงระดับมืออาชีพ
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/courses" className="retro-btn retro-btn-primary">
              เริ่มเรียน
            </Link>
            <Link href="/playground" className="retro-btn">
              Playground
            </Link>
          </div>
        </div>
      </div>

      {/* Course Phases */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">📚 Learning Path</span>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2">
          {phases.map((phase) => (
            <div key={phase.id} className="retro-card">
              <div className="retro-card-header">
                <span className="retro-card-icon">{phase.icon}</span>
                <span className="retro-card-title">Phase {phase.id}</span>
              </div>
              <div className="font-bold text-xs mb-1">{phase.title}</div>
              <div className="retro-card-description">{phase.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features List */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">✨ Features</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span>📖</span>
            <span className="text-xs">Interactive Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💻</span>
            <span className="text-xs">Code Playground</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span className="text-xs">Project Showcase</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎓</span>
            <span className="text-xs">Certificates</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="retro-groupbox">
        <span className="retro-groupbox-title">🔗 Quick Links</span>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/courses" className="retro-link">
            📚 Browse Courses
          </Link>
          <Link href="/playground" className="retro-link">
            🎮 Code Playground
          </Link>
          <Link href="/projects" className="retro-link">
            🏆 Student Projects
          </Link>
          <Link href="/about" className="retro-link">
            ℹ️ About Us
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-2 text-center text-xs border-t border-gray-400">
        <p>
          Best viewed with{" "}
          <span className="font-bold">Microsoft Internet Explorer 5.0</span> at{" "}
          <span className="font-bold">800x600</span> resolution
        </p>
        <p className="mt-1">
          <span className="retro-link">Webmaster</span> |{" "}
          <span className="retro-link">Guestbook</span> |{" "}
          <span className="retro-link">Site Map</span>
        </p>
        <p className="mt-2">
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            alt="Under Construction"
            className="inline-block"
          />{" "}
          🚧 Under Construction 🚧
        </p>
      </div>
    </div>
  );
}
