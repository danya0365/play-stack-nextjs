"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Input Handling สำหรับ Canvas Games</h1>

      <Objectives
        items={[
          "จัดการ keyboard input อย่างมืออาชีพ",
          "รับ mouse position และ click events",
          "Touch input สำหรับมือถือ",
          "สร้าง Input Manager แบบ reusable",
        ]}
      />

      <Section title="Keyboard Input" icon="⌨️">
        <p className="mb-4">
          ใช้ object เก็บสถานะปุ่มแทนการเช็คใน event handler:
        </p>

        <CodeBlock
          title="Keyboard State Pattern"
          language="javascript"
          code={`
// เก็บสถานะว่าปุ่มใดกำลังถูกกดอยู่
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  
  // Prevent default สำหรับบางปุ่ม
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// ใช้ใน update function
function update(dt) {
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.x -= player.speed * dt;
  }
  if (keys['ArrowRight'] || keys['KeyD']) {
    player.x += player.speed * dt;
  }
  if (keys['ArrowUp'] || keys['KeyW']) {
    player.y -= player.speed * dt;
  }
  if (keys['ArrowDown'] || keys['KeyS']) {
    player.y += player.speed * dt;
  }
  
  // Jump (กดครั้งเดียว)
  if (keys['Space'] && player.isGrounded) {
    player.vy = -player.jumpForce;
    player.isGrounded = false;
  }
}
          `}
        />

        <TipBox type="tip">
          <strong>ใช้ e.code แทน e.key:</strong>
          <ul className="mt-2 space-y-1">
            <li>• e.code = "KeyA" (ตำแหน่งบน keyboard)</li>
            <li>• e.key = "a" หรือ "ก" (ขึ้นกับภาษา)</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="One-Time Key Press" icon="👆">
        <CodeBlock
          title="Key Just Pressed Pattern"
          language="javascript"
          code={`
const keys = {};
const keysJustPressed = {};

document.addEventListener('keydown', (e) => {
  if (!keys[e.code]) {
    keysJustPressed[e.code] = true;
  }
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// ล้าง justPressed ทุก frame
function clearJustPressed() {
  for (const key in keysJustPressed) {
    keysJustPressed[key] = false;
  }
}

// ใช้งาน
function update(dt) {
  // กดยิง (ครั้งเดียวต่อการกด)
  if (keysJustPressed['Space']) {
    shoot();
  }
  
  // เคลื่อนที่ (กดค้างได้)
  if (keys['ArrowRight']) {
    player.x += player.speed * dt;
  }
}

// ที่ท้าย game loop
function gameLoop() {
  update(dt);
  render();
  clearJustPressed();  // <-- สำคัญ!
  requestAnimationFrame(gameLoop);
}
          `}
        />
      </Section>

      <Section title="Mouse Input" icon="🖱️">
        <CodeBlock
          title="Mouse Handling"
          language="javascript"
          code={`
const mouse = {
  x: 0,
  y: 0,
  isDown: false,
  justClicked: false
};

// Track position
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Click events
canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0) {  // Left click
    mouse.isDown = true;
    mouse.justClicked = true;
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (e.button === 0) {
    mouse.isDown = false;
  }
});

// ป้องกัน context menu (right click)
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// ใช้งาน
function update(dt) {
  // Player หันหน้าหา mouse
  const angle = Math.atan2(
    mouse.y - player.y,
    mouse.x - player.x
  );
  player.rotation = angle;
  
  // Click to shoot
  if (mouse.justClicked) {
    shootBullet(mouse.x, mouse.y);
    mouse.justClicked = false;
  }
  
  // Hold to auto-fire
  if (mouse.isDown && player.canShoot) {
    shootBullet(mouse.x, mouse.y);
    player.canShoot = false;
    setTimeout(() => player.canShoot = true, 100);
  }
}
          `}
        />
      </Section>

      <Section title="Button Click Detection" icon="📱">
        <CodeBlock
          title="UI Button with Mouse"
          language="javascript"
          code={`
// Button class
class Button {
  constructor(x, y, width, height, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.isHovered = false;
  }
  
  contains(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }
  
  update(mouse) {
    this.isHovered = this.contains(mouse.x, mouse.y);
    
    if (this.isHovered && mouse.justClicked) {
      return true;  // Button was clicked
    }
    return false;
  }
  
  draw(ctx) {
    // Background
    ctx.fillStyle = this.isHovered ? '#4ade80' : '#3b82f6';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2
    );
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}

// Usage
const startButton = new Button(300, 250, 200, 50, 'START GAME');
const optionsButton = new Button(300, 320, 200, 50, 'OPTIONS');

function update() {
  if (startButton.update(mouse)) {
    startGame();
  }
  if (optionsButton.update(mouse)) {
    showOptions();
  }
}

function render() {
  startButton.draw(ctx);
  optionsButton.draw(ctx);
}
          `}
        />
      </Section>

      <Section title="Touch Input (Mobile)" icon="📲">
        <CodeBlock
          title="Touch Events"
          language="javascript"
          code={`
const touch = {
  x: 0,
  y: 0,
  isDown: false
};

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touch.x = t.clientX - rect.left;
  touch.y = t.clientY - rect.top;
  touch.isDown = true;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touch.x = t.clientX - rect.left;
  touch.y = t.clientY - rect.top;
});

canvas.addEventListener('touchend', (e) => {
  touch.isDown = false;
});

// Virtual Joystick
function drawJoystick(centerX, centerY) {
  const radius = 60;
  const knobRadius = 25;
  
  // Base circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
  
  // Knob
  let knobX = centerX;
  let knobY = centerY;
  
  if (touch.isDown) {
    const dx = touch.x - centerX;
    const dy = touch.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < radius) {
      knobX = touch.x;
      knobY = touch.y;
    } else {
      // Clamp to edge
      knobX = centerX + (dx / dist) * radius;
      knobY = centerY + (dy / dist) * radius;
    }
    
    // Output: -1 to 1
    player.vx = (knobX - centerX) / radius;
    player.vy = (knobY - centerY) / radius;
  } else {
    player.vx = 0;
    player.vy = 0;
  }
  
  ctx.beginPath();
  ctx.arc(knobX, knobY, knobRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();
}
          `}
        />
      </Section>

      <Section title="Complete Input Manager" icon="🎮">
        <CodeBlock
          title="Reusable Input Manager"
          language="javascript"
          code={`
class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    
    this.keys = {};
    this.keysJustPressed = {};
    this.keysJustReleased = {};
    
    this.mouse = { x: 0, y: 0, isDown: false };
    this.mouseJustClicked = false;
    
    this.setupKeyboard();
    this.setupMouse();
  }
  
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.keysJustPressed[e.code] = true;
      }
      this.keys[e.code] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.keysJustReleased[e.code] = true;
    });
  }
  
  setupMouse() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mousedown', () => {
      this.mouse.isDown = true;
      this.mouseJustClicked = true;
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });
  }
  
  isKeyDown(code) {
    return !!this.keys[code];
  }
  
  isKeyJustPressed(code) {
    return !!this.keysJustPressed[code];
  }
  
  isMouseDown() {
    return this.mouse.isDown;
  }
  
  wasMouseJustClicked() {
    return this.mouseJustClicked;
  }
  
  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }
  
  // Call at end of each frame
  update() {
    this.keysJustPressed = {};
    this.keysJustReleased = {};
    this.mouseJustClicked = false;
  }
}

// Usage
const input = new InputManager(canvas);

function update(dt) {
  if (input.isKeyDown('ArrowRight')) {
    player.x += player.speed * dt;
  }
  
  if (input.wasMouseJustClicked()) {
    shoot();
  }
}

function gameLoop() {
  update(dt);
  render();
  input.update();  // Reset just-pressed states
  requestAnimationFrame(gameLoop);
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "ทำไมต้องใช้ e.code แทน e.key?",
              options: ["เร็วกว่า", "ไม่ขึ้นกับภาษา keyboard", "ใช้ memory น้อยกว่า", "ใช้ได้ทุก browser"],
              correctIndex: 1,
              explanation: "e.code แสดงตำแหน่งปุ่ม ส่วน e.key แสดงตัวอักษรตามภาษา"
            },
            {
              question: "keysJustPressed ใช้ทำอะไร?",
              options: ["เก็บปุ่มที่กดค้าง", "ตรวจการกดครั้งเดียว (ไม่ซ้ำ)", "นับจำนวนการกด", "บันทึก input"],
              correctIndex: 1,
              explanation: "justPressed ใช้สำหรับ action ที่ต้องการกดครั้งเดียว เช่น ยิง, กระโดด"
            },
            {
              question: "canvas.getBoundingClientRect() ใช้ทำอะไร?",
              options: ["วาดรูป", "หาตำแหน่ง canvas บนหน้าจอ", "ล้าง canvas", "เปลี่ยนขนาด"],
              correctIndex: 1,
              explanation: "ใช้หาตำแหน่ง canvas เพื่อคำนวณ mouse position ที่สัมพันธ์กับ canvas"
            },
            {
              question: "Virtual Joystick ใช้สำหรับอะไร?",
              options: ["Desktop games", "Mobile games", "Console games", "VR games"],
              correctIndex: 1,
              explanation: "Virtual Joystick ใช้แทน physical controls บนหน้าจอมือถือ"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Input Type", "Method", "Use Case"]}
          rows={[
            ["Keyboard (hold)", "keys[code]", "Movement"],
            ["Keyboard (once)", "keysJustPressed[code]", "Jump, Shoot"],
            ["Mouse position", "mousemove event", "Aiming"],
            ["Mouse click", "mousedown/up events", "Shooting, UI"],
            ["Touch", "touch events", "Mobile games"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ keys object เก็บสถานะปุ่มได้",
            "แยก hold กับ justPressed ได้",
            "รับ mouse position บน canvas ได้",
            "สร้าง UI Button ที่ clickable ได้",
            "พร้อมเรียน Collision Detection!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Collision Detection! 💥</strong>
        </TipBox>
      </Section>
    </div>
  );
}
