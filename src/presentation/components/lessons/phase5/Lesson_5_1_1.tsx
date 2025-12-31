"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">สร้าง Game Portfolio</h1>

      <Objectives
        items={[
          "Portfolio ที่ดีมีอะไรบ้าง",
          "จัดแสดง projects อย่างมืออาชีพ",
          "เขียน case studies ที่น่าสนใจ",
          "GitHub profile ที่โดดเด่น",
        ]}
      />

      <Section title="Portfolio สำคัญมาก!" icon="📁">
        <TipBox type="info">
          <strong>ทำไม Portfolio สำคัญ?</strong>
          <ul className="mt-2 space-y-1">
            <li>• แสดง skills จริงๆ ไม่ใช่แค่บอก</li>
            <li>• เห็นกระบวนการคิดและทำงาน</li>
            <li>• ความตั้งใจและ passion</li>
            <li>• ทำให้โดดเด่นกว่าคนอื่น</li>
          </ul>
        </TipBox>

        <Diagram caption="Portfolio ที่ดี vs ไม่ดี">
{`
❌ ไม่ดี:
• Screenshot อย่างเดียว ไม่มีรายละเอียด
• Link เสีย
• Code ยุ่งเหยิง ไม่มี README
• ไม่มีตัวอย่างที่เล่นได้

✅ ดี:
• Playable demo
• Video trailer
• Technical breakdown
• Clean code + documentation
• Process/development story
`}
        </Diagram>
      </Section>

      <Section title="Project Showcase" icon="🎮">
        <CodeBlock
          title="Project Page Structure"
          language="markdown"
          code={`
# 🎮 Project Name

![Game Screenshot](./screenshot.png)

## 🎯 Overview
One-line description of the game and what makes it unique.

## 🎬 Demo
- [Play Now](https://your-game.vercel.app)
- [Video Trailer](https://youtube.com/watch?v=...)

## ⚙️ Technical Stack
- **Engine:** Phaser 3
- **Language:** TypeScript
- **Physics:** Matter.js
- **Audio:** Howler.js

## ✨ Key Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## 🧠 Technical Highlights
- Custom A* pathfinding implementation
- Object pooling for 1000+ bullets
- 60 FPS on mobile devices

## 📸 Screenshots
| Menu | Gameplay | Boss Fight |
|------|----------|------------|
| ![](./menu.png) | ![](./gameplay.png) | ![](./boss.png) |

## 🚀 Development Process
### Challenges
- Problem: Physics was slow with many objects
- Solution: Implemented spatial hashing

### What I Learned
- How to optimize rendering for mobile
- State machine patterns for complex AI
- etc.

## 📅 Timeline
- Week 1-2: Prototyping
- Week 3-4: Core mechanics
- Week 5-6: Polish and testing

## 🔗 Links
- [Source Code](https://github.com/you/project)
- [DevLog](https://your-blog.com/devlog)
          `}
        />
      </Section>

      <Section title="GitHub Profile" icon="🐙">
        <CodeBlock
          title="Profile README"
          language="markdown"
          code={`
<!-- README.md ใน repo ชื่อ username ของคุณ -->

# Hi, I'm [Your Name] 👋

## 🎮 Game Developer

I create **web-based games** using modern technologies.

### 🔥 Featured Projects

| Project | Description | Tech | Play |
|---------|-------------|------|------|
| Space Shooter | Fast-paced arcade | Phaser 3 | [Play](link) |
| Puzzle Quest | Match-3 RPG | React + PixiJS | [Play](link) |
| 3D Racing | WebGL racing game | Three.js | [Play](link) |

### 🛠️ Tech Stack

\`\`\`
Languages:    JavaScript, TypeScript, Python
Frameworks:   Phaser, Three.js, React, Next.js
Tools:        Tiled, Aseprite, Blender
Platforms:    Web, Desktop (Electron)
\`\`\`

### 📈 GitHub Stats

![Your GitHub stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME)

### 🎯 Currently Working On
- 🔨 Building an open-world RPG
- 📚 Learning shaders and GLSL
- ✍️ Writing game dev tutorials

### 📫 Contact
- Portfolio: [yoursite.com](link)
- LinkedIn: [/in/yourname](link)
- Twitter: [@yourhandle](link)
- Email: you@email.com
          `}
        />

        <TipBox type="tip">
          <strong>GitHub Tips:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Pin best projects</li>
            <li>• ใส่ README ทุก repo</li>
            <li>• Commit regularly (green squares)</li>
            <li>• Use descriptive commit messages</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Portfolio Website" icon="🌐">
        <CodeBlock
          title="Portfolio Structure"
          language="text"
          code={`
portfolio-site/
├── pages/
│   ├── index.tsx          # Home with featured projects
│   ├── projects/
│   │   ├── index.tsx      # All projects grid
│   │   └── [slug].tsx     # Individual project page
│   ├── about.tsx          # About me, skills
│   ├── resume.tsx         # Downloadable resume
│   └── contact.tsx        # Contact form
│
├── components/
│   ├── ProjectCard.tsx    # Project preview card
│   ├── SkillBar.tsx       # Skill visualization
│   ├── GameEmbed.tsx      # Embed playable games
│   └── VideoPlayer.tsx    # Game trailers
│
└── data/
    └── projects.json      # Project data
          `}
        />

        <CodeBlock
          title="Project Data"
          language="json"
          code={`
{
  "projects": [
    {
      "slug": "space-shooter",
      "title": "Space Shooter",
      "tagline": "Fast-paced arcade action",
      "thumbnail": "/projects/space-shooter/thumb.png",
      "demoUrl": "https://space-shooter.vercel.app",
      "repoUrl": "https://github.com/you/space-shooter",
      "videoUrl": "https://youtube.com/...",
      "tags": ["Phaser", "TypeScript", "Arcade"],
      "year": 2024,
      "featured": true,
      "highlights": [
        "Custom particle system",
        "60+ FPS on mobile",
        "10 unique enemy types"
      ]
    }
  ]
}
          `}
        />
      </Section>

      <Section title="What to Include" icon="✅">
        <Table
          headers={["Element", "Why"]}
          rows={[
            ["3-5 Best Projects", "Quality over quantity"],
            ["Playable Demos", "Show, don't tell"],
            ["Source Code", "Prove you wrote it"],
            ["Technical Writing", "Communication skills"],
            ["Contact Info", "Make it easy to reach you"],
            ["Resume/CV", "Formal credentials"],
          ]}
        />
      </Section>

      <Section title="สรุป" icon="📝">
        <TipBox type="success">
          <strong>Portfolio Checklist:</strong>
          <ul className="mt-2 space-y-1">
            <li>✅ 3-5 polished projects</li>
            <li>✅ Playable demos / videos</li>
            <li>✅ Clean, documented code</li>
            <li>✅ Technical case studies</li>
            <li>✅ Professional GitHub profile</li>
            <li>✅ Easy contact info</li>
          </ul>
        </TipBox>

        <TipBox type="info">
          <strong>บทต่อไป: Resume สำหรับ Game Dev! 📄</strong>
        </TipBox>
      </Section>
    </div>
  );
}
