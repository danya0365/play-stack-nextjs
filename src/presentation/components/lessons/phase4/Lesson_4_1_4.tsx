"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">3D Physics ด้วย Cannon.js</h1>

      <Objectives
        items={[
          "ตั้งค่า Cannon.js physics world",
          "สร้าง rigid bodies",
          "ใช้ constraints และ joints",
          "Sync physics กับ Three.js",
        ]}
      />

      <Section title="Physics Engine Overview" icon="⚡">
        <Table
          headers={["Engine", "Description"]}
          rows={[
            ["Cannon.js", "Lightweight, pure JS, easy to use"],
            ["Cannon-es", "Modern fork of Cannon.js (recommended)"],
            ["Rapier", "Rust-based, very fast, WASM"],
            ["Ammo.js", "Bullet physics port, full-featured"],
          ]}
        />

        <CodeBlock
          title="Installation"
          language="bash"
          code={`
# Cannon-es (recommended)
npm install cannon-es

# Types for TypeScript
npm install -D @types/cannon
          `}
        />
      </Section>

      <Section title="Basic Setup" icon="🎬">
        <CodeBlock
          title="Physics World Setup"
          language="javascript"
          code={`
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// ─────────────────────────────────
// Three.js Setup
// ─────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ─────────────────────────────────
// Cannon.js Physics World
// ─────────────────────────────────
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)  // Earth gravity
});

world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;  // Optimize static objects

// ─────────────────────────────────
// Physics timestep
// ─────────────────────────────────
const fixedTimeStep = 1.0 / 60.0;
const maxSubSteps = 3;
let lastTime = 0;

function animate(time) {
  requestAnimationFrame(animate);
  
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  
  // Step physics world
  world.step(fixedTimeStep, dt, maxSubSteps);
  
  // Sync Three.js with physics (see next section)
  
  renderer.render(scene, camera);
}

animate(0);
          `}
        />
      </Section>

      <Section title="Creating Bodies" icon="📦">
        <CodeBlock
          title="Rigid Bodies"
          language="javascript"
          code={`
// ─────────────────────────────────
// Ground (static body)
// ─────────────────────────────────
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
  mass: 0,  // mass = 0 means static
  shape: groundShape,
  material: new CANNON.Material('ground')
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Three.js ground mesh
const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// ─────────────────────────────────
// Box (dynamic body)
// ─────────────────────────────────
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxBody = new CANNON.Body({
  mass: 1,
  shape: boxShape,
  position: new CANNON.Vec3(0, 5, 0),
  material: new CANNON.Material('box')
});
world.addBody(boxBody);

// Three.js box mesh
const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x4ade80 })
);
boxMesh.castShadow = true;
scene.add(boxMesh);

// ─────────────────────────────────
// Sphere (dynamic body)
// ─────────────────────────────────
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 2,
  shape: sphereShape,
  position: new CANNON.Vec3(2, 5, 0)
});
world.addBody(sphereBody);

// Three.js sphere mesh
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x60a5fa })
);
sphereMesh.castShadow = true;
scene.add(sphereMesh);
          `}
        />
      </Section>

      <Section title="Syncing Physics with Rendering" icon="🔄">
        <CodeBlock
          title="Sync Objects"
          language="javascript"
          code={`
// Store pairs of body-mesh
const objects = [
  { body: boxBody, mesh: boxMesh },
  { body: sphereBody, mesh: sphereMesh }
];

function animate(time) {
  requestAnimationFrame(animate);
  
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  
  // Step physics
  world.step(fixedTimeStep, dt, maxSubSteps);
  
  // ─────────────────────────────────
  // Sync meshes to physics bodies
  // ─────────────────────────────────
  for (const obj of objects) {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  }
  
  renderer.render(scene, camera);
}

// Alternative: Use Cannon's postStep event
world.addEventListener('postStep', () => {
  objects.forEach(obj => {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  });
});
          `}
        />
      </Section>

      <Section title="Materials & Collisions" icon="💥">
        <CodeBlock
          title="Physics Materials"
          language="javascript"
          code={`
// ─────────────────────────────────
// Materials define friction & bounce
// ─────────────────────────────────
const groundMaterial = new CANNON.Material('ground');
const boxMaterial = new CANNON.Material('box');

// Contact material between ground and box
const groundBoxContactMaterial = new CANNON.ContactMaterial(
  groundMaterial,
  boxMaterial,
  {
    friction: 0.3,        // 0 = icy, 1 = sticky
    restitution: 0.5      // 0 = no bounce, 1 = super bouncy
  }
);
world.addContactMaterial(groundBoxContactMaterial);

// Default material for everything else
world.defaultContactMaterial.friction = 0.3;
world.defaultContactMaterial.restitution = 0.3;

// ─────────────────────────────────
// Collision Events
// ─────────────────────────────────
boxBody.addEventListener('collide', (event) => {
  const contact = event.contact;
  const impactVelocity = contact.getImpactVelocityAlongNormal();
  
  if (Math.abs(impactVelocity) > 1) {
    console.log('Strong collision!', impactVelocity);
    playImpactSound(impactVelocity);
  }
});
          `}
        />
      </Section>

      <Section title="Applying Forces" icon="🚀">
        <CodeBlock
          title="Forces & Impulses"
          language="javascript"
          code={`
// ─────────────────────────────────
// Apply force (continuous, like engines)
// ─────────────────────────────────
boxBody.applyForce(
  new CANNON.Vec3(0, 100, 0),    // Force vector
  boxBody.position               // Point of application
);

// ─────────────────────────────────
// Apply impulse (instant, like explosions)
// ─────────────────────────────────
boxBody.applyImpulse(
  new CANNON.Vec3(0, 10, 0),     // Impulse vector
  boxBody.position               // Point of application
);

// ─────────────────────────────────
// Player movement example
// ─────────────────────────────────
const moveSpeed = 10;

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'w':
      playerBody.applyForce(new CANNON.Vec3(0, 0, -moveSpeed), playerBody.position);
      break;
    case 's':
      playerBody.applyForce(new CANNON.Vec3(0, 0, moveSpeed), playerBody.position);
      break;
    case ' ':
      // Jump (only if grounded)
      if (isGrounded(playerBody)) {
        playerBody.applyImpulse(new CANNON.Vec3(0, 5, 0), playerBody.position);
      }
      break;
  }
});

function isGrounded(body) {
  // Simple ground check
  return body.position.y < 1;
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "mass: 0 หมายความว่าอะไร?",
              options: ["เคลื่อนที่เร็วมาก", "เป็น static body (ไม่เคลื่อนที่)", "โปร่งใส", "ไม่มี collision"],
              correctIndex: 1,
              explanation: "mass = 0 ทำให้ body เป็น static ไม่ถูก forces กระทบ"
            },
            {
              question: "restitution คืออะไร?",
              options: ["แรงเสียดทาน", "ความสามารถในการกระดอน (bounce)", "มวล", "ความเร็ว"],
              correctIndex: 1,
              explanation: "restitution 0 = ไม่กระดอน, 1 = กระดอนเต็มที่"
            },
            {
              question: "ความแตกต่างระหว่าง applyForce และ applyImpulse?",
              options: ["ไม่ต่าง", "Force ต่อเนื่อง, Impulse ทันที", "Impulse ต่อเนื่อง, Force ทันที", "Force ใช้กับ static เท่านั้น"],
              correctIndex: 1,
              explanation: "Force ใช้ต่อเนื่อง (engine), Impulse ใช้ทันที (explosion, jump)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["World", "Physics simulation container"],
            ["Body", "Physics object (mass, shape)"],
            ["Shape", "Collision shape (Box, Sphere, Plane)"],
            ["Material", "Physics properties (friction, bounce)"],
            ["Force", "Continuous push (engines)"],
            ["Impulse", "Instant push (jumps, explosions)"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า physics world ได้",
            "สร้าง rigid bodies ได้",
            "Sync physics กับ Three.js ได้",
            "ใช้ materials และ collisions ได้",
            "พร้อมเรียน Babylon.js!"
          ]}
        />

        <TipBox type="success">
          <strong>Module ต่อไป: Babylon.js! 🔮</strong>
        </TipBox>
      </Section>
    </div>
  );
}
