"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Babylon.js Setup</h1>

      <Objectives
        items={[
          "ทำความรู้จัก Babylon.js",
          "ตั้งค่า Babylon.js project",
          "เข้าใจ Scene, Engine, Camera",
          "สร้าง 3D scene แรก",
        ]}
      />

      <Section title="Babylon.js คืออะไร?" icon="🔮">
        <p className="mb-4">
          <strong>Babylon.js</strong> เป็น full-featured 3D engine สำหรับ web:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🎮 Built-in physics (Havok, Cannon, Oimo)</li>
          <li>🎬 Advanced animation system</li>
          <li>✨ PBR rendering by default</li>
          <li>🥽 Native XR (VR/AR) support</li>
          <li>🛠️ Node Material Editor (visual shader)</li>
          <li>📦 GLTF loader, asset manager</li>
        </ul>

        <Table
          headers={["", "Three.js", "Babylon.js"]}
          rows={[
            ["Philosophy", "Library (flexible)", "Engine (batteries included)"],
            ["Physics", "External (Cannon, Rapier)", "Built-in (Havok)"],
            ["GUI", "External", "Built-in"],
            ["XR", "Basic", "Full support"],
            ["Learning Curve", "Lower", "Higher"],
          ]}
        />
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Setup Babylon.js Project"
          language="bash"
          code={`
# Create Vite project
npm create vite@latest my-babylon-game -- --template vanilla-ts
cd my-babylon-game

# Install Babylon.js
npm install @babylonjs/core
npm install @babylonjs/loaders      # GLTF/OBJ loaders
npm install @babylonjs/gui          # 2D GUI
npm install @babylonjs/materials    # Additional materials

# Optional: Havok physics
npm install @babylonjs/havok
          `}
        />
      </Section>

      <Section title="Basic Setup" icon="🎬">
        <CodeBlock
          title="Complete Babylon.js Setup"
          language="typescript"
          code={`
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3
} from "@babylonjs/core";

// ─────────────────────────────────
// 1. Get canvas & create engine
// ─────────────────────────────────
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, { 
  preserveDrawingBuffer: true, 
  stencil: true 
});

// ─────────────────────────────────
// 2. Create scene
// ─────────────────────────────────
const scene = new Scene(engine);
scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.15, 1);

// ─────────────────────────────────
// 3. Add camera
// ─────────────────────────────────
const camera = new ArcRotateCamera(
  "camera",
  Math.PI / 2,    // alpha (horizontal rotation)
  Math.PI / 3,    // beta (vertical angle)
  10,             // radius (distance)
  Vector3.Zero(), // target
  scene
);
camera.attachControl(canvas, true);  // Enable mouse control

// ─────────────────────────────────
// 4. Add light
// ─────────────────────────────────
const light = new HemisphericLight(
  "light",
  new Vector3(0, 1, 0),  // direction
  scene
);
light.intensity = 0.8;

// ─────────────────────────────────
// 5. Create shapes
// ─────────────────────────────────
// Ground
const ground = MeshBuilder.CreateGround(
  "ground",
  { width: 10, height: 10 },
  scene
);

// Box
const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
box.position.y = 0.5;

// Sphere
const sphere = MeshBuilder.CreateSphere(
  "sphere",
  { diameter: 1, segments: 32 },
  scene
);
sphere.position = new Vector3(2, 0.5, 0);

// ─────────────────────────────────
// 6. Add materials
// ─────────────────────────────────
const boxMat = new StandardMaterial("boxMat", scene);
boxMat.diffuseColor = new Color3(0.3, 0.8, 0.5);  // green
box.material = boxMat;

const sphereMat = new StandardMaterial("sphereMat", scene);
sphereMat.diffuseColor = new Color3(0.4, 0.6, 1);  // blue
sphere.material = sphereMat;

// ─────────────────────────────────
// 7. Render loop
// ─────────────────────────────────
engine.runRenderLoop(() => {
  box.rotation.y += 0.01;
  scene.render();
});

// ─────────────────────────────────
// 8. Handle resize
// ─────────────────────────────────
window.addEventListener("resize", () => {
  engine.resize();
});
          `}
        />
      </Section>

      <Section title="Camera Types" icon="📷">
        <CodeBlock
          title="Different Cameras"
          language="typescript"
          code={`
import {
  ArcRotateCamera,
  FreeCamera,
  FollowCamera,
  UniversalCamera,
  Vector3
} from "@babylonjs/core";

// ─────────────────────────────────
// ArcRotateCamera (orbit around target)
// ─────────────────────────────────
const arcCam = new ArcRotateCamera(
  "arcCam",
  Math.PI / 2,    // alpha
  Math.PI / 3,    // beta
  10,             // radius
  Vector3.Zero(), // target
  scene
);
arcCam.lowerRadiusLimit = 2;
arcCam.upperRadiusLimit = 20;
arcCam.attachControl(canvas, true);

// ─────────────────────────────────
// FreeCamera (first-person)
// ─────────────────────────────────
const freeCam = new FreeCamera(
  "freeCam",
  new Vector3(0, 2, -10),
  scene
);
freeCam.setTarget(Vector3.Zero());
freeCam.attachControl(canvas, true);

// WASD movement
freeCam.keysUp.push(87);     // W
freeCam.keysDown.push(83);   // S
freeCam.keysLeft.push(65);   // A
freeCam.keysRight.push(68);  // D
freeCam.speed = 0.5;

// ─────────────────────────────────
// FollowCamera (third-person)
// ─────────────────────────────────
const followCam = new FollowCamera(
  "followCam",
  new Vector3(0, 10, -10),
  scene
);
followCam.radius = 10;
followCam.heightOffset = 4;
followCam.rotationOffset = 180;
followCam.lockedTarget = playerMesh;  // target to follow
          `}
        />
      </Section>

      <Section title="Built-in Shapes" icon="🧱">
        <CodeBlock
          title="MeshBuilder Shapes"
          language="typescript"
          code={`
import { MeshBuilder, Vector3 } from "@babylonjs/core";

// Box
const box = MeshBuilder.CreateBox("box", {
  width: 1,
  height: 2,
  depth: 0.5
}, scene);

// Sphere
const sphere = MeshBuilder.CreateSphere("sphere", {
  diameter: 2,
  segments: 32
}, scene);

// Cylinder
const cylinder = MeshBuilder.CreateCylinder("cylinder", {
  height: 3,
  diameterTop: 0.5,
  diameterBottom: 1.5,
  tessellation: 24
}, scene);

// Plane
const plane = MeshBuilder.CreatePlane("plane", {
  width: 5,
  height: 5
}, scene);

// Ground
const ground = MeshBuilder.CreateGround("ground", {
  width: 10,
  height: 10,
  subdivisions: 10
}, scene);

// Torus
const torus = MeshBuilder.CreateTorus("torus", {
  diameter: 2,
  thickness: 0.5,
  tessellation: 32
}, scene);
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Babylon.js ต่างจาก Three.js อย่างไร?",
              options: ["เหมือนกัน", "Babylon มี physics, GUI built-in", "Three.js มีของครบกว่า", "Babylon.js ใช้ได้เฉพาะ iOS"],
              correctIndex: 1,
              explanation: "Babylon.js มา 'batteries included' รวม physics, GUI, XR ในตัว"
            },
            {
              question: "ArcRotateCamera ใช้ทำอะไร?",
              options: ["First-person view", "หมุนรอบ target (orbit camera)", "Follow character", "Bird's eye view"],
              correctIndex: 1,
              explanation: "ArcRotateCamera หมุนรอบจุด target เหมาะกับ model viewer หรือ isometric games"
            },
            {
              question: "engine.runRenderLoop() ทำอะไร?",
              options: ["โหลด assets", "เรียก render ทุก frame", "สร้าง engine", "หยุด game"],
              correctIndex: 1,
              explanation: "runRenderLoop เรียก callback ทุก frame สำหรับ animation และ render"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Engine", "จัดการ rendering และ browser APIs"],
            ["Scene", "Container สำหรับ objects ทั้งหมด"],
            ["Camera", "มุมมอง (Arc, Free, Follow)"],
            ["Light", "แหล่งแสง (Hemispheric, Point, Directional)"],
            ["MeshBuilder", "สร้าง 3D shapes"],
            ["Material", "พื้นผิวของ mesh"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Babylon.js project ได้",
            "เข้าใจ Engine, Scene, Camera",
            "สร้าง 3D objects ได้",
            "ใช้ camera types ต่างๆ ได้",
            "พร้อมเรียน PBR Materials!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: PBR Materials! 🎨</strong>
        </TipBox>
      </Section>
    </div>
  );
}
