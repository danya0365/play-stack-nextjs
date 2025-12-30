"use client";

import { animated, useSpring, useTrail } from "@react-spring/web";
import Link from "next/link";

const phases = [
  {
    id: 1,
    title: "Foundation",
    icon: "🎯",
    description: "เริ่มต้นกับพื้นฐาน JavaScript และ Game Concepts",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 2,
    title: "2D Games",
    icon: "🎮",
    description: "Canvas API, Phaser.js, PixiJS",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Multiplayer",
    icon: "🌐",
    description: "Colyseus, PeerJS, Real-time Games",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "3D Development",
    icon: "🎲",
    description: "Three.js, Babylon.js, PlayCanvas",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 5,
    title: "Advanced Topics",
    icon: "🚀",
    description: "Architecture, Optimization, Monetization",
    color: "from-indigo-500 to-violet-600",
  },
];

export function MainHomeView() {
  // Hero animation
  const heroSpring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    config: { tension: 280, friction: 60 },
  });

  // Cards trail animation
  const trail = useTrail(phases.length, {
    from: { opacity: 0, y: 40, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { tension: 300, friction: 40 },
    delay: 300,
  });

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Hero Section */}
      <animated.section
        style={heroSpring}
        className="flex-shrink-0 py-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">เรียนรู้</span>{" "}
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Game Development
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            ตั้งแต่ Text-Based Games จนถึง 3D Multiplayer
            เรียนรู้การสร้างเกมอย่างเป็นระบบด้วยคอร์สที่ออกแบบมาสำหรับทุกระดับ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/courses"
              className="main-btn main-btn-primary text-base px-8 py-3"
            >
              🎮 เริ่มเรียนเลย
            </Link>
            <Link
              href="/playground"
              className="main-btn main-btn-secondary text-base px-8 py-3"
            >
              🕹️ ลองเล่น Playground
            </Link>
          </div>
        </div>
      </animated.section>

      {/* Learning Path */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            📚 Learning Path
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {trail.map((style, index) => (
              <animated.div
                key={phases[index].id}
                style={style}
                className="main-card group cursor-pointer"
              >
                <div className="main-card-header">
                  <span className="text-3xl">{phases[index].icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Phase {phases[index].id}
                </h3>
                <p
                  className={`text-sm font-medium bg-linear-to-r ${phases[index].color} bg-clip-text text-transparent mb-2`}
                >
                  {phases[index].title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {phases[index].description}
                </p>
              </animated.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
