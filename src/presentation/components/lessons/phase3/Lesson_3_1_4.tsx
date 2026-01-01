"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">ระบบ Matchmaking</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ Matchmaking concepts",
          "สร้าง Room filtering",
          "ใช้ Lobby room",
          "จัดการ room metadata",
        ]}
      />

      <Section title="Matchmaking คืออะไร?" icon="🎯">
        <p className="mb-4">
          <strong>Matchmaking</strong> คือกระบวนการจับคู่ผู้เล่นเข้าห้องเกมที่เหมาะสม:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🔍 หา room ที่มีที่ว่าง</li>
          <li>🎮 จับคู่ตามทักษะ (skill-based)</li>
          <li>🌍 จับคู่ตามภูมิภาค (region-based)</li>
          <li>👥 จับคู่ตามจำนวนผู้เล่น</li>
          <li>🎲 จับคู่ตาม game mode</li>
        </ul>

        <Diagram caption="Matchmaking Flow">
{`
   Player Request              Matchmaking              Result
  ┌───────────┐              ┌───────────┐           ┌───────────┐
  │ Join Game │   filter     │  Search   │  found   │  Join     │
  │ mode: pvp │───────────►  │  Rooms    │─────────►│  Room A   │
  │ region:us │              │           │          │           │
  └───────────┘              └───────────┘          └───────────┘
                                  │
                                  │ not found
                                  ▼
                             ┌───────────┐
                             │  Create   │
                             │  New Room │
                             └───────────┘
`}
        </Diagram>
      </Section>

      <Section title="Room Filtering" icon="🔍">
        <CodeBlock
          title="Server: Define Room with Metadata"
          language="typescript"
          code={`
import { Room, Client } from "colyseus";
import { Schema, type } from "@colyseus/schema";

class GameState extends Schema {
  @type("string") mode: string = "casual";
  @type("string") region: string = "asia";
  @type("uint8") playerCount: number = 0;
}

export class GameRoom extends Room<GameState> {
  maxClients = 4;
  
  onCreate(options: any) {
    this.setState(new GameState());
    this.state.mode = options.mode || "casual";
    this.state.region = options.region || "asia";
    
    // ─────────────────────────────────
    // Set room metadata for filtering
    // ─────────────────────────────────
    this.setMetadata({
      mode: this.state.mode,
      region: this.state.region,
      minLevel: options.minLevel || 1,
      maxLevel: options.maxLevel || 100
    });
  }
  
  onJoin(client: Client, options: any) {
    this.state.playerCount++;
    
    // Update metadata when players change
    this.setMetadata({
      ...this.metadata,
      playerCount: this.state.playerCount
    });
  }
  
  onLeave(client: Client) {
    this.state.playerCount--;
    this.setMetadata({
      ...this.metadata,
      playerCount: this.state.playerCount
    });
  }
}
          `}
        />

        <CodeBlock
          title="Client: Filter Rooms"
          language="typescript"
          code={`
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

// ─────────────────────────────────
// Get available rooms with filter
// ─────────────────────────────────
async function findRooms(mode: string, region: string) {
  const rooms = await client.getAvailableRooms("game");
  
  // Filter by criteria
  const filtered = rooms.filter(room => {
    const meta = room.metadata;
    return meta.mode === mode && 
           meta.region === region &&
           room.clients < room.maxClients;
  });
  
  return filtered;
}

// ─────────────────────────────────
// Smart join with fallback
// ─────────────────────────────────
async function smartJoin(playerOptions: {
  name: string;
  mode: string;
  region: string;
  level: number;
}) {
  const { name, mode, region, level } = playerOptions;
  
  // 1. Try region + mode match
  const rooms = await findRooms(mode, region);
  
  if (rooms.length > 0) {
    // Join room with fewest players (fastest to fill)
    const bestRoom = rooms.sort((a, b) => 
      (b.maxClients - b.clients) - (a.maxClients - a.clients)
    )[0];
    
    return await client.joinById(bestRoom.roomId, { name });
  }
  
  // 2. Fallback: create new room
  return await client.create("game", { 
    name, 
    mode, 
    region,
    minLevel: Math.max(1, level - 10),
    maxLevel: level + 10
  });
}
          `}
        />
      </Section>

      <Section title="Lobby Room Pattern" icon="🏠">
        <CodeBlock
          title="Lobby Room Implementation"
          language="typescript"
          code={`
import { Room, Client } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

// ─────────────────────────────────
// Available Room Info
// ─────────────────────────────────
class RoomInfo extends Schema {
  @type("string") roomId: string;
  @type("string") name: string;
  @type("string") mode: string;
  @type("uint8") players: number;
  @type("uint8") maxPlayers: number;
  @type("boolean") isPlaying: boolean;
}

class LobbyState extends Schema {
  @type([ RoomInfo ]) rooms = new ArraySchema<RoomInfo>();
}

// ─────────────────────────────────
// Lobby Room
// ─────────────────────────────────
export class LobbyRoom extends Room<LobbyState> {
  onCreate() {
    this.setState(new LobbyState());
    
    // Update room list periodically
    this.clock.setInterval(() => {
      this.updateRoomList();
    }, 2000);
    
    // Handle create room request
    this.onMessage("createRoom", async (client, options) => {
      const room = await this.presence.exists("game:" + options.roomName);
      if (!room) {
        client.send("roomCreated", { 
          success: true,
          roomName: options.roomName 
        });
      } else {
        client.send("roomCreated", { 
          success: false, 
          error: "Room exists" 
        });
      }
    });
  }
  
  async updateRoomList() {
    // Get all game rooms from matchmaker
    const rooms = await this.presence.hgetall("game:rooms");
    
    this.state.rooms.clear();
    
    for (const [roomId, data] of Object.entries(rooms)) {
      const info = new RoomInfo();
      const roomData = JSON.parse(data as string);
      info.roomId = roomId;
      info.name = roomData.name;
      info.mode = roomData.mode;
      info.players = roomData.players;
      info.maxPlayers = roomData.maxPlayers;
      info.isPlaying = roomData.isPlaying;
      this.state.rooms.push(info);
    }
  }
}
          `}
        />

        <CodeBlock
          title="Client: Lobby UI"
          language="typescript"
          code={`
const client = new Client("ws://localhost:2567");
let lobbyRoom: Room;

// ─────────────────────────────────
// Connect to Lobby
// ─────────────────────────────────
async function connectLobby() {
  lobbyRoom = await client.joinOrCreate("lobby");
  
  // Listen for room list updates
  lobbyRoom.state.rooms.onAdd((roomInfo, index) => {
    addRoomToUI(roomInfo);
    
    roomInfo.onChange(() => {
      updateRoomInUI(roomInfo);
    });
  });
  
  lobbyRoom.state.rooms.onRemove((roomInfo, index) => {
    removeRoomFromUI(roomInfo.roomId);
  });
}

// ─────────────────────────────────
// Join Game from Lobby
// ─────────────────────────────────
async function joinGameRoom(roomId: string) {
  // Leave lobby
  lobbyRoom.leave();
  
  // Join game room
  const gameRoom = await client.joinById(roomId, { 
    name: playerName 
  });
  
  return gameRoom;
}

// ─────────────────────────────────
// Create New Game Room
// ─────────────────────────────────
async function createGameRoom(options: { 
  name: string; 
  mode: string 
}) {
  lobbyRoom.leave();
  
  const gameRoom = await client.create("game", {
    roomName: options.name,
    mode: options.mode,
    creatorName: playerName
  });
  
  return gameRoom;
}
          `}
        />
      </Section>

      <Section title="Skill-Based Matchmaking" icon="🏆">
        <CodeBlock
          title="Rating-Based Room Matching"
          language="typescript"
          code={`
// Server: GameRoom
export class RankedGameRoom extends Room<GameState> {
  minRating: number;
  maxRating: number;
  
  onCreate(options: any) {
    this.setState(new GameState());
    
    this.minRating = options.rating - 200;
    this.maxRating = options.rating + 200;
    
    this.setMetadata({
      mode: "ranked",
      minRating: this.minRating,
      maxRating: this.maxRating
    });
  }
  
  // Custom filter function
  static onFilter(options: any, roomInfo: any): boolean {
    const meta = roomInfo.metadata;
    const playerRating = options.rating;
    
    // Check if player rating is within room's range
    return playerRating >= meta.minRating && 
           playerRating <= meta.maxRating;
  }
  
  onJoin(client: Client, options: any) {
    // Validate player rating
    if (options.rating < this.minRating || 
        options.rating > this.maxRating) {
      throw new Error("Rating mismatch");
    }
    
    // Add player...
  }
}

// Server: Register with filter
gameServer.define("ranked", RankedGameRoom, {
  // Use filterBy for efficient matchmaking
  filterBy: ["mode", "minRating", "maxRating"]
});
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "setMetadata() ใช้ทำอะไร?",
              options: ["เปลี่ยน room state", "กำหนดข้อมูลสำหรับ filtering", "ส่ง message", "เปลี่ยน maxClients"],
              correctIndex: 1,
              explanation: "setMetadata กำหนดข้อมูลที่ clients ใช้ filter rooms"
            },
            {
              question: "getAvailableRooms() return อะไร?",
              options: ["Players ทั้งหมด", "รายการ rooms ที่ยังเข้าได้", "Room state", "Server info"],
              correctIndex: 1,
              explanation: "getAvailableRooms ให้ list ของ rooms พร้อม metadata"
            },
            {
              question: "Lobby room pattern ใช้ทำอะไร?",
              options: ["เล่นเกม", "แสดง UI", "รวม players ก่อนจับคู่เข้า game room", "เก็บ score"],
              correctIndex: 2,
              explanation: "Lobby room ใช้รวบรวม players และแสดง available rooms"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Matchmaking", "กระบวนการจับคู่ players เข้า rooms"],
            ["setMetadata()", "กำหนด room info สำหรับ filtering"],
            ["getAvailableRooms()", "ดึงรายการ rooms ที่สามารถ join ได้"],
            ["Lobby Room", "Room สำหรับรอ และเลือก game room"],
            ["filterBy", "Efficient matchmaking option"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ Matchmaking concepts",
            "ใช้ Room metadata ได้",
            "Filter rooms บน client ได้",
            "สร้าง Lobby room pattern ได้",
            "พร้อมเรียน P2P with PeerJS!"
          ]}
        />

        <TipBox type="success">
          <strong>Module ต่อไป: P2P with PeerJS! 🔗</strong>
        </TipBox>
      </Section>
    </div>
  );
}
