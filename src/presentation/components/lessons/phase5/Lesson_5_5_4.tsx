"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_5_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Physics ขั้นสูง</h1>

      <Objectives
        items={[
          "เข้าใจ Soft Body Physics",
          "Cloth Simulation",
          "Destruction Effects",
          "Particles Physics",
        ]}
      />

      <Section title="Soft Body Basics" icon="🎈">
        <Table
          headers={["Type", "Description", "Example"]}
          rows={[
            ["Rigid Body", "รูปร่างคงที่", "กล่อง, ลูกบอล"],
            ["Soft Body", "รูปร่างเปลี่ยนแปลงได้", "เยลลี่, ลูกโป่ง"],
            ["Cloth", "พื้นผิวบางที่พลิ้วได้", "ธง, เสื้อผ้า"],
            ["Rope", "เส้นที่โค้งได้", "เชือก, โซ่"],
          ]}
        />

        <CodeBlock
          title="Simple Spring System"
          language="typescript"
          code={`
interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
}

interface Spring {
  p1: number;
  p2: number;
  length: number;
  stiffness: number;
}

class SoftBody {
  points: Point[] = [];
  springs: Spring[] = [];
  
  update(dt: number) {
    // Apply gravity
    for (const p of this.points) {
      if (p.pinned) continue;
      p.vy += 980 * dt;
    }
    
    // Solve spring constraints
    for (let i = 0; i < 5; i++) {
      for (const spring of this.springs) {
        this.solveSpring(spring);
      }
    }
    
    // Update positions
    for (const p of this.points) {
      if (p.pinned) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;
    }
  }
  
  private solveSpring(spring: Spring) {
    const p1 = this.points[spring.p1];
    const p2 = this.points[spring.p2];
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const diff = (spring.length - dist) / dist;
    
    const offsetX = dx * diff * 0.5 * spring.stiffness;
    const offsetY = dy * diff * 0.5 * spring.stiffness;
    
    if (!p1.pinned) {
      p1.x -= offsetX;
      p1.y -= offsetY;
    }
    if (!p2.pinned) {
      p2.x += offsetX;
      p2.y += offsetY;
    }
  }
}
          `}
        />
      </Section>

      <Section title="Cloth Simulation" icon="🏴">
        <CodeBlock
          title="Cloth Grid"
          language="typescript"
          code={`
function createCloth(width: number, height: number, spacing: number): SoftBody {
  const cloth = new SoftBody();
  
  // Create points grid
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cloth.points.push({
        x: x * spacing,
        y: y * spacing,
        vx: 0, vy: 0,
        pinned: y === 0 // Pin top row
      });
    }
  }
  
  // Create springs
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      
      // Horizontal
      if (x < width - 1) {
        cloth.springs.push({
          p1: i, p2: i + 1,
          length: spacing, stiffness: 0.5
        });
      }
      
      // Vertical
      if (y < height - 1) {
        cloth.springs.push({
          p1: i, p2: i + width,
          length: spacing, stiffness: 0.5
        });
      }
      
      // Diagonal (for stability)
      if (x < width - 1 && y < height - 1) {
        cloth.springs.push({
          p1: i, p2: i + width + 1,
          length: spacing * 1.414, stiffness: 0.3
        });
      }
    }
  }
  
  return cloth;
}
          `}
        />
      </Section>

      <Section title="Destruction" icon="💥">
        <CodeBlock
          title="Simple Destruction"
          language="typescript"
          code={`
class Destructible {
  mesh: THREE.Mesh;
  fragments: THREE.Mesh[] = [];
  destroyed = false;
  
  destroy(impactPoint: THREE.Vector3, force: number) {
    if (this.destroyed) return;
    this.destroyed = true;
    
    // Hide original
    this.mesh.visible = false;
    
    // Create fragments
    const count = Math.min(20, Math.floor(force / 10));
    
    for (let i = 0; i < count; i++) {
      const fragment = this.createFragment();
      
      // Position near impact
      fragment.position.copy(this.mesh.position);
      fragment.position.add(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ));
      
      // Add velocity away from impact
      const direction = fragment.position.clone()
        .sub(impactPoint)
        .normalize();
      
      fragment.userData.velocity = direction.multiplyScalar(force * 0.1);
      fragment.userData.angularVelocity = new THREE.Vector3(
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10
      );
      
      this.fragments.push(fragment);
      scene.add(fragment);
    }
  }
  
  update(dt: number) {
    for (const frag of this.fragments) {
      // Apply gravity
      frag.userData.velocity.y -= 9.8 * dt;
      
      // Update position
      frag.position.add(
        frag.userData.velocity.clone().multiplyScalar(dt)
      );
      
      // Rotate
      frag.rotation.x += frag.userData.angularVelocity.x * dt;
      frag.rotation.y += frag.userData.angularVelocity.y * dt;
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
              question: "Soft Body ต่างจาก Rigid Body อย่างไร?",
              options: ["เหมือนกัน", "Soft body เปลี่ยนรูปร่างได้", "Rigid body นุ่มกว่า", "Soft body เร็วกว่า"],
              correctIndex: 1,
              explanation: "Soft body สามารถเปลี่ยนรูปร่างเมื่อโดน forces"
            },
            {
              question: "Cloth simulation ใช้อะไรเป็นพื้นฐาน?",
              options: ["Particles", "Spring constraints", "Shaders", "AI"],
              correctIndex: 1,
              explanation: "Cloth ใช้ grid ของ points ที่เชื่อมด้วย springs"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "เข้าใจ soft body physics",
            "สร้าง cloth simulation ได้",
            "ทำ destruction effects ได้",
            "🎉 จบ Phase 5 และจบ PlayStack curriculum!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 ยินดีด้วย! คุณเรียนจบ PlayStack แล้ว!</strong>
          <p className="mt-2">
            จาก text games → 2D → Multiplayer → 3D → Advanced Topics
            <br />
            คุณมีความรู้ครบถ้วนพร้อมสร้างเกมของตัวเอง! 🚀
          </p>
        </TipBox>
      </Section>
    </div>
  );
}
