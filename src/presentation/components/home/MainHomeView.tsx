"use client";

import { animated, useSpring, useTrail } from "@react-spring/web";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import 3D canvas (client-side only)
const Hero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  { ssr: false }
);

const phases = [
  {
    id: 1,
    title: "Foundation",
    icon: "🎯",
    lessons: 6,
    description: "JavaScript & Game Concepts",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 2,
    title: "2D Games",
    icon: "🎮",
    lessons: 11,
    description: "Canvas, Phaser.js, PixiJS",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Multiplayer",
    icon: "🌐",
    lessons: 7,
    description: "Colyseus, PeerJS",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "3D Development",
    icon: "🎲",
    lessons: 13,
    description: "Three.js, Babylon.js, Unity",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 5,
    title: "Advanced",
    icon: "🚀",
    lessons: 16,
    description: "Architecture, Optimization",
    color: "from-indigo-500 to-violet-600",
  },
];

const stats = [
  { label: "บทเรียน", value: "53" },
  { label: "ชั่วโมง", value: "30+" },
  { label: "Projects", value: "15+" },
];

export function MainHomeView() {
  // Hero animation
  const heroSpring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    config: { tension: 280, friction: 60 },
  });

  // Stats animation
  const statsSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    delay: 500,
    config: { tension: 300, friction: 40 },
  });

  // Cards trail animation
  const trail = useTrail(phases.length, {
    from: { opacity: 0, y: 40, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { tension: 300, friction: 40 },
    delay: 600,
  });

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-900">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 3D Canvas Background */}
        <Hero3DCanvas />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/50 pointer-events-none" />
        
        {/* Hero Content */}
        <animated.div
          style={heroSpring}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-purple-200">🎮 เรียนได้เลยวันนี้</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Become a</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Game Developer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            เรียนรู้การสร้างเกมตั้งแต่ <span className="text-cyan-400">Text-Based</span> จนถึง{" "}
            <span className="text-purple-400">3D Multiplayer</span>
            <br />
            ด้วยคอร์สที่ออกแบบมาสำหรับทุกระดับ
          </p>

          {/* Stats */}
          <animated.div
            style={statsSpring}
            className="flex items-center justify-center gap-8 mb-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </animated.div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/courses"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 เริ่มเรียนฟรี
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/playground"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl text-lg border border-white/20 transition-all hover:bg-white/20 hover:scale-105"
            >
              🕹️ ลอง Playground
            </Link>
          </div>

          {/* Price tag */}
          <div className="mt-8 inline-flex items-center gap-2 text-gray-400">
            <span className="line-through text-gray-500">฿1,999</span>
            <span className="text-2xl font-bold text-white">฿999</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
              -50%
            </span>
          </div>
        </animated.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              📚 Learning Path
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              5 Phases ครอบคลุมทุกสิ่งที่ต้องรู้เพื่อเป็น Game Developer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {trail.map((style, index) => (
              <animated.div
                key={phases[index].id}
                style={style}
                className="group relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer hover:-translate-y-1"
              >
                {/* Phase number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {phases[index].id}
                </div>

                <div className="text-4xl mb-4">{phases[index].icon}</div>
                
                <h3 className="text-lg font-semibold text-white mb-1">
                  {phases[index].title}
                </h3>
                
                <p className={`text-sm font-medium bg-gradient-to-r ${phases[index].color} bg-clip-text text-transparent mb-2`}>
                  {phases[index].lessons} บทเรียน
                </p>
                
                <p className="text-sm text-gray-400">
                  {phases[index].description}
                </p>

                {/* Progress bar (fake for now) */}
                <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${phases[index].color} transition-all`}
                    style={{ width: index === 0 ? '30%' : '0%' }}
                  />
                </div>
              </animated.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              ดู Curriculum ทั้งหมด
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            ✨ ทำไมต้องเรียนกับเรา?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "เนื้อหาครบถ้วน",
                description: "53 บทเรียน ครอบคลุมตั้งแต่พื้นฐานจนถึงระดับ Advanced"
              },
              {
                icon: "💻",
                title: "ลงมือทำจริง",
                description: "เน้น hands-on projects ไม่ใช่แค่ดู video"
              },
              {
                icon: "🇹🇭",
                title: "ภาษาไทย",
                description: "เนื้อหาภาษาไทยเข้าใจง่าย ไม่ต้องแปล"
              },
              {
                icon: "💰",
                title: "คุ้มค่า",
                description: "จ่ายครั้งเดียว เรียนได้ตลอดชีพ"
              },
              {
                icon: "📜",
                title: "Certificate",
                description: "รับ Certificate เมื่อเรียนจบ"
              },
              {
                icon: "👥",
                title: "Community",
                description: "เข้าร่วม Discord community แลกเปลี่ยนความรู้"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            💬 นักเรียนพูดถึงเรา
          </h2>
          <p className="text-gray-400 text-center mb-12">
            ความคิดเห็นจากนักเรียนที่เรียนจบแล้ว
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "สมชาย นักพัฒนา",
                role: "Junior Developer @ Startup",
                avatar: "🧑‍💻",
                rating: 5,
                text: "คอร์สนี้เปลี่ยนชีวิตผมเลย จากไม่รู้อะไรเลยเรื่อง game dev ตอนนี้ทำเกมขายบน itch.io ได้แล้ว!",
              },
              {
                name: "มานี โปรแกรมเมอร์",
                role: "Freelance Game Dev",
                avatar: "👩‍💻",
                rating: 5,
                text: "เนื้อหาละเอียดมาก โดยเฉพาะส่วน Multiplayer กับ Three.js เข้าใจง่าย ทำตามได้เลย",
              },
              {
                name: "วิทย์ เกมเมอร์",
                role: "นักศึกษา ม.6",
                avatar: "🎮",
                rating: 5,
                text: "เรียน Phase 1-2 ฟรีก่อน ชอบมากเลยซื้อ Full Course ราคาคุ้มค่ามากครับ",
              },
              {
                name: "แอน ครีเอเตอร์",
                role: "Indie Game Creator",
                avatar: "👾",
                rating: 5,
                text: "เคยเรียนคอร์สฝรั่งมาหลายตัว แต่อันนี้เข้าใจง่ายกว่าเพราะเป็นภาษาไทย",
              },
              {
                name: "ต้น เดฟ",
                role: "Full-Stack Developer",
                avatar: "🚀",
                rating: 5,
                text: "มาจาก web dev อยากทำเกม คอร์สนี้ช่วยให้เปลี่ยนสายได้เร็วมาก",
              },
              {
                name: "ฟ้า ดีไซเนอร์",
                role: "UI/UX Designer",
                avatar: "🎨",
                rating: 5,
                text: "แม้เป็นดีไซเนอร์ก็เรียนได้ ตอนนี้ทำเกม prototype เองได้แล้ว!",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array(testimonial.rating).fill(0).map((_, j) => (
                    <span key={j} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            💰 เลือกแพ็คเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-gray-400 text-center mb-12">
            จ่ายครั้งเดียว เรียนได้ตลอดชีพ ไม่มีค่าธรรมเนียมรายเดือน
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-1">฿0</div>
                <div className="text-gray-400 text-sm">ลองเรียนฟรี</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Phase 1: Foundation (6 บท)",
                  "เข้าถึง Playground",
                  "Community Discord",
                  "❌ Phase 2-5",
                  "❌ Certificate",
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${item.startsWith("❌") ? "text-gray-500" : "text-gray-300"}`}>
                    {!item.startsWith("❌") && <span className="text-green-400">✓</span>}
                    {item.replace("❌ ", "")}
                  </li>
                ))}
              </ul>
              <Link
                href="/courses"
                className="block w-full text-center py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
              >
                เริ่มเรียนฟรี
              </Link>
            </div>

            {/* Pro - Recommended */}
            <div className="relative p-8 bg-gradient-to-b from-purple-900/50 to-slate-900 rounded-2xl border-2 border-purple-500 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                ⭐ แนะนำ
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl text-gray-400 line-through">฿1,999</span>
                  <span className="text-4xl font-bold text-white">฿999</span>
                </div>
                <div className="text-green-400 text-sm font-semibold">ประหยัด 50%</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "ทุก Phase (53 บท)",
                  "เข้าถึง Playground",
                  "Community Discord",
                  "Certificate",
                  "Updates ตลอดชีพ",
                  "Priority Support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/checkout/pro"
                className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
              >
                🚀 ซื้อตอนนี้
              </Link>
            </div>

            {/* Team */}
            <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Team</h3>
                <div className="text-4xl font-bold text-white mb-1">฿2,999</div>
                <div className="text-gray-400 text-sm">สำหรับ 5 คน</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "ทุกอย่างใน Pro",
                  "5 Licenses",
                  "Team Dashboard",
                  "Invoice สำหรับบริษัท",
                  "Priority Support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
              >
                ติดต่อเรา
              </Link>
            </div>
          </div>

          {/* Money back guarantee */}
          <div className="text-center mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <span className="text-2xl mr-2">🛡️</span>
            <span className="text-gray-300">
              <strong className="text-white">รับประกันคืนเงิน 30 วัน</strong> - ถ้าไม่พอใจ คืนเงินเต็ม 100%
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            ❓ คำถามที่พบบ่อย
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "ต้องมีพื้นฐานอะไรก่อนไหม?",
                a: "ไม่จำเป็น! คอร์สออกแบบมาสำหรับผู้เริ่มต้น เริ่มจาก JavaScript พื้นฐานเลย"
              },
              {
                q: "เรียนได้นานแค่ไหน?",
                a: "ตลอดชีพ! จ่ายครั้งเดียว เรียนได้ไม่จำกัด รวมถึง updates ในอนาคต"
              },
              {
                q: "มี Certificate ไหม?",
                a: "มีครับ! เมื่อเรียนจบจะได้รับ Certificate สามารถดาวน์โหลดและแชร์ได้"
              },
              {
                q: "ถ้าติดปัญหาถามใครได้?",
                a: "เรามี Discord Community ที่คอยช่วยเหลือ และ Priority Support สำหรับ Pro Members"
              },
              {
                q: "รับชำระด้วยอะไรบ้าง?",
                a: "บัตรเครดิต/เดบิต, PromptPay, TrueMoney Wallet และ Mobile Banking"
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50"
              >
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            พร้อมจะเป็น Game Developer แล้วหรือยัง? 🎮
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            เริ่มเรียนฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/courses"
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              🚀 เริ่มเรียนฟรี
            </Link>
            <Link
              href="/checkout/pro"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl text-xl border border-white/20 transition-all hover:bg-white/20"
            >
              ซื้อ Pro ฿999
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
