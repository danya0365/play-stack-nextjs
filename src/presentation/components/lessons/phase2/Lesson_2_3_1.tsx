"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_3_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน PixiJS</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ PixiJS และข้อดี",
          "ตั้งค่า PixiJS project",
          "สร้าง Sprites และ Containers",
          "Loader และ Asset Management",
        ]}
      />

      <Section title="PixiJS คืออะไร?" icon="🚀">
        <p className="mb-4">
          <strong>PixiJS</strong> เป็น 2D rendering engine ที่เร็วที่สุดบน web:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>⚡ WebGL rendering ที่เร็วมาก</li>
          <li>🎨 Filters, Blending modes, Masks</li>
          <li>📱 Touch-friendly</li>
          <li>🔧 ไม่มี physics built-in (ยืดหยุ่นกว่า)</li>
        </ul>

        <TipBox type="info">
          <strong>PixiJS vs Phaser:</strong>
          <br />
          PixiJS เป็น renderer อย่างเดียว ​ต้องจัดการ game logic เอง
          เหมาะกับเกมที่ต้องการ control สูงและ performance สูง
        </TipBox>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Setup PixiJS Project"
          language="bash"
          code={`
# Create project
npm create vite@latest my-pixi-game -- --template vanilla
cd my-pixi-game

# Install PixiJS
npm install pixi.js
          `}
        />

        <CodeBlock
          title="Basic HTML"
          language="html"
          code={`
<!DOCTYPE html>
<html>
<head>
  <title>PixiJS Game</title>
  <style>
    * { margin: 0; padding: 0; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module" src="/main.js"></script>
</body>
</html>
          `}
        />
      </Section>

      <Section title="Creating Application" icon="🎮">
        <CodeBlock
          title="PixiJS Application"
          language="javascript"
          code={`
import * as PIXI from 'pixi.js';

// สร้าง Application
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a2e,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true
});

// เพิ่ม canvas เข้า DOM
document.body.appendChild(app.view);

// ตอนนี้พร้อมใช้งาน!
console.log('PixiJS version:', PIXI.VERSION);
          `}
        />

        <CodeBlock
          title="Responsive Canvas"
          language="javascript"
          code={`
// Full screen
const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x1a1a2e
});

// Or specific container
const container = document.getElementById('game-container');
const app = new PIXI.Application({
  resizeTo: container,
  backgroundColor: 0x1a1a2e
});

// Handle resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
          `}
        />
      </Section>

      <Section title="Loading Assets" icon="📥">
        <CodeBlock
          title="Asset Loading"
          language="javascript"
          code={`
import * as PIXI from 'pixi.js';

async function init() {
  const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1a1a2e
  });
  document.body.appendChild(app.view);
  
  // ─────────────────────────────────
  // Load single asset
  // ─────────────────────────────────
  const texture = await PIXI.Assets.load('assets/player.png');
  
  // ─────────────────────────────────
  // Load multiple assets
  // ─────────────────────────────────
  PIXI.Assets.addBundle('game', {
    player: 'assets/player.png',
    enemy: 'assets/enemy.png',
    background: 'assets/bg.png',
    spritesheet: 'assets/spritesheet.json'
  });
  
  const assets = await PIXI.Assets.loadBundle('game');
  
  // ─────────────────────────────────
  // Progress callback
  // ─────────────────────────────────
  await PIXI.Assets.loadBundle('game', (progress) => {
    console.log(\`Loading: \${Math.round(progress * 100)}%\`);
    updateLoadingBar(progress);
  });
  
  // Now start game
  startGame(app, assets);
}

function startGame(app, assets) {
  // Create sprites from loaded textures
  const player = new PIXI.Sprite(assets.player);
  app.stage.addChild(player);
}

init();
          `}
        />
      </Section>

      <Section title="Sprites" icon="🖼️">
        <CodeBlock
          title="Creating Sprites"
          language="javascript"
          code={`
// จาก texture ที่โหลดแล้ว
const player = new PIXI.Sprite(texture);

// Properties
player.x = 400;
player.y = 300;
player.width = 64;
player.height = 64;
player.scale.set(2);           // ขยาย 2 เท่า
player.anchor.set(0.5);        // จุดหมุนตรงกลาง
player.rotation = Math.PI / 4; // หมุน 45 องศา
player.alpha = 0.8;            // ความโปร่งใส
player.tint = 0xff0000;        // ใส่สี
player.visible = true;

// Add to stage
app.stage.addChild(player);

// Position shortcuts
player.position.set(400, 300);
player.scale.set(2, 2);
player.anchor.set(0.5, 0.5);

// Pivot (different from anchor)
player.pivot.set(32, 48);  // offset from top-left
          `}
        />
      </Section>

      <Section title="Containers" icon="📦">
        <CodeBlock
          title="Grouping with Containers"
          language="javascript"
          code={`
// Container = group of display objects
const gameContainer = new PIXI.Container();
app.stage.addChild(gameContainer);

// Add children
const player = new PIXI.Sprite(playerTexture);
const weapon = new PIXI.Sprite(weaponTexture);
gameContainer.addChild(player);
gameContainer.addChild(weapon);

// Move container = move all children
gameContainer.x = 400;
gameContainer.y = 300;

// Container properties
gameContainer.scale.set(2);     // scale all children
gameContainer.rotation = 0.5;   // rotate all children
gameContainer.alpha = 0.5;      // affect all children

// Sort children by zIndex
gameContainer.sortableChildren = true;
player.zIndex = 1;
weapon.zIndex = 2;

// Get children
gameContainer.children.forEach(child => {
  console.log(child);
});

// Remove children
gameContainer.removeChild(weapon);
gameContainer.removeChildren();  // remove all
          `}
        />
      </Section>

      <Section title="Game Loop" icon="🔄">
        <CodeBlock
          title="Animation with Ticker"
          language="javascript"
          code={`
// ─────────────────────────────────
// Using app.ticker
// ─────────────────────────────────
app.ticker.add((delta) => {
  // delta = time since last frame (in frames, not ms)
  // At 60 FPS, delta ≈ 1
  
  player.x += speed * delta;
  player.rotation += 0.01 * delta;
});

// ─────────────────────────────────
// Delta time in seconds
// ─────────────────────────────────
app.ticker.add((delta) => {
  const dt = delta / 60;  // convert to seconds (roughly)
  player.x += 100 * dt;   // 100 pixels per second
});

// ─────────────────────────────────
// More accurate delta time
// ─────────────────────────────────
let lastTime = performance.now();

app.ticker.add(() => {
  const now = performance.now();
  const dt = (now - lastTime) / 1000;  // seconds
  lastTime = now;
  
  update(dt);
  render();
});

function update(dt) {
  // Game logic
  player.x += player.vx * dt;
  player.y += player.vy * dt;
}

function render() {
  // PixiJS handles rendering automatically
}

// ─────────────────────────────────
// Control ticker
// ─────────────────────────────────
app.ticker.stop();   // pause
app.ticker.start();  // resume
app.ticker.maxFPS = 60;
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "PixiJS มีข้อดีอะไรเหนือ Phaser?",
              options: ["Physics ดีกว่า", "เร็วกว่าและ control สูงกว่า", "Tilemap support", "Sound system"],
              correctIndex: 1,
              explanation: "PixiJS เป็น renderer อย่างเดียว เร็วและยืดหยุ่นกว่า"
            },
            {
              question: "PIXI.Assets.loadBundle() ใช้ทำอะไร?",
              options: ["สร้าง sprite", "โหลดหลาย assets พร้อมกัน", "สร้าง animation", "จัดการ physics"],
              correctIndex: 1,
              explanation: "loadBundle โหลดหลาย assets ที่กำหนดไว้ใน bundle"
            },
            {
              question: "PIXI.Container ใช้ทำอะไร?",
              options: ["โหลด textures", "จัดกลุ่ม sprites เข้าด้วยกัน", "สร้าง filters", "จัดการ input"],
              correctIndex: 1,
              explanation: "Container ช่วยจัดกลุ่ม sprites และย้าย/หมุน/scale พร้อมกัน"
            },
            {
              question: "app.ticker ใช้ทำอะไร?",
              options: ["โหลด assets", "Game loop (เรียกทุก frame)", "สร้าง sprites", "จัดการ sound"],
              correctIndex: 1,
              explanation: "ticker เป็น game loop ที่เรียก callback ทุก frame"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["PIXI.Application", "Main game container"],
            ["PIXI.Assets.load()", "Load textures"],
            ["PIXI.Sprite", "Display image"],
            ["PIXI.Container", "Group sprites"],
            ["app.ticker", "Game loop"],
            ["app.stage", "Root container"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า PixiJS project ได้",
            "โหลด assets ด้วย PIXI.Assets ได้",
            "สร้างและจัดการ Sprites ได้",
            "ใช้ Container จัดกลุ่ม objects ได้",
            "พร้อมเรียน Rendering และ Filters!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: WebGL Rendering และ Filters! 🎨</strong>
        </TipBox>
      </Section>
    </div>
  );
}
