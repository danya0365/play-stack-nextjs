"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">ตั้งค่า Colyseus Server</h1>

      <Objectives
        items={[
          "ทำความเข้าใจสถาปัตยกรรม Multiplayer",
          "ติดตั้งและตั้งค่า Colyseus Server",
          "สร้าง Game Room แรก",
          "เข้าใจ State Management ใน Colyseus",
        ]}
      />

      <Section title="Colyseus คืออะไร?" icon="🔌">
        <p className="mb-4">
          <strong>Colyseus</strong> เป็น Multiplayer Game Framework สำหรับ Node.js:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🎮 ออกแบบมาสำหรับเกมโดยเฉพาะ</li>
          <li>⚡ Real-time state synchronization</li>
          <li>🏠 ระบบ Room-based matchmaking</li>
          <li>📱 รองรับ WebSocket และ HTTP</li>
          <li>🔄 Automatic state patching (delta updates)</li>
        </ul>

        <Diagram caption="Colyseus Architecture">
{`
┌─────────────────────────────────────────────────┐
│                  COLYSEUS SERVER                 │
│                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │  Room 1  │  │  Room 2  │  │  Room 3  │     │
│   │ (Game A) │  │ (Game B) │  │ (Game C) │     │
│   │          │  │          │  │          │     │
│   │ State    │  │ State    │  │ State    │     │
│   │ Players  │  │ Players  │  │ Players  │     │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│        │             │             │            │
└────────┼─────────────┼─────────────┼────────────┘
         │             │             │
    ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
    │ Client  │   │ Client  │   │ Client  │
    │ (P1,P2) │   │ (P3,P4) │   │ (P5,P6) │
    └─────────┘   └─────────┘   └─────────┘
`}
        </Diagram>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="สร้าง Colyseus Project"
          language="bash"
          code={`
# สร้าง project ใหม่
npm init colyseus-app my-game-server
cd my-game-server

# หรือติดตั้งเอง
npm install colyseus
npm install @colyseus/ws-transport
npm install express
          `}
        />

        <CodeBlock
          title="โครงสร้าง Project"
          language="text"
          code={`
my-game-server/
├── src/
│   ├── rooms/
│   │   └── MyRoom.ts    # Game room logic
│   └── index.ts         # Server entry point
├── package.json
└── tsconfig.json
          `}
        />
      </Section>

      <Section title="Server Setup" icon="🖥️">
        <CodeBlock
          title="src/index.ts - Main Server"
          language="typescript"
          code={`
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import { WebSocketTransport } from "@colyseus/ws-transport";

// Import rooms
import { GameRoom } from "./rooms/GameRoom";

const app = express();
const port = Number(process.env.PORT) || 2567;

// Create HTTP server
const server = createServer(app);

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server
  })
});

// Register room handlers
gameServer.define("game", GameRoom);
gameServer.define("lobby", LobbyRoom);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", rooms: gameServer.rooms.length });
});

// Start server
gameServer.listen(port);
console.log(\`🎮 Colyseus server running on ws://localhost:\${port}\`);
          `}
        />
      </Section>

      <Section title="Creating Your First Room" icon="🏠">
        <CodeBlock
          title="src/rooms/GameRoom.ts"
          language="typescript"
          code={`
import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

// ─────────────────────────────────
// State Classes (synced to clients)
// ─────────────────────────────────
class Player extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") score: number = 0;
  @type("boolean") isReady: boolean = false;
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") status: string = "waiting"; // waiting, playing, finished
  @type("number") countdown: number = 0;
}

// ─────────────────────────────────
// Room Class
// ─────────────────────────────────
export class GameRoom extends Room<GameState> {
  maxClients = 4;
  
  // Called when room is created
  onCreate(options: any) {
    console.log("GameRoom created!", options);
    
    // Initialize state
    this.setState(new GameState());
    
    // Register message handlers
    this.onMessage("move", (client, data) => {
      this.handleMove(client, data);
    });
    
    this.onMessage("ready", (client) => {
      this.handleReady(client);
    });
  }
  
  // Called when client joins
  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    
    // Create player
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name || "Player";
    player.x = Math.random() * 500;
    player.y = Math.random() * 500;
    
    // Add to state
    this.state.players.set(client.sessionId, player);
    
    // Broadcast join
    this.broadcast("playerJoined", { 
      id: client.sessionId, 
      name: player.name 
    });
  }
  
  // Called when client leaves
  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    
    // Remove from state
    this.state.players.delete(client.sessionId);
    
    // Broadcast leave
    this.broadcast("playerLeft", { id: client.sessionId });
  }
  
  // Handle move message
  handleMove(client: Client, data: { x: number, y: number }) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.x = data.x;
      player.y = data.y;
    }
  }
  
  // Handle ready message
  handleReady(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.isReady = true;
      this.checkAllReady();
    }
  }
  
  // Check if all players ready
  checkAllReady() {
    let allReady = true;
    this.state.players.forEach(player => {
      if (!player.isReady) allReady = false;
    });
    
    if (allReady && this.state.players.size >= 2) {
      this.startGame();
    }
  }
  
  // Start game
  startGame() {
    this.state.status = "playing";
    this.broadcast("gameStart");
  }
  
  // Called when room is disposed
  onDispose() {
    console.log("Room disposed!");
  }
}
          `}
        />
      </Section>

      <Section title="Schema Decorator Types" icon="📝">
        <Table
          headers={["Type", "Description", "Example"]}
          rows={[
            ["@type(\"string\")", "Text data", "player.name"],
            ["@type(\"number\")", "Integer/Float", "player.x, player.score"],
            ["@type(\"boolean\")", "True/False", "player.isReady"],
            ["@type({ map: T })", "Key-value collection", "players map"],
            ["@type([ T ])", "Array of items", "inventory items"],
            ["@type(CustomClass)", "Nested schema", "player.stats"],
          ]}
        />

        <TipBox type="tip">
          <strong>Schema = Synced State!</strong> 
          <br />
          ทุก property ที่มี @type decorator จะถูก sync ไปยัง clients อัตโนมัติ
        </TipBox>
      </Section>

      <Section title="Room Lifecycle" icon="🔄">
        <Diagram caption="Room Lifecycle Methods">
{`
  onCreate() ──► Room Created
       │
       ▼
  onJoin() ──► Client Joins
       │
       │ (Game Running)
       │
  onMessage() ──► Handle Messages
       │
       ▼
  onLeave() ──► Client Leaves
       │
       ▼
  onDispose() ──► Room Destroyed
`}
        </Diagram>

        <CodeBlock
          title="Room Options"
          language="typescript"
          code={`
export class GameRoom extends Room<GameState> {
  // Maximum clients allowed
  maxClients = 4;
  
  // Patch rate (state updates per second)
  patchRate = 20; // 20 updates/sec
  
  // Auto-dispose when empty
  autoDispose = true;
  
  onCreate(options: any) {
    // options from client.joinOrCreate()
    console.log("Room options:", options);
    
    // Set simulation interval (game loop)
    this.setSimulationInterval((deltaTime) => {
      this.update(deltaTime);
    }, 1000 / 60); // 60 FPS
  }
  
  update(deltaTime: number) {
    // Game logic here
    // Update positions, check collisions, etc.
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Colyseus Room คืออะไร?",
              options: ["ห้องแชท", "Game session ที่เก็บ state และ players", "Database", "HTML element"],
              correctIndex: 1,
              explanation: "Room เป็น container ที่เก็บ game state และจัดการ players"
            },
            {
              question: "@type decorator ใช้ทำอะไร?",
              options: ["ตรวจ TypeScript", "กำหนด property ที่จะ sync ไป clients", "สร้าง CSS", "Validate input"],
              correctIndex: 1,
              explanation: "@type บอก Colyseus ว่า property นี้ต้อง sync ไป clients"
            },
            {
              question: "onJoin() ถูกเรียกเมื่อไหร่?",
              options: ["Server start", "Client เข้าร่วม room", "Client ออกจาก room", "Room ถูกลบ"],
              correctIndex: 1,
              explanation: "onJoin() ถูกเรียกทุกครั้งที่มี client ใหม่เข้าร่วม room"
            },
            {
              question: "MapSchema ใช้ทำอะไร?",
              options: ["แสดงแผนที่", "เก็บ key-value collection ที่ sync ได้", "โหลด tilemap", "Navigation"],
              correctIndex: 1,
              explanation: "MapSchema เหมาะสำหรับเก็บ players โดยใช้ sessionId เป็น key"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Colyseus Server", "Multiplayer game server framework"],
            ["Room", "Game session ที่เก็บ state"],
            ["Schema", "Class ที่กำหนด synced state"],
            ["@type", "Decorator สำหรับ auto-sync"],
            ["onJoin/onLeave", "Player connection handlers"],
            ["onMessage", "รับ message จาก client"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Colyseus server ได้",
            "สร้าง Room class ได้",
            "ใช้ Schema กำหนด state ได้",
            "จัดการ player join/leave ได้",
            "พร้อมเรียน State Synchronization!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: State Synchronization! 🔄</strong>
        </TipBox>
      </Section>
    </div>
  );
}
