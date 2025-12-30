// Lesson content for module 1.1 (Programming Basics for Games)

export interface LessonContent {
  id: string;
  moduleId: string;
  title: string;
  titleTh: string;
  content: string; // Markdown content
  codeExamples: CodeExample[];
  challenge?: Challenge;
  videoUrl?: string;
  order: number;
  duration: number;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export const lessonContents: LessonContent[] = [
  {
    id: "lesson-1-1-1",
    moduleId: "module-1-1",
    title: "Variables & Data Types",
    titleTh: "ตัวแปรและชนิดข้อมูล",
    order: 1,
    duration: 20,
    content: `
# ตัวแปรและชนิดข้อมูลใน JavaScript

## 🎯 เป้าหมาย
เรียนรู้พื้นฐานการประกาศตัวแปรและชนิดข้อมูลสำคัญสำหรับการพัฒนาเกม

## 📝 การประกาศตัวแปร

ใน JavaScript สมัยใหม่ เราใช้ \`let\` และ \`const\`:

\`\`\`javascript
// ใช้ let สำหรับค่าที่เปลี่ยนแปลงได้
let playerScore = 0;
let playerName = "Hero";

// ใช้ const สำหรับค่าคงที่
const GRAVITY = 9.8;
const MAX_HEALTH = 100;
\`\`\`

## 🎮 ชนิดข้อมูลสำคัญในเกม

### Numbers (ตัวเลข)
\`\`\`javascript
let health = 100;      // จำนวนเต็ม
let speed = 5.5;       // ทศนิยม
let x = 0, y = 0;      // พิกัด
\`\`\`

### Strings (ข้อความ)
\`\`\`javascript
let characterName = "Knight";
let dialogText = \`\${characterName} says hello!\`;
\`\`\`

### Booleans (จริง/เท็จ)
\`\`\`javascript
let isAlive = true;
let isJumping = false;
let hasKey = false;
\`\`\`

### Arrays (อาร์เรย์)
\`\`\`javascript
let inventory = ["sword", "shield", "potion"];
let enemies = [];  // รายการศัตรู
\`\`\`

### Objects (ออบเจกต์)
\`\`\`javascript
let player = {
  name: "Hero",
  health: 100,
  x: 0,
  y: 0,
  speed: 5
};
\`\`\`

## 💡 ทิปส์

> 🔥 **Best Practice:** ใช้ \`const\` เป็นหลัก และใช้ \`let\` เฉพาะเมื่อจำเป็นต้องเปลี่ยนค่า

## ✅ สรุป
- ใช้ \`const\` สำหรับค่าคงที่
- ใช้ \`let\` สำหรับค่าที่เปลี่ยนแปลง
- รู้จัก Number, String, Boolean, Array, Object
    `,
    codeExamples: [
      {
        title: "Player Object",
        language: "javascript",
        code: `// สร้าง Player Object
const player = {
  name: "Hero",
  health: 100,
  maxHealth: 100,
  x: 100,
  y: 200,
  speed: 5,
  isAlive: true,
  inventory: []
};

// แสดงข้อมูล player
console.log("Player:", player.name);
console.log("Health:", player.health + "/" + player.maxHealth);
console.log("Position:", \`(\${player.x}, \${player.y})\`);`,
        description: "ตัวอย่างการสร้าง Player object สำหรับเกม",
      },
    ],
    challenge: {
      id: "challenge-1-1-1",
      title: "สร้าง Enemy Object",
      description: "สร้าง enemy object ที่มี properties: name, health, damage, x, y",
      starterCode: `// สร้าง enemy object ที่นี่
const enemy = {
  // เพิ่ม properties ให้ครบ
};

console.log(enemy);`,
      solution: `const enemy = {
  name: "Goblin",
  health: 50,
  damage: 10,
  x: 200,
  y: 150
};

console.log(enemy);`,
      hints: [
        "enemy ควรมี name เป็น string",
        "health และ damage เป็น number",
        "x และ y เป็นพิกัด",
      ],
      testCases: [
        {
          input: "enemy.name",
          expectedOutput: "string",
          description: "name ควรเป็น string",
        },
        {
          input: "enemy.health",
          expectedOutput: "number",
          description: "health ควรเป็น number",
        },
      ],
    },
  },
  {
    id: "lesson-1-1-2",
    moduleId: "module-1-1",
    title: "Functions & Game Logic",
    titleTh: "ฟังก์ชันและ Game Logic",
    order: 2,
    duration: 25,
    content: `
# ฟังก์ชันและ Game Logic

## 🎯 เป้าหมาย
เรียนรู้การสร้าง functions สำหรับ game logic ต่างๆ

## 📝 การสร้าง Function

### Function พื้นฐาน
\`\`\`javascript
function takeDamage(player, damage) {
  player.health -= damage;
  if (player.health <= 0) {
    player.isAlive = false;
    console.log("Game Over!");
  }
}
\`\`\`

### Arrow Function
\`\`\`javascript
const heal = (player, amount) => {
  player.health = Math.min(player.health + amount, player.maxHealth);
};
\`\`\`

## 🎮 Game Logic ที่พบบ่อย

### การเคลื่อนที่
\`\`\`javascript
function movePlayer(player, dx, dy) {
  player.x += dx * player.speed;
  player.y += dy * player.speed;
}
\`\`\`

### การโจมตี
\`\`\`javascript
function attack(attacker, defender) {
  const damage = attacker.damage - defender.defense;
  if (damage > 0) {
    defender.health -= damage;
  }
  return damage;
}
\`\`\`

### การตรวจสอบ Collision
\`\`\`javascript
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
\`\`\`

## 💡 Best Practices

1. **Single Responsibility:** แต่ละ function ทำแค่หน้าที่เดียว
2. **Pure Functions:** หลีกเลี่ยง side effects เมื่อเป็นไปได้
3. **Descriptive Names:** ตั้งชื่อที่อธิบายสิ่งที่ function ทำ
    `,
    codeExamples: [
      {
        title: "Combat System",
        language: "javascript",
        code: `// Combat System Functions
function attack(attacker, defender) {
  const damage = Math.max(0, attacker.damage - defender.defense);
  defender.health -= damage;
  console.log(\`\${attacker.name} dealt \${damage} damage to \${defender.name}!\`);
  
  if (defender.health <= 0) {
    defender.isAlive = false;
    console.log(\`\${defender.name} has been defeated!\`);
  }
  return damage;
}

// Test
const player = { name: "Hero", damage: 20, defense: 5, health: 100, isAlive: true };
const enemy = { name: "Goblin", damage: 10, defense: 2, health: 30, isAlive: true };

attack(player, enemy);
attack(enemy, player);`,
        description: "ระบบต่อสู้พื้นฐาน",
      },
    ],
  },
  {
    id: "lesson-1-1-3",
    moduleId: "module-1-1",
    title: "Game Loop",
    titleTh: "Game Loop พื้นฐาน",
    order: 3,
    duration: 30,
    content: `
# Game Loop พื้นฐาน

## 🎯 เป้าหมาย
เข้าใจหัวใจของเกมทุกเกม: **Game Loop**

## 📝 Game Loop คืออะไร?

Game Loop คือวงจรที่ทำงานซ้ำๆ ตลอดเวลาที่เกมทำงาน:

\`\`\`
┌─────────┐
│  Input  │ ← รับ input จากผู้เล่น
└────┬────┘
     ↓
┌────┴────┐
│ Update  │ ← อัพเดท game state
└────┬────┘
     ↓
┌────┴────┐
│ Render  │ ← แสดงผลออกหน้าจอ
└────┬────┘
     ↓
     └──→ กลับไปเริ่มใหม่
\`\`\`

## 🎮 requestAnimationFrame

\`\`\`javascript
let lastTime = 0;

function gameLoop(timestamp) {
  // คำนวณ delta time
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // 1. Handle Input
  handleInput();
  
  // 2. Update Game State
  update(deltaTime);
  
  // 3. Render
  render();
  
  // 4. Loop ต่อไป
  requestAnimationFrame(gameLoop);
}

// เริ่ม game loop
requestAnimationFrame(gameLoop);
\`\`\`

## 💡 Delta Time

Delta Time คือเวลาที่ผ่านไประหว่าง frame:

\`\`\`javascript
function update(deltaTime) {
  // ใช้ deltaTime ทำให้เคลื่อนที่สม่ำเสมอ
  player.x += player.speed * (deltaTime / 1000);
}
\`\`\`

> ⚠️ **สำคัญ:** ใช้ deltaTime เพื่อให้เกมทำงานเหมือนกันทุก devices!
    `,
    codeExamples: [
      {
        title: "Basic Game Loop",
        language: "javascript",
        code: `// Basic Game Loop Demo
let frameCount = 0;
let lastTime = 0;
let fps = 0;

function gameLoop(timestamp) {
  // Calculate FPS
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  fps = Math.round(1000 / deltaTime);
  
  // Update
  frameCount++;
  
  // Log every 60 frames
  if (frameCount % 60 === 0) {
    console.log(\`Frame: \${frameCount}, FPS: \${fps}\`);
  }
  
  // Stop after 180 frames (3 seconds at 60fps)
  if (frameCount < 180) {
    requestAnimationFrame(gameLoop);
  } else {
    console.log("Game Loop Demo Complete!");
  }
}

console.log("Starting Game Loop Demo...");
requestAnimationFrame(gameLoop);`,
        description: "ตัวอย่าง Game Loop พื้นฐาน",
      },
    ],
  },
];

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContents.find((l) => l.id === lessonId);
}

export function getLessonsByModule(moduleId: string): LessonContent[] {
  return lessonContents.filter((l) => l.moduleId === moduleId);
}
