"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_3_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">PlayCanvas Editor</h1>

      <Objectives
        items={[
          "ทำความรู้จัก PlayCanvas",
          "ใช้งาน Cloud Editor",
          "สร้าง entities และ components",
          "Publish เกม",
        ]}
      />

      <Section title="PlayCanvas คืออะไร?" icon="☁️">
        <Table
          headers={["Feature", "Description"]}
          rows={[
            ["Cloud Editor", "ทำงานผ่าน browser ไม่ต้องติดตั้ง"],
            ["Collaborative", "ทำงานร่วมกันได้ real-time"],
            ["Entity-Component", "Architecture คล้าย Unity"],
            ["Mobile Optimized", "ออกแบบมาให้ทำงานบน mobile ได้ดี"],
            ["Free Tier", "ใช้งานฟรีได้"],
          ]}
        />

        <TipBox type="info">
          <strong>PlayCanvas vs Others:</strong> 
          เหมาะสำหรับ browser-based editor และทำ mobile games
        </TipBox>
      </Section>

      <Section title="Getting Started" icon="🚀">
        <CodeBlock
          title="Setup"
          language="text"
          code={`
1. ไปที่ https://playcanvas.com
2. สร้าง account
3. New Project → Blank Project
4. เปิด Editor
          `}
        />

        <TipBox type="tip">
          <strong>Editor Layout:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Left: Hierarchy (entities tree)</li>
            <li>• Middle: Viewport (3D scene)</li>
            <li>• Right: Inspector (properties)</li>
            <li>• Bottom: Assets panel</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Entities & Components" icon="📦">
        <CodeBlock
          title="Entity Structure"
          language="text"
          code={`
Entity (like GameObject)
├── Transform (always present)
│   ├── Position
│   ├── Rotation
│   └── Scale
│
├── Components (attached behaviors)
│   ├── Model (3D mesh)
│   ├── Light
│   ├── Camera
│   ├── Rigidbody
│   ├── Collision
│   ├── Script
│   └── etc.
│
└── Children (nested entities)
          `}
        />

        <CodeBlock
          title="Script Component Example"
          language="javascript"
          code={`
var RotateScript = pc.createScript('rotate');

// Attributes (inspector properties)
RotateScript.attributes.add('speed', {
  type: 'number',
  default: 10,
  title: 'Rotation Speed'
});

// Initialize
RotateScript.prototype.initialize = function() {
  console.log('Script initialized!');
};

// Update (called every frame)
RotateScript.prototype.update = function(dt) {
  this.entity.rotate(0, this.speed * dt, 0);
};
          `}
        />
      </Section>

      <Section title="Working with Assets" icon="📁">
        <CodeBlock
          title="Load and Use Assets"
          language="javascript"
          code={`
// ─────────────────────────────────
// Load Model from assets
// ─────────────────────────────────
var LoadModel = pc.createScript('loadModel');

LoadModel.attributes.add('modelAsset', {
  type: 'asset',
  assetType: 'model',
  title: 'Model'
});

LoadModel.prototype.initialize = function() {
  if (this.modelAsset) {
    this.entity.model.asset = this.modelAsset;
  }
};

// ─────────────────────────────────
// Load Texture
// ─────────────────────────────────
var ApplyTexture = pc.createScript('applyTexture');

ApplyTexture.attributes.add('textureAsset', {
  type: 'asset',
  assetType: 'texture'
});

ApplyTexture.prototype.initialize = function() {
  var material = this.entity.model.material;
  material.diffuseMap = this.textureAsset.resource;
  material.update();
};
          `}
        />
      </Section>

      <Section title="Input Handling" icon="🎮">
        <CodeBlock
          title="Keyboard & Mouse"
          language="javascript"
          code={`
var PlayerController = pc.createScript('playerController');

PlayerController.attributes.add('speed', {
  type: 'number',
  default: 5
});

PlayerController.prototype.update = function(dt) {
  var app = this.app;
  var keyboard = app.keyboard;
  var direction = new pc.Vec3();
  
  // ─────────────────────────────────
  // Keyboard input
  // ─────────────────────────────────
  if (keyboard.isPressed(pc.KEY_W)) {
    direction.z -= 1;
  }
  if (keyboard.isPressed(pc.KEY_S)) {
    direction.z += 1;
  }
  if (keyboard.isPressed(pc.KEY_A)) {
    direction.x -= 1;
  }
  if (keyboard.isPressed(pc.KEY_D)) {
    direction.x += 1;
  }
  
  // Normalize and apply movement
  if (direction.length() > 0) {
    direction.normalize();
    direction.mulScalar(this.speed * dt);
    this.entity.translate(direction);
  }
  
  // ─────────────────────────────────
  // Mouse input
  // ─────────────────────────────────
  if (app.mouse.wasPressed(pc.MOUSEBUTTON_LEFT)) {
    this.shoot();
  }
};

PlayerController.prototype.shoot = function() {
  console.log('Shooting!');
  // Create bullet, play sound, etc.
};
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "PlayCanvas Editor ทำงานที่ไหน?",
              options: ["ต้องติดตั้งในเครื่อง", "ทำงานบน browser (cloud)", "มือถือเท่านั้น", "Command line"],
              correctIndex: 1,
              explanation: "PlayCanvas Editor ทำงานบน browser ไม่ต้องติดตั้งอะไร"
            },
            {
              question: "pc.createScript() ใช้ทำอะไร?",
              options: ["สร้าง entity", "สร้าง script component", "สร้าง material", "สร้าง light"],
              correctIndex: 1,
              explanation: "pc.createScript สร้าง script ที่ attach กับ entity ได้"
            },
            {
              question: "attributes.add() ใช้ทำอะไร?",
              options: ["เพิ่ม entity", "สร้าง properties ที่แก้ไขได้ใน Inspector", "เพิ่ม component", "โหลด asset"],
              correctIndex: 1,
              explanation: "attributes.add สร้าง properties ที่แสดงใน Editor Inspector"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Entity", "Object ใน scene (เหมือน GameObject)"],
            ["Component", "Behavior ที่ attach บน entity"],
            ["Script", "Custom logic เขียนด้วย JavaScript"],
            ["Attributes", "Properties ที่แก้ไขได้ใน Editor"],
            ["Assets", "Resources (models, textures, audio)"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ PlayCanvas Editor ได้",
            "สร้าง entities และ components ได้",
            "เขียน scripts ได้",
            "จัดการ input ได้",
            "พร้อมเรียน Advanced Scripting!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: PlayCanvas Scripting! 📝</strong>
        </TipBox>
      </Section>
    </div>
  );
}
