"use client";

import { certificates, courseConfig, learningPaths } from "@/src/data/master";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";

export function AboutView() {
  const { layout } = useLayoutStore();

  const team = [
    { name: "Game Master", role: "Lead Instructor", icon: "👨‍🏫", bio: "10+ ปี ใน Game Development" },
    { name: "Pixel Pro", role: "2D Artist", icon: "🎨", bio: "ผู้เชี่ยวชาญ Pixel Art และ Animation" },
    { name: "Code Ninja", role: "Technical Lead", icon: "🥷", bio: "Full-stack Game Developer" },
    { name: "Sound Wave", role: "Audio Designer", icon: "🎵", bio: "Game Audio และ Music Production" },
  ];

  const features = [
    { icon: "📚", title: "บทเรียนครบครัน", desc: "5 Phases, 16+ Modules ครอบคลุมทุกด้าน" },
    { icon: "💻", title: "Playground", desc: "ลองเขียนโค้ดและรันได้ทันที" },
    { icon: "🏆", title: "Projects", desc: "โปรเจกต์จริงในทุก Module" },
    { icon: "🎓", title: "Certificates", desc: "ใบรับรองในแต่ละ Phase" },
    { icon: "🌐", title: "Dual Layout", desc: "Modern และ Retro (IE5 style)" },
    { icon: "🌙", title: "Dark Mode", desc: "รองรับ Dark/Light theme" },
  ];

  const techStack = [
    { name: "Next.js", icon: "⚡" },
    { name: "React", icon: "⚛️" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Tailwind CSS", icon: "🎨" },
    { name: "Zustand", icon: "🐻" },
    { name: "React Spring", icon: "🌸" },
  ];

  if (layout === "retro") {
    return (
      <div className="retro-page h-full overflow-auto">
        {/* Header */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">ℹ️ About Play Stack</span>
          <div className="py-2 text-center">
            <h1 className="text-base font-bold">🎮 {courseConfig.nameTh}</h1>
            <p className="text-xs mt-1">{courseConfig.taglineTh}</p>
            <p className="text-xs mt-1">{courseConfig.descriptionTh}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">📊 Statistics</span>
          <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{courseConfig.totalPhases}</div>
              <div>Phases</div>
            </div>
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{courseConfig.totalModules}</div>
              <div>Modules</div>
            </div>
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{learningPaths.length}</div>
              <div>Paths</div>
            </div>
            <div className="p-2 bg-gray-200">
              <div className="font-bold">{certificates.length}</div>
              <div>Certs</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">👥 Team</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {team.map((member) => (
              <div key={member.name} className="retro-card text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{member.icon}</span>
                  <div>
                    <div className="font-bold">{member.name}</div>
                    <div className="text-gray-600">{member.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="retro-groupbox">
          <span className="retro-groupbox-title">🔧 Tech Stack</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {techStack.map((tech) => (
              <span key={tech.name} className="px-2 py-1 bg-gray-200 text-xs">
                {tech.icon} {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎮 เกี่ยวกับ Play Stack
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {courseConfig.descriptionTh}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {courseConfig.totalPhases}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Phases</div>
          </div>
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-purple-600">
              {courseConfig.totalModules}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Modules</div>
          </div>
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-pink-600">
              {learningPaths.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Learning Paths</div>
          </div>
          <div className="main-card text-center">
            <div className="text-3xl font-bold text-orange-600">
              {certificates.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Certificates</div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            ✨ Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="main-card">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            👥 Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member) => (
              <div key={member.name} className="main-card text-center">
                <div className="text-4xl mb-3">{member.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 mt-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🔧 Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium"
              >
                {tech.icon} {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
