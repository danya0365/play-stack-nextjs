"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_1_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Console Interaction: สร้างเกมบน Terminal</h1>

      <Objectives
        items={[
          "เข้าใจวิธีรับ input จากผู้ใช้ใน Node.js",
          "สร้างเมนูและ navigation แบบ text-based",
          "จัดการ async/await กับ readline",
          "สร้าง game loop สำหรับ console games",
        ]}
      />

      <Section title="ทำไมต้องเรียน Console Games?" icon="🎯">
        <p className="mb-4">
          Console games เป็นจุดเริ่มต้นที่ดีเพราะ:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🧠 โฟกัสที่ <strong>game logic</strong> ล้วนๆ ไม่ต้องยุ่งกับ graphics</li>
          <li>📝 เข้าใจ input/output และ state management</li>
          <li>🎮 เกมแนว RPG, Adventure, Puzzle เริ่มต้นจากที่นี่</li>
          <li>⚡ ทดสอบ ideas ได้เร็ว</li>
        </ul>
      </Section>

      <Section title="ตั้งค่า readline" icon="🔧">
        <p className="mb-4">Node.js มี module readline ในตัวสำหรับรับ input:</p>
        
        <CodeBlock
          title="Basic readline Setup"
          language="javascript"
          code={`
const readline = require('readline');

// สร้าง interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ถามคำถาม
rl.question('What is your name? ', (answer) => {
  console.log(\`Hello, \${answer}!\`);
  rl.close(); // ปิด interface
});
          `}
        />

        <TipBox type="tip">
          <strong>Pro Tip:</strong> อย่าลืม <code>rl.close()</code> เมื่อใช้งานเสร็จ 
          ไม่งั้นโปรแกรมจะไม่ปิด!
        </TipBox>
      </Section>

      <Section title="Promisify สำหรับ async/await" icon="⚡">
        <p className="mb-4">แปลง callback เป็น Promise เพื่อใช้ async/await:</p>

        <CodeBlock
          title="Promisified readline"
          language="javascript"
          code={`
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// ใช้งานกับ async/await
async function main() {
  const name = await ask('Enter your name: ');
  const age = await ask('Enter your age: ');
  
  console.log(\`Hello \${name}, you are \${age} years old!\`);
  
  rl.close();
}

main();
          `}
        />
      </Section>

      <Section title="สร้างเมนูเกม" icon="📋">
        <CodeBlock
          title="Game Menu System"
          language="javascript"
          code={`
async function showMenu() {
  console.clear(); // ล้างหน้าจอ
  console.log('╔════════════════════════════╗');
  console.log('║     🎮 TEXT ADVENTURE      ║');
  console.log('╠════════════════════════════╣');
  console.log('║  1. เริ่มเกมใหม่            ║');
  console.log('║  2. โหลดเกม               ║');
  console.log('║  3. ตัวเลือก               ║');
  console.log('║  4. ออกจากเกม             ║');
  console.log('╚════════════════════════════╝');
  
  const choice = await ask('เลือก (1-4): ');
  
  switch (choice) {
    case '1':
      await startNewGame();
      break;
    case '2':
      await loadGame();
      break;
    case '3':
      await showOptions();
      break;
    case '4':
      console.log('ขอบคุณที่เล่น! 👋');
      rl.close();
      process.exit(0);
    default:
      console.log('กรุณาเลือก 1-4');
      await showMenu();
  }
}
          `}
        />
      </Section>

      <Section title="Game Loop สำหรับ Console" icon="🔄">
        <CodeBlock
          title="Console Game Loop"
          language="javascript"
          code={`
let isRunning = true;

async function gameLoop() {
  while (isRunning) {
    // 1. แสดงสถานะปัจจุบัน
    displayGameState();
    
    // 2. รับ input
    const command = await ask('> ');
    
    // 3. ประมวลผล command
    await processCommand(command);
    
    // 4. เช็คว่าเกมจบหรือยัง
    if (checkWinCondition()) {
      console.log('🎉 ยินดีด้วย! คุณชนะแล้ว!');
      isRunning = false;
    }
    
    if (checkLoseCondition()) {
      console.log('💀 Game Over!');
      isRunning = false;
    }
  }
  
  rl.close();
}

function processCommand(cmd) {
  const parts = cmd.toLowerCase().split(' ');
  const action = parts[0];
  const target = parts.slice(1).join(' ');
  
  switch (action) {
    case 'go':
    case 'move':
      movePlayer(target);
      break;
    case 'look':
      lookAround();
      break;
    case 'take':
    case 'get':
      pickupItem(target);
      break;
    case 'use':
      useItem(target);
      break;
    case 'inventory':
    case 'inv':
    case 'i':
      showInventory();
      break;
    case 'help':
    case 'h':
      showHelp();
      break;
    case 'quit':
    case 'exit':
      isRunning = false;
      break;
    default:
      console.log('ไม่เข้าใจคำสั่ง พิมพ์ "help" เพื่อดูคำสั่งทั้งหมด');
  }
}
          `}
        />
      </Section>

      <Section title="จัดรูปแบบ Output ให้สวย" icon="🎨">
        <CodeBlock
          title="Formatting Utilities"
          language="javascript"
          code={`
// สี (ANSI Escape Codes)
const colors = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m',
  white: '\\x1b[37m'
};

// Helper functions
function colorize(text, color) {
  return colors[color] + text + colors.reset;
}

function success(text) {
  console.log(colorize('✓ ' + text, 'green'));
}

function error(text) {
  console.log(colorize('✗ ' + text, 'red'));
}

function warning(text) {
  console.log(colorize('⚠ ' + text, 'yellow'));
}

function info(text) {
  console.log(colorize('ℹ ' + text, 'cyan'));
}

// Health Bar
function displayHealthBar(current, max, width = 20) {
  const filled = Math.round((current / max) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const color = current > max * 0.5 ? 'green' : current > max * 0.25 ? 'yellow' : 'red';
  console.log(\`HP: [\${colorize(bar, color)}] \${current}/\${max}\`);
}

// Usage
displayHealthBar(75, 100); // HP: [███████████████░░░░░] 75/100
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Module ใดใช้รับ input ใน Node.js?",
              options: ["fs", "path", "readline", "http"],
              correctIndex: 2,
              explanation: "readline เป็น built-in module สำหรับรับ input จากผู้ใช้"
            },
            {
              question: "ทำไมต้องเรียก rl.close()?",
              options: [
                "เพื่อล้างหน้าจอ",
                "เพื่อปิดโปรแกรมให้สมบูรณ์",
                "เพื่อบันทึกข้อมูล",
                "เพื่อรีเซ็ต input"
              ],
              correctIndex: 1,
              explanation: "ถ้าไม่เรียก rl.close() โปรแกรมจะไม่สิ้นสุดการทำงาน"
            },
            {
              question: "Promisify ใช้ทำอะไร?",
              options: ["เพิ่มความเร็ว", "แปลง callback เป็น Promise", "ลด memory", "เพิ่ม security"],
              correctIndex: 1,
              explanation: "การแปลง callback เป็น Promise ทำให้ใช้ async/await ได้"
            },
            {
              question: "ANSI Escape Codes ใช้ทำอะไร?",
              options: ["เข้ารหัสข้อมูล", "ใส่สีให้ text ใน terminal", "บีบอัดข้อมูล", "สร้างไฟล์"],
              correctIndex: 1,
              explanation: "ANSI Codes ใช้ใส่สีและ style ให้กับ text ใน terminal"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["readline", "Module สำหรับรับ input ใน Node.js"],
            ["rl.question()", "ถามคำถามและรับคำตอบ"],
            ["Promisify", "แปลง callback เป็น Promise"],
            ["clearScreen", "console.clear() ล้างหน้าจอ"],
            ["ANSI Colors", "ใส่สีให้ text ใน terminal"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ readline รับ input ได้",
            "แปลง callback เป็น Promise ได้",
            "สร้างเมนูเกมแบบ text-based ได้",
            "ใช้ ANSI Colors ตกแต่ง output ได้",
            "พร้อมเรียน State Management!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: State Management สำหรับเกม! 📊</strong>
        </TipBox>
      </Section>
    </div>
  );
}
