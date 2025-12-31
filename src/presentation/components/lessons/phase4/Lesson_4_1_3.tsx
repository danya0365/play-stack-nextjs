"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Networking และ Multiplayer</h1>

      <Objectives
        items={[
          "พื้นฐาน Game Networking",
          "WebSocket สำหรับ Real-time",
          "Client-Server Architecture",
          "Lag Compensation Techniques",
        ]}
      />

      <Section title="Multiplayer Architectures" icon="🌐">
        <Diagram caption="Network Architectures">
{`
Peer-to-Peer                    Client-Server
┌──────┐    ┌──────┐           ┌──────────┐
│  P1  │◄───│  P2  │           │  SERVER  │
└──────┘    └──┬───┘           └────┬─────┘
     ▲         │                    │
     │    ┌────▼───┐         ┌──────┴──────┐
     └────│  P3   │         │             │
          └───────┘     ┌───▼───┐    ┌────▼───┐
                        │  C1   │    │   C2   │
                        └───────┘    └────────┘

P2P: Each client talks to all          
Server: All clients talk to server
`}
        </Diagram>

        <Table
          headers={["Architecture", "Pros", "Cons"]}
          rows={[
            ["Peer-to-Peer", "No server cost", "Hard to sync, cheating"],
            ["Client-Server", "Authoritative, anti-cheat", "Server cost, latency"],
            ["Relay Server", "P2P + NAT traversal", "More latency"],
          ]}
        />
      </Section>

      <Section title="WebSocket Basics" icon="🔌">
        <CodeBlock
          title="WebSocket Client"
          language="javascript"
          code={`
// ─────────────────────────────────
// Basic Connection
// ─────────────────────────────────
class GameClient {
  constructor(serverUrl) {
    this.ws = new WebSocket(serverUrl);
    this.playerId = null;
    this.players = new Map();
    this.eventHandlers = new Map();
    
    this.ws.onopen = () => {
      console.log('Connected to server!');
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
    
    this.ws.onclose = () => {
      console.log('Disconnected from server');
      // Reconnection logic
      setTimeout(() => this.reconnect(), 3000);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  send(type, data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }
  
  on(type, handler) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type).push(handler);
  }
  
  handleMessage(message) {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(h => h(message.data));
    }
  }
}

// Usage
const client = new GameClient('ws://localhost:3001');

client.on('welcome', (data) => {
  client.playerId = data.playerId;
  console.log('My ID:', data.playerId);
});

client.on('player_joined', (data) => {
  console.log('Player joined:', data.playerId);
  client.players.set(data.playerId, { x: data.x, y: data.y });
});

client.on('player_moved', (data) => {
  const player = client.players.get(data.playerId);
  if (player) {
    player.x = data.x;
    player.y = data.y;
  }
});

// Send movement
function sendMovement(x, y) {
  client.send('move', { x, y });
}
          `}
        />
      </Section>

      <Section title="Server (Node.js)" icon="🖥️">
        <CodeBlock
          title="WebSocket Server"
          language="javascript"
          code={`
// npm install ws
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

const players = new Map();
let nextPlayerId = 1;

wss.on('connection', (ws) => {
  // Assign player ID
  const playerId = nextPlayerId++;
  const player = {
    id: playerId,
    x: Math.random() * 500,
    y: Math.random() * 500,
    ws: ws
  };
  players.set(playerId, player);
  
  // Send welcome message
  send(ws, 'welcome', { playerId });
  
  // Notify others
  broadcast('player_joined', {
    playerId,
    x: player.x,
    y: player.y
  }, ws);
  
  // Send existing players to new player
  players.forEach((p, id) => {
    if (id !== playerId) {
      send(ws, 'player_joined', { playerId: id, x: p.x, y: p.y });
    }
  });
  
  // Handle messages
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case 'move':
        player.x = message.data.x;
        player.y = message.data.y;
        broadcast('player_moved', {
          playerId,
          x: player.x,
          y: player.y
        }, ws);
        break;
        
      case 'chat':
        broadcast('chat', {
          playerId,
          text: message.data.text
        });
        break;
    }
  });
  
  // Handle disconnect
  ws.on('close', () => {
    players.delete(playerId);
    broadcast('player_left', { playerId });
    console.log(\`Player \${playerId} disconnected\`);
  });
});

function send(ws, type, data) {
  ws.send(JSON.stringify({ type, data }));
}

function broadcast(type, data, exclude = null) {
  players.forEach(player => {
    if (player.ws !== exclude && player.ws.readyState === WebSocket.OPEN) {
      send(player.ws, type, data);
    }
  });
}

console.log('Game server running on port 3001');
          `}
        />
      </Section>

      <Section title="Client Prediction" icon="⚡">
        <TipBox type="info">
          <strong>ปัญหา:</strong> ถ้ารอ server confirm ทุกครั้ง จะรู้สึก laggy
          <br />
          <strong>Solution:</strong> ทำเลย แล้วแก้ถ้า server ไม่ตรง
        </TipBox>

        <CodeBlock
          title="Client-Side Prediction"
          language="javascript"
          code={`
class PlayerController {
  constructor(client) {
    this.client = client;
    this.position = { x: 0, y: 0 };
    this.serverPosition = { x: 0, y: 0 };
    this.inputHistory = [];
    this.inputSequence = 0;
  }
  
  // ─────────────────────────────────
  // Send input, apply locally
  // ─────────────────────────────────
  move(input) {
    this.inputSequence++;
    
    // Apply locally immediately
    this.applyInput(input);
    
    // Store for reconciliation
    this.inputHistory.push({
      sequence: this.inputSequence,
      input: input
    });
    
    // Send to server
    this.client.send('input', {
      sequence: this.inputSequence,
      input: input
    });
  }
  
  applyInput(input) {
    const speed = 5;
    if (input.up) this.position.y -= speed;
    if (input.down) this.position.y += speed;
    if (input.left) this.position.x -= speed;
    if (input.right) this.position.x += speed;
  }
  
  // ─────────────────────────────────
  // Receive server update
  // ─────────────────────────────────
  onServerUpdate(data) {
    // Set server position
    this.serverPosition = { ...data.position };
    
    // Remove processed inputs
    this.inputHistory = this.inputHistory.filter(
      hist => hist.sequence > data.lastProcessedInput
    );
    
    // Reconciliation: re-apply pending inputs
    this.position = { ...this.serverPosition };
    for (const hist of this.inputHistory) {
      this.applyInput(hist.input);
    }
  }
}

// Server-side
function processPlayerInput(player, data) {
  // Apply input
  applyInput(player, data.input);
  
  // Send confirmation
  send(player.ws, 'position_update', {
    position: { x: player.x, y: player.y },
    lastProcessedInput: data.sequence
  });
}
          `}
        />
      </Section>

      <Section title="Entity Interpolation" icon="📈">
        <CodeBlock
          title="Smooth Other Players"
          language="javascript"
          code={`
class RemotePlayer {
  constructor() {
    this.positionBuffer = [];
    this.interpolationDelay = 100; // ms
    
    this.renderPosition = { x: 0, y: 0 };
  }
  
  // ─────────────────────────────────
  // Receive position update
  // ─────────────────────────────────
  onPositionUpdate(position, timestamp) {
    this.positionBuffer.push({
      position,
      timestamp
    });
    
    // Keep buffer size reasonable
    while (this.positionBuffer.length > 10) {
      this.positionBuffer.shift();
    }
  }
  
  // ─────────────────────────────────
  // Interpolate for rendering
  // ─────────────────────────────────
  update(currentTime) {
    const renderTime = currentTime - this.interpolationDelay;
    
    // Find two positions to interpolate between
    let before = null;
    let after = null;
    
    for (let i = 0; i < this.positionBuffer.length - 1; i++) {
      if (this.positionBuffer[i].timestamp <= renderTime &&
          this.positionBuffer[i + 1].timestamp >= renderTime) {
        before = this.positionBuffer[i];
        after = this.positionBuffer[i + 1];
        break;
      }
    }
    
    if (before && after) {
      // Calculate interpolation factor
      const total = after.timestamp - before.timestamp;
      const progress = renderTime - before.timestamp;
      const t = progress / total;
      
      // Lerp
      this.renderPosition.x = before.position.x + (after.position.x - before.position.x) * t;
      this.renderPosition.y = before.position.y + (after.position.y - before.position.y) * t;
    } else if (this.positionBuffer.length > 0) {
      // Use latest position
      const latest = this.positionBuffer[this.positionBuffer.length - 1];
      this.renderPosition = { ...latest.position };
    }
  }
}

// Usage
const remotePlayers = new Map();

client.on('player_moved', (data) => {
  let player = remotePlayers.get(data.playerId);
  if (!player) {
    player = new RemotePlayer();
    remotePlayers.set(data.playerId, player);
  }
  
  player.onPositionUpdate(
    { x: data.x, y: data.y },
    data.timestamp || Date.now()
  );
});

function render() {
  const now = Date.now();
  
  remotePlayers.forEach(player => {
    player.update(now);
    drawPlayer(player.renderPosition);
  });
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Technique", "Purpose"]}
          rows={[
            ["WebSocket", "Real-time bidirectional"],
            ["Client Prediction", "Remove input lag"],
            ["Server Reconciliation", "Fix prediction errors"],
            ["Entity Interpolation", "Smooth other players"],
            ["Lag Compensation", "Fair hit detection"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Audio และ Sound Effects! 🔊</strong>
        </TipBox>
      </Section>
    </div>
  );
}
