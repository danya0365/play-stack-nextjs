"use client";

import { useCallback } from "react";
import { CodeBlock, Diagram, LiveCanvas, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_1_1() {
  // Live demo draw function
  const drawDemo = useCallback((ctx: CanvasRenderingContext2D, frame: number) => {
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, 200);
    sky.addColorStop(0, '#0f172a');
    sky.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 400, 200);
    
    // Ground
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 200, 400, 100);
    
    // Moon with glow
    const moonGlow = ctx.createRadialGradient(320, 50, 0, 320, 50, 30);
    moonGlow.addColorStop(0, '#fef3c7');
    moonGlow.addColorStop(0.8, '#fcd34d');
    moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(320, 50, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Stars (twinkling)
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
      const x = (i * 47) % 400;
      const y = (i * 31) % 180;
      const twinkle = Math.sin(frame * 0.1 + i) * 0.5 + 1;
      ctx.beginPath();
      ctx.arc(x, y, twinkle, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Player with animation
    const bounce = Math.sin(frame * 0.1) * 3;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 165 + bounce, 24, 36);
    
    // Enemy moving
    const enemyX = 200 + Math.sin(frame * 0.05) * 50;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(enemyX, 175, 24, 24);
    
    // Coin rotating
    const coinScale = Math.abs(Math.sin(frame * 0.1));
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.ellipse(300, 185, 8 * coinScale, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }, []);

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

      <Section title="🎮 Live Demo" icon="▶️">
        <p className="mb-4">ลองดู demo ที่สร้างด้วย Canvas:</p>
        <LiveCanvas width={400} height={300} draw={drawDemo} />
        <p className="text-sm text-gray-500 text-center">
          กดปุ่มเพื่อดู animation - สังเกตการเคลื่อนไหวของ player, enemy และ coin
        </p>
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
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "ต้องใช้คำสั่งอะไรก่อนวาดวงกลม?",
              options: ["fillRect()", "beginPath()", "moveTo()", "arc()"],
              correctIndex: 1,
              explanation: "beginPath() ใช้เพื่อเริ่ม path ใหม่ก่อนวาดรูปทรง"
            },
            {
              question: "คำสั่ง arc() ต้องการ parameter กี่ตัว?",
              options: ["3", "4", "5", "6"],
              correctIndex: 2,
              explanation: "arc(centerX, centerY, radius, startAngle, endAngle) = 5 ตัว"
            },
            {
              question: "Math.PI * 2 ใน arc() หมายถึงอะไร?",
              options: ["ครึ่งวงกลม", "วงกลมเต็ม", "หนึ่งในสี่วงกลม", "สามในสี่วงกลม"],
              correctIndex: 1,
              explanation: "2π radians = 360 องศา = วงกลมเต็ม"
            },
            {
              question: "ใช้อะไรทำให้สี่เหลี่ยมโปร่งใส?",
              options: ["fillRect()", "strokeRect()", "clearRect()", "deleteRect()"],
              correctIndex: 2,
              explanation: "clearRect() ใช้ลบ pixels ให้กลายเป็นโปร่งใส"
            }
          ]}
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
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Canvas และ Context ได้",
            "วาดสี่เหลี่ยมและวงกลมได้",
            "ใช้สีและ gradient ได้",
            "เข้าใจ coordinate system",
            "พร้อมเรียน Animation Loop!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Animation Loop - ทำให้ทุกอย่างเคลื่อนไหว! 🔄</strong>
        </TipBox>
      </Section>
    </div>
  );
}

