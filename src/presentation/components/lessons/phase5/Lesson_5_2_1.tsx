"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Server Architecture</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ Authoritative Server",
          "ออกแบบ Game Server Architecture",
          "จัดการ Game State บน Server",
          "Scaling และ Load Balancing",
        ]}
      />

      <Section title="Client-Server Models" icon="🏗️">
        <Diagram caption="Authority Models">
{`
Client-Authoritative (ไม่ปลอดภัย):
┌────────┐       ┌────────┐
│ Client │──────►│ Server │  Client ตัดสินใจ
│ (ยิง)  │       │ (dump) │  Server แค่ relay
└────────┘       └────────┘

Server-Authoritative (ปลอดภัย):
┌────────┐       ┌────────┐
│ Client │──────►│ Server │  Client ส่ง input
│ (input)│◄──────│ (logic)│  Server ตัดสินใจ
└────────┘       └────────┘
`}
        </Diagram>

        <Table
          headers={["Model", "Pros", "Cons"]}
          rows={[
            ["Client-Auth", "Responsive, simple", "Cheat ง่าย"],
            ["Server-Auth", "ป้องกัน cheat", "Latency, complex"],
          ]}
        />
      </Section>

      <Section title="Server Architecture" icon="🖥️">
        <CodeBlock
          title="Authoritative Game Server"
          language="typescript"
          code={`
import { Server, Room } from "colyseus";

class GameState {
  players: Map<string, Player> = new Map();
  bullets: Bullet[] = [];
  tick: number = 0;
}

class GameRoom extends Room<GameState> {
  private tickRate = 60;
  private tickInterval: NodeJS.Timer;
  
  onCreate() {
    this.setState(new GameState());
    
    // Fixed timestep game loop
    this.tickInterval = setInterval(() => {
      this.tick();
    }, 1000 / this.tickRate);
  }
  
  // ─────────────────────────────────
  // Process client inputs
  // ─────────────────────────────────
  onMessage(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    
    switch (message.type) {
      case "input":
        // Queue input for processing
        player.inputQueue.push({
          tick: message.tick,
          input: message.input
        });
        break;
    }
  }
  
  // ─────────────────────────────────
  // Server tick (authoritative)
  // ─────────────────────────────────
  private tick() {
    this.state.tick++;
    
    // Process all player inputs
    this.state.players.forEach(player => {
      this.processPlayerInputs(player);
    });
    
    // Update physics
    this.updatePhysics();
    
    // Check collisions
    this.checkCollisions();
    
    // Remove dead entities
    this.cleanup();
    
    // State is automatically synced to clients
  }
  
  private processPlayerInputs(player: Player) {
    while (player.inputQueue.length > 0) {
      const input = player.inputQueue.shift()!;
      
      // ─────────────────────────────────
      // Server validates and applies input
      // ─────────────────────────────────
      if (input.input.left) player.x -= player.speed;
      if (input.input.right) player.x += player.speed;
      if (input.input.up) player.y -= player.speed;
      if (input.input.down) player.y += player.speed;
      
      // Clamp to world bounds
      player.x = Math.max(0, Math.min(800, player.x));
      player.y = Math.max(0, Math.min(600, player.y));
      
      if (input.input.shoot) {
        this.tryShoot(player);
      }
      
      player.lastProcessedTick = input.tick;
    }
  }
  
  private tryShoot(player: Player) {
    // Server validates shoot
    if (Date.now() - player.lastShot < 100) return; // Rate limit
    
    player.lastShot = Date.now();
    this.state.bullets.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(player.angle) * 10,
      vy: Math.sin(player.angle) * 10,
      owner: player.id
    });
  }
}
          `}
        />
      </Section>

      <Section title="Scaling" icon="📈">
        <CodeBlock
          title="Load Balancing"
          language="text"
          code={`
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │   (Nginx/HAProxy)│
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
    │ Server 1│         │ Server 2│         │ Server 3│
    │ Rooms:  │         │ Rooms:  │         │ Rooms:  │
    │ 1-100   │         │ 101-200 │         │ 201-300 │
    └─────────┘         └─────────┘         └─────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────┴────────┐
                    │     Redis       │
                    │  (Shared State) │
                    └─────────────────┘
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Server-Authoritative หมายความว่าอย่างไร?",
              options: ["Client ตัดสินใจทุกอย่าง", "Server ตัดสินใจ game logic ทั้งหมด", "ไม่มี server", "ทุกคนเท่าเทียม"],
              correctIndex: 1,
              explanation: "Server-Auth หมายความว่า Server เป็นผู้ตัดสินใจสุดท้าย ป้องกัน cheat"
            },
            {
              question: "ทำไมต้องใช้ fixed timestep?",
              options: ["เร็วกว่า", "เพื่อให้ simulation ตรงกันทุก client", "ประหยัด bandwidth", "ง่ายกว่า"],
              correctIndex: 1,
              explanation: "Fixed timestep ทำให้ game logic ได้ผลเหมือนกันไม่ว่า frame rate จะเป็นเท่าไร"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "เข้าใจ Authoritative Server",
            "ออกแบบ game tick loop ได้",
            "Process input บน server ได้",
            "พร้อมเรียน Lag Compensation!"
          ]}
        />
      </Section>
    </div>
  );
}
