"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">จัดการ State แบบ P2P</h1>

      <Objectives
        items={[
          "จัดการ game state ในระบบ P2P",
          "จัดการ conflicts และ synchronization",
          "สร้าง host/guest architecture",
          "สร้าง P2P multiplayer game",
        ]}
      />

      <Section title="P2P State Challenges" icon="⚠️">
        <p className="mb-4">
          ใน P2P ไม่มี server เป็น authority จึงต้องจัดการเรื่อง:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🤔 ใครเป็น "ความจริง"?</li>
          <li>🔄 Sync state อย่างไร?</li>
          <li>💥 Conflict resolution</li>
          <li>⏰ Timing/Latency</li>
        </ul>

        <Diagram caption="P2P Authority Models">
{`
    Host Authority              Full P2P (Lockstep)
   (Recommended for games)        (Complex)
   
   ┌──────────┐               ┌──────────┐
   │   HOST   │               │  Peer A  │
   │ (Server) │               │          │
   └────┬─────┘               └────┬─────┘
        │                          │
   ┌────┴────┐                ┌────┴────┐
   │         │                │         │
┌──┴──┐   ┌──┴──┐          ┌──┴──┐   ┌──┴──┐
│Guest│   │Guest│          │Peer │   │Peer │
│  A  │   │  B  │          │  B  │   │  C  │
└─────┘   └─────┘          └─────┘   └─────┘

Host = source of truth      All peers agree on inputs
Guests sync from host       Before advancing game state
`}
        </Diagram>
      </Section>

      <Section title="Host/Guest Architecture" icon="👑">
        <CodeBlock
          title="P2P Game Manager"
          language="typescript"
          code={`
import Peer, { DataConnection } from "peerjs";

interface Player {
  id: string;
  x: number;
  y: number;
  score: number;
}

interface GameState {
  players: Map<string, Player>;
  items: { id: string; x: number; y: number; }[];
  gameTime: number;
}

class P2PGameManager {
  peer: Peer;
  connections: Map<string, DataConnection> = new Map();
  
  isHost: boolean = false;
  hostId: string = "";
  myId: string = "";
  
  state: GameState = {
    players: new Map(),
    items: [],
    gameTime: 0
  };
  
  constructor() {
    this.peer = new Peer();
    this.peer.on("open", (id) => {
      this.myId = id;
    });
    this.peer.on("connection", (conn) => this.handleConnection(conn));
  }
  
  // ─────────────────────────────────
  // Host: Create game room
  // ─────────────────────────────────
  hostGame() {
    this.isHost = true;
    this.hostId = this.myId;
    
    // Add self as player
    this.state.players.set(this.myId, {
      id: this.myId,
      x: 100, y: 100, score: 0
    });
    
    // Start game loop
    this.startGameLoop();
    
    return this.myId; // Share this ID with guests
  }
  
  // ─────────────────────────────────
  // Guest: Join game room
  // ─────────────────────────────────
  joinGame(hostId: string) {
    this.isHost = false;
    this.hostId = hostId;
    
    const conn = this.peer.connect(hostId, { reliable: true });
    this.handleConnection(conn);
  }
  
  handleConnection(conn: DataConnection) {
    conn.on("open", () => {
      this.connections.set(conn.peer, conn);
      
      if (this.isHost) {
        // Host: Add new player
        this.state.players.set(conn.peer, {
          id: conn.peer,
          x: 200, y: 200, score: 0
        });
        
        // Send full state to new player
        conn.send({
          type: "fullState",
          state: this.serializeState()
        });
      }
    });
    
    conn.on("data", (data: any) => {
      this.handleMessage(conn.peer, data);
    });
    
    conn.on("close", () => {
      this.connections.delete(conn.peer);
      if (this.isHost) {
        this.state.players.delete(conn.peer);
        this.broadcastState();
      }
    });
  }
  
  handleMessage(from: string, data: any) {
    switch (data.type) {
      case "fullState":
        // Guest receives full state
        this.deserializeState(data.state);
        break;
        
      case "stateUpdate":
        // Guest receives state updates
        this.applyStateUpdate(data.update);
        break;
        
      case "input":
        // Host receives guest input
        if (this.isHost) {
          this.handlePlayerInput(from, data.input);
        }
        break;
    }
  }
  
  // ─────────────────────────────────
  // Send input to host
  // ─────────────────────────────────
  sendInput(input: { dx?: number; dy?: number; action?: string }) {
    if (this.isHost) {
      // Host: apply directly
      this.handlePlayerInput(this.myId, input);
    } else {
      // Guest: send to host
      const hostConn = this.connections.get(this.hostId);
      hostConn?.send({ type: "input", input });
    }
  }
  
  // ─────────────────────────────────
  // Host: Process player input
  // ─────────────────────────────────
  handlePlayerInput(playerId: string, input: any) {
    const player = this.state.players.get(playerId);
    if (!player) return;
    
    if (input.dx) player.x += input.dx;
    if (input.dy) player.y += input.dy;
    
    // Broadcast updated state
    this.broadcastState();
  }
  
  // ─────────────────────────────────
  // Host: Game loop
  // ─────────────────────────────────
  startGameLoop() {
    setInterval(() => {
      this.state.gameTime += 1/60;
      
      // Update game logic
      this.updateGame();
      
      // Send state to all guests
      this.broadcastState();
    }, 1000/60);
  }
  
  updateGame() {
    // Game logic here
    // Check collisions, update items, etc.
  }
  
  broadcastState() {
    const update = this.serializeState();
    this.connections.forEach(conn => {
      conn.send({ type: "stateUpdate", update });
    });
  }
  
  serializeState() {
    return {
      players: Array.from(this.state.players.entries()),
      items: this.state.items,
      gameTime: this.state.gameTime
    };
  }
  
  deserializeState(data: any) {
    this.state.players = new Map(data.players);
    this.state.items = data.items;
    this.state.gameTime = data.gameTime;
  }
  
  applyStateUpdate(update: any) {
    this.deserializeState(update);
  }
}
          `}
        />
      </Section>

      <Section title="Input Prediction" icon="🎯">
        <CodeBlock
          title="Client-Side Prediction"
          language="typescript"
          code={`
class PredictiveP2PGame extends P2PGameManager {
  // Local predicted position
  predictedPosition = { x: 0, y: 0 };
  
  // Pending inputs waiting for host confirmation
  pendingInputs: { seq: number; input: any }[] = [];
  inputSeq = 0;
  
  sendInput(input: { dx?: number; dy?: number }) {
    // ─────────────────────────────────
    // 1. Apply input locally (prediction)
    // ─────────────────────────────────
    if (input.dx) this.predictedPosition.x += input.dx;
    if (input.dy) this.predictedPosition.y += input.dy;
    
    // ─────────────────────────────────
    // 2. Send to host with sequence number
    // ─────────────────────────────────
    this.inputSeq++;
    this.pendingInputs.push({ seq: this.inputSeq, input });
    
    if (this.isHost) {
      this.handlePlayerInput(this.myId, input);
    } else {
      const hostConn = this.connections.get(this.hostId);
      hostConn?.send({ 
        type: "input", 
        input,
        seq: this.inputSeq 
      });
    }
  }
  
  applyStateUpdate(update: any) {
    // ─────────────────────────────────
    // 3. Get authoritative position from host
    // ─────────────────────────────────
    const myPlayer = update.players.find(
      ([id]: [string, Player]) => id === this.myId
    );
    
    if (myPlayer) {
      const [, serverPos] = myPlayer;
      
      // ─────────────────────────────────
      // 4. Remove acknowledged inputs
      // ─────────────────────────────────
      const lastAck = update.lastAckedSeq?.[this.myId] || 0;
      this.pendingInputs = this.pendingInputs.filter(
        i => i.seq > lastAck
      );
      
      // ─────────────────────────────────
      // 5. Re-apply pending inputs
      // ─────────────────────────────────
      this.predictedPosition = { x: serverPos.x, y: serverPos.y };
      
      for (const pending of this.pendingInputs) {
        if (pending.input.dx) this.predictedPosition.x += pending.input.dx;
        if (pending.input.dy) this.predictedPosition.y += pending.input.dy;
      }
    }
    
    // Apply rest of state
    super.applyStateUpdate(update);
  }
  
  // Render uses predicted position for smooth movement
  render() {
    const myPlayer = this.state.players.get(this.myId);
    if (myPlayer) {
      // Use predicted position for rendering self
      drawPlayer(
        this.myId,
        this.predictedPosition.x,
        this.predictedPosition.y
      );
    }
    
    // Other players use server state
    this.state.players.forEach((player, id) => {
      if (id !== this.myId) {
        drawPlayer(id, player.x, player.y);
      }
    });
  }
}
          `}
        />

        <TipBox type="info">
          <strong>Client-Side Prediction:</strong> ทำให้ player รู้สึกว่าตอบสนองทันที
          โดยเคลื่อนที่ก่อนแล้วค่อยแก้ไขเมื่อ host ยืนยัน
        </TipBox>
      </Section>

      <Section title="Complete P2P Game" icon="🎮">
        <CodeBlock
          title="Simple P2P Movement Game"
          language="typescript"
          code={`
// HTML: 
// <canvas id="game" width="800" height="600"></canvas>
// <input id="hostId" placeholder="Host ID to join">
// <button id="hostBtn">Host Game</button>
// <button id="joinBtn">Join Game</button>

class SimpleP2PGame {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  game: P2PGameManager;
  keys: Set<string> = new Set();
  
  constructor() {
    this.canvas = document.getElementById("game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.game = new P2PGameManager();
    
    this.setupInput();
    this.setupUI();
    this.startRenderLoop();
  }
  
  setupUI() {
    document.getElementById("hostBtn")?.addEventListener("click", () => {
      const hostId = this.game.hostGame();
      alert("Share this ID: " + hostId);
    });
    
    document.getElementById("joinBtn")?.addEventListener("click", () => {
      const hostId = (document.getElementById("hostId") as HTMLInputElement).value;
      this.game.joinGame(hostId);
    });
  }
  
  setupInput() {
    document.addEventListener("keydown", (e) => this.keys.add(e.key));
    document.addEventListener("keyup", (e) => this.keys.delete(e.key));
    
    // Send input at 60fps
    setInterval(() => {
      const speed = 5;
      let dx = 0, dy = 0;
      
      if (this.keys.has("ArrowUp") || this.keys.has("w")) dy = -speed;
      if (this.keys.has("ArrowDown") || this.keys.has("s")) dy = speed;
      if (this.keys.has("ArrowLeft") || this.keys.has("a")) dx = -speed;
      if (this.keys.has("ArrowRight") || this.keys.has("d")) dx = speed;
      
      if (dx !== 0 || dy !== 0) {
        this.game.sendInput({ dx, dy });
      }
    }, 1000/60);
  }
  
  startRenderLoop() {
    const render = () => {
      this.ctx.fillStyle = "#1a1a2e";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw all players
      this.game.state.players.forEach((player, id) => {
        const isMe = id === this.game.myId;
        this.ctx.fillStyle = isMe ? "#4ade80" : "#60a5fa";
        this.ctx.fillRect(player.x - 20, player.y - 20, 40, 40);
        
        this.ctx.fillStyle = "white";
        this.ctx.font = "12px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          isMe ? "You" : id.slice(0, 6), 
          player.x, 
          player.y - 30
        );
      });
      
      // Status
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "left";
      this.ctx.fillText(
        \`Players: \${this.game.state.players.size} | \` +
        \`Host: \${this.game.isHost ? "Yes" : "No"}\`,
        10, 20
      );
      
      requestAnimationFrame(render);
    };
    render();
  }
}

new SimpleP2PGame();
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "ในระบบ Host/Guest ใครเป็น authority?",
              options: ["ทุก peer เท่ากัน", "Host เป็น source of truth", "Guest ตัดสินใจเอง", "ไม่มี authority"],
              correctIndex: 1,
              explanation: "Host ทำหน้าที่เป็น server ตัดสินใจและส่ง state ให้ guests"
            },
            {
              question: "Client-side prediction ทำไปเพื่ออะไร?",
              options: ["ลด bandwidth", "ทำให้รู้สึกตอบสนองทันที", "เพิ่ม security", "ลด CPU usage"],
              correctIndex: 1,
              explanation: "Prediction ทำให้ player เคลื่อนที่ทันทีโดยไม่ต้องรอ host"
            },
            {
              question: "Guests ส่งอะไรไปให้ Host?",
              options: ["Full game state", "Input commands เท่านั้น", "Video stream", "ไม่ส่งอะไรเลย"],
              correctIndex: 1,
              explanation: "Guests ส่ง input ให้ Host แล้ว Host จะประมวลผลและส่ง state กลับ"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Host/Guest Model", "Host เป็น authority, guests ส่ง input"],
            ["Full State Sync", "ส่ง state ทั้งหมดเมื่อเริ่ม"],
            ["Delta Updates", "ส่งเฉพาะ changes"],
            ["Client Prediction", "เคลื่อนที่ก่อน แก้ทีหลัง"],
            ["Input Buffering", "เก็บ inputs รอ confirmation"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ P2P state challenges",
            "สร้าง Host/Guest architecture ได้",
            "ส่ง input และ sync state ได้",
            "เข้าใจ client-side prediction",
            "สร้าง P2P multiplayer game ได้!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phase 3: Multiplayer Fundamentals!</strong>
          <br />
          พร้อมไป Phase 4: 3D Game Development!
        </TipBox>
      </Section>
    </div>
  );
}
