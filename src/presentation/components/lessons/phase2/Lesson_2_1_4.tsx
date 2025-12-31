"use client";

import { CodeBlock, CodeChallenge, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_1_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Collision Detection</h1>

      <Objectives
        items={[
          "AABB Collision (กล่องชนกล่อง)",
          "Circle Collision (วงกลมชนวงกลม)",
          "Circle vs Rectangle",
          "Collision Response และ Physics เบื้องต้น",
        ]}
      />

      <Section title="ทำไม Collision ถึงสำคัญ?" icon="💥">
        <p className="mb-4">
          Collision Detection เป็นพื้นฐานของเกมเกือบทุกแนว:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🎯 กระสุนโดนศัตรู</li>
          <li>🏃 ผู้เล่นเดินชนกำแพง</li>
          <li>💰 เก็บไอเทม, เหรียญ</li>
          <li>🚗 รถชนกัน</li>
        </ul>
      </Section>

      <Section title="AABB Collision" icon="📦">
        <p className="mb-4">
          <strong>AABB</strong> = Axis-Aligned Bounding Box (กล่องที่ไม่หมุน)
        </p>

        <Diagram caption="AABB Collision Check">
{`
     ┌────────────┐
     │     A      │
     │   (x,y)    │
     │  w x h     │
     └────────────┘
           ↓
    ┌──────────────────┐
    │        B         │
    │  Collision if:   │
    │  A และ B overlap │
    └──────────────────┘
`}
        </Diagram>

        <CodeBlock
          title="AABB Collision Function"
          language="javascript"
          code={`
// ตรวจสอบว่า 2 กล่องชนกันหรือไม่
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
  console.log('💥 Player hit enemy!');
  player.health -= 10;
}

// Collision with multiple enemies
function checkEnemyCollisions() {
  for (const enemy of enemies) {
    if (enemy.isAlive && aabbCollision(player, enemy)) {
      handlePlayerHit(enemy);
    }
  }
}

// Bullet vs Enemies
function checkBulletCollisions() {
  for (const bullet of bullets) {
    for (const enemy of enemies) {
      if (enemy.isAlive && aabbCollision(bullet, enemy)) {
        enemy.health -= bullet.damage;
        bullet.active = false;
        
        if (enemy.health <= 0) {
          enemy.isAlive = false;
          score += enemy.points;
        }
        break;  // bullet hits only one enemy
      }
    }
  }
}
          `}
        />
      </Section>

      <Section title="Circle Collision" icon="⭕">
        <p className="mb-4">ใช้สำหรับ objects ที่กลม เช่น ลูกบอล, หัวตัวละคร:</p>

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
  console.log('🎱 Balls collided!');
}

// Performance tip: Distance Squared
function circleCollisionFast(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distSq = dx * dx + dy * dy;
  const radiusSum = a.radius + b.radius;
  
  return distSq < radiusSum * radiusSum;
}
          `}
        />

        <TipBox type="tip">
          <strong>Performance:</strong> ใช้ distance squared เมื่อไม่ต้องการค่าระยะจริง 
          เพราะ Math.sqrt() ช้ากว่า
        </TipBox>
      </Section>

      <Section title="Circle vs Rectangle" icon="🔵">
        <CodeBlock
          title="Circle-Rectangle Collision"
          language="javascript"
          code={`
function circleRectCollision(circle, rect) {
  // หาจุดที่ใกล้วงกลมที่สุดบน rect
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  
  // คำนวณระยะห่าง
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  const distSq = dx * dx + dy * dy;
  
  return distSq < circle.radius * circle.radius;
}

// ตัวอย่าง: ลูกบอลชนกำแพง
const ball = { x: 150, y: 120, radius: 20 };
const wall = { x: 100, y: 100, width: 200, height: 20 };

if (circleRectCollision(ball, wall)) {
  // Bounce!
  ball.vy = -ball.vy * 0.8;  // Reverse Y velocity with damping
}
          `}
        />
      </Section>

      <Section title="Point in Rectangle" icon="📍">
        <CodeBlock
          title="Point Collision"
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

// ใช้สำหรับ mouse click
canvas.addEventListener('click', (e) => {
  const mousePos = { x: e.offsetX, y: e.offsetY };
  
  for (const button of buttons) {
    if (pointInRect(mousePos, button)) {
      button.onClick();
      break;
    }
  }
});

// Point in Circle
function pointInCircle(point, circle) {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy < circle.radius * circle.radius;
}
          `}
        />
      </Section>

      <Section title="Collision Response" icon="↔️">
        <CodeBlock
          title="Collision Response Examples"
          language="javascript"
          code={`
// 1. Push Back (Platform collision)
function handlePlatformCollision(player, platform) {
  if (!aabbCollision(player, platform)) return;
  
  // Calculate overlap
  const overlapLeft = (player.x + player.width) - platform.x;
  const overlapRight = (platform.x + platform.width) - player.x;
  const overlapTop = (player.y + player.height) - platform.y;
  const overlapBottom = (platform.y + platform.height) - player.y;
  
  // Find smallest overlap
  const minOverlapX = overlapLeft < overlapRight ? -overlapLeft : overlapRight;
  const minOverlapY = overlapTop < overlapBottom ? -overlapTop : overlapBottom;
  
  // Push back in direction of smallest overlap
  if (Math.abs(minOverlapX) < Math.abs(minOverlapY)) {
    player.x += minOverlapX;
    player.vx = 0;
  } else {
    player.y += minOverlapY;
    player.vy = 0;
    
    // Landing on top
    if (minOverlapY < 0) {
      player.isGrounded = true;
    }
  }
}

// 2. Bounce (Ball physics)
function handleBallBounce(ball, wall) {
  if (!circleRectCollision(ball, wall)) return;
  
  // Find closest point on wall
  const closestX = Math.max(wall.x, Math.min(ball.x, wall.x + wall.width));
  const closestY = Math.max(wall.y, Math.min(ball.y, wall.y + wall.height));
  
  // Calculate normal
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / dist;
  const ny = dy / dist;
  
  // Reflect velocity
  const dot = ball.vx * nx + ball.vy * ny;
  ball.vx = ball.vx - 2 * dot * nx;
  ball.vy = ball.vy - 2 * dot * ny;
  
  // Apply bounce damping
  ball.vx *= 0.8;
  ball.vy *= 0.8;
  
  // Push ball out
  const overlap = ball.radius - dist;
  ball.x += nx * overlap;
  ball.y += ny * overlap;
}

// 3. Collect Item
function handleItemCollision(player, items) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    
    if (aabbCollision(player, item)) {
      // Apply item effect
      switch (item.type) {
        case 'coin':
          score += 10;
          break;
        case 'health':
          player.health = Math.min(player.health + 25, player.maxHealth);
          break;
        case 'powerup':
          player.powerups.push(item.power);
          break;
      }
      
      // Remove item
      items.splice(i, 1);
      
      // Play sound
      playSound('pickup');
    }
  }
}
          `}
        />
      </Section>

      <Section title="Complete Collision System" icon="🎮">
        <CodeBlock
          title="Collision Manager"
          language="javascript"
          code={`
const Collision = {
  // Basic checks
  aabb(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
  },
  
  circle(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < a.radius + b.radius;
  },
  
  circleRect(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  },
  
  pointRect(p, r) {
    return p.x >= r.x && p.x <= r.x + r.width &&
           p.y >= r.y && p.y <= r.y + r.height;
  },
  
  pointCircle(p, c) {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    return dx * dx + dy * dy < c.radius * c.radius;
  }
};

// Usage
if (Collision.aabb(player, enemy)) {
  takeDamage(10);
}
          `}
        />
      </Section>

      <Section title="🏆 ลองทำ Challenge!" icon="🧪">
        <CodeChallenge
          title="เขียน AABB Collision"
          description="เขียน function ตรวจสอบว่า 2 กล่องชนกันหรือไม่"
          starterCode={`
// a และ b มี x, y, width, height
// return true ถ้าชนกัน

function aabbCollision(a, b) {
  // เติมโค้ดที่นี่
}

// ทดสอบ
const box1 = { x: 0, y: 0, width: 50, height: 50 };
const box2 = { x: 30, y: 30, width: 50, height: 50 };
const box3 = { x: 100, y: 100, width: 50, height: 50 };

console.log(aabbCollision(box1, box2)); // true (overlap)
console.log(aabbCollision(box1, box3)); // false (no overlap)
          `}
          solution={`
function aabbCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ทดสอบ
const box1 = { x: 0, y: 0, width: 50, height: 50 };
const box2 = { x: 30, y: 30, width: 50, height: 50 };
const box3 = { x: 100, y: 100, width: 50, height: 50 };

console.log(aabbCollision(box1, box2)); // true
console.log(aabbCollision(box1, box3)); // false
          `}
          hints={[
            "เช็คว่า a อยู่ทางซ้ายของ b ด้านขวาหรือไม่",
            "เช็ค 4 ด้าน: ซ้าย, ขวา, บน, ล่าง",
            "ใช้ && เชื่อมทุกเงื่อนไขเข้าด้วยกัน"
          ]}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "AABB ย่อมาจากอะไร?",
              options: ["Any Angle Bounding Box", "Axis-Aligned Bounding Box", "Accurate Bounding Box", "Advanced Bounding Box"],
              correctIndex: 1,
              explanation: "AABB = Axis-Aligned Bounding Box คือกล่องที่ขอบขนานกับแกน X, Y"
            },
            {
              question: "Circle Collision เปรียบเทียบอะไร?",
              options: ["width กับ height", "distance กับ ผลรวมรัศมี", "angle", "velocity"],
              correctIndex: 1,
              explanation: "วงกลมชนกันเมื่อ distance < radius1 + radius2"
            },
            {
              question: "ทำไม distance squared เร็วกว่า?",
              options: ["ใช้ memory น้อยกว่า", "ไม่ต้อง Math.sqrt()", "ใช้ integer ได้", "แม่นยำกว่า"],
              correctIndex: 1,
              explanation: "Math.sqrt() ช้า การเปรียบเทียบ squared values เร็วกว่า"
            },
            {
              question: "pointInRect ใช้ทำอะไรเป็นหลัก?",
              options: ["Character collision", "Mouse click detection", "Physics simulation", "AI pathfinding"],
              correctIndex: 1,
              explanation: "pointInRect ใช้เช็คว่า mouse click อยู่ใน button/UI หรือไม่"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Collision Type", "Use Case", "Performance"]}
          rows={[
            ["AABB", "กล่อง/สี่เหลี่ยม", "เร็วมาก"],
            ["Circle", "วงกลม/ลูกบอล", "เร็ว"],
            ["Circle-Rect", "ผสม", "ปานกลาง"],
            ["Point-Rect", "Mouse click", "เร็วมาก"],
          ]}
        />

        <ProgressCheck
          items={[
            "เขียน AABB Collision ได้",
            "เขียน Circle Collision ได้",
            "เข้าใจ Circle-Rect collision",
            "ใช้ pointInRect ตรวจ mouse click ได้",
            "พร้อมเรียน Phaser.js!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Module Canvas API!</strong>
          <br />
          บทต่อไป: Phaser.js - Game Engine ยอดนิยม!
        </TipBox>
      </Section>
    </div>
  );
}
