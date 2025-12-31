"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน HTML5 Canvas</h1>

      <Objectives
        items={[
          "ตั้งค่า Canvas element และ Drawing Context",
          "วาดรูปทรงพื้นฐาน (rect, circle, line)",
          "ใช้สีและ gradients",
          "สร้าง game scene แรก",
        ]}
      />

      <Section title="Canvas คืออะไร?" icon="🎨">
        <p className="mb-4">
          <strong>Canvas</strong> คือ HTML element ที่ใช้วาดกราฟิก 2D (และ 3D ด้วย WebGL) บน browser
        </p>

        <CodeBlock
          title="HTML Setup"
          language="html"
          code={`
<!DOCTYPE html>
<html>
<head>
  <title>My Canvas Game</title>
  <style>
    * { margin: 0; padding: 0; }
    canvas {
      display: block;
      background: #1a1a2e;
    }
  </style>
</head>
<body>
  <canvas id="game" width="800" height="600"></canvas>
  <script src="game.js"></script>
</body>
</html>
          `}
        />

        <TipBox type="tip">
          <strong>Pro Tip:</strong> ตั้งค่า width/height ใน HTML attribute โดยตรง 
          ไม่ใช่ CSS เพราะ CSS จะ stretch ไม่ใช่ resize
        </TipBox>
      </Section>

      <Section title="Getting the Drawing Context" icon="🖌️">
        <CodeBlock
          title="Canvas Context"
          language="javascript"
          code={`
// รับ canvas element
const canvas = document.getElementById('game');

// รับ 2D drawing context
const ctx = canvas.getContext('2d');

// ตอนนี้เราสามารถวาดได้แล้ว!
ctx.fillStyle = 'green';
ctx.fillRect(100, 100, 50, 50);
          `}
        />

        <Diagram caption="Canvas Coordinate System">
{`(0,0) ─────────────────────────────▶ X (width)
  │
  │     ┌──────────────────┐
  │     │                  │
  │     │   Canvas Area    │
  │     │                  │
  │     │      (x, y)      │
  │     │        •         │
  │     │                  │
  │     └──────────────────┘
  ▼
  Y (height)`}
        </Diagram>
      </Section>

      <Section title="วาดรูปทรงพื้นฐาน" icon="📐">
        <h3 className="font-semibold text-lg mb-3">1. สี่เหลี่ยม (Rectangles)</h3>
        
        <CodeBlock
          title="Drawing Rectangles"
          language="javascript"
          code={`
// 1. สี่เหลี่ยมทึบ (filled)
ctx.fillStyle = '#4ade80';  // สีเขียว
ctx.fillRect(50, 50, 100, 80);  // x, y, width, height

// 2. สี่เหลี่ยมขอบ (stroke)
ctx.strokeStyle = '#f472b6';  // สีชมพู
ctx.lineWidth = 3;
ctx.strokeRect(200, 50, 100, 80);

// 3. ลบสี่เหลี่ยม (clear)
ctx.clearRect(75, 70, 50, 40);  // ทำให้โปร่งใส
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">2. วงกลม (Circles)</h3>

        <CodeBlock
          title="Drawing Circles"
          language="javascript"
          code={`
// วงกลมทึบ
ctx.beginPath();  // เริ่ม path ใหม่
ctx.arc(200, 200, 50, 0, Math.PI * 2);  // centerX, centerY, radius, startAngle, endAngle
ctx.fillStyle = '#60a5fa';  // สีฟ้า
ctx.fill();

// วงกลมขอบ
ctx.beginPath();
ctx.arc(350, 200, 50, 0, Math.PI * 2);
ctx.strokeStyle = '#fbbf24';  // สีเหลือง
ctx.lineWidth = 4;
ctx.stroke();

// ครึ่งวงกลม
ctx.beginPath();
ctx.arc(500, 200, 50, 0, Math.PI);  // 0 ถึง PI = ครึ่งวงกลม
ctx.fillStyle = '#a78bfa';
ctx.fill();
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">3. เส้น (Lines)</h3>

        <CodeBlock
          title="Drawing Lines"
          language="javascript"
          code={`
// เส้นเดียว
ctx.beginPath();
ctx.moveTo(50, 300);    // จุดเริ่มต้น
ctx.lineTo(200, 350);   // จุดสิ้นสุด
ctx.strokeStyle = '#a78bfa';
ctx.lineWidth = 2;
ctx.stroke();

// หลายเส้นต่อกัน (path)
ctx.beginPath();
ctx.moveTo(250, 300);
ctx.lineTo(350, 350);
ctx.lineTo(300, 400);
ctx.closePath();  // ปิด path กลับไปจุดเริ่ม
ctx.fillStyle = '#34d399';
ctx.fill();
ctx.stroke();  // วาดขอบด้วย

// เส้นประ
ctx.beginPath();
ctx.setLineDash([10, 5]);  // ยาว 10, ช่องว่าง 5
ctx.moveTo(400, 300);
ctx.lineTo(550, 380);
ctx.stroke();
ctx.setLineDash([]);  // reset เป็นเส้นปกติ
          `}
        />
      </Section>

      <Section title="สีและ Gradients" icon="🌈">
        <h3 className="font-semibold text-lg mb-3">รูปแบบสี</h3>

        <CodeBlock
          title="Color Formats"
          language="javascript"
          code={`
// แบบต่างๆ ที่ใช้ได้
ctx.fillStyle = 'red';                    // ชื่อสี
ctx.fillStyle = '#ff0000';                // Hex
ctx.fillStyle = 'rgb(255, 0, 0)';         // RGB
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';   // RGBA (มี alpha)
ctx.fillStyle = 'hsl(0, 100%, 50%)';      // HSL
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">Linear Gradient</h3>

        <CodeBlock
          title="Linear Gradient"
          language="javascript"
          code={`
// สร้าง gradient (x1, y1, x2, y2)
const gradient = ctx.createLinearGradient(0, 0, 800, 0);  // horizontal
gradient.addColorStop(0, '#667eea');     // สีเริ่มต้น
gradient.addColorStop(0.5, '#764ba2');   // สีกลาง
gradient.addColorStop(1, '#f093fb');     // สีสุดท้าย

// ใช้ gradient เป็น fillStyle
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 100);

// Vertical gradient
const vGradient = ctx.createLinearGradient(0, 0, 0, 600);
vGradient.addColorStop(0, '#0f0c29');
vGradient.addColorStop(0.5, '#302b63');
vGradient.addColorStop(1, '#24243e');
ctx.fillStyle = vGradient;
ctx.fillRect(0, 0, 800, 600);
          `}
        />

        <h3 className="font-semibold text-lg mt-6 mb-3">Radial Gradient</h3>

        <CodeBlock
          title="Radial Gradient"
          language="javascript"
          code={`
// สร้าง radial gradient (centerX, centerY, innerRadius, centerX, centerY, outerRadius)
const sunGlow = ctx.createRadialGradient(100, 100, 0, 100, 100, 80);
sunGlow.addColorStop(0, '#fcd34d');    // สีตรงกลาง
sunGlow.addColorStop(0.6, '#f59e0b');
sunGlow.addColorStop(1, 'transparent');

// วาดพระอาทิตย์
ctx.fillStyle = sunGlow;
ctx.beginPath();
ctx.arc(100, 100, 80, 0, Math.PI * 2);
ctx.fill();
          `}
        />
      </Section>

      <Section title="ตัวอย่าง: Game Scene" icon="🎮">
        <CodeBlock
          title="Complete Game Scene"
          language="javascript"
          code={`
function drawScene() {
  // 1. Sky gradient background
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#0f172a');   // dark blue
  sky.addColorStop(1, '#1e3a8a');   // lighter blue
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 800, 400);
  
  // 2. Ground
  ctx.fillStyle = '#166534';  // dark green
  ctx.fillRect(0, 400, 800, 200);
  
  // 3. Moon
  const moonGlow = ctx.createRadialGradient(650, 80, 0, 650, 80, 50);
  moonGlow.addColorStop(0, '#fef3c7');
  moonGlow.addColorStop(0.8, '#fcd34d');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(650, 80, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // 4. Stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 350;
    const size = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 5. Player
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(100, 360, 32, 48);
  
  // 6. Enemy
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(300, 370, 32, 32);
}

drawScene();
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Method", "ใช้ทำอะไร"]}
          rows={[
            ["fillRect(x, y, w, h)", "วาดสี่เหลี่ยมทึบ"],
            ["strokeRect(x, y, w, h)", "วาดสี่เหลี่ยมขอบ"],
            ["clearRect(x, y, w, h)", "ลบพื้นที่"],
            ["beginPath()", "เริ่ม path ใหม่"],
            ["arc(x, y, r, start, end)", "วาดวงกลม/โค้ง"],
            ["moveTo(), lineTo()", "วาดเส้น"],
            ["fill(), stroke()", "เติม/วาดขอบ"],
            ["createLinearGradient()", "สร้าง gradient แนวเส้น"],
            ["createRadialGradient()", "สร้าง gradient แนววงกลม"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Animation Loop - ทำให้ทุกอย่างเคลื่อนไหว! 🔄</strong>
        </TipBox>
      </Section>
    </div>
  );
}
