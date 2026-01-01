"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">State Synchronization</h1>

      <Objectives
        items={[
          "เข้าใจการทำงานของ State Sync",
          "ใช้ Schema types ต่างๆ",
          "จัดการ Nested schemas",
          "เข้าใจ Delta patches",
        ]}
      />

      <Section title="State Sync คืออะไร?" icon="🔄">
        <p className="mb-4">
          Colyseus ใช้ระบบ <strong>Automatic State Synchronization</strong>:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🔄 Server state → Client state อัตโนมัติ</li>
          <li>📦 ส่งเฉพาะ changes (delta patches)</li>
          <li>⚡ Binary serialization (ประหยัด bandwidth)</li>
          <li>🎯 Selective sync ตาม @type decorator</li>
        </ul>

        <Diagram caption="State Synchronization Flow">
{`
 SERVER                              CLIENT
┌──────────────┐                  ┌──────────────┐
│ GameState    │                  │ GameState    │
│ ─────────────│   Automatic     │ ─────────────│
│ players: {...}│ ─────────────► │ players: {...}│
│ score: 100   │   Delta Patch   │ score: 100   │
│ status: play │                  │ status: play │
└──────────────┘                  └──────────────┘
       │                                 │
       │ Change: score = 150             │
       ▼                                 ▼
┌──────────────┐                  ┌──────────────┐
│ score: 150   │ ─── PATCH ────► │ score: 150   │
└──────────────┘  (only delta)   └──────────────┘
`}
        </Diagram>
      </Section>

      <Section title="Schema Types" icon="📝">
        <CodeBlock
          title="Primitive Types"
          language="typescript"
          code={`
import { Schema, type } from "@colyseus/schema";

class PlayerState extends Schema {
  // String
  @type("string") name: string = "";
  
  // Numbers
  @type("number") x: number = 0;      // float64
  @type("int8") health: number = 100;  // -128 to 127
  @type("uint8") level: number = 1;    // 0 to 255
  @type("int16") damage: number = 0;   // -32768 to 32767
  @type("uint16") gold: number = 0;    // 0 to 65535
  @type("int32") experience: number = 0;
  @type("uint32") score: number = 0;
  @type("float32") speed: number = 1.0;
  @type("float64") precise: number = 0.0;
  
  // Boolean
  @type("boolean") isAlive: boolean = true;
}
          `}
        />

        <Table
          headers={["Type", "Size", "Range"]}
          rows={[
            ["int8", "1 byte", "-128 to 127"],
            ["uint8", "1 byte", "0 to 255"],
            ["int16", "2 bytes", "-32,768 to 32,767"],
            ["uint16", "2 bytes", "0 to 65,535"],
            ["int32", "4 bytes", "±2 billion"],
            ["uint32", "4 bytes", "0 to 4 billion"],
            ["float32", "4 bytes", "~7 digits precision"],
            ["float64/number", "8 bytes", "~15 digits precision"],
          ]}
        />

        <TipBox type="tip">
          <strong>Bandwidth Optimization:</strong> ใช้ type ที่เล็กที่สุดที่เพียงพอ
          เช่น health 0-100 ใช้ uint8 แทน number
        </TipBox>
      </Section>

      <Section title="Collections" icon="📚">
        <CodeBlock
          title="MapSchema & ArraySchema"
          language="typescript"
          code={`
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

// ─────────────────────────────────
// Player Schema
// ─────────────────────────────────
class Player extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("number") x: number = 0;
  @type("number") y: number = 0;
}

// ─────────────────────────────────
// Item Schema
// ─────────────────────────────────
class Item extends Schema {
  @type("string") id: string;
  @type("string") type: string;
  @type("uint8") quantity: number = 1;
}

// ─────────────────────────────────
// Main Game State
// ─────────────────────────────────
class GameState extends Schema {
  // Map: key-value pairs (great for players by ID)
  @type({ map: Player }) 
  players = new MapSchema<Player>();
  
  // Array: ordered list
  @type([ Item ]) 
  items = new ArraySchema<Item>();
  
  // Nested schema
  @type(Player)
  currentTurn: Player;
}
          `}
        />

        <CodeBlock
          title="Working with Collections"
          language="typescript"
          code={`
// ─────────────────────────────────
// MapSchema Operations
// ─────────────────────────────────
// Add player
const player = new Player();
player.id = client.sessionId;
player.name = "Hero";
this.state.players.set(client.sessionId, player);

// Get player
const p = this.state.players.get(client.sessionId);

// Remove player
this.state.players.delete(client.sessionId);

// Iterate
this.state.players.forEach((player, key) => {
  console.log(key, player.name);
});

// Size
console.log("Players:", this.state.players.size);

// ─────────────────────────────────
// ArraySchema Operations
// ─────────────────────────────────
// Add item
const item = new Item();
item.id = "sword-1";
item.type = "weapon";
this.state.items.push(item);

// Remove item
const index = this.state.items.findIndex(i => i.id === "sword-1");
if (index !== -1) {
  this.state.items.splice(index, 1);
}

// Clear
this.state.items.clear();
          `}
        />
      </Section>

      <Section title="Nested Schemas" icon="🏗️">
        <CodeBlock
          title="Complex State Structure"
          language="typescript"
          code={`
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

// ─────────────────────────────────
// Stats (nested)
// ─────────────────────────────────
class Stats extends Schema {
  @type("uint16") hp: number = 100;
  @type("uint16") maxHp: number = 100;
  @type("uint16") mp: number = 50;
  @type("uint16") attack: number = 10;
  @type("uint16") defense: number = 5;
}

// ─────────────────────────────────
// Inventory Item
// ─────────────────────────────────
class InventoryItem extends Schema {
  @type("string") itemId: string;
  @type("uint8") quantity: number = 1;
  @type("uint8") slot: number = 0;
}

// ─────────────────────────────────
// Player with nested schemas
// ─────────────────────────────────
class Player extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  
  // Nested schema
  @type(Stats) stats = new Stats();
  
  // Array of nested schemas
  @type([ InventoryItem ]) inventory = new ArraySchema<InventoryItem>();
}

// ─────────────────────────────────
// Game State
// ─────────────────────────────────
class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") phase: string = "lobby";
  @type("uint16") round: number = 0;
}
          `}
        />

        <CodeBlock
          title="Modifying Nested State"
          language="typescript"
          code={`
// Get player
const player = this.state.players.get(sessionId);

// Modify nested stats (auto-synced!)
player.stats.hp -= 20;
player.stats.mp -= 10;

// Add inventory item
const newItem = new InventoryItem();
newItem.itemId = "potion-hp";
newItem.quantity = 3;
newItem.slot = 0;
player.inventory.push(newItem);

// Update existing item
const item = player.inventory.find(i => i.itemId === "potion-hp");
if (item) {
  item.quantity += 1;
}
          `}
        />
      </Section>

      <Section title="Client-Side Listeners" icon="👂">
        <CodeBlock
          title="Listening for State Changes"
          language="typescript"
          code={`
import { Client, Room } from "colyseus.js";

// Connect to room
const client = new Client("ws://localhost:2567");
const room = await client.joinOrCreate("game", { name: "Player1" });

// ─────────────────────────────────
// Listen for full state
// ─────────────────────────────────
room.onStateChange((state) => {
  console.log("Full state:", state);
});

// ─────────────────────────────────
// Listen for player additions
// ─────────────────────────────────
room.state.players.onAdd((player, sessionId) => {
  console.log("Player joined:", sessionId, player.name);
  
  // Listen for this player's changes
  player.onChange(() => {
    console.log("Player updated:", player.x, player.y);
  });
  
  // Listen for specific field
  player.listen("x", (newX, prevX) => {
    console.log(\`X changed: \${prevX} → \${newX}\`);
  });
});

// ─────────────────────────────────
// Listen for player removals
// ─────────────────────────────────
room.state.players.onRemove((player, sessionId) => {
  console.log("Player left:", sessionId);
});

// ─────────────────────────────────
// Listen for specific field changes
// ─────────────────────────────────
room.state.listen("phase", (newPhase, prevPhase) => {
  console.log(\`Game phase: \${prevPhase} → \${newPhase}\`);
});
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Delta patch คืออะไร?",
              options: ["ส่ง state ทั้งหมด", "ส่งเฉพาะ changes", "ลบ state", "สร้าง state ใหม่"],
              correctIndex: 1,
              explanation: "Delta patch ส่งเฉพาะส่วนที่เปลี่ยนแปลง ประหยัด bandwidth"
            },
            {
              question: "uint8 เก็บค่าได้ช่วงเท่าไหร่?",
              options: ["-128 ถึง 127", "0 ถึง 255", "-32768 ถึง 32767", "0 ถึง 65535"],
              correctIndex: 1,
              explanation: "uint8 = unsigned 8-bit = 0 to 255"
            },
            {
              question: "MapSchema เหมาะกับอะไร?",
              options: ["เก็บ ordered list", "เก็บ key-value pairs เช่น players by ID", "เก็บแผนที่เกม", "เก็บ single value"],
              correctIndex: 1,
              explanation: "MapSchema เหมาะสำหรับเก็บ collection ที่ access ด้วย key"
            },
            {
              question: "onAdd() ถูกเรียกเมื่อไหร่?",
              options: ["เมื่อ player disconnect", "เมื่อมี item ใหม่ถูกเพิ่มเข้า collection", "เมื่อ game start", "เมื่อ room ถูกสร้าง"],
              correctIndex: 1,
              explanation: "onAdd() ถูกเรียกทุกครั้งที่มี element ใหม่ใน MapSchema/ArraySchema"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Schema", "Class กำหนด synced state structure"],
            ["@type()", "Decorator บอก type และ enable sync"],
            ["MapSchema", "Key-value collection (players)"],
            ["ArraySchema", "Ordered list (items, bullets)"],
            ["Delta Patch", "ส่งเฉพาะ changes ประหยัด bandwidth"],
            ["onAdd/onRemove", "Client listeners for collection changes"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ Schema types ต่างๆ",
            "ใช้ MapSchema และ ArraySchema ได้",
            "สร้าง Nested schemas ได้",
            "ฟังการเปลี่ยนแปลง state บน client ได้",
            "พร้อมเรียน Client Integration!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Client Integration! 📱</strong>
        </TipBox>
      </Section>
    </div>
  );
}
