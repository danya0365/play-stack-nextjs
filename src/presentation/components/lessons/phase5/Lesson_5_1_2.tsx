"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Resume สำหรับ Game Developer</h1>

      <Objectives
        items={[
          "เขียน Resume ที่โดดเด่น",
          "Highlight tech skills อย่างมีประสิทธิภาพ",
          "Project descriptions ที่น่าสนใจ",
          "Tailor resume สำหรับแต่ละตำแหน่ง",
        ]}
      />

      <Section title="Resume Structure" icon="📄">
        <CodeBlock
          title="Resume Template"
          language="markdown"
          code={`
# [Your Name]
**Game Developer**

📧 email@example.com | 🌐 portfolio.com | 💼 linkedin.com/in/you | 🐙 github.com/you

---

## 🎯 Summary
Passionate game developer with X years of experience creating engaging 
web-based games. Specialized in [Phaser/Three.js/etc.] with a focus on 
[gameplay programming/technical art/etc.]. Shipped X games with Y+ players.

---

## 💼 Experience

### Game Developer | Company Name
*Jan 2023 - Present*

- Developed and shipped 3 HTML5 games with 100K+ total plays
- Implemented A* pathfinding reducing CPU usage by 40%
- Created reusable component library used across 5 projects
- Optimized rendering pipeline achieving 60 FPS on mobile devices

### Junior Developer | Previous Company
*Jun 2021 - Dec 2022*

- Built gameplay features for match-3 puzzle game
- Integrated analytics and player progression systems
- Collaborated with designers to implement game mechanics

---

## 🎮 Projects

### Space Shooter (Phaser 3, TypeScript)
[Play](link) | [Source](github)
- Fast-paced arcade game with 10 enemy types
- Custom particle system and screen shake effects
- 4.5★ rating on itch.io with 5,000+ plays

### 3D Dungeon Crawler (Three.js, React)
[Play](link) | [Source](github)
- Procedurally generated dungeons using BSP algorithm
- Real-time lighting with dynamic shadows
- Save/load system using IndexedDB

---

## 🛠️ Skills

**Languages:** JavaScript, TypeScript, Python, C#
**Game Engines:** Phaser, PixiJS, Three.js, Unity (learning)
**Web:** React, Next.js, Node.js, WebSocket
**Tools:** Git, VS Code, Tiled, Aseprite, Blender
**Concepts:** Game loops, Physics, AI/Pathfinding, ECS

---

## 📚 Education

### Bachelor of Computer Science
University Name | 2017 - 2021
- Relevant coursework: Computer Graphics, Game Design, AI

---

## 🏆 Achievements

- 🥇 1st Place, GameJam Thailand 2023
- 📜 Published article "Optimizing Phaser Games" (500+ views)
- ⭐ 100+ GitHub stars across projects
          `}
        />
      </Section>

      <Section title="Project Descriptions" icon="✍️">
        <TipBox type="tip">
          <strong>ใช้ Formula นี้:</strong>
          <br />
          [Action verb] + [What you did] + [Impact/Result]
        </TipBox>

        <CodeBlock
          title="ก่อน vs หลัง"
          language="text"
          code={`
❌ Bad:
- Made a game using Phaser
- Added multiplayer
- Fixed bugs

✅ Good:
- Developed roguelike game with procedural level generation 
  and 20+ unique items, achieving 5,000+ plays on itch.io
  
- Implemented real-time multiplayer using WebSocket, 
  supporting 8 concurrent players with <50ms latency
  
- Reduced memory usage by 60% through object pooling, 
  enabling smooth gameplay on low-end mobile devices
          `}
        />

        <Table
          headers={["Action Verbs", "ใช้เมื่อ"]}
          rows={[
            ["Developed, Built, Created", "สร้าง features ใหม่"],
            ["Implemented, Integrated", "Technical work"],
            ["Optimized, Improved", "Performance/quality"],
            ["Designed, Architected", "System design"],
            ["Led, Collaborated", "Teamwork"],
          ]}
        />
      </Section>

      <Section title="Skills Section" icon="🛠️">
        <CodeBlock
          title="Skills Formatting"
          language="markdown"
          code={`
# Option 1: Categorized (Recommended)
**Languages:** JavaScript/TypeScript (Expert), Python (Intermediate)
**Game Dev:** Phaser, PixiJS, Three.js, Matter.js
**Web:** React, Next.js, Node.js, WebSocket

# Option 2: Proficiency Bars (อาจใช้ใน PDF)
JavaScript     ████████░░ 80%
TypeScript     ███████░░░ 70%
Phaser         ████████░░ 80%
Three.js       ██████░░░░ 60%

# Option 3: Years of Experience
- JavaScript (5 years)
- Phaser (3 years)
- Three.js (2 years)
          `}
        />

        <TipBox type="warning">
          <strong>อย่า:</strong>
          <ul className="mt-2 space-y-1">
            <li>• ใส่ skills ที่ไม่เกี่ยว (MS Office)</li>
            <li>• โอ้อวด skills ที่ยังไม่แข็งแรง</li>
            <li>• ใส่ rating ที่ไม่มีมาตรฐาน</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Tailoring Resume" icon="🎯">
        <CodeBlock
          title="Match Job Description"
          language="text"
          code={`
Job Description Says:
"Looking for experience with Unity, C#, and multiplayer games"

Your Resume Should Highlight:
✅ Unity projects (even if personal)
✅ C# skills and related OOP experience
✅ Any multiplayer implementation
✅ Networking knowledge

Job Description Says:
"Web game developer for casual mobile games"

Your Resume Should Highlight:
✅ Phaser, PixiJS, or similar
✅ Mobile-first development
✅ Performance optimization
✅ Touch controls implementation
          `}
        />
      </Section>

      <Section title="Cover Letter Tips" icon="📨">
        <CodeBlock
          title="Cover Letter Structure"
          language="text"
          code={`
Dear [Hiring Manager],

[Paragraph 1: Hook]
As a game developer who has shipped X games played by Y+ users, 
I was excited to see the [Position] role at [Company]. Your work 
on [Specific Game/Project] resonates with my passion for [Genre/Style].

[Paragraph 2: Why You're a Fit]
In my current role at [Company], I [specific achievement aligned 
with job requirements]. My experience with [Tech Stack] and 
[Relevant Skill] makes me well-prepared for this opportunity.

[Paragraph 3: Why This Company]
I'm particularly drawn to [Company] because of [specific reason - 
studio culture, games they've made, technology]. I believe my 
[skill/experience] would contribute to [specific project/goal].

[Paragraph 4: Call to Action]
I'd love the opportunity to discuss how my experience aligns 
with your team's needs. My portfolio at [link] showcases my 
recent work. Thank you for your consideration.

Best regards,
[Your Name]
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Do", "Don't"]}
          rows={[
            ["Quantify achievements", "Vague descriptions"],
            ["Tailor for each job", "One-size-fits-all"],
            ["Include portfolio link", "Text-only projects"],
            ["1-2 pages max", "5+ pages"],
            ["Proofread carefully", "Typos/errors"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Interview Preparation! 🎤</strong>
        </TipBox>
      </Section>
    </div>
  );
}
