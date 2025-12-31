"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_1_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Game Loop: หัวใจของเกมทุกเกม</h1>

      <Objectives
        items={[
          "เข้าใจว่า Game Loop คืออะไรและทำงานอย่างไร",
          "การใช้ requestAnimationFrame",
          "การคำนวณ Delta Time สำหรับ smooth movement",
          "Fixed vs Variable Timestep",
        ]}
      />

      <Section title="Game Loop คืออะไร?" icon="🔄">
        <p className="mb-4">
          Game Loop คือ <strong>วงจรหลัก</strong> ที่ทำงานซ้ำตลอดเวลาที่เกมทำงาน
        </p>

        <Diagram caption="Game Loop Flow">
{`┌──────────────────────────────────────────────┐
│                  GAME LOOP                    │
├──────────────────────────────────────────────┤
│                                              │
│   ┌─────────────┐                           │
│   │   INPUT     │  ← รับ input จากผู้เล่น      │
│   │   PHASE     │    (keyboard, mouse)       │
│   └──────┬──────┘                           │
│          ↓                                   │
│   ┌──────┴──────┐                           │
│   │   UPDATE    │  ← อัพเดท game state       │
│   │   PHASE     │    (ตำแหน่ง, collision)     │
│   └──────┬──────┘                           │
│          ↓                                   │
│   ┌──────┴──────┐                           │
│   │   RENDER    │  ← วาดทุกอย่างลงหน้าจอ      │
│   │   PHASE     │    (graphics, UI)          │
│   └──────┬──────┘                           │
│          ↓                                   │
│          └────→ กลับไปเริ่มใหม่ (60 FPS)        │
│                                              │
└──────────────────────────────────────────────┘`}
        </Diagram>
      </Section>

      <Section title="requestAnimationFrame" icon="⚡">
        <p className="mb-4">วิธีที่ดีที่สุดในการสร้าง Game Loop บน Browser:</p>

        <CodeBlock
          title="Basic Game Loop"
          language="javascript"
          code={`
function gameLoop(timestamp) {
  // 1. Handle Input
  handleInput();
  
  // 2. Update Game Logic
  update();
  
  // 3. Render Graphics
  render();
  
  // 4. Request next frame
  requestAnimationFrame(gameLoop);
}

// เริ่ม game loop
requestAnimationFrame(gameLoop);
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">ทำไมต้อง requestAnimationFrame?</h3>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>⚡ Sync กับ monitor refresh rate (60 FPS)</li>
          <li>🔋 หยุดอัตโนมัติเมื่อ tab ไม่ active (ประหยัด battery)</li>
          <li>🎨 Smooth animations ไม่กระตุก</li>
        </ul>
      </Section>

      <Section title="Delta Time - สำคัญมาก!" icon="⏱️">
        <TipBox type="warning">
          <strong>ปัญหา:</strong> เครื่องแต่ละเครื่องมี FPS ต่างกัน (30, 60, 144 FPS)
          <br />
          <strong>ทำให้:</strong> เกมทำงานเร็ว/ช้าไม่เท่ากัน!
        </TipBox>

        <h3 className="font-semibold text-lg mt-6 mb-3">❌ ปัญหา - เคลื่อนที่ไม่สม่ำเสมอ</h3>
        <CodeBlock
          language="javascript"
          code={`
function update() {
  player.x += 5; // 5 pixels ต่อ frame
  // 60 FPS = 300 px/s
  // 30 FPS = 150 px/s  ← ช้ากว่า 2 เท่า!
}
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">✅ แก้ไข - ใช้ Delta Time</h3>
        <CodeBlock
          title="Game Loop with Delta Time"
          language="javascript"
          code={`
let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  
  update(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
  // 300 pixels per second ไม่ว่า FPS จะเป็นเท่าไร
  player.x += 300 * deltaTime;
}
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">Delta Time ทำงานอย่างไร?</h3>
        <Table
          headers={["FPS", "Delta Time", "Movement per frame", "Total per second"]}
          rows={[
            ["60", "0.0167s", "5 px", "300 px"],
            ["30", "0.0333s", "10 px", "300 px"],
            ["120", "0.0083s", "2.5 px", "300 px"],
          ]}
        />

        <TipBox type="success">
          <strong>ผลลัพธ์เหมือนกัน ไม่ว่า FPS จะเป็นเท่าไร!</strong>
        </TipBox>
      </Section>

      <Section title="Complete Game Loop Template" icon="🎮">
        <CodeBlock
          title="Production-Ready Game Loop"
          language="javascript"
          code={`
// ==========================================
// GAME STATE
// ==========================================
const game = {
  isRunning: true,
  isPaused: false,
  lastTime: 0,
  fps: 0,
  frameCount: 0
};

// Input State
const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false
};

// Player
const player = {
  x: 400,
  y: 300,
  speed: 200 // pixels per second
};

// ==========================================
// INPUT HANDLING
// ==========================================
function setupInput() {
  document.addEventListener('keydown', (e) => {
    switch(e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        keys.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        keys.right = true;
        break;
      case 'Escape':
        game.isPaused = !game.isPaused;
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    switch(e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        keys.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        keys.right = false;
        break;
    }
  });
}

// ==========================================
// UPDATE
// ==========================================
function update(deltaTime) {
  if (game.isPaused) return;
  
  // Player movement with delta time
  if (keys.left) player.x -= player.speed * deltaTime;
  if (keys.right) player.x += player.speed * deltaTime;
  
  // Keep player in bounds
  player.x = Math.max(0, Math.min(800 - 32, player.x));
}

// ==========================================
// RENDER
// ==========================================
function render() {
  const ctx = canvas.getContext('2d');
  
  // Clear screen
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw player
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(player.x, player.y, 32, 32);
  
  // Draw FPS
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(\`FPS: \${game.fps}\`, 10, 20);
}

// ==========================================
// GAME LOOP
// ==========================================
function gameLoop(timestamp) {
  const deltaTime = (timestamp - game.lastTime) / 1000;
  game.lastTime = timestamp;
  
  // Calculate FPS
  game.frameCount++;
  if (game.frameCount % 30 === 0) {
    game.fps = Math.round(1 / deltaTime);
  }
  
  update(deltaTime);
  render();
  
  if (game.isRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// ==========================================
// START
// ==========================================
setupInput();
requestAnimationFrame(gameLoop);
console.log('🎮 Game Started!');
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Game Loop", "วงจรหลักที่ทำงานซ้ำตลอดเกม"],
            ["requestAnimationFrame", "API สำหรับ smooth 60 FPS"],
            ["Delta Time", "เวลาระหว่าง frames (seconds)"],
            ["Input Phase", "รับ input จากผู้เล่น"],
            ["Update Phase", "อัพเดท game logic"],
            ["Render Phase", "วาดกราฟิก"],
          ]}
        />

        <TipBox type="info">
          <strong>บทต่อไป: คณิตศาสตร์สำหรับเกม! 📐</strong>
        </TipBox>
      </Section>
    </div>
  );
}
