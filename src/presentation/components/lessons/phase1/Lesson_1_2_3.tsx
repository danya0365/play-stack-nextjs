"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_1_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Story Branching: สร้างเรื่องราวหลายทาง</h1>

      <Objectives
        items={[
          "ออกแบบ Story Structure ด้วย nodes และ edges",
          "สร้างระบบ Dialogue ที่มี choices",
          "จัดการ consequences ของ choices",
          "สร้าง Text Adventure แบบสมบูรณ์",
        ]}
      />

      <Section title="Story Graph" icon="🎯">
        <p className="mb-4">
          เรื่องราวแบบ branching คือ <strong>กราฟ</strong> ที่เชื่อมโยง story nodes เข้าด้วยกัน:
        </p>
        
        <Diagram caption="Story Branching Example">
{`                    ┌─────────────┐
                    │    START    │
                    │ "คุณตื่นขึ้น" │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Go Left  │ │ Go Ahead │ │ Go Right │
       │  Forest  │ │  Castle  │ │   Cave   │
       └────┬─────┘ └────┬─────┘ └────┬─────┘
            ↓            ↓            ↓
       ┌────────────────────────────────────┐
       │       Multiple possible endings     │
       │    🏆 Victory   💀 Death   🎭 ???   │
       └────────────────────────────────────┘`}
        </Diagram>
      </Section>

      <Section title="Story Node Structure" icon="📝">
        <CodeBlock
          title="Story Data Structure"
          language="javascript"
          code={`
// Story node structure
const story = {
  start: {
    id: 'start',
    text: \`
      คุณตื่นขึ้นมาในป่าลึกลับ...
      คุณจำไม่ได้ว่าตัวเองมาอยู่ที่นี่ได้อย่างไร
      ต้นไม้ใหญ่โตล้อมรอบคุณ และมีทางเดิน 3 ทาง
    \`,
    choices: [
      { text: '🌲 เดินไปทางซ้าย (ป่าทึบ)', next: 'forest' },
      { text: '🏰 เดินตรงไป (เห็นปราสาทไกลๆ)', next: 'castle_path' },
      { text: '🕳️ เดินไปทางขวา (ถ้ำมืด)', next: 'cave' }
    ]
  },
  
  forest: {
    id: 'forest',
    text: \`
      คุณเดินเข้าไปในป่าทึบ...
      เสียงนกร้องรอบตัว แสงแดดส่องผ่านใบไม้
      
      ทันใดนั้น! คุณเห็นสไลม์สีเขียวขวางทาง!
    \`,
    choices: [
      { text: '⚔️ สู้กับสไลม์!', next: 'fight_slime' },
      { text: '🏃 หนี!', next: 'run_away' },
      { text: '🍖 โยนอาหารให้มัน', next: 'feed_slime', requires: 'food' }
    ]
  },
  
  fight_slime: {
    id: 'fight_slime',
    text: \`
      คุณดึงดาบออกมาต่อสู้!
      
      *ฟัน* *ฟัน* *ฟัน*
      
      สไลม์ถูกกำจัด! คุณได้รับ 10 EXP
      และพบกุญแจทองคำตกอยู่!
    \`,
    onEnter: (state) => {
      state.player.experience += 10;
      state.inventory.push('golden_key');
    },
    choices: [
      { text: '➡️ เดินต่อไป', next: 'forest_deep' }
    ]
  },
  
  feed_slime: {
    id: 'feed_slime',
    text: \`
      คุณโยนอาหารให้สไลม์...
      มันกินอย่างเอร็ดอร่อย แล้วหลีกทางให้คุณ!
      
      สไลม์ดูเหมือนจะชอบคุณ...
      มันติดตามคุณไป! 🐾
    \`,
    onEnter: (state) => {
      state.companions.push('friendly_slime');
      state.flags.friendlyWithMonsters = true;
    },
    choices: [
      { text: '➡️ เดินต่อไปพร้อมเพื่อนใหม่', next: 'forest_deep' }
    ]
  },
  
  // Ending nodes
  victory: {
    id: 'victory',
    text: \`
      🎉 CONGRATULATIONS! 🎉
      
      คุณกอบกู้อาณาจักรสำเร็จ!
      เจ้าหญิงได้รับการช่วยเหลือ
      และคุณได้รับการยกย่องเป็นวีรบุรุษ!
      
      === THE END ===
    \`,
    isEnding: true,
    endingType: 'victory'
  },
  
  death: {
    id: 'death',
    text: \`
      💀 GAME OVER 💀
      
      การผจญภัยของคุณจบลงที่นี่...
      
      === THE END ===
    \`,
    isEnding: true,
    endingType: 'death'
  }
};
          `}
        />
      </Section>

      <Section title="Dialogue System" icon="💬">
        <CodeBlock
          title="Dialogue Engine"
          language="javascript"
          code={`
async function showDialogue(nodeId) {
  const node = story[nodeId];
  
  if (!node) {
    console.log('Error: Node not found:', nodeId);
    return;
  }
  
  // Clear screen
  console.clear();
  
  // Display text with typewriter effect
  await typeWriter(node.text);
  
  // Execute onEnter callback if exists
  if (node.onEnter) {
    node.onEnter(gameState);
  }
  
  // Check if ending
  if (node.isEnding) {
    handleEnding(node.endingType);
    return;
  }
  
  // Filter available choices
  const availableChoices = node.choices.filter(choice => {
    // Check requirements
    if (choice.requires) {
      return hasItem(choice.requires);
    }
    if (choice.requiresFlag) {
      return gameState.flags[choice.requiresFlag];
    }
    return true;
  });
  
  // Display choices
  console.log('\\n' + '─'.repeat(40) + '\\n');
  
  availableChoices.forEach((choice, index) => {
    console.log(\`  \${index + 1}. \${choice.text}\`);
  });
  
  console.log('');
  
  // Get player choice
  const answer = await ask('เลือก: ');
  const choiceIndex = parseInt(answer) - 1;
  
  if (choiceIndex >= 0 && choiceIndex < availableChoices.length) {
    const selectedChoice = availableChoices[choiceIndex];
    
    // Execute choice callback if exists
    if (selectedChoice.onSelect) {
      selectedChoice.onSelect(gameState);
    }
    
    // Go to next node
    await showDialogue(selectedChoice.next);
  } else {
    console.log('กรุณาเลือกตัวเลือกที่ถูกต้อง');
    await showDialogue(nodeId); // Repeat current node
  }
}

// Typewriter effect
async function typeWriter(text, speed = 30) {
  const lines = text.trim().split('\\n');
  
  for (const line of lines) {
    for (const char of line) {
      process.stdout.write(char);
      await sleep(speed);
    }
    console.log('');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
          `}
        />
      </Section>

      <Section title="Conditional Choices" icon="🔀">
        <CodeBlock
          title="Advanced Choice System"
          language="javascript"
          code={`
const advancedNode = {
  id: 'throne_room',
  text: \`
    คุณยืนอยู่หน้าราชบัลลังก์...
    กษัตริย์มังกรนั่งอยู่ตรงหน้า
    
    "เจ้ามาทำไม มนุษย์?" มันถาม
  \`,
  choices: [
    {
      text: '⚔️ ต่อสู้ด้วยดาบ!',
      next: 'final_battle',
      condition: () => hasItem('legendary_sword')
    },
    {
      text: '✨ ใช้คาถาโบราณ',
      next: 'magic_battle',
      condition: () => gameState.player.stats.intelligence >= 20
    },
    {
      text: '🤝 เจรจาสันติ',
      next: 'negotiate',
      condition: () => gameState.flags.friendlyWithMonsters
    },
    {
      text: '🐾 ให้สไลม์เพื่อนช่วย!',
      next: 'slime_helps',
      condition: () => gameState.companions.includes('friendly_slime')
    },
    {
      text: '🏃 หนี!',
      next: 'escape_attempt'
      // Always available
    }
  ]
};

// Filter and display choices
function getAvailableChoices(node) {
  return node.choices.filter(choice => {
    if (choice.condition) {
      return choice.condition();
    }
    return true;
  });
}
          `}
        />

        <TipBox type="tip">
          <strong>Design Tip:</strong> ให้ choices ที่ไม่มีเงื่อนไขอย่างน้อย 1 ตัวเลือกเสมอ 
          เพื่อไม่ให้ผู้เล่นติดอยู่ในจุดใดจุดหนึ่ง
        </TipBox>
      </Section>

      <Section title="Consequences & Callbacks" icon="⚡">
        <CodeBlock
          title="Choice Consequences"
          language="javascript"
          code={`
const consequenceNode = {
  id: 'mysterious_fountain',
  text: 'คุณพบน้ำพุลึกลับ น้ำเป็นสีม่วงเรืองแสง...',
  choices: [
    {
      text: '💧 ดื่มน้ำจากน้ำพุ',
      next: 'drink_result',
      onSelect: (state) => {
        // Random effect!
        const effects = [
          () => {
            state.player.maxHealth += 20;
            state.player.health = state.player.maxHealth;
            state.lastEffectMessage = '✨ HP สูงสุดเพิ่มขึ้น!';
          },
          () => {
            state.player.stats.strength += 5;
            state.lastEffectMessage = '💪 Strength เพิ่มขึ้น!';
          },
          () => {
            state.player.health = Math.max(1, state.player.health - 50);
            state.lastEffectMessage = '☠️ น้ำมันเป็นพิษ! HP ลดลง!';
          },
          () => {
            state.inventory.push('magic_gem');
            state.lastEffectMessage = '💎 คุณได้รับ Magic Gem!';
          }
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
      }
    },
    {
      text: '🚶 เดินผ่านไป',
      next: 'forest_continue'
    },
    {
      text: '🧪 เก็บน้ำใส่ขวด',
      next: 'collect_water',
      condition: () => hasItem('empty_bottle'),
      onSelect: (state) => {
        removeItem('empty_bottle');
        addItem('mystery_potion');
      }
    }
  ]
};
          `}
        />
      </Section>

      <Section title="Complete Text Adventure" icon="🎮">
        <CodeBlock
          title="Putting It All Together"
          language="javascript"
          code={`
// Main game file
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise(r => rl.question(q, r));
}

// Game state
const gameState = {
  player: { health: 100, maxHealth: 100, stats: { strength: 10, intelligence: 8 } },
  inventory: [],
  companions: [],
  flags: {},
  currentNode: 'start'
};

// Story (as defined above)
const story = { /* ... all nodes ... */ };

// Main game loop
async function main() {
  console.log('=== THE MYSTERIOUS FOREST ===');
  console.log('A Text Adventure Game\\n');
  
  await showDialogue('start');
}

// Start game
main().catch(console.error);
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Story node ประกอบด้วยอะไรบ้าง?",
              options: ["แค่ text", "text และ choices", "แค่ choices", "text, choices และ callbacks"],
              correctIndex: 1,
              explanation: "Story node มี text แสดงเนื้อเรื่อง และ choices นำไป node ถัดไป"
            },
            {
              question: "onEnter callback ถูกเรียกเมื่อไหร่?",
              options: [
                "เมื่อเลือก choice",
                "เมื่อเข้าสู่ node นั้น",
                "เมื่อออกจาก node",
                "เมื่อเกมเริ่ม"
              ],
              correctIndex: 1,
              explanation: "onEnter ถูกเรียกทันทีที่เข้าสู่ node ก่อนแสดง text"
            },
            {
              question: "choice.requires ใช้ทำอะไร?",
              options: ["กำหนด node ถัดไป", "เงื่อนไขการแสดง choice", "กำหนด ending", "เพิ่ม effect"],
              correctIndex: 1,
              explanation: "requires กำหนดว่าต้องมีไอเทมนั้นจึงจะแสดง choice นี้"
            },
            {
              question: "node.isEnding = true หมายความว่าอะไร?",
              options: ["เกมหยุดชั่วคราว", "เป็น node สุดท้าย (จบเกม)", "ต้องเริ่มใหม่", "บันทึกเกม"],
              correctIndex: 1,
              explanation: "เมื่อ isEnding เป็น true จะหยุดการเล่าเรื่องและแสดงผล ending"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Story Node", "หน่วยเนื้อเรื่อง มี text และ choices"],
            ["Choices", "ตัวเลือกที่นำไปสู่ node ถัดไป"],
            ["Conditions", "เงื่อนไขในการแสดง choice"],
            ["Callbacks", "onEnter, onSelect สำหรับ side effects"],
            ["Endings", "nodes ที่ isEnding = true"],
          ]}
        />

        <ProgressCheck
          items={[
            "ออกแบบ Story Graph แบบกิ่งได้",
            "สร้าง Story Nodes ที่มี choices ได้",
            "ใช้ conditions แสดง/ซ่อน choices ได้",
            "ใช้ callbacks สร้าง side effects ได้",
            "พร้อมสำหรับ Phase 2: 2D Game Development!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phase 1 แล้ว!</strong>
          <br />
          พร้อมสำหรับ Phase 2: 2D Game Development ด้วย Canvas, Phaser, และ PixiJS!
        </TipBox>
      </Section>
    </div>
  );
}
