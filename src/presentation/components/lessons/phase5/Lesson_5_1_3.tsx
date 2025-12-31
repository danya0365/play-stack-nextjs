"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Interview Preparation</h1>

      <Objectives
        items={[
          "Technical interview สำหรับ game dev",
          "คำถามที่พบบ่อยและวิธีตอบ",
          "Whiteboard/coding challenges",
          "Portfolio review preparation",
        ]}
      />

      <Section title="Interview Types" icon="🎤">
        <Table
          headers={["Type", "What to Expect"]}
          rows={[
            ["Phone Screen", "Basic questions, motivation, experience"],
            ["Technical Phone", "Coding problem, system design"],
            ["Take-Home", "Mini project or bug fix"],
            ["On-Site Technical", "Whiteboard, pair programming"],
            ["Portfolio Review", "Walk through your projects"],
            ["Culture Fit", "Team dynamics, working style"],
          ]}
        />
      </Section>

      <Section title="Common Questions" icon="❓">
        <CodeBlock
          title="Technical Questions"
          language="text"
          code={`
📐 GAME PROGRAMMING
Q: อธิบาย Game Loop
A: Game loop คือ core loop ที่ทำงานซ้ำทุก frame ประกอบด้วย:
   1. Process Input - รับ keyboard/mouse/touch
   2. Update - update game logic, physics, AI
   3. Render - วาดทุกอย่างบนหน้าจอ
   ใช้ requestAnimationFrame เพื่อ sync กับ display refresh rate
   และใช้ delta time เพื่อให้ movement ไม่ขึ้นกับ frame rate

Q: Fixed timestep vs Variable timestep ต่างกันอย่างไร?
A: Variable: dt ต่างกันทุก frame, ง่ายกว่าแต่ physics อาจ unstable
   Fixed: dt คงที่ (เช่น 1/60), physics stable แต่ต้อง accumulate time
   ส่วนใหญ่ use fixed timestep for physics, variable for rendering

Q: Object Pooling คืออะไร?
A: Technique สำหรับ reuse objects แทน create/destroy
   - สร้าง pool ของ objects ล่วงหน้า
   - acquire() เมื่อต้องใช้
   - release() เมื่อเสร็จ
   ลด garbage collection spike และ allocation overhead

📦 DATA STRUCTURES
Q: ใช้ data structure อะไรสำหรับ collision detection ที่มี objects เยอะ?
A: Spatial partitioning:
   - Grid/Spatial Hash - O(1) lookup, ง่าย
   - Quadtree - ดีสำหรับ non-uniform distribution
   - BVH - ดีสำหรับ 3D และ complex shapes

Q: A* ทำงานอย่างไร?
A: Pathfinding algorithm ที่ใช้:
   - Open list: nodes ที่จะ explore
   - Closed list: nodes ที่ explore แล้ว
   - f(n) = g(n) + h(n)
     g = cost from start, h = heuristic to goal
   - เลือก node ที่มี f ต่ำสุด, expand neighbors, repeat
          `}
        />

        <CodeBlock
          title="Behavioral Questions"
          language="text"
          code={`
🤝 TEAMWORK
Q: Tell me about a challenging project
A: Use STAR method:
   Situation: "Working on multiplayer game, latency issues"
   Task: "Had to implement lag compensation"
   Action: "Researched techniques, implemented client-side prediction"
   Result: "Reduced perceived latency by 70%, players satisfied"

Q: How do you handle disagreements with teammates?
A: "I focus on the problem, not the person.
   Listen to understand their perspective.
   Present data/evidence for my view.
   Find compromise or escalate to lead if needed.
   Once decision is made, commit fully."

🎮 GAME DESIGN
Q: What makes a game fun?
A: Elements like:
   - Clear goals with meaningful choices
   - Appropriate challenge (flow state)
   - Satisfying feedback (juice)
   - Sense of progression
   - Depends on genre และ target audience

Q: Favorite game? Why?
A: Be specific และ analytical:
   "[Game] because [specific mechanic] creates [emotional response].
   The [system] is elegant because [technical/design reason].
   I learned [specific thing] that influences my work."
          `}
        />
      </Section>

      <Section title="Coding Challenges" icon="💻">
        <CodeBlock
          title="Common Game Dev Problems"
          language="javascript"
          code={`
// ─────────────────────────────────
// Problem 1: 2D Collision Detection
// ─────────────────────────────────
function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Circle collision
function circleCollision(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

// ─────────────────────────────────
// Problem 2: Find closest enemy
// ─────────────────────────────────
function findClosestEnemy(player, enemies) {
  let closest = null;
  let minDist = Infinity;
  
  for (const enemy of enemies) {
    const dist = distance(player, enemy);
    if (dist < minDist) {
      minDist = dist;
      closest = enemy;
    }
  }
  
  return closest;
}

// ─────────────────────────────────
// Problem 3: Implement simple state machine
// ─────────────────────────────────
class StateMachine {
  constructor() {
    this.states = {};
    this.current = null;
  }
  
  add(name, { enter, update, exit }) {
    this.states[name] = { enter, update, exit };
  }
  
  change(name) {
    if (this.current && this.states[this.current].exit) {
      this.states[this.current].exit();
    }
    this.current = name;
    if (this.states[name].enter) {
      this.states[name].enter();
    }
  }
  
  update(dt) {
    if (this.current && this.states[this.current].update) {
      this.states[this.current].update(dt);
    }
  }
}

// ─────────────────────────────────
// Problem 4: Smooth camera follow
// ─────────────────────────────────
function updateCamera(camera, target, dt) {
  const smoothness = 0.1;
  camera.x += (target.x - camera.x) * smoothness;
  camera.y += (target.y - camera.y) * smoothness;
}

// Or with lerp
function lerp(a, b, t) {
  return a + (b - a) * t;
}
          `}
        />
      </Section>

      <Section title="Portfolio Review Tips" icon="🎨">
        <CodeBlock
          title="Presenting Your Work"
          language="text"
          code={`
📋 PREPARATION
- เตรียม demo ที่ work (check links!)
- รู้ code ของตัวเอง (เค้าอาจถาม detail)
- เตรียมพูดเรื่อง challenges และ solutions

🎯 DURING PRESENTATION
"This is [Project Name], a [genre] game built with [tech].

The main challenge was [problem].
I solved it by [solution], which [result].

Let me show you [interesting feature]...
*demonstrate*

If I were to improve it, I would [future improvement]."

❓ EXPECT QUESTIONS LIKE:
- Why did you choose [technology]?
- How would you scale this for more players?
- What was the hardest bug you fixed?
- What would you do differently?
- Walk me through the code for [feature]
          `}
        />
      </Section>

      <Section title="Questions to Ask" icon="🙋">
        <CodeBlock
          title="Questions for Interviewer"
          language="text"
          code={`
🎮 ABOUT THE ROLE
- What does a typical day/week look like?
- What projects would I work on first?
- How is the team structured?

👥 ABOUT THE TEAM
- What's the code review process?
- How do you handle crunch?
- What's the onboarding like?

🚀 ABOUT THE COMPANY
- What's the tech stack?
- How do you approach game design decisions?
- What's the biggest challenge the team faces?

📈 ABOUT GROWTH
- How do you support skill development?
- What does success look like in this role?
- Are there opportunities to work on different projects?
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Before", "During", "After"]}
          rows={[
            ["Research company", "Be confident", "Send thank you"],
            ["Practice problems", "Ask questions", "Follow up"],
            ["Prepare portfolio", "Show enthusiasm", "Reflect & learn"],
            ["Test all demos", "Be honest", ""],
          ]}
        />

        <TipBox type="success">
          <strong>🎉 Congratulations!</strong>
          <br />
          คุณเรียนจบ PlayStack Course แล้ว! 🚀
        </TipBox>
      </Section>
    </div>
  );
}
