"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน Three.js</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ 3D graphics concepts",
          "ตั้งค่า Three.js project",
          "Scene, Camera, Renderer",
          "สร้าง 3D objects แรก",
        ]}
      />

      <Section title="Three.js คืออะไร?" icon="🎮">
        <p className="mb-4">
          <strong>Three.js</strong> เป็น JavaScript library ที่ทำให้การทำงานกับ WebGL ง่ายขึ้น:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🌐 Render 3D graphics บน browser</li>
          <li>⚡ ใช้ WebGL (Hardware accelerated)</li>
          <li>🎨 Materials, Lighting, Shadows</li>
          <li>📦 Geometries, Loaders, Controls</li>
          <li>🎬 Animation System</li>
        </ul>
      </Section>

      <Section title="3D Concepts" icon="📐">
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

        <TipBox type="info">
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
          `}
        />
      </Section>

      <Section title="Scene Setup" icon="🎬">
        <Diagram caption="Three.js Structure">
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

        <CodeBlock
          title="Basic Three.js Setup"
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
// 4. Handle resize
// ─────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
          `}
        />
      </Section>

      <Section title="Creating Objects" icon="📦">
        <CodeBlock
          title="Mesh = Geometry + Material"
          language="javascript"
          code={`
// ─────────────────────────────────
// Basic Shapes
// ─────────────────────────────────

// Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 2;
scene.add(sphere);

// Cylinder
const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xf472b6 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.x = -2;
scene.add(cylinder);

// Plane (ground)
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x333333,
  side: THREE.DoubleSide 
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// ─────────────────────────────────
// Object Properties
// ─────────────────────────────────
cube.position.set(0, 0, 0);
cube.rotation.set(0, Math.PI / 4, 0);
cube.scale.set(1, 1, 1);

// Shorthand
cube.position.x = 1;
cube.rotation.y += 0.01;
          `}
        />
      </Section>

      <Section title="Lighting" icon="💡">
        <CodeBlock
          title="Light Types"
          language="javascript"
          code={`
// ─────────────────────────────────
// Ambient Light - global illumination
// ─────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// ─────────────────────────────────
// Directional Light - like sun
// ─────────────────────────────────
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ─────────────────────────────────
// Point Light - like bulb
// ─────────────────────────────────
const pointLight = new THREE.PointLight(0xff6600, 1, 10);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

// ─────────────────────────────────
// Spot Light - like flashlight
// ─────────────────────────────────
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 5, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
scene.add(spotLight);

// Helper to visualize lights
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(lightHelper);
          `}
        />
      </Section>

      <Section title="Animation Loop" icon="🔄">
        <CodeBlock
          title="Render Loop"
          language="javascript"
          code={`
// Animation variables
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // Delta time
  const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  
  // Update objects
  cube.rotation.x += 0.5 * deltaTime;
  cube.rotation.y += 0.5 * deltaTime;
  
  // Floating motion
  sphere.position.y = Math.sin(elapsedTime * 2) * 0.5;
  
  // Render
  renderer.render(scene, camera);
}

// Start animation
animate();
          `}
        />
      </Section>

      <Section title="Complete Example" icon="🎮">
        <CodeBlock
          title="Full Three.js Scene"
          language="javascript"
          code={`
import * as THREE from 'three';

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Player (cube)
const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x4ade80 })
);
player.position.y = 0.5;
player.castShadow = true;
scene.add(player);

// Input
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// Game loop
const clock = new THREE.Clock();
const speed = 5;

function animate() {
  requestAnimationFrame(animate);
  
  const dt = clock.getDelta();
  
  // Movement
  if (keys['KeyW'] || keys['ArrowUp']) player.position.z -= speed * dt;
  if (keys['KeyS'] || keys['ArrowDown']) player.position.z += speed * dt;
  if (keys['KeyA'] || keys['ArrowLeft']) player.position.x -= speed * dt;
  if (keys['KeyD'] || keys['ArrowRight']) player.position.x += speed * dt;
  
  // Camera follows player
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 5;
  camera.lookAt(player.position);
  
  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
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
              question: "THREE.Clock ใช้ทำอะไร?",
              options: ["แสดงเวลา", "คำนวณ delta time สำหรับ animation", "สร้าง timer", "จับเวลา game"],
              correctIndex: 1,
              explanation: "Clock ใช้ getDelta() และ getElapsedTime() สำหรับ frame-independent animation"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Scene", "Container สำหรับ objects ทั้งหมด"],
            ["Camera", "กำหนดมุมมอง (PerspectiveCamera)"],
            ["Renderer", "Render scene ลง canvas"],
            ["Mesh", "Geometry + Material"],
            ["Light", "Ambient, Directional, Point, Spot"],
            ["Clock", "Delta time สำหรับ animation"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Three.js project ได้",
            "เข้าใจ Scene, Camera, Renderer",
            "สร้าง Mesh จาก Geometry + Material ได้",
            "ใช้ Light ต่างๆ ได้",
            "พร้อมเรียน Materials และ Textures!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Materials และ Textures! 🎨</strong>
        </TipBox>
      </Section>
    </div>
  );
}
