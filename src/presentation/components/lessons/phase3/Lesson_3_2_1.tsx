"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">พื้นฐาน Cannon.js Physics</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ physics simulation",
          "ตั้งค่า Cannon.js world",
          "สร้าง physics bodies",
          "Sync กับ Three.js meshes",
        ]}
      />

      <Section title="Cannon.js คืออะไร?" icon="🔬">
        <p className="mb-4">
          <strong>Cannon.js</strong> (หรือ cannon-es) เป็น 3D physics engine:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🎯 Rigid body dynamics</li>
          <li>💥 Collision detection</li>
          <li>🔗 Constraints และ joints</li>
          <li>⚡ Optimized สำหรับ web</li>
        </ul>

        <Diagram caption="Physics Pipeline">
{`
Three.js (Visual)          Cannon.js (Physics)
┌─────────────────┐        ┌─────────────────┐
│     Mesh        │◄───────│     Body        │
│  - position     │  sync  │  - position     │
│  - rotation     │        │  - quaternion   │
│  - geometry     │        │  - shape        │
└─────────────────┘        └─────────────────┘
                                   │
                                   ▼
                           World.step(dt)
                                   │
                                   ▼
                           Physics calculated
`}
        </Diagram>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Setup"
          language="bash"
          code={`
# Install cannon-es (maintained fork)
npm install cannon-es

# TypeScript types included
          `}
        />

        <CodeBlock
          title="Basic Import"
          language="javascript"
          code={`
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
          `}
        />
      </Section>

      <Section title="World Setup" icon="🌍">
        <CodeBlock
          title="Creating Physics World"
          language="javascript"
          code={`
// Create physics world
const world = new CANNON.World();

// Gravity
world.gravity.set(0, -9.82, 0);  // Earth gravity

// Broadphase (collision detection optimization)
world.broadphase = new CANNON.NaiveBroadphase();

// For small/static objects
world.broadphase = new CANNON.SAPBroadphase(world);

// Solver iterations (higher = more accurate but slower)
world.solver.iterations = 10;

// Allow sleeping (performance)
world.allowSleep = true;
          `}
        />
      </Section>

      <Section title="Creating Bodies" icon="📦">
        <CodeBlock
          title="Physics Bodies"
          language="javascript"
          code={`
// ─────────────────────────────────
// Static body (ground)
// ─────────────────────────────────
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
  mass: 0,  // mass = 0 means static
  shape: groundShape
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// ─────────────────────────────────
// Dynamic body (will fall)
// ─────────────────────────────────
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxBody = new CANNON.Body({
  mass: 1,
  shape: boxShape,
  position: new CANNON.Vec3(0, 5, 0)
});
world.addBody(boxBody);

// ─────────────────────────────────
// Sphere
// ─────────────────────────────────
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: sphereShape,
  position: new CANNON.Vec3(2, 10, 0)
});
world.addBody(sphereBody);

// ─────────────────────────────────
// Cylinder
// ─────────────────────────────────
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1, 8);
const cylinderBody = new CANNON.Body({
  mass: 1,
  shape: cylinderShape
});
world.addBody(cylinderBody);

// ─────────────────────────────────
// Body properties
// ─────────────────────────────────
boxBody.velocity.set(0, 0, 0);         // initial velocity
boxBody.angularVelocity.set(0, 0, 0);  // rotation velocity
boxBody.linearDamping = 0.01;          // air resistance
boxBody.angularDamping = 0.01;
boxBody.fixedRotation = true;          // no rotation
          `}
        />
      </Section>

      <Section title="Syncing with Three.js" icon="🔄">
        <CodeBlock
          title="Physics-Visual Sync"
          language="javascript"
          code={`
// Store pairs
const objectsToUpdate = [];

// Create paired objects
function createBox(width, height, depth, position) {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color: 0x4ade80 })
  );
  mesh.position.copy(position);
  mesh.castShadow = true;
  scene.add(mesh);
  
  // Cannon.js body
  const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    position: new CANNON.Vec3(position.x, position.y, position.z)
  });
  world.addBody(body);
  
  // Store pair
  objectsToUpdate.push({ mesh, body });
  
  return { mesh, body };
}

function createSphere(radius, position) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x60a5fa })
  );
  mesh.position.copy(position);
  scene.add(mesh);
  
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(position.x, position.y, position.z)
  });
  world.addBody(body);
  
  objectsToUpdate.push({ mesh, body });
  return { mesh, body };
}

// Animation loop
const clock = new THREE.Clock();
let previousTime = 0;

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  
  // Step physics world
  world.step(1/60, deltaTime, 3);
  
  // Sync all objects
  for (const obj of objectsToUpdate) {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  }
  
  renderer.render(scene, camera);
}

animate();
          `}
        />
      </Section>

      <Section title="Materials & Friction" icon="🧱">
        <CodeBlock
          title="Contact Materials"
          language="javascript"
          code={`
// Create materials
const defaultMaterial = new CANNON.Material('default');
const bouncyMaterial = new CANNON.Material('bouncy');
const iceMaterial = new CANNON.Material('ice');

// Define contact behavior
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.3,
    restitution: 0.3  // bounciness
  }
);
world.addContactMaterial(defaultContactMaterial);

// Bouncy contact
const bouncyContactMaterial = new CANNON.ContactMaterial(
  bouncyMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.9  // very bouncy
  }
);
world.addContactMaterial(bouncyContactMaterial);

// Ice (slippery)
const iceContactMaterial = new CANNON.ContactMaterial(
  iceMaterial,
  defaultMaterial,
  {
    friction: 0.01,  // very low friction
    restitution: 0.2
  }
);
world.addContactMaterial(iceContactMaterial);

// Apply material to body
boxBody.material = bouncyMaterial;
groundBody.material = defaultMaterial;

// Or set world default
world.defaultContactMaterial = defaultContactMaterial;
          `}
        />
      </Section>

      <Section title="Complete Example" icon="🎮">
        <CodeBlock
          title="Falling Boxes Demo"
          language="javascript"
          code={`
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Ground
const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane()
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Objects to sync
const objects = [];

// Create random box
function createRandomBox() {
  const x = (Math.random() - 0.5) * 6;
  const y = 5 + Math.random() * 5;
  const z = (Math.random() - 0.5) * 6;
  
  const size = 0.3 + Math.random() * 0.5;
  
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
  );
  mesh.castShadow = true;
  scene.add(mesh);
  
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(size/2, size/2, size/2)),
    position: new CANNON.Vec3(x, y, z)
  });
  body.angularVelocity.set(
    Math.random() * 5,
    Math.random() * 5,
    Math.random() * 5
  );
  world.addBody(body);
  
  objects.push({ mesh, body });
}

// Spawn boxes
for (let i = 0; i < 50; i++) {
  setTimeout(() => createRandomBox(), i * 100);
}

// Animation
const clock = new THREE.Clock();
let lastTime = 0;

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  const delta = time - lastTime;
  lastTime = time;
  
  world.step(1/60, delta, 3);
  
  for (const obj of objects) {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  }
  
  renderer.render(scene, camera);
}

animate();
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["CANNON.World", "Physics simulation world"],
            ["CANNON.Body", "Physics object"],
            ["CANNON.Shape", "Collision shape (Box, Sphere, etc)"],
            ["CANNON.Material", "Friction & bounce properties"],
            ["world.step()", "Advance simulation"],
            ["mass: 0", "Static object"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Collision Events และ Triggers! 💥</strong>
        </TipBox>
      </Section>
    </div>
  );
}
