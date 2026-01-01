"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_3_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">เผยแพร่เกม</h1>

      <Objectives
        items={[
          "Publish บน itch.io",
          "Steam Web",
          "PWA สำหรับ Mobile",
          "Marketing basics",
        ]}
      />

      <Section title="itch.io" icon="🎮">
        <CodeBlock
          title="Upload to itch.io"
          language="text"
          code={`
1. สร้าง account ที่ itch.io
2. Dashboard → Create new project

Project Settings:
├── Title: My Awesome Game
├── Kind: HTML (for web games)
├── Pricing: Free / Donations / Paid
└── Upload: ZIP file ของ build

ZIP Structure:
my-game.zip/
├── index.html
├── game.js
├── assets/
└── ...

Embed Options:
├── Width/Height: 800x600
├── Fullscreen: Yes
└── Mobile: Responsive
          `}
        />
      </Section>

      <Section title="PWA for Mobile" icon="📱">
        <CodeBlock
          title="manifest.json"
          language="json"
          code={`
{
  "name": "My Game",
  "short_name": "Game",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#1a1a2e",
  "theme_color": "#4ade80",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
          `}
        />

        <CodeBlock
          title="Service Worker"
          language="javascript"
          code={`
// sw.js - Cache game assets
const CACHE_NAME = 'game-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/game.js',
  '/assets/sprites.png',
  '/assets/sounds.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
          `}
        />
      </Section>

      <Section title="Marketing" icon="📣">
        <Table
          headers={["Platform", "Strategy"]}
          rows={[
            ["Twitter/X", "GIFs, devlogs, #gamedev #indiedev"],
            ["Reddit", "r/WebGames, r/IndieGaming"],
            ["Discord", "Game dev communities"],
            ["YouTube", "Trailers, devlogs"],
            ["TikTok", "Short gameplay clips"],
          ]}
        />

        <TipBox type="tip">
          <strong>Press Kit:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Logo และ screenshots</li>
            <li>• Game description</li>
            <li>• Trailer video</li>
            <li>• Contact info</li>
            <li>• Fact sheet</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "PWA ย่อมาจากอะไร?",
              options: ["Personal Web App", "Progressive Web App", "Premium Web Access", "Play With Anyone"],
              correctIndex: 1,
              explanation: "PWA = Progressive Web App ทำให้ web app ติดตั้งบน mobile ได้"
            },
            {
              question: "ข้อดีของ itch.io คืออะไร?",
              options: ["ค่าธรรมเนียมสูง", "Easy to publish, กำหนดราคาเองได้", "เฉพาะ mobile", "ต้อง review นาน"],
              correctIndex: 1,
              explanation: "itch.io ง่าย, ฟรี, กำหนดส่วนแบ่งเอง (0%+)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "Publish บน itch.io ได้",
            "สร้าง PWA ได้",
            "เข้าใจ marketing basics",
            "จบ Module 5.3! พร้อมเรียน Performance!"
          ]}
        />
      </Section>
    </div>
  );
}
