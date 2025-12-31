"use client";

import { CodeBlock, CodeChallenge, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_1_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน JavaScript สำหรับการพัฒนาเกม</h1>

      <Objectives
        items={[
          "การประกาศตัวแปรแบบ Modern JavaScript (let, const)",
          "ชนิดข้อมูลที่สำคัญสำหรับเกม",
          "การสร้าง Objects สำหรับ game entities",
          "Best practices ที่ใช้ในอุตสาหกรรมเกม",
        ]}
      />

      <Section title="ทำไม JavaScript ถึงเหมาะกับการพัฒนาเกม?" icon="📚">
        <p className="mb-4">
          JavaScript เป็นภาษาที่ทรงพลังสำหรับการพัฒนาเกมบนเว็บ:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🌐 ทำงานได้บน Browser ทุกตัวโดยไม่ต้องติดตั้งอะไร</li>
          <li>⚡ Performance สูงด้วย V8 Engine และ WebGL</li>
          <li>🎮 มี Game Engine มากมาย (Phaser, PixiJS, Three.js)</li>
          <li>👥 Community ใหญ่และมี resources มากมาย</li>
        </ul>
      </Section>

      <Section title="การประกาศตัวแปร" icon="📝">
        <h3 className="font-semibold text-lg mb-3">Modern JavaScript: let vs const</h3>
        
        <CodeBlock
          title="การใช้ let และ const"
          language="javascript"
          code={`
// 🔄 let - ใช้สำหรับค่าที่เปลี่ยนแปลงได้
let playerHealth = 100;
let playerX = 0;
let playerY = 0;
let score = 0;

// 🔒 const - ใช้สำหรับค่าคงที่ที่ไม่เปลี่ยน
const GRAVITY = 9.8;
const MAX_HEALTH = 100;
const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const TILE_SIZE = 32;
          `}
        />

        <TipBox type="tip">
          <strong>Pro Tip:</strong> ใช้ <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">const</code> เป็นค่าเริ่มต้น 
          และใช้ <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">let</code> เฉพาะเมื่อค่านั้นต้องเปลี่ยนแปลงจริงๆ
        </TipBox>

        <h3 className="font-semibold text-lg mt-6 mb-3">❌ หลีกเลี่ยง var</h3>
        
        <CodeBlock
          language="javascript"
          code={`
// ❌ ไม่แนะนำ - มี issues เรื่อง scope
var oldWay = "avoid this";

// ✅ ใช้ let หรือ const แทน
let modernWay = "use this instead";
          `}
        />
      </Section>

      <Section title="ชนิดข้อมูลที่สำคัญในเกม" icon="🎮">
        <h3 className="font-semibold text-lg mb-3">1. Numbers (ตัวเลข)</h3>
        <CodeBlock
          language="javascript"
          code={`
// พิกัดและตำแหน่ง
let x = 100;
let y = 200.5;

// สถิติ (Stats)
let health = 100;
let mana = 50;
let damage = 25;
let attackSpeed = 1.5;

// เวลาและ Delta Time
let deltaTime = 0.016; // ~60 FPS
let elapsedTime = 0;
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">2. Strings (ข้อความ)</h3>
        <CodeBlock
          language="javascript"
          code={`
// ข้อมูลตัวละคร
const playerName = "DragonSlayer99";
const characterClass = "Warrior";

// Template Literals - สำหรับ dynamic text
const damageText = \`\${playerName} dealt \${damage} damage!\`;
const healthBar = \`HP: \${health}/\${MAX_HEALTH}\`;
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">3. Booleans (จริง/เท็จ)</h3>
        <CodeBlock
          language="javascript"
          code={`
// สถานะตัวละคร
let isAlive = true;
let isJumping = false;
let isAttacking = false;
let canMove = true;

// Game States
let isPaused = false;
let isGameOver = false;
let hasWon = false;
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">4. Arrays (อาร์เรย์)</h3>
        <CodeBlock
          language="javascript"
          code={`
// Inventory System
let inventory = ["sword", "shield", "health_potion"];

// Enemy List
let enemies = [];
let bullets = [];
let particles = [];

// High Scores
let highScores = [10000, 8500, 7200, 5000, 3500];
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">5. Objects (ออบเจ็กต์) - สำคัญมาก!</h3>
        <CodeBlock
          title="Complete Player Object"
          language="javascript"
          code={`
const player = {
  name: "Hero",
  class: "Knight",
  level: 1,
  experience: 0,
  
  // Stats
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  damage: 15,
  defense: 10,
  
  // Position
  x: 100,
  y: 200,
  width: 32,
  height: 48,
  
  // Movement
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpForce: 12,
  
  // State
  isAlive: true,
  isJumping: false,
  direction: "right",
  
  // Inventory
  inventory: [],
  gold: 0
};

// เข้าถึง properties
console.log(player.name);        // "Hero"
console.log(player.health);      // 100
console.log(player.x, player.y); // 100, 200
          `}
          description="ตัวอย่าง Player object แบบสมบูรณ์ที่ใช้ในเกมจริง"
        />
      </Section>

      <Section title="🏆 ลองทำ Challenge!" icon="🧪">
        <CodeChallenge
          title="สร้าง Enemy Object"
          description="สร้าง object สำหรับ enemy ที่มี name, health, damage, x, y และ isAlive"
          starterCode={`
// สร้าง enemy object ที่มี:
// - name: "Goblin"
// - health: 50
// - damage: 10
// - x: 200
// - y: 100
// - isAlive: true

const enemy = {
  // เติมโค้ดของคุณที่นี่
};

console.log(enemy.name);   // ควรแสดง "Goblin"
console.log(enemy.health); // ควรแสดง 50
          `}
          solution={`
const enemy = {
  name: "Goblin",
  health: 50,
  damage: 10,
  x: 200,
  y: 100,
  isAlive: true
};

console.log(enemy.name);   // "Goblin"
console.log(enemy.health); // 50
          `}
          hints={[
            "Object ใช้ปีกกา { } ในการสร้าง",
            "แต่ละ property คั่นด้วย comma",
            "String ใช้ quotes ครอบ"
          ]}
        />
      </Section>

      <Section title="สร้าง Game Entity Pattern" icon="🏗️">
        <p className="mb-4">Pattern ที่ใช้ในเกมจริง - ใช้ Factory Function สร้าง entities:</p>
        
        <CodeBlock
          title="Enemy Factory Function"
          language="javascript"
          code={`
function createEnemy(type, x, y) {
  const enemyStats = {
    slime: { health: 20, damage: 5, speed: 2, xp: 10 },
    goblin: { health: 40, damage: 10, speed: 3, xp: 25 },
    orc: { health: 80, damage: 20, speed: 2.5, xp: 50 },
    dragon: { health: 500, damage: 50, speed: 4, xp: 500 }
  };

  const stats = enemyStats[type] || enemyStats.slime;

  return {
    type,
    ...stats,
    maxHealth: stats.health,
    x,
    y,
    width: 32,
    height: 32,
    isAlive: true,
    
    // Methods
    takeDamage(amount) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        this.isAlive = false;
      }
    },
    
    heal(amount) {
      this.health = Math.min(this.health + amount, this.maxHealth);
    }
  };
}

// สร้าง enemies
const slime = createEnemy("slime", 100, 200);
const boss = createEnemy("dragon", 500, 300);

// ใช้งาน
slime.takeDamage(15);
console.log(slime.health); // 5
          `}
        />
      </Section>

      <Section title="Best Practices" icon="✨">
        <h3 className="font-semibold text-lg mb-3">1. ใช้ UPPER_CASE สำหรับค่าคงที่</h3>
        <CodeBlock
          language="javascript"
          code={`
const MAX_ENEMIES = 50;
const PLAYER_SPEED = 5;
const GRAVITY = 0.5;
          `}
        />

        <h3 className="font-semibold text-lg mt-4 mb-3">2. ใช้ camelCase สำหรับตัวแปรทั่วไป</h3>
        <CodeBlock
          language="javascript"
          code={`
let playerHealth = 100;
let currentLevel = 1;
let isGameRunning = true;
          `}
        />

        <h3 className="font-semibold text-lg mt-4 mb-3">3. Group related data ใน Objects</h3>
        <CodeBlock
          language="javascript"
          code={`
// ✅ ดี - จัดกลุ่ม
const gameConfig = {
  screen: { width: 1280, height: 720 },
  physics: { gravity: 0.5, friction: 0.8 },
  player: { startX: 100, startY: 500 }
};

// ❌ ไม่ดี - กระจัดกระจาย
const screenWidth = 1280;
const screenHeight = 720;
const gravity = 0.5;
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "ควรใช้อะไรสำหรับค่าที่ไม่เปลี่ยนแปลง เช่น GRAVITY?",
              options: ["var", "let", "const", "function"],
              correctIndex: 2,
              explanation: "const ใช้สำหรับค่าคงที่ที่ไม่ต้องการเปลี่ยนแปลง"
            },
            {
              question: "ชนิดข้อมูลใดเหมาะสำหรับเก็บ isAlive?",
              options: ["Number", "String", "Boolean", "Array"],
              correctIndex: 2,
              explanation: "Boolean ใช้เก็บค่าจริง/เท็จ เหมาะสำหรับ state flags"
            },
            {
              question: "ควรใช้อะไรเก็บข้อมูล player (name, health, x, y)?",
              options: ["Array", "String", "Number", "Object"],
              correctIndex: 3,
              explanation: "Object เหมาะสำหรับเก็บข้อมูลที่เกี่ยวข้องกันไว้ด้วยกัน"
            },
            {
              question: "Naming convention สำหรับค่าคงที่คือ?",
              options: ["camelCase", "UPPER_CASE", "kebab-case", "PascalCase"],
              correctIndex: 1,
              explanation: "ค่าคงที่มักใช้ UPPER_CASE เพื่อให้เห็นชัดว่าเป็น constant"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "ใช้ทำอะไร", "ตัวอย่าง"]}
          rows={[
            ["const", "ค่าคงที่", "const GRAVITY = 9.8"],
            ["let", "ค่าที่เปลี่ยนได้", "let health = 100"],
            ["Numbers", "ตำแหน่ง, สถิติ", "x, y, health, damage"],
            ["Strings", "ชื่อ, ข้อความ", "playerName, dialogText"],
            ["Booleans", "สถานะ", "isAlive, isPaused"],
            ["Arrays", "รายการ", "inventory, enemies"],
            ["Objects", "Entities", "player, enemy, bullet"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจความแตกต่างระหว่าง let และ const",
            "รู้จักชนิดข้อมูลหลักทั้ง 5 แบบ",
            "สามารถสร้าง Object สำหรับ game entity ได้",
            "เข้าใจ naming conventions",
            "พร้อมเรียนบทต่อไป: Game Loop!"
          ]}
        />

        <TipBox type="success">
          <strong>พร้อมสำหรับบทต่อไป: Game Loop! 🎮</strong>
        </TipBox>
      </Section>
    </div>
  );
}

