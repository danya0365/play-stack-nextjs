"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Lighting และ Shadows</h1>

      <Objectives
        items={[
          "เข้าใจ Light types ต่างๆ",
          "ตั้งค่า Shadows",
          "ใช้ Light helpers",
          "Optimize lighting performance",
        ]}
      />

      <Section title="Light Types" icon="💡">
        <Diagram caption="Light Types Comparison">
{`
  Ambient         Directional        Point           Spot
  ░░░░░░░░       │││││││││         ╱│╲              ╲│╱
  ░░░░░░░░       │││││││││        ╱─┼─╲              │
  ░░░░░░░░       ▼▼▼▼▼▼▼▼▼       ╱──┼──╲             │
  ░░░░░░░░                      ───(○)───       ────(○)────
                                  ╲──┼──╱         ╲  │  ╱
  Everywhere     Like sun          ╲─┼─╱          (cone)
  No direction   Parallel rays     ╲│╱
                                   All directions
`}
        </Diagram>

        <CodeBlock
          title="Light Types"
          language="javascript"
          code={`
import * as THREE from 'three';

// ─────────────────────────────────
// Ambient Light - global illumination
// ─────────────────────────────────
const ambientLight = new THREE.AmbientLight(
  0xffffff,  // color
  0.5        // intensity
);
scene.add(ambientLight);

// ─────────────────────────────────
// Directional Light - like sun
// ─────────────────────────────────
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// ─────────────────────────────────
// Point Light - like bulb
// ─────────────────────────────────
const pointLight = new THREE.PointLight(
  0xff6600,  // color
  1,         // intensity
  10,        // distance (0 = no limit)
  2          // decay
);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

// ─────────────────────────────────
// Spot Light - like flashlight
// ─────────────────────────────────
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 5, 0);
spotLight.angle = Math.PI / 6;       // cone angle
spotLight.penumbra = 0.5;            // soft edges
spotLight.decay = 2;
spotLight.distance = 20;
scene.add(spotLight);

// ─────────────────────────────────
// Hemisphere Light - sky + ground
// ─────────────────────────────────
const hemiLight = new THREE.HemisphereLight(
  0x87ceeb,  // sky color
  0x362312,  // ground color
  0.5        // intensity
);
scene.add(hemiLight);
          `}
        />
      </Section>

      <Section title="Setting Up Shadows" icon="🌑">
        <CodeBlock
          title="Shadow Setup"
          language="javascript"
          code={`
// ─────────────────────────────────
// 1. Enable shadows on renderer
// ─────────────────────────────────
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ─────────────────────────────────
// 2. Enable shadows on light
// ─────────────────────────────────
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;

// Shadow quality
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// Shadow camera (area that casts shadows)
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

scene.add(directionalLight);

// ─────────────────────────────────
// 3. Objects cast shadows
// ─────────────────────────────────
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x4ade80 })
);
cube.castShadow = true;      // casts shadow
scene.add(cube);

// ─────────────────────────────────
// 4. Objects receive shadows
// ─────────────────────────────────
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;  // receives shadow
scene.add(ground);
          `}
        />

        <TipBox type="warning">
          <strong>Shadows are expensive!</strong> 
          ใช้เฉพาะ objects สำคัญ และ limit shadow map size
        </TipBox>
      </Section>

      <Section title="Light Helpers" icon="🔧">
        <CodeBlock
          title="Visualize Lights"
          language="javascript"
          code={`
// ─────────────────────────────────
// Directional Light Helper
// ─────────────────────────────────
const dirLightHelper = new THREE.DirectionalLightHelper(
  directionalLight, 
  5  // size
);
scene.add(dirLightHelper);

// Shadow camera helper
const shadowHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(shadowHelper);

// ─────────────────────────────────
// Point Light Helper
// ─────────────────────────────────
const pointLightHelper = new THREE.PointLightHelper(
  pointLight, 
  0.5  // size
);
scene.add(pointLightHelper);

// ─────────────────────────────────
// Spot Light Helper
// ─────────────────────────────────
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Update helper when light changes
spotLight.angle = Math.PI / 4;
spotLightHelper.update();
          `}
        />
      </Section>

      <Section title="Complete Example" icon="🎮">
        <CodeBlock
          title="Scene with Multiple Lights"
          language="javascript"
          code={`
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// ─────────────────────────────────
// Lights
// ─────────────────────────────────
// Ambient (base light)
scene.add(new THREE.AmbientLight(0x404040, 0.5));

// Main directional light (sun)
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 30;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;
scene.add(sunLight);

// Point light (lamp)
const lampLight = new THREE.PointLight(0xff9900, 2, 10);
lampLight.position.set(-3, 2, 0);
lampLight.castShadow = true;
scene.add(lampLight);

// ─────────────────────────────────
// Objects
// ─────────────────────────────────
// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Cubes
for (let i = 0; i < 5; i++) {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff,
      roughness: 0.5,
      metalness: 0.2
    })
  );
  cube.position.set(
    (Math.random() - 0.5) * 8,
    0.5,
    (Math.random() - 0.5) * 8
  );
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
}

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ 
    color: 0x4ade80,
    roughness: 0.2,
    metalness: 0.8
  })
);
sphere.position.set(0, 1, 0);
sphere.castShadow = true;
scene.add(sphere);

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Ambient Light มีลักษณะอย่างไร?",
              options: ["ส่องจากทิศทางเดียว", "ส่องสว่างทั่วทั้ง scene เท่าๆ กัน", "เป็น cone", "สะท้อนจาก objects"],
              correctIndex: 1,
              explanation: "Ambient light ให้แสงพื้นฐานทั้ง scene ไม่มี direction"
            },
            {
              question: "ต้องทำอะไรบ้างเพื่อให้เห็น shadows?",
              options: ["แค่เพิ่ม light", "Enable shadow บน renderer, light, และ objects", "ใช้ MeshBasicMaterial", "เพิ่ม fog"],
              correctIndex: 1,
              explanation: "ต้อง enable shadow ที่ renderer, light.castShadow, mesh.castShadow/receiveShadow"
            },
            {
              question: "SpotLight penumbra คืออะไร?",
              options: ["ความสว่าง", "ความนุ่มของขอบ cone", "ระยะทาง", "มุม"],
              correctIndex: 1,
              explanation: "penumbra ทำให้ขอบของ spotlight นุ่มลง (0-1)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Light Type", "Use Case"]}
          rows={[
            ["Ambient", "Base illumination"],
            ["Directional", "Sun, main light"],
            ["Point", "Lamps, fires, effects"],
            ["Spot", "Flashlights, car lights"],
            ["Hemisphere", "Realistic outdoor ambient"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ light types ต่างๆ ได้",
            "ตั้งค่า shadows ได้",
            "ใช้ light helpers debug ได้",
            "Optimize shadow quality ได้",
            "พร้อมเรียน 3D Physics!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: 3D Physics! ⚡</strong>
        </TipBox>
      </Section>
    </div>
  );
}
