"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">ระบบ Anti-Cheat</h1>

      <Objectives
        items={[
          "เข้าใจ common cheats",
          "Server-side validation",
          "Rate limiting",
          "Detection และ response",
        ]}
      />

      <Section title="Common Cheats" icon="🚫">
        <Table
          headers={["Cheat", "วิธี", "ป้องกัน"]}
          rows={[
            ["Speed hack", "ส่ง position ไกลเกินไป", "Validate distance/tick"],
            ["Teleport", "ส่ง position ใหม่ทันที", "Check max distance"],
            ["Rapid fire", "ส่ง shoot บ่อยเกินไป", "Rate limiting"],
            ["Wall hack", "แก้ client เห็นทะลุ", "Server ส่งเฉพาะที่ควรเห็น"],
          ]}
        />
      </Section>

      <Section title="Server Validation" icon="✅">
        <CodeBlock
          title="Validate All Inputs"
          language="typescript"
          code={`
class AntiCheat {
  private maxSpeed = 10;
  private shootCooldown = 100; // ms
  
  validateMovement(player: Player, newX: number, newY: number): boolean {
    // ─────────────────────────────────
    // 1. Check max distance per tick
    // ─────────────────────────────────
    const dx = newX - player.x;
    const dy = newY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > this.maxSpeed * 1.5) { // Allow some tolerance
      this.flagPlayer(player, "SPEED_HACK", distance);
      return false;
    }
    
    // ─────────────────────────────────
    // 2. Check world bounds
    // ─────────────────────────────────
    if (newX < 0 || newX > 800 || newY < 0 || newY > 600) {
      return false;
    }
    
    // ─────────────────────────────────
    // 3. Check collision (no wall clip)
    // ─────────────────────────────────
    if (this.checkCollisionWithWalls(newX, newY)) {
      return false;
    }
    
    return true;
  }
  
  validateShoot(player: Player): boolean {
    const now = Date.now();
    
    // ─────────────────────────────────
    // Rate limiting
    // ─────────────────────────────────
    if (now - player.lastShot < this.shootCooldown) {
      player.rapidFireCount++;
      
      if (player.rapidFireCount > 5) {
        this.flagPlayer(player, "RAPID_FIRE");
        return false;
      }
      return false;
    }
    
    player.lastShot = now;
    player.rapidFireCount = 0;
    return true;
  }
  
  // ─────────────────────────────────
  // Visibility check (anti wall-hack)
  // ─────────────────────────────────
  getVisibleEnemies(player: Player, allEnemies: Player[]): Player[] {
    return allEnemies.filter(enemy => {
      // Only send enemies within view distance
      const dist = this.distance(player, enemy);
      if (dist > player.viewRange) return false;
      
      // Ray cast to check line of sight
      if (!this.hasLineOfSight(player, enemy)) return false;
      
      return true;
    });
  }
}
          `}
        />
      </Section>

      <Section title="Detection & Response" icon="🔍">
        <CodeBlock
          title="Strike System"
          language="typescript"
          code={`
class CheatDetection {
  private strikes: Map<string, number> = new Map();
  private flags: Map<string, string[]> = new Map();
  
  flagPlayer(playerId: string, reason: string, data?: any) {
    // Log for review
    console.log(\`[CHEAT] \${playerId}: \${reason}\`, data);
    
    // Add flag
    if (!this.flags.has(playerId)) {
      this.flags.set(playerId, []);
    }
    this.flags.get(playerId)!.push(reason);
    
    // Add strike
    const strikes = (this.strikes.get(playerId) || 0) + 1;
    this.strikes.set(playerId, strikes);
    
    // ─────────────────────────────────
    // Take action based on strikes
    // ─────────────────────────────────
    if (strikes >= 10) {
      this.banPlayer(playerId);
    } else if (strikes >= 5) {
      this.warnPlayer(playerId);
    }
  }
  
  banPlayer(playerId: string) {
    console.log(\`[BAN] \${playerId}\`);
    // Add to ban list
    // Disconnect player
    // Notify admins
  }
}
          `}
        />

        <TipBox type="warning">
          <strong>Balance:</strong> อย่า strict เกินไป - network lag อาจทำให้ false positive
          ใช้ tolerance และดู pattern แทนการ ban ทันที
        </TipBox>
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "วิธีป้องกัน speed hack ที่ดีที่สุดคืออะไร?",
              options: ["ตรวจ client", "Server validate distance/tick", "ใช้ encryption", "ไม่มีทาง"],
              correctIndex: 1,
              explanation: "Server ต้อง validate ว่า player เคลื่อนที่เร็วกว่าที่ควรไหม"
            },
            {
              question: "การป้องกัน wall hack ทำอย่างไร?",
              options: ["Encrypt data", "Server ส่งเฉพาะ entities ที่ควรเห็น", "ตรวจ client code", "ไม่ได้"],
              correctIndex: 1,
              explanation: "ถ้า server ไม่ส่ง data ของ enemies ที่อยู่หลังกำแพง client จะไม่สามารถ hack ได้"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "เข้าใจ common cheats",
            "Implement server validation ได้",
            "ใช้ rate limiting ได้",
            "จบ Module 5.2! พร้อมเรียน Monetization!"
          ]}
        />
      </Section>
    </div>
  );
}
