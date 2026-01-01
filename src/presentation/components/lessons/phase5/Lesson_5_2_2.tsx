"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Lag Compensation</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ Network Latency",
          "Implement Client-Side Prediction",
          "ใช้ Server Reconciliation",
          "Entity Interpolation",
        ]}
      />

      <Section title="Latency Problem" icon="⏱️">
        <Diagram caption="Network Delay">
{`
Time ────────────────────────────────────►

Client:  [Input]────────────────────[See Result]
              ╲                      ╱
               ╲ 50ms              ╱ 50ms
                ╲                ╱
Server:         [Receive]──[Process]──[Send]

Total delay = 100ms+ (feels unresponsive)
`}
        </Diagram>
      </Section>

      <Section title="Client-Side Prediction" icon="🎯">
        <CodeBlock
          title="Predict Locally"
          language="typescript"
          code={`
class PredictiveClient {
  localPlayer: Player;
  pendingInputs: Input[] = [];
  inputSequence = 0;
  
  update(input: InputState) {
    // ─────────────────────────────────
    // 1. Apply input locally immediately
    // ─────────────────────────────────
    this.inputSequence++;
    
    const inputPacket = {
      sequence: this.inputSequence,
      ...input
    };
    
    // Apply locally
    this.applyInput(this.localPlayer, input);
    
    // Save for reconciliation
    this.pendingInputs.push(inputPacket);
    
    // ─────────────────────────────────
    // 2. Send to server
    // ─────────────────────────────────
    this.sendToServer({
      type: "input",
      ...inputPacket
    });
  }
  
  applyInput(player: Player, input: InputState) {
    if (input.left) player.x -= player.speed;
    if (input.right) player.x += player.speed;
    if (input.up) player.y -= player.speed;
    if (input.down) player.y += player.speed;
  }
}
          `}
        />
      </Section>

      <Section title="Server Reconciliation" icon="🔄">
        <CodeBlock
          title="Correct Prediction Errors"
          language="typescript"
          code={`
class PredictiveClient {
  onServerUpdate(serverState: PlayerState) {
    // ─────────────────────────────────
    // 1. Get authoritative position
    // ─────────────────────────────────
    const serverX = serverState.x;
    const serverY = serverState.y;
    const lastProcessedInput = serverState.lastInputSequence;
    
    // ─────────────────────────────────
    // 2. Remove acknowledged inputs
    // ─────────────────────────────────
    this.pendingInputs = this.pendingInputs.filter(
      input => input.sequence > lastProcessedInput
    );
    
    // ─────────────────────────────────
    // 3. Re-apply pending inputs
    // ─────────────────────────────────
    this.localPlayer.x = serverX;
    this.localPlayer.y = serverY;
    
    for (const input of this.pendingInputs) {
      this.applyInput(this.localPlayer, input);
    }
    
    // Now local position is corrected
  }
}
          `}
        />

        <Diagram caption="Reconciliation Flow">
{`
Client Timeline:
[Input 1][Input 2][Input 3][Input 4][Input 5]
    ↓
    └──────► Server processes Input 1-3
              ↓
              └──► Client receives: "After Input 3, position = (10, 20)"
                    ↓
                    └──► Client: Set position (10, 20)
                         Re-apply Input 4, 5
`}
        </Diagram>
      </Section>

      <Section title="Entity Interpolation" icon="🎬">
        <CodeBlock
          title="Smooth Other Players"
          language="typescript"
          code={`
class InterpolatedEntity {
  positionBuffer: { time: number; x: number; y: number }[] = [];
  renderX = 0;
  renderY = 0;
  
  // Add new server state
  addServerState(state: { x: number; y: number }) {
    this.positionBuffer.push({
      time: Date.now(),
      x: state.x,
      y: state.y
    });
    
    // Keep only last 1 second
    const cutoff = Date.now() - 1000;
    this.positionBuffer = this.positionBuffer.filter(
      p => p.time > cutoff
    );
  }
  
  // Render at past time (100ms behind)
  interpolate() {
    const renderTime = Date.now() - 100; // 100ms in the past
    
    // Find positions to interpolate between
    let before = null;
    let after = null;
    
    for (let i = 0; i < this.positionBuffer.length; i++) {
      if (this.positionBuffer[i].time <= renderTime) {
        before = this.positionBuffer[i];
      } else {
        after = this.positionBuffer[i];
        break;
      }
    }
    
    if (before && after) {
      // Interpolate
      const t = (renderTime - before.time) / (after.time - before.time);
      this.renderX = before.x + (after.x - before.x) * t;
      this.renderY = before.y + (after.y - before.y) * t;
    } else if (before) {
      // Extrapolate (risky)
      this.renderX = before.x;
      this.renderY = before.y;
    }
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Client-Side Prediction ทำอะไร?",
              options: ["ทำนายอนาคต", "ทำให้ player รู้สึกว่าตอบสนองทันที", "ลด bandwidth", "เพิ่ม security"],
              correctIndex: 1,
              explanation: "Prediction ทำให้ input ของ player ตอบสนองทันทีโดยไม่ต้องรอ server"
            },
            {
              question: "Server Reconciliation ใช้ทำอะไร?",
              options: ["Connect server", "แก้ไข prediction ที่ผิด", "ส่ง data", "ลด latency"],
              correctIndex: 1,
              explanation: "Reconciliation ตรวจสอบและแก้ไขตำแหน่งเมื่อ server ส่งผลลัพธ์กลับมา"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Technique", "Purpose"]}
          rows={[
            ["Prediction", "ทำให้ local player responsive"],
            ["Reconciliation", "แก้ไข prediction errors"],
            ["Interpolation", "ทำให้ other players smooth"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ latency problem",
            "Implement prediction ได้",
            "ใช้ reconciliation ได้",
            "พร้อมเรียน Anti-Cheat!"
          ]}
        />
      </Section>
    </div>
  );
}
