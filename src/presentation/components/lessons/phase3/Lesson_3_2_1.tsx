"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน WebRTC</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ WebRTC และ P2P",
          "รู้จัก Signaling process",
          "เข้าใจ NAT traversal",
          "เปรียบเทียบ P2P vs Server-based",
        ]}
      />

      <Section title="P2P vs Server-Based" icon="🔄">
        <Diagram caption="Architecture Comparison">
{`
     SERVER-BASED (Colyseus)              P2P (WebRTC)
    
         ┌────────┐                      ┌────────┐
         │ Server │                      │Signaling│
         └───┬────┘                      │ Server │
             │                           └────────┘
      ┌──────┼──────┐                    (only for initial connect)
      │      │      │                         │
      ▼      ▼      ▼                    ┌────┴────┐
   ┌───┐  ┌───┐  ┌───┐               ┌───┐       ┌───┐
   │ A │  │ B │  │ C │               │ A │◄─────►│ B │
   └───┘  └───┘  └───┘               └───┘       └───┘
                                       │           │
   All traffic through server           Direct connection!
`}
        </Diagram>

        <Table
          headers={["", "Server-Based", "P2P"]}
          rows={[
            ["Latency", "Higher (A→Server→B)", "Lower (A→B direct)"],
            ["Server Cost", "ต้องมี server", "แทบไม่มี"],
            ["Scalability", "ต้อง scale server", "Scale ตาม peers"],
            ["Authority", "Server = ความจริง", "ต้องตกลงกัน"],
            ["Use Case", "MMO, Competitive", "1v1, Co-op, Video call"],
          ]}
        />
      </Section>

      <Section title="WebRTC คืออะไร?" icon="🌐">
        <p className="mb-4">
          <strong>WebRTC</strong> (Web Real-Time Communication) คือ technology สำหรับ:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>📹 Video/Audio streaming</li>
          <li>📦 Data channels (game data)</li>
          <li>🔒 Encrypted connections</li>
          <li>🌍 Works in browsers</li>
        </ul>

        <Diagram caption="WebRTC Components">
{`
┌─────────────────────────────────────────────┐
│                  WebRTC                      │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ MediaStream  │  │    RTCDataChannel    │ │
│  │ (Video/Audio)│  │ (Game Data, Messages)│ │
│  └──────────────┘  └──────────────────────┘ │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │         RTCPeerConnection            │   │
│  │   (handles the actual connection)     │   │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
`}
        </Diagram>

        <TipBox type="info">
          <strong>Data Channels</strong> คือสิ่งที่เราใช้สำหรับเกม! 
          ส่งข้อมูลแบบ reliable หรือ unreliable ได้
        </TipBox>
      </Section>

      <Section title="Signaling Process" icon="🤝">
        <p className="mb-4">
          เนื่องจาก peers ไม่รู้ที่อยู่กัน จึงต้องมี <strong>Signaling Server</strong> ช่วย:
        </p>

        <Diagram caption="Signaling Flow">
{`
  Peer A                Signaling Server              Peer B
    │                         │                          │
    │   1. Create Offer       │                          │
    ├────────────────────────►│                          │
    │                         │   2. Forward Offer       │
    │                         ├─────────────────────────►│
    │                         │                          │
    │                         │   3. Create Answer       │
    │                         │◄─────────────────────────┤
    │   4. Forward Answer     │                          │
    │◄────────────────────────┤                          │
    │                         │                          │
    │   5. Exchange ICE Candidates                       │
    │◄────────────────────────┼─────────────────────────►│
    │                         │                          │
    │         6. Direct P2P Connection Established       │
    │◄═══════════════════════════════════════════════════╡
    │                         │                          │
`}
        </Diagram>

        <CodeBlock
          title="Signaling Concepts"
          language="typescript"
          code={`
// ─────────────────────────────────
// Offer: "นี่คือวิธีที่ฉันสื่อสารได้"
// ─────────────────────────────────
const offer = await peerConnection.createOffer();
// Contains: codecs, encryption, etc.

// ─────────────────────────────────
// Answer: "โอเค ฉันยอมรับและนี่คือของฉัน"
// ─────────────────────────────────
const answer = await peerConnection.createAnswer();

// ─────────────────────────────────
// ICE Candidates: "นี่คือทางที่จะติดต่อฉันได้"
// ─────────────────────────────────
// - Local IP (same network)
// - Public IP (via STUN)
// - Relay IP (via TURN)
          `}
        />
      </Section>

      <Section title="NAT Traversal" icon="🔀">
        <p className="mb-4">
          ปัญหาหลักของ P2P คือ <strong>NAT (Network Address Translation)</strong>:
        </p>

        <Diagram caption="NAT Problem">
{`
     Internet                              Internet
         │                                     │
    ┌────┴────┐                          ┌────┴────┐
    │  NAT/   │                          │  NAT/   │
    │ Router  │                          │ Router  │
    └────┬────┘                          └────┬────┘
         │ Private IP: 192.168.1.x           │ Private IP: 192.168.1.x
    ┌────┴────┐                          ┌────┴────┐
    │ Peer A  │         ???              │ Peer B  │
    └─────────┘         How to connect?  └─────────┘
    
    Both peers have private IPs!
    They can't directly reach each other!
`}
        </Diagram>

        <Table
          headers={["Server", "หน้าที่"]}
          rows={[
            ["STUN", "ค้นหา public IP ของเรา (free, fast)"],
            ["TURN", "Relay traffic เมื่อ direct connection ไม่ได้ (costly)"],
            ["ICE", "ลองทุกทางเพื่อหาการเชื่อมต่อที่ดีที่สุด"],
          ]}
        />

        <CodeBlock
          title="ICE Configuration"
          language="typescript"
          code={`
const config = {
  iceServers: [
    // Free STUN servers
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    
    // TURN server (for fallback)
    {
      urls: "turn:your-turn-server.com:3478",
      username: "user",
      credential: "password"
    }
  ]
};

const peerConnection = new RTCPeerConnection(config);
          `}
        />

        <TipBox type="warning">
          <strong>TURN servers มีค่าใช้จ่าย!</strong> 
          เพราะ traffic ทั้งหมดผ่าน server ของคุณ
          ใช้เฉพาะเมื่อ STUN ไม่ work
        </TipBox>
      </Section>

      <Section title="Raw WebRTC Example" icon="📝">
        <CodeBlock
          title="Basic RTCPeerConnection"
          language="typescript"
          code={`
// ─────────────────────────────────
// Peer A (Caller)
// ─────────────────────────────────
const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const peerA = new RTCPeerConnection(config);

// Create data channel
const dataChannel = peerA.createDataChannel("game");

dataChannel.onopen = () => {
  console.log("Channel open!");
  dataChannel.send(JSON.stringify({ type: "hello" }));
};

dataChannel.onmessage = (event) => {
  console.log("Received:", event.data);
};

// Create offer
const offer = await peerA.createOffer();
await peerA.setLocalDescription(offer);

// Collect ICE candidates
peerA.onicecandidate = (event) => {
  if (event.candidate) {
    // Send to Peer B via signaling server
    signalingServer.send({
      type: "ice-candidate",
      candidate: event.candidate
    });
  }
};

// ─────────────────────────────────
// Peer B (Callee)
// ─────────────────────────────────
const peerB = new RTCPeerConnection(config);

// Receive data channel
peerB.ondatachannel = (event) => {
  const channel = event.channel;
  channel.onmessage = (e) => console.log("Got:", e.data);
};

// Receive offer
await peerB.setRemoteDescription(offer);

// Create answer
const answer = await peerB.createAnswer();
await peerB.setLocalDescription(answer);

// Back to Peer A
await peerA.setRemoteDescription(answer);
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "P2P มีข้อดีกว่า Server-based อย่างไร?",
              options: ["มี authority กลาง", "Latency ต่ำกว่า", "Scale ง่ายกว่า", "ปลอดภัยกว่า"],
              correctIndex: 1,
              explanation: "P2P ส่งข้อมูลตรงถึงกัน ไม่ต้องผ่าน server จึง latency ต่ำ"
            },
            {
              question: "Signaling Server ทำหน้าที่อะไร?",
              options: ["ส่งข้อมูลเกม", "ช่วย peers หากันและแลกเปลี่ยน connection info", "เก็บ game state", "Verify players"],
              correctIndex: 1,
              explanation: "Signaling server ช่วยแลกเปลี่ยน offer/answer/ICE เพื่อสร้าง connection"
            },
            {
              question: "STUN server ทำอะไร?",
              options: ["Relay traffic", "ค้นหา public IP ของเรา", "เก็บข้อมูล", "Encrypt data"],
              correctIndex: 1,
              explanation: "STUN ช่วยให้รู้ public IP/port ของตัวเอง"
            },
            {
              question: "TURN server ใช้เมื่อไหร่?",
              options: ["ทุกครั้ง", "เมื่อ direct connection ไม่ได้ (symmetric NAT)", "เมื่อต้องการ low latency", "เมื่อต้องการ security"],
              correctIndex: 1,
              explanation: "TURN เป็น fallback เมื่อ P2P direct ไม่ได้ โดย relay traffic ผ่าน"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["WebRTC", "P2P communication in browsers"],
            ["RTCDataChannel", "ส่งข้อมูลเกมแบบ P2P"],
            ["Signaling", "กระบวนการแลกเปลี่ยน connection info"],
            ["STUN", "ค้นหา public IP (free)"],
            ["TURN", "Relay fallback (costly)"],
            ["ICE", "ลองทุกทางเพื่อ connect"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจความแตกต่าง P2P vs Server",
            "เข้าใจ Signaling process",
            "รู้จัก STUN/TURN/ICE",
            "เห็นภาพ Raw WebRTC API",
            "พร้อมใช้ PeerJS!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: ตั้งค่า PeerJS! 🔗</strong>
        </TipBox>
      </Section>
    </div>
  );
}
