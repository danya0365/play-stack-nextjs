"use client";

import { CodeBlock, CodeChallenge, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_1_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">State Management: หัวใจของเกมทุกเกม</h1>

      <Objectives
        items={[
          "เข้าใจแนวคิด Game State",
          "ออกแบบ State Structure ที่ดี",
          "จัดการ Player Data และ Inventory",
          "Save/Load ด้วย JSON และ File System",
        ]}
      />

      <Section title="Game State คืออะไร?" icon="🎯">
        <p className="mb-4">
          <strong>Game State</strong> คือข้อมูลทั้งหมดที่อธิบาย "สถานะ" ของเกมในขณะใดขณะหนึ่ง
        </p>
        
        <Diagram caption="Game State ประกอบด้วย">
{`┌─────────────────────────────────────────────┐
│                 GAME STATE                   │
├─────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐        │
│  │   Player    │    │    World    │        │
│  │  - health   │    │  - rooms    │        │
│  │  - position │    │  - npcs     │        │
│  │  - inventory│    │  - items    │        │
│  └─────────────┘    └─────────────┘        │
│                                             │
│  ┌─────────────┐    ┌─────────────┐        │
│  │    Flags    │    │   Progress  │        │
│  │  - quests   │    │  - level    │        │
│  │  - unlocks  │    │  - score    │        │
│  └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────┘`}
        </Diagram>
      </Section>

      <Section title="ออกแบบ Game State" icon="🏗️">
        <CodeBlock
          title="Complete Game State Structure"
          language="javascript"
          code={`
const gameState = {
  // ข้อมูลเกม
  version: '1.0.0',
  createdAt: Date.now(),
  playTime: 0,
  
  // ข้อมูลผู้เล่น
  player: {
    name: 'Hero',
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    level: 1,
    experience: 0,
    gold: 0,
    
    // Stats
    stats: {
      strength: 10,
      defense: 5,
      intelligence: 8,
      luck: 3
    },
    
    // Inventory
    inventory: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    }
  },
  
  // ตำแหน่งปัจจุบัน
  currentLocation: 'village',
  
  // Quest flags
  quests: {
    mainQuest: 0,           // 0-5 progress
    killedDragon: false,
    savedPrincess: false,
    foundTreasure: false
  },
  
  // World flags
  world: {
    doorUnlocked: {
      castle: false,
      dungeon: false,
      tower: false
    },
    npcsSpoken: [],
    itemsCollected: []
  }
};
          `}
        />

        <TipBox type="tip">
          <strong>Best Practice:</strong> จัดกลุ่มข้อมูลที่เกี่ยวข้องกันไว้ด้วยกัน 
          จะช่วยให้โค้ดอ่านง่ายและ debug ง่ายขึ้น
        </TipBox>
      </Section>

      <Section title="Inventory System" icon="🎒">
        <CodeBlock
          title="Inventory Management"
          language="javascript"
          code={`
// Item types
const itemTypes = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable',
  KEY_ITEM: 'key_item',
  MISC: 'misc'
};

// Item database
const items = {
  'iron_sword': {
    id: 'iron_sword',
    name: 'ดาบเหล็ก',
    type: itemTypes.WEAPON,
    damage: 10,
    price: 100,
    description: 'ดาบเหล็กธรรมดา แต่แข็งแกร่ง'
  },
  'health_potion': {
    id: 'health_potion',
    name: 'ยาฟื้นฟู',
    type: itemTypes.CONSUMABLE,
    heal: 50,
    price: 25,
    description: 'ฟื้นฟู HP 50 หน่วย'
  },
  'castle_key': {
    id: 'castle_key',
    name: 'กุญแจปราสาท',
    type: itemTypes.KEY_ITEM,
    price: 0,
    description: 'กุญแจเปิดประตูปราสาท'
  }
};

// Inventory functions
function addItem(itemId, quantity = 1) {
  const existing = gameState.player.inventory.find(i => i.id === itemId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    gameState.player.inventory.push({
      id: itemId,
      quantity: quantity
    });
  }
  
  const item = items[itemId];
  console.log(\`ได้รับ \${item.name} x\${quantity}\`);
}

function removeItem(itemId, quantity = 1) {
  const index = gameState.player.inventory.findIndex(i => i.id === itemId);
  
  if (index === -1) return false;
  
  const invItem = gameState.player.inventory[index];
  invItem.quantity -= quantity;
  
  if (invItem.quantity <= 0) {
    gameState.player.inventory.splice(index, 1);
  }
  
  return true;
}

function hasItem(itemId, quantity = 1) {
  const item = gameState.player.inventory.find(i => i.id === itemId);
  return item && item.quantity >= quantity;
}

function useItem(itemId) {
  if (!hasItem(itemId)) {
    console.log('ไม่มีไอเทมนี้!');
    return false;
  }
  
  const item = items[itemId];
  
  if (item.type !== itemTypes.CONSUMABLE) {
    console.log('ใช้ไอเทมนี้ไม่ได้!');
    return false;
  }
  
  // Use effect
  if (item.heal) {
    gameState.player.health = Math.min(
      gameState.player.health + item.heal,
      gameState.player.maxHealth
    );
    console.log(\`HP ฟื้นฟู +\${item.heal}!\`);
  }
  
  removeItem(itemId);
  return true;
}

function showInventory() {
  console.log('\\n╔════ กระเป๋า ════╗');
  
  if (gameState.player.inventory.length === 0) {
    console.log('║  (ว่างเปล่า)     ║');
  } else {
    gameState.player.inventory.forEach(invItem => {
      const item = items[invItem.id];
      console.log(\`║ \${item.name} x\${invItem.quantity}\`);
    });
  }
  
  console.log('╚═════════════════╝');
}
          `}
        />
      </Section>

      <Section title="Save/Load System" icon="💾">
        <CodeBlock
          title="Save & Load with JSON"
          language="javascript"
          code={`
const fs = require('fs');
const path = require('path');

const SAVE_DIR = './saves';
const SAVE_FILE = path.join(SAVE_DIR, 'save.json');

// Ensure save directory exists
if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR, { recursive: true });
}

function saveGame() {
  try {
    // Update timestamp
    gameState.lastSaved = Date.now();
    
    // Convert to JSON
    const saveData = JSON.stringify(gameState, null, 2);
    
    // Write to file
    fs.writeFileSync(SAVE_FILE, saveData);
    
    console.log('💾 บันทึกเกมสำเร็จ!');
    return true;
  } catch (error) {
    console.error('❌ บันทึกเกมล้มเหลว:', error.message);
    return false;
  }
}

function loadGame() {
  try {
    if (!fs.existsSync(SAVE_FILE)) {
      console.log('ไม่พบไฟล์ save');
      return false;
    }
    
    const saveData = fs.readFileSync(SAVE_FILE, 'utf8');
    const loadedState = JSON.parse(saveData);
    
    // Validate version
    if (loadedState.version !== gameState.version) {
      console.log('⚠️ Warning: Save version mismatch');
    }
    
    // Restore state
    Object.assign(gameState, loadedState);
    
    console.log('📂 โหลดเกมสำเร็จ!');
    console.log(\`ยินดีต้อนรับกลับ, \${gameState.player.name}!\`);
    return true;
  } catch (error) {
    console.error('❌ โหลดเกมล้มเหลว:', error.message);
    return false;
  }
}

function deleteSave() {
  try {
    if (fs.existsSync(SAVE_FILE)) {
      fs.unlinkSync(SAVE_FILE);
      console.log('🗑️ ลบ save สำเร็จ');
    }
  } catch (error) {
    console.error('ลบ save ล้มเหลว:', error.message);
  }
}
          `}
        />

        <TipBox type="warning">
          <strong>สำคัญ:</strong> ใช้ try-catch เสมอเมื่อทำงานกับ file system 
          เพราะอาจเกิด error ได้หลายกรณี
        </TipBox>
      </Section>

      <Section title="State Update Functions" icon="🔄">
        <CodeBlock
          title="State Helpers"
          language="javascript"
          code={`
// Player Stats
function healPlayer(amount) {
  const oldHealth = gameState.player.health;
  gameState.player.health = Math.min(
    gameState.player.health + amount,
    gameState.player.maxHealth
  );
  const healed = gameState.player.health - oldHealth;
  console.log(\`❤️ HP +\${healed}\`);
}

function damagePlayer(amount) {
  gameState.player.health = Math.max(0, gameState.player.health - amount);
  console.log(\`💔 HP -\${amount}\`);
  
  if (gameState.player.health === 0) {
    console.log('💀 You died!');
    return true; // Player died
  }
  return false;
}

function addExperience(amount) {
  gameState.player.experience += amount;
  console.log(\`✨ EXP +\${amount}\`);
  
  // Check level up
  const expNeeded = gameState.player.level * 100;
  if (gameState.player.experience >= expNeeded) {
    levelUp();
  }
}

function levelUp() {
  gameState.player.level++;
  gameState.player.experience = 0;
  
  // Stat increases
  gameState.player.maxHealth += 10;
  gameState.player.health = gameState.player.maxHealth;
  gameState.player.stats.strength += 2;
  gameState.player.stats.defense += 1;
  
  console.log('🎉 LEVEL UP!');
  console.log(\`Level \${gameState.player.level} reached!\`);
}

// Quest flags
function setQuestFlag(questName, value) {
  if (questName in gameState.quests) {
    gameState.quests[questName] = value;
  }
}

function checkQuestFlag(questName) {
  return gameState.quests[questName] || false;
}
          `}
        />
      </Section>

      <Section title="🏆 ลองทำ Challenge!" icon="🧪">
        <CodeChallenge
          title="สร้าง addItem function"
          description="เขียน function เพิ่มไอเทมลง inventory"
          starterCode={`
// inventory เป็น array ของ { id, quantity }
// ถ้ามีไอเทมอยู่แล้ว เพิ่ม quantity
// ถ้าไม่มี เพิ่มไอเทมใหม่

let inventory = [];

function addItem(itemId, quantity = 1) {
  // เติมโค้ดของคุณที่นี่
}

// ทดสอบ
addItem('sword', 1);
addItem('potion', 3);
addItem('potion', 2);
console.log(inventory);
// ควรได้:
// [{ id: 'sword', quantity: 1 }, { id: 'potion', quantity: 5 }]
          `}
          solution={`
let inventory = [];

function addItem(itemId, quantity = 1) {
  const existing = inventory.find(i => i.id === itemId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    inventory.push({ id: itemId, quantity });
  }
}

// ทดสอบ
addItem('sword', 1);
addItem('potion', 3);
addItem('potion', 2);
console.log(inventory);
// [{ id: 'sword', quantity: 1 }, { id: 'potion', quantity: 5 }]
          `}
          hints={[
            "ใช้ array.find() หาไอเทมที่มีอยู่แล้ว",
            "ถ้ามีอยู่แล้วเพิ่ม quantity ถ้าไม่มี push ใหม่",
            "อย่าลืมค่า default parameter quantity = 1"
          ]}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Game State คืออะไร?",
              options: ["โค้ดโปรแกรม", "ข้อมูลทั้งหมดของเกม ณ ขณะใดขณะหนึ่ง", "ไฟล์ save", "กราฟิกของเกม"],
              correctIndex: 1,
              explanation: "Game State เก็บข้อมูลทั้งหมดที่อธิบายสถานะของเกม"
            },
            {
              question: "JSON.stringify() ใช้ทำอะไร?",
              options: [
                "แปลง JSON เป็น object",
                "แปลง object เป็น JSON string",
                "อ่านไฟล์",
                "เขียนไฟล์"
              ],
              correctIndex: 1,
              explanation: "stringify แปลง JS object เป็น JSON string สำหรับบันทึกไฟล์"
            },
            {
              question: "ทำไมต้องใช้ try-catch กับ file operations?",
              options: ["เพิ่มความเร็ว", "จัดการ errors ที่อาจเกิดขึ้น", "ลด memory", "เพิ่ม security"],
              correctIndex: 1,
              explanation: "File operations อาจเกิด error ได้หลายกรณี (file ไม่มี, สิทธิ์ไม่พอ)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "ใช้ทำอะไร"]}
          rows={[
            ["Game State", "เก็บข้อมูลทั้งหมดของเกม"],
            ["Player Object", "ข้อมูลผู้เล่น, stats, inventory"],
            ["Flags", "สถานะ quest, unlocks, events"],
            ["Inventory System", "add/remove/use items"],
            ["Save/Load", "JSON + File System"],
          ]}
        />

        <ProgressCheck
          items={[
            "ออกแบบ Game State structure ได้",
            "สร้าง Inventory System ได้",
            "ใช้ JSON บันทึก/โหลดเกมได้",
            "เขียน state update functions ได้",
            "พร้อมเรียน Story Branching!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Story Branching - สร้างเรื่องราวหลายทาง! 📖</strong>
        </TipBox>
      </Section>
    </div>
  );
}
