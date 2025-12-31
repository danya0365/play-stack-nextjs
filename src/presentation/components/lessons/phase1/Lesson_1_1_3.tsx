"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_1_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">คณิตศาสตร์สำหรับการพัฒนาเกม</h1>

      <Objectives
        items={[
          "Vector คืออะไรและใช้ทำอะไร",
          "การคำนวณระยะทางและทิศทาง",
          "การตรวจจับ Collision แบบต่างๆ",
          "Trigonometry สำหรับการหมุนและเล็ง",
        ]}
      />

      <Section title="Vectors - พื้นฐานของทุกอย่างในเกม" icon="📐">
        <p className="mb-4">
          Vector คือข้อมูลที่มีทั้ง <strong>ขนาด</strong> และ <strong>ทิศทาง</strong>
        </p>

        <CodeBlock
          title="Vector2 Class"
          language="javascript"
          code={`
class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  // บวก vectors
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  
  // ลบ vectors
  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  
  // คูณด้วย scalar
  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  
  // ความยาว (magnitude)
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  // Normalize (ทำให้ความยาว = 1)
  normalize() {
    const len = this.length;
    if (len === 0) return new Vector2();
    return new Vector2(this.x / len, this.y / len);
  }
  
  // ระยะทางถึง vector อื่น
  distanceTo(v) {
    return this.subtract(v).length;
  }
  
  // มุมจาก vector นี้ไป vector อื่น
  angleTo(v) {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }
}

// ใช้งาน
const playerPos = new Vector2(100, 200);
const enemyPos = new Vector2(300, 250);
const distance = playerPos.distanceTo(enemyPos);
console.log(\`Distance: \${distance.toFixed(2)}\`);
          `}
        />
      </Section>

      <Section title="การคำนวณระยะทาง" icon="📏">
        <CodeBlock
          title="Distance Functions"
          language="javascript"
          code={`
// ระยะทางระหว่าง 2 จุด (Euclidean Distance)
function distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ตัวอย่างการใช้งาน
const player = { x: 100, y: 100 };
const enemy = { x: 200, y: 150 };

const dist = distance(player, enemy);
console.log(\`Distance: \${dist.toFixed(2)}\`); // ~111.80

// ใช้เช็คว่าอยู่ในระยะโจมตีหรือไม่
const ATTACK_RANGE = 50;
if (distance(player, enemy) <= ATTACK_RANGE) {
  console.log("Enemy in range!");
}
          `}
        />

        <TipBox type="tip">
          <strong>Performance Tip:</strong> ใช้ Distance Squared เมื่อไม่ต้องการค่าจริง (ประหยัด Math.sqrt)
        </TipBox>

        <CodeBlock
          title="Distance Squared (เร็วกว่า!)"
          language="javascript"
          code={`
function distanceSquared(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

// เปรียบเทียบกับ range squared แทน
const ATTACK_RANGE = 50;
const ATTACK_RANGE_SQ = ATTACK_RANGE * ATTACK_RANGE; // 2500

if (distanceSquared(player, enemy) <= ATTACK_RANGE_SQ) {
  console.log("Enemy in range!");
}
          `}
        />
      </Section>

      <Section title="Collision Detection" icon="💥">
        <h3 className="font-semibold text-lg mb-3">1. AABB (Axis-Aligned Bounding Box)</h3>
        <p className="mb-3">สำหรับสี่เหลี่ยมที่ไม่หมุน:</p>

        <CodeBlock
          title="AABB Collision"
          language="javascript"
          code={`
function aabbCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ตัวอย่าง
const player = { x: 100, y: 100, width: 32, height: 32 };
const enemy = { x: 120, y: 110, width: 32, height: 32 };

if (aabbCollision(player, enemy)) {
  console.log("Collision detected!");
}
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">2. Circle Collision</h3>
        <CodeBlock
          title="Circle Collision"
          language="javascript"
          code={`
function circleCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}

// ตัวอย่าง
const ball1 = { x: 100, y: 100, radius: 20 };
const ball2 = { x: 130, y: 110, radius: 15 };

if (circleCollision(ball1, ball2)) {
  console.log("Balls collided!");
}
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">3. Point in Rectangle</h3>
        <CodeBlock
          title="Point in Rect (สำหรับ Mouse Click)"
          language="javascript"
          code={`
function pointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

// ใช้สำหรับเช็ค mouse click
canvas.addEventListener('click', (e) => {
  const mousePos = { x: e.offsetX, y: e.offsetY };
  
  if (pointInRect(mousePos, button)) {
    console.log("Button clicked!");
  }
});
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">Complete Collision System</h3>
        <CodeBlock
          title="Collision Detection Utility"
          language="javascript"
          code={`
const Collision = {
  // AABB
  rectRect(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
  },
  
  // Circle
  circleCircle(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < a.radius + b.radius;
  },
  
  // Circle vs Rect
  circleRect(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  },
  
  // Point in Rect
  pointRect(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
           point.y >= rect.y && point.y <= rect.y + rect.height;
  }
};
          `}
        />
      </Section>

      <Section title="Trigonometry" icon="🔄">
        <h3 className="font-semibold text-lg mb-3">การหมุนและมุม</h3>

        <CodeBlock
          title="Angle Functions"
          language="javascript"
          code={`
// แปลง degrees เป็น radians
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

// แปลง radians เป็น degrees
function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

// หามุมจากจุดหนึ่งไปอีกจุด
function angleBetween(from, to) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

// ตัวอย่าง: ศัตรูหันหน้าหาผู้เล่น
const enemy = { x: 200, y: 200, rotation: 0 };
const player = { x: 400, y: 300 };

enemy.rotation = angleBetween(enemy, player);
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">การเคลื่อนที่ตามมุม</h3>
        <CodeBlock
          title="Move in Direction"
          language="javascript"
          code={`
// เคลื่อนที่ไปในทิศทางที่กำหนด
function moveInDirection(entity, angle, speed, deltaTime) {
  entity.x += Math.cos(angle) * speed * deltaTime;
  entity.y += Math.sin(angle) * speed * deltaTime;
}

// ตัวอย่าง: กระสุนบินไปหาเป้าหมาย
const bullet = { x: 100, y: 100 };
const target = { x: 300, y: 200 };
const angle = angleBetween(bullet, target);

function update(deltaTime) {
  moveInDirection(bullet, angle, 500, deltaTime); // 500 px/s
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "สูตร", "ใช้ทำอะไร"]}
          rows={[
            ["Distance", "√(dx² + dy²)", "หาระยะห่าง"],
            ["AABB", "เช็ค overlap 4 ด้าน", "Collision สี่เหลี่ยม"],
            ["Circle", "dist < r1 + r2", "Collision วงกลม"],
            ["atan2", "Math.atan2(dy, dx)", "หามุม"],
            ["cos/sin", "x += cos(θ), y += sin(θ)", "เคลื่อนที่ตามมุม"],
          ]}
        />

        <TipBox type="success">
          <strong>พร้อมสำหรับ Module ถัดไป: Text-Based Games! 📝</strong>
        </TipBox>
      </Section>
    </div>
  );
}
