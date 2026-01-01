"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Client Integration</h1>

      <Objectives
        items={[
          "เชื่อมต่อ Client กับ Colyseus Server",
          "จัดการ Room events",
          "ส่งและรับ Messages",
          "สร้าง Multiplayer game loop",
        ]}
      />

      <Section title="Colyseus.js Client" icon="📱">
        <CodeBlock
          title="Installation"
          language="bash"
          code={`
# สำหรับ Web
npm install colyseus.js

# สำหรับ React/Next.js
npm install colyseus.js
          `}
        />

        <CodeBlock
          title="Basic Connection"
          language="typescript"
          code={`
import { Client, Room } from "colyseus.js";

// ─────────────────────────────────
// Create client
// ─────────────────────────────────
const client = new Client("ws://localhost:2567");

// ─────────────────────────────────
// Join or create room
// ─────────────────────────────────
async function connect() {
  try {
    // joinOrCreate: joins existing room or creates new one
    const room = await client.joinOrCreate("game", {
      name: "Player1",
      team: "blue"
    });
    
    console.log("Joined room:", room.id);
    console.log("Session ID:", room.sessionId);
    
    return room;
  } catch (error) {
    console.error("Connection error:", error);
  }
}
          `}
        />
      </Section>

      <Section title="Room Methods" icon="🏠">
        <Table
          headers={["Method", "Description"]}
          rows={[
            ["joinOrCreate(roomName, options)", "Join existing or create new room"],
            ["join(roomName, options)", "Join existing room only"],
            ["create(roomName, options)", "Create new room only"],
            ["joinById(roomId, options)", "Join specific room by ID"],
            ["reconnect(roomId, sessionId)", "Reconnect to room"],
          ]}
        />

        <CodeBlock
          title="Different Join Methods"
          language="typescript"
          code={`
// ─────────────────────────────────
// Join or Create (most common)
// ─────────────────────────────────
const room = await client.joinOrCreate("game", { name: "Hero" });

// ─────────────────────────────────
// Join existing only
// ─────────────────────────────────
try {
  const room = await client.join("game", { name: "Hero" });
} catch (e) {
  console.log("No room available");
}

// ─────────────────────────────────
// Create new only
// ─────────────────────────────────
const room = await client.create("game", { maxPlayers: 4 });

// ─────────────────────────────────
// Join by ID (from lobby/matchmaking)
// ─────────────────────────────────
const room = await client.joinById("abc123", { name: "Hero" });

// ─────────────────────────────────
// Get available rooms
// ─────────────────────────────────
const rooms = await client.getAvailableRooms("game");
rooms.forEach(room => {
  console.log(room.roomId, room.clients, room.maxClients);
});
          `}
        />
      </Section>

      <Section title="Room Events" icon="📡">
        <CodeBlock
          title="Handling Room Events"
          language="typescript"
          code={`
const room = await client.joinOrCreate("game", { name: "Hero" });

// ─────────────────────────────────
// State change (full state)
// ─────────────────────────────────
room.onStateChange((state) => {
  console.log("New state:", state);
});

// ─────────────────────────────────
// Receive messages from server
// ─────────────────────────────────
room.onMessage("gameStart", (data) => {
  console.log("Game started!", data);
  startGame();
});

room.onMessage("playerHit", ({ playerId, damage }) => {
  console.log(\`\${playerId} took \${damage} damage!\`);
  showDamageEffect(playerId, damage);
});

room.onMessage("gameOver", ({ winner }) => {
  console.log("Winner:", winner);
  showGameOver(winner);
});

// ─────────────────────────────────
// Room error
// ─────────────────────────────────
room.onError((code, message) => {
  console.error("Room error:", code, message);
});

// ─────────────────────────────────
// Room leave
// ─────────────────────────────────
room.onLeave((code) => {
  console.log("Left room, code:", code);
  // 1000 = normal disconnect
  // 4000+ = custom codes
});
          `}
        />

        <Diagram caption="Client-Server Communication">
{`
    CLIENT                              SERVER
┌──────────────┐                  ┌──────────────┐
│              │                  │              │
│  room.send() ├─── MESSAGE ────►│ onMessage()  │
│              │                  │              │
│ onMessage()  │◄── MESSAGE ─────┤ broadcast()  │
│              │                  │ send()       │
│              │                  │              │
│ onState      │◄── STATE ───────┤ this.state   │
│ Change()     │   PATCH          │              │
└──────────────┘                  └──────────────┘
`}
        </Diagram>
      </Section>

      <Section title="Sending Messages" icon="📤">
        <CodeBlock
          title="Client → Server Messages"
          language="typescript"
          code={`
// ─────────────────────────────────
// Send movement
// ─────────────────────────────────
function sendMovement(x: number, y: number) {
  room.send("move", { x, y });
}

// ─────────────────────────────────
// Send action
// ─────────────────────────────────
function attack(targetId: string) {
  room.send("attack", { targetId });
}

// ─────────────────────────────────
// Send chat
// ─────────────────────────────────
function sendChat(message: string) {
  room.send("chat", { message });
}

// ─────────────────────────────────
// Example: Game input handler
// ─────────────────────────────────
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      room.send("move", { direction: "up" });
      break;
    case "ArrowDown":
      room.send("move", { direction: "down" });
      break;
    case " ": // Space
      room.send("action", { type: "jump" });
      break;
  }
});

document.addEventListener("click", (e) => {
  room.send("click", { 
    x: e.clientX, 
    y: e.clientY 
  });
});
          `}
        />
      </Section>

      <Section title="Complete Example" icon="🎮">
        <CodeBlock
          title="Multiplayer Game Client"
          language="typescript"
          code={`
import { Client, Room } from "colyseus.js";

// ─────────────────────────────────
// Game State
// ─────────────────────────────────
let room: Room;
let players: Map<string, Player> = new Map();
let mySessionId: string;

// ─────────────────────────────────
// Player Class (client-side)
// ─────────────────────────────────
class Player {
  x: number = 0;
  y: number = 0;
  name: string = "";
  element: HTMLDivElement;
  
  constructor(id: string, name: string) {
    this.name = name;
    this.element = document.createElement("div");
    this.element.className = "player";
    this.element.textContent = name;
    document.getElementById("game")?.appendChild(this.element);
  }
  
  update(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
  }
  
  destroy() {
    this.element.remove();
  }
}

// ─────────────────────────────────
// Connect to Server
// ─────────────────────────────────
async function connect(playerName: string) {
  const client = new Client("ws://localhost:2567");
  
  try {
    room = await client.joinOrCreate("game", { name: playerName });
    mySessionId = room.sessionId;
    console.log("Connected! Session:", mySessionId);
    
    setupStateListeners();
    setupInputHandlers();
    
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

// ─────────────────────────────────
// Listen for State Changes
// ─────────────────────────────────
function setupStateListeners() {
  // Player joined
  room.state.players.onAdd((playerState, sessionId) => {
    console.log("Player joined:", sessionId);
    
    const player = new Player(sessionId, playerState.name);
    player.update(playerState.x, playerState.y);
    players.set(sessionId, player);
    
    // Listen for this player's movement
    playerState.onChange(() => {
      player.update(playerState.x, playerState.y);
    });
  });
  
  // Player left
  room.state.players.onRemove((playerState, sessionId) => {
    console.log("Player left:", sessionId);
    
    const player = players.get(sessionId);
    if (player) {
      player.destroy();
      players.delete(sessionId);
    }
  });
  
  // Game messages
  room.onMessage("chat", ({ from, message }) => {
    addChatMessage(from, message);
  });
}

// ─────────────────────────────────
// Input Handlers
// ─────────────────────────────────
function setupInputHandlers() {
  document.addEventListener("keydown", (e) => {
    const speed = 10;
    let dx = 0, dy = 0;
    
    switch (e.key) {
      case "ArrowUp": case "w": dy = -speed; break;
      case "ArrowDown": case "s": dy = speed; break;
      case "ArrowLeft": case "a": dx = -speed; break;
      case "ArrowRight": case "d": dx = speed; break;
    }
    
    if (dx !== 0 || dy !== 0) {
      room.send("move", { dx, dy });
    }
  });
}

// ─────────────────────────────────
// Disconnect
// ─────────────────────────────────
function disconnect() {
  if (room) {
    room.leave();
  }
}

// Start
connect("Player1");
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "joinOrCreate() ทำอะไร?",
              options: ["สร้าง room ใหม่เท่านั้น", "Join room หรือสร้างใหม่ถ้าไม่มี", "ลบ room", "Reconnect"],
              correctIndex: 1,
              explanation: "joinOrCreate จะ join room ที่มีอยู่ หรือสร้างใหม่ถ้าไม่มี"
            },
            {
              question: "room.send() ใช้ทำอะไร?",
              options: ["รับ state", "ส่ง message ไป server", "Disconnect", "เปลี่ยน room"],
              correctIndex: 1,
              explanation: "room.send(type, data) ส่ง message ไปยัง server"
            },
            {
              question: "onMessage() ใช้ทำอะไร?",
              options: ["ส่ง message", "รับ message จาก server", "รับ state change", "Connect"],
              correctIndex: 1,
              explanation: "room.onMessage(type, callback) ใช้รับ message จาก server"
            },
            {
              question: "room.sessionId คืออะไร?",
              options: ["Room ID", "Player's unique ID ใน room นี้", "Server ID", "Timestamp"],
              correctIndex: 1,
              explanation: "sessionId เป็น unique ID ของ client ใน room นี้"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Client", "Colyseus.js client instance"],
            ["joinOrCreate()", "Join or create room"],
            ["room.send()", "Send message to server"],
            ["room.onMessage()", "Receive server messages"],
            ["room.onStateChange()", "Listen to state updates"],
            ["room.sessionId", "Your unique player ID"],
          ]}
        />

        <ProgressCheck
          items={[
            "เชื่อมต่อ Client กับ Server ได้",
            "Join room ด้วยวิธีต่างๆ ได้",
            "ส่งและรับ messages ได้",
            "สร้าง game input handlers ได้",
            "พร้อมเรียน Matchmaking!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Matchmaking! 🎯</strong>
        </TipBox>
      </Section>
    </div>
  );
}
