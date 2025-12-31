"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Animation Loop สำหรับ Canvas Games</h1>

      <Objectives
        items={[
          "สร้าง smooth animation ด้วย requestAnimationFrame",
          "ใช้ Delta Time สำหรับ frame-rate independent movement",
          "สร้าง sprite animation",
          "FPS counter และ performance monitoring",
        ]}
      />

      <Section title="requestAnimationFrame คืออะไร?" icon="⚡">
        <p className="mb-4">
          <strong>requestAnimationFrame</strong> คือ browser API ที่เหมาะที่สุดสำหรับการทำ animation:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
          <li>⚡ Sync กับ monitor refresh rate (60 FPS)</li>
          <li>🔋 หยุดอัตโนมัติเมื่อ tab ไม่ active</li>
          <li>🎨 Smooth animations ไม่กระตุก</li>
        </ul>

        <CodeBlock
          title="Basic Animation Loop"
          language="javascript"
          code={`
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let x = 0;

function gameLoop() {
  // 1. Clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 2. Update
  x += 2;
  if (x > canvas.width) x = -50;
  
  // 3. Draw
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(x, 200, 50, 50);
  
  // 4. Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
          `}
        />
      </Section>

      <Section title="Delta Time - Frame Rate Independent" icon="⏱️">
        <TipBox type="warning">
          <strong>ปัญหา:</strong> เครื่องแต่ละเครื่องมี FPS ต่างกัน (30, 60, 144 FPS)
          ทำให้เกมทำงานเร็ว/ช้าไม่เท่ากัน!
        </TipBox>

        <CodeBlock
          title="Delta Time Solution"
          language="javascript"
          code={`
let lastTime = 0;

function gameLoop(timestamp) {
  // คำนวณ delta time (วินาที)
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update with delta time
  update(deltaTime);
  
  // Draw
  render();
  
  requestAnimationFrame(gameLoop);
}

const player = {
  x: 100,
  y: 300,
  speed: 200  // pixels PER SECOND (ไม่ใช่ per frame!)
};

function update(dt) {
  // ไม่ว่า FPS จะเป็นเท่าไร player จะเคลื่อนที่ 200 px/s เสมอ
  player.x += player.speed * dt;
  
  if (player.x > canvas.width) {
    player.x = -50;
  }
}

function render() {
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(player.x, player.y, 50, 50);
}

requestAnimationFrame(gameLoop);
          `}
        />

        <Table
          headers={["FPS", "Delta Time", "Movement/frame", "Total/second"]}
          rows={[
            ["60", "0.0167s", "~3.3 px", "200 px ✅"],
            ["30", "0.0333s", "~6.7 px", "200 px ✅"],
            ["144", "0.0069s", "~1.4 px", "200 px ✅"],
          ]}
        />
      </Section>

      <Section title="Complete Game Loop Structure" icon="🎮">
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
  frameCount: 0,
  lastFpsUpdate: 0
};

// Input
const keys = {};

// Player
const player = {
  x: 400,
  y: 300,
  vx: 0,
  vy: 0,
  speed: 300,
  width: 40,
  height: 40
};

// ==========================================
// INPUT HANDLING
// ==========================================
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  
  if (e.code === 'Escape') {
    game.isPaused = !game.isPaused;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// ==========================================
// UPDATE
// ==========================================
function update(dt) {
  if (game.isPaused) return;
  
  // Input -> Velocity
  player.vx = 0;
  player.vy = 0;
  
  if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -1;
  if (keys['ArrowRight'] || keys['KeyD']) player.vx = 1;
  if (keys['ArrowUp'] || keys['KeyW']) player.vy = -1;
  if (keys['ArrowDown'] || keys['KeyS']) player.vy = 1;
  
  // Normalize diagonal movement
  if (player.vx !== 0 && player.vy !== 0) {
    const diag = 1 / Math.sqrt(2);  // ~0.707
    player.vx *= diag;
    player.vy *= diag;
  }
  
  // Apply movement
  player.x += player.vx * player.speed * dt;
  player.y += player.vy * player.speed * dt;
  
  // Keep in bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// ==========================================
// RENDER
// ==========================================
function render() {
  // Clear
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw player
  ctx.fillStyle = game.isPaused ? '#666' : '#4ade80';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw FPS
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(\`FPS: \${game.fps}\`, 10, 25);
  
  // Draw pause overlay
  if (game.isPaused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
}

// ==========================================
// GAME LOOP
// ==========================================
function gameLoop(timestamp) {
  // Delta time
  const dt = (timestamp - game.lastTime) / 1000;
  game.lastTime = timestamp;
  
  // FPS counter
  game.frameCount++;
  if (timestamp - game.lastFpsUpdate >= 1000) {
    game.fps = game.frameCount;
    game.frameCount = 0;
    game.lastFpsUpdate = timestamp;
  }
  
  // Main loop
  update(dt);
  render();
  
  // Continue
  if (game.isRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// START GAME
console.log('🎮 Game Started!');
requestAnimationFrame(gameLoop);
          `}
        />
      </Section>

      <Section title="Sprite Animation" icon="🎬">
        <CodeBlock
          title="Sprite Sheet Animation"
          language="javascript"
          code={`
// โหลด sprite sheet
const spriteSheet = new Image();
spriteSheet.src = 'player_spritesheet.png';

// Animation config
const animation = {
  frames: 4,         // จำนวน frames
  currentFrame: 0,
  frameWidth: 32,
  frameHeight: 32,
  frameTime: 0.15,   // วินาทีต่อ frame
  elapsed: 0
};

function updateAnimation(dt) {
  animation.elapsed += dt;
  
  if (animation.elapsed >= animation.frameTime) {
    animation.currentFrame = (animation.currentFrame + 1) % animation.frames;
    animation.elapsed = 0;
  }
}

function drawSprite(x, y) {
  const sx = animation.currentFrame * animation.frameWidth;
  const sy = 0;  // row 0 (idle), row 1 (walk), etc.
  
  ctx.drawImage(
    spriteSheet,
    sx, sy,                                    // source position
    animation.frameWidth, animation.frameHeight, // source size
    x, y,                                       // destination position
    32, 32                                      // destination size
  );
}

// In game loop
function update(dt) {
  updateAnimation(dt);
}

function render() {
  drawSprite(player.x, player.y);
}
          `}
        />

        <Diagram caption="Sprite Sheet Layout">
{`┌──────┬──────┬──────┬──────┐
│ F0   │ F1   │ F2   │ F3   │  ← Idle Animation (Row 0)
└──────┴──────┴──────┴──────┘
┌──────┬──────┬──────┬──────┐
│ F0   │ F1   │ F2   │ F3   │  ← Walk Animation (Row 1)
└──────┴──────┴──────┴──────┘
   32px   32px   32px   32px`}
        </Diagram>
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["requestAnimationFrame", "API สำหรับ smooth 60 FPS"],
            ["Delta Time", "เวลาระหว่าง frames (วินาที)"],
            ["speed * dt", "Frame-rate independent movement"],
            ["Sprite Animation", "แสดง frames จาก sprite sheet"],
            ["FPS Counter", "ตรวจสอบ performance"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Input Handling - ควบคุมเกมด้วย keyboard และ mouse! 🎮</strong>
        </TipBox>
      </Section>
    </div>
  );
}
