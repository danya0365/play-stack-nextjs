"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน 3D และ Three.js</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ 3D graphics concepts",
          "ตั้งค่า Three.js project",
          "เข้าใจ Scene, Camera, Renderer",
          "สร้าง 3D objects แรก",
        ]}
      />

      <Section title="Three.js คืออะไร?" icon="🧊">
        <p className="mb-4">
          <strong>Three.js</strong> เป็น JavaScript library สำหรับ 3D graphics บน web:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🌐 Render 3D graphics บน browser</li>
          <li>⚡ ใช้ WebGL (Hardware accelerated)</li>
          <li>🎨 Materials, Lighting, Shadows</li>
          <li>📦 Geometries, Loaders, Controls</li>
          <li>🎬 Animation System</li>
        </ul>

        <TipBox type="info">
          <strong>Why Three.js?</strong> เป็น 3D library ที่ popular ที่สุดสำหรับ web
          มี community ใหญ่และ documentation ดี
        </TipBox>
      </Section>

      <Section title="3D Coordinate System" icon="📐">
        <Diagram caption="3D Coordinate System">
{`
        Y (up)
        │
        │
        │
        └──────── X (right)
       ╱
      ╱
     Z (towards you)

  • Position: (x, y, z)
  • Rotation: (pitch, yaw, roll)
  • Scale: (sx, sy, sz)
`}
        </Diagram>

        <TipBox type="tip">
          <strong>Right-hand rule:</strong> นิ้วชี้ไป +X, นิ้วกลางไป +Y, นิ้วโป้งชี้มาหา +Z
        </TipBox>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Setup Three.js Project"
          language="bash"
          code={`
# Create project with Vite
npm create vite@latest my-3d-game -- --template vanilla
cd my-3d-game

# Install Three.js
npm install three

# Optional: TypeScript types
npm install -D @types/three

# Start development
npm run dev
          `}
        />
      </Section>

      <Section title="Three.js Components" icon="🧱">
        <Diagram caption="Three.js Core Components">
{`
┌─────────────────────────────────────────┐
│              RENDERER                    │
│  ┌─────────────────────────────────┐    │
│  │           SCENE                  │    │
│  │  ┌─────────┐ ┌─────────┐        │    │
│  │  │  MESH   │ │  LIGHT  │        │    │
│  │  │ (geo +  │ │         │        │    │
│  │  │  mat)   │ │         │        │    │
│  │  └─────────┘ └─────────┘        │    │
│  │                                  │    │
│  │  ┌─────────┐                    │    │
│  │  │ CAMERA  │  ← Looking at scene│    │
│  │  └─────────┘                    │    │
│  └─────────────────────────────────┘    │
│                  ↓ render               │
│  ┌─────────────────────────────────┐    │
│  │         CANVAS (DOM)             │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
`}
        </Diagram>

        <Table
          headers={["Component", "คำอธิบาย"]}
          rows={[
            ["Scene", "Container สำหรับ objects ทั้งหมด"],
            ["Camera", "กำหนดมุมมอง (Perspective/Orthographic)"],
            ["Renderer", "วาด scene ลงบน canvas"],
            ["Mesh", "Object 3D = Geometry + Material"],
            ["Light", "แสงสว่าง เช่น Ambient, Directional, Point"],
          ]}
        />
      </Section>

      <Section title="Basic Setup" icon="🎬">
        <CodeBlock
          title="Complete Three.js Setup"
          language="javascript"
          code={`
import * as THREE from 'three';

// ─────────────────────────────────
// 1. Scene - container for everything
// ─────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// ─────────────────────────────────
// 2. Camera - what we see
// ─────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  75,                                    // FOV (degrees)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                   // Near clipping plane
  1000                                   // Far clipping plane
);
camera.position.z = 5;  // Move camera back

// ─────────────────────────────────
// 3. Renderer - draws to canvas
// ─────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ─────────────────────────────────
// 4. Create a cube
// ─────────────────────────────────
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// ─────────────────────────────────
// 5. Add light
// ─────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// ─────────────────────────────────
// 6. Animation loop
// ─────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();

// ─────────────────────────────────
// 7. Handle resize
// ─────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
          `}
        />
      </Section>

      <Section title="Camera Types" icon="📷">
        <CodeBlock
          title="Perspective vs Orthographic"
          language="javascript"
          code={`
// ─────────────────────────────────
// Perspective Camera (most games)
// ─────────────────────────────────
// Objects far away appear smaller
const perspCamera = new THREE.PerspectiveCamera(
  75,      // FOV: field of view (degrees)
  16/9,    // Aspect ratio
  0.1,     // Near: objects closer than this are invisible
  1000     // Far: objects further than this are invisible
);

// ─────────────────────────────────
// Orthographic Camera (2D-like, isometric)
// ─────────────────────────────────
// No perspective, objects stay same size
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;
const orthoCamera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,  // Left
  frustumSize * aspect / 2,   // Right
  frustumSize / 2,            // Top
  frustumSize / -2,           // Bottom
  0.1,                        // Near
  1000                        // Far
);
          `}
        />
      </Section>

      <Section title="Basic Objects" icon="📦">
        <CodeBlock
          title="Creating 3D Objects"
          language="javascript"
          code={`
// ─────────────────────────────────
// Cube
// ─────────────────────────────────
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),  // width, height, depth
  new THREE.MeshStandardMaterial({ color: 0x4ade80 })
);
scene.add(cube);

// ─────────────────────────────────
// Sphere
// ─────────────────────────────────
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),  // radius, widthSegments, heightSegments
  new THREE.MeshStandardMaterial({ color: 0x60a5fa })
);
sphere.position.x = 2;
scene.add(sphere);

// ─────────────────────────────────
// Plane (ground)
// ─────────────────────────────────
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    side: THREE.DoubleSide 
  })
);
plane.rotation.x = -Math.PI / 2;  // Rotate to be horizontal
plane.position.y = -1;
scene.add(plane);

// ─────────────────────────────────
// Object Transform
// ─────────────────────────────────
cube.position.set(0, 0, 0);     // x, y, z
cube.rotation.set(0, Math.PI/4, 0); // radians
cube.scale.set(1, 1, 1);        // scale multiplier
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Three.js Scene คืออะไร?",
              options: ["หน้าจอ", "Container สำหรับ objects ทั้งหมด", "กล้อง", "แสง"],
              correctIndex: 1,
              explanation: "Scene เป็น container ที่เก็บ objects, lights, cameras ทั้งหมด"
            },
            {
              question: "PerspectiveCamera FOV คืออะไร?",
              options: ["Frame Per Second", "Field of View (มุมมอง)", "Forward Vector", "Focus Distance"],
              correctIndex: 1,
              explanation: "FOV = Field of View กำหนดว่ากล้องจะเห็นกว้างแค่ไหน (หน่วย degrees)"
            },
            {
              question: "Mesh ประกอบด้วยอะไรบ้าง?",
              options: ["Scene + Camera", "Geometry + Material", "Light + Shadow", "Renderer + Canvas"],
              correctIndex: 1,
              explanation: "Mesh = Geometry (รูปร่าง) + Material (พื้นผิว/สี)"
            },
            {
              question: "requestAnimationFrame ใช้ทำอะไร?",
              options: ["โหลดรูป", "สร้าง animation loop ที่ sync กับ display refresh rate", "สร้าง geometry", "เปลี่ยน material"],
              correctIndex: 1,
              explanation: "requestAnimationFrame เรียก callback ก่อน browser repaint (~60fps)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Scene", "Container สำหรับ objects ทั้งหมด"],
            ["Camera", "กำหนดมุมมอง (Perspective/Orthographic)"],
            ["Renderer", "Render scene ลง canvas"],
            ["Mesh", "Geometry + Material"],
            ["Geometry", "รูปร่าง (Box, Sphere, Plane...)"],
            ["Material", "พื้นผิว (สี, texture, การสะท้อนแสง)"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Three.js project ได้",
            "เข้าใจ Scene, Camera, Renderer",
            "สร้าง basic 3D objects ได้",
            "ใช้ animation loop ได้",
            "พร้อมเรียน Geometry & Materials!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Geometry & Materials! 🎨</strong>
        </TipBox>
      </Section>
    </div>
  );
}
