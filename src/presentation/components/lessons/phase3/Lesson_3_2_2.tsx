"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">ตั้งค่า PeerJS</h1>

      <Objectives
        items={[
          "ติดตั้งและตั้งค่า PeerJS",
          "สร้าง Peer connections",
          "ส่งและรับข้อมูลผ่าน DataConnection",
          "จัดการ connection events",
        ]}
      />

      <Section title="PeerJS คืออะไร?" icon="🔗">
        <p className="mb-4">
          <strong>PeerJS</strong> เป็น library ที่ทำให้ WebRTC ง่ายขึ้น:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>✅ ไม่ต้องเขียน signaling เอง</li>
          <li>✅ Free cloud signaling server</li>
          <li>✅ Simple API</li>
          <li>✅ Automatic reconnection</li>
        </ul>

        <Diagram caption="PeerJS Architecture">
{`
   ┌─────────────────────────────────────────┐
   │            PeerJS Cloud Server           │
   │         (Free Signaling Server)          │
   └─────────────────┬───────────────────────┘
                     │ Signaling only
           ┌─────────┴─────────┐
           │                   │
      ┌────┴────┐         ┌────┴────┐
      │ Peer A  │◄═══════►│ Peer B  │
      │  ID:abc │ Direct  │  ID:xyz │
      └─────────┘ P2P     └─────────┘
`}
        </Diagram>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Setup"
          language="bash"
          code={`
# Install PeerJS
npm install peerjs

# TypeScript types included
          `}
        />

        <CodeBlock
          title="Basic Import"
          language="typescript"
          code={`
import Peer, { DataConnection } from "peerjs";

// Or in browser
// <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
          `}
        />
      </Section>

      <Section title="Creating a Peer" icon="👤">
        <CodeBlock
          title="Initialize Peer"
          language="typescript"
          code={`
import Peer from "peerjs";

// ─────────────────────────────────
// Auto-generated ID (recommended)
// ─────────────────────────────────
const peer = new Peer();

peer.on("open", (id) => {
  console.log("My peer ID:", id);
  // Share this ID with others to connect
});

// ─────────────────────────────────
// Custom ID
// ─────────────────────────────────
const peer = new Peer("player-123");

// ─────────────────────────────────
// With custom server
// ─────────────────────────────────
const peer = new Peer("player-123", {
  host: "your-peerjs-server.com",
  port: 9000,
  path: "/myapp",
  secure: true  // Use wss:// instead of ws://
});
          `}
        />

        <TipBox type="tip">
          <strong>Custom Peer ID:</strong> ใช้ได้แต่ต้องระวัง conflict!
          ควรใช้ username + random suffix เช่น "hero-abc123"
        </TipBox>
      </Section>

      <Section title="Connecting to a Peer" icon="🔌">
        <CodeBlock
          title="Data Connection"
          language="typescript"
          code={`
// ─────────────────────────────────
// Peer A: Connect to Peer B
// ─────────────────────────────────
const conn = peer.connect("peer-b-id", {
  reliable: true,  // ordered, guaranteed delivery
  serialization: "json"  // auto JSON parse
});

conn.on("open", () => {
  console.log("Connected to peer!");
  
  // Send data
  conn.send({ type: "hello", name: "Player A" });
  conn.send({ type: "move", x: 100, y: 200 });
});

conn.on("data", (data) => {
  console.log("Received:", data);
});

conn.on("close", () => {
  console.log("Connection closed");
});

conn.on("error", (err) => {
  console.error("Connection error:", err);
});
          `}
        />

        <CodeBlock
          title="Receiving Connections"
          language="typescript"
          code={`
// ─────────────────────────────────
// Peer B: Accept incoming connections
// ─────────────────────────────────
peer.on("connection", (conn) => {
  console.log("Incoming connection from:", conn.peer);
  
  conn.on("open", () => {
    console.log("Connection ready!");
    conn.send({ type: "welcome" });
  });
  
  conn.on("data", (data) => {
    console.log("Got data:", data);
    handleGameData(data);
  });
  
  conn.on("close", () => {
    console.log("Peer disconnected");
    removePlayer(conn.peer);
  });
});
          `}
        />
      </Section>

      <Section title="Connection Options" icon="⚙️">
        <Table
          headers={["Option", "Default", "Description"]}
          rows={[
            ["reliable", "true", "Ordered, guaranteed delivery (TCP-like)"],
            ["serialization", "'binary'", "'json' | 'binary' | 'none'"],
            ["label", "auto", "Custom label for the connection"],
          ]}
        />

        <CodeBlock
          title="Reliable vs Unreliable"
          language="typescript"
          code={`
// ─────────────────────────────────
// Reliable: Chat, Game state, Actions
// ─────────────────────────────────
const reliableConn = peer.connect(peerId, {
  reliable: true,
  serialization: "json"
});

// ─────────────────────────────────
// Unreliable: Position updates (high frequency)
// ─────────────────────────────────
const unreliableConn = peer.connect(peerId, {
  reliable: false,  // May lose packets but faster
  serialization: "json"
});

// Use both for different purposes
function sendPosition(x: number, y: number) {
  unreliableConn.send({ type: "pos", x, y });  // Fast, may lose
}

function sendAction(action: string) {
  reliableConn.send({ type: "action", action });  // Guaranteed
}
          `}
        />
      </Section>

      <Section title="Complete Example" icon="🎮">
        <CodeBlock
          title="Simple P2P Chat"
          language="typescript"
          code={`
import Peer, { DataConnection } from "peerjs";

class P2PGame {
  peer: Peer;
  connections: Map<string, DataConnection> = new Map();
  myId: string = "";
  
  constructor() {
    this.peer = new Peer();
    this.setupPeer();
  }
  
  setupPeer() {
    // Get our ID
    this.peer.on("open", (id) => {
      this.myId = id;
      console.log("My ID:", id);
      document.getElementById("myId")!.textContent = id;
    });
    
    // Accept incoming connections
    this.peer.on("connection", (conn) => {
      this.handleConnection(conn);
    });
    
    // Handle errors
    this.peer.on("error", (err) => {
      console.error("Peer error:", err);
    });
  }
  
  // Connect to another peer
  connectToPeer(peerId: string) {
    const conn = this.peer.connect(peerId, {
      reliable: true,
      serialization: "json"
    });
    this.handleConnection(conn);
  }
  
  // Setup connection handlers
  handleConnection(conn: DataConnection) {
    conn.on("open", () => {
      console.log("Connected to:", conn.peer);
      this.connections.set(conn.peer, conn);
      
      // Send hello
      conn.send({ 
        type: "hello", 
        from: this.myId,
        name: "Player" 
      });
    });
    
    conn.on("data", (data: any) => {
      this.handleMessage(conn.peer, data);
    });
    
    conn.on("close", () => {
      console.log("Disconnected:", conn.peer);
      this.connections.delete(conn.peer);
    });
  }
  
  // Handle incoming messages
  handleMessage(from: string, data: any) {
    switch (data.type) {
      case "hello":
        console.log(\`\${data.name} joined!\`);
        break;
      case "chat":
        console.log(\`\${from}: \${data.message}\`);
        break;
      case "move":
        console.log(\`\${from} moved to \${data.x}, \${data.y}\`);
        break;
    }
  }
  
  // Send to all connected peers
  broadcast(data: any) {
    this.connections.forEach((conn) => {
      conn.send(data);
    });
  }
  
  // Send to specific peer
  sendTo(peerId: string, data: any) {
    const conn = this.connections.get(peerId);
    if (conn) {
      conn.send(data);
    }
  }
  
  // Cleanup
  disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.peer.destroy();
  }
}

// Usage
const game = new P2PGame();

// Connect to friend
document.getElementById("connectBtn")?.addEventListener("click", () => {
  const friendId = (document.getElementById("friendId") as HTMLInputElement).value;
  game.connectToPeer(friendId);
});

// Send chat
document.getElementById("sendBtn")?.addEventListener("click", () => {
  const msg = (document.getElementById("message") as HTMLInputElement).value;
  game.broadcast({ type: "chat", message: msg });
});
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "PeerJS ทำให้อะไรง่ายขึ้น?",
              options: ["Database", "WebRTC signaling และ connection", "CSS styling", "Server setup"],
              correctIndex: 1,
              explanation: "PeerJS wrap WebRTC และ handle signaling ให้"
            },
            {
              question: "peer.connect() return อะไร?",
              options: ["Promise", "DataConnection object", "String", "Boolean"],
              correctIndex: 1,
              explanation: "peer.connect() return DataConnection ที่ใช้ส่ง/รับข้อมูล"
            },
            {
              question: "reliable: true หมายความว่าอะไร?",
              options: ["เร็วกว่า", "รับประกัน delivery และ ordering", "ใช้ UDP", "ไม่ encrypt"],
              correctIndex: 1,
              explanation: "reliable: true รับประกันว่าข้อมูลจะถึงและเรียงลำดับถูกต้อง"
            },
            {
              question: "connection.send() ใช้ส่งอะไรได้?",
              options: ["String เท่านั้น", "Objects ได้เมื่อใช้ serialization: json", "Video เท่านั้น", "Files เท่านั้น"],
              correctIndex: 1,
              explanation: "ใช้ serialization: 'json' แล้วส่ง objects ได้โดยตรง"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["new Peer()", "สร้าง peer instance"],
            ["peer.connect(id)", "เชื่อมต่อไปยัง peer อื่น"],
            ["peer.on('connection')", "รับ incoming connections"],
            ["conn.send(data)", "ส่งข้อมูล"],
            ["conn.on('data')", "รับข้อมูล"],
            ["reliable: true/false", "Guaranteed vs fast delivery"],
          ]}
        />

        <ProgressCheck
          items={[
            "ติดตั้ง PeerJS ได้",
            "สร้าง Peer และได้ ID",
            "Connect ไปหา peer อื่นได้",
            "ส่งและรับข้อมูลได้",
            "พร้อมทำ P2P Game State!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: จัดการ State แบบ P2P! 🎮</strong>
        </TipBox>
      </Section>
    </div>
  );
}
