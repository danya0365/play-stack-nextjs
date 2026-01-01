"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Physics Engine ใน Babylon.js</h1>

      <Objectives
        items={[
          "ตั้งค่า physics engine ใน Babylon.js",
          "สร้าง physics impostors",
          "ใช้ forces, impulses, และ constraints",
          "จัดการ collision events",
        ]}
      />

      <Section title="Physics Engines" icon="⚡">
        <Table
          headers={["Engine", "Description"]}
          rows={[
            ["Havok", "Official, high performance (recommended)"],
            ["Cannon.js", "Pure JS, easy, legacy"],
            ["Oimo.js", "Lightweight, fast"],
            ["Ammo.js", "Bullet physics port, full-featured"],
          ]}
        />

        <CodeBlock
          title="Havok Physics Setup"
          language="typescript"
          code={`
import { HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

// ─────────────────────────────────
// Initialize Havok
// ─────────────────────────────────
async function initPhysics() {
  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);
  
  scene.enablePhysics(
    new Vector3(0, -9.81, 0),  // gravity
    havokPlugin
  );
}

await initPhysics();
          `}
        />
      </Section>

      <Section title="Physics Aggregates" icon="📦">
        <CodeBlock
          title="Creating Physics Bodies"
          language="typescript"
          code={`
import { 
  PhysicsAggregate, 
  PhysicsShapeType,
  MeshBuilder,
  Vector3
} from "@babylonjs/core";

// ─────────────────────────────────
// Ground (static)
// ─────────────────────────────────
const ground = MeshBuilder.CreateGround("ground", {
  width: 20,
  height: 20
}, scene);

new PhysicsAggregate(
  ground,
  PhysicsShapeType.BOX,
  { mass: 0 },  // mass 0 = static
  scene
);

// ─────────────────────────────────
// Box (dynamic)
// ─────────────────────────────────
const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
box.position.y = 5;

const boxAggregate = new PhysicsAggregate(
  box,
  PhysicsShapeType.BOX,
  { 
    mass: 1,
    friction: 0.5,
    restitution: 0.5  // bounciness
  },
  scene
);

// ─────────────────────────────────
// Sphere (dynamic)
// ─────────────────────────────────
const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
sphere.position = new Vector3(2, 5, 0);

const sphereAggregate = new PhysicsAggregate(
  sphere,
  PhysicsShapeType.SPHERE,
  { mass: 2, restitution: 0.8 },
  scene
);

// ─────────────────────────────────
// Shape Types
// ─────────────────────────────────
// PhysicsShapeType.BOX
// PhysicsShapeType.SPHERE
// PhysicsShapeType.CAPSULE
// PhysicsShapeType.CYLINDER
// PhysicsShapeType.CONVEX_HULL
// PhysicsShapeType.MESH (accurate but slow)
          `}
        />
      </Section>

      <Section title="Forces & Impulses" icon="🚀">
        <CodeBlock
          title="Applying Forces"
          language="typescript"
          code={`
// Access the physics body
const body = boxAggregate.body;

// ─────────────────────────────────
// Apply Force (continuous)
// ─────────────────────────────────
body.applyForce(
  new Vector3(0, 100, 0),    // force vector
  box.position               // point of application
);

// ─────────────────────────────────
// Apply Impulse (instant)
// ─────────────────────────────────
body.applyImpulse(
  new Vector3(0, 10, 0),     // impulse vector
  box.position               // point of application
);

// ─────────────────────────────────
// Set Velocity
// ─────────────────────────────────
body.setLinearVelocity(new Vector3(5, 0, 0));
body.setAngularVelocity(new Vector3(0, 3, 0));

// Get Velocity
const vel = body.getLinearVelocity();
console.log("Speed:", vel.length());

// ─────────────────────────────────
// Player Movement Example
// ─────────────────────────────────
document.addEventListener("keydown", (e) => {
  const force = 50;
  const body = playerAggregate.body;
  
  switch(e.key) {
    case "w":
      body.applyForce(new Vector3(0, 0, force), player.position);
      break;
    case "s":
      body.applyForce(new Vector3(0, 0, -force), player.position);
      break;
    case " ":
      body.applyImpulse(new Vector3(0, 5, 0), player.position);
      break;
  }
});
          `}
        />
      </Section>

      <Section title="Collision Events" icon="💥">
        <CodeBlock
          title="Detect Collisions"
          language="typescript"
          code={`
// ─────────────────────────────────
// Collision Observable
// ─────────────────────────────────
boxAggregate.body.setCollisionCallbackEnabled(true);

const observable = boxAggregate.body.getCollisionObservable();

observable.add((event) => {
  const { collidedAgainst, point, normal } = event;
  
  console.log("Collision at:", point);
  console.log("With:", collidedAgainst.transformNode.name);
  
  // Calculate impact force
  const velocity = boxAggregate.body.getLinearVelocity();
  const impact = velocity.length();
  
  if (impact > 5) {
    playImpactSound();
    spawnParticles(point);
  }
});

// ─────────────────────────────────
// Trigger Volume (no physics response)
// ─────────────────────────────────
const trigger = MeshBuilder.CreateBox("trigger", { size: 2 }, scene);
trigger.visibility = 0.3;

const triggerAggregate = new PhysicsAggregate(
  trigger,
  PhysicsShapeType.BOX,
  { mass: 0, isTrigger: true },
  scene
);

triggerAggregate.body.getCollisionObservable().add((event) => {
  console.log("Entered trigger zone!");
  // Collect item, damage player, etc.
});
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "mass: 0 หมายความว่าอะไร?",
              options: ["เคลื่อนที่เร็วมาก", "เป็น static body", "ไม่มี collision", "โปร่งใส"],
              correctIndex: 1,
              explanation: "mass = 0 ทำให้ body ไม่เคลื่อนที่ (static)"
            },
            {
              question: "restitution คืออะไร?",
              options: ["แรงเสียดทาน", "ความสามารถในการกระดอน", "มวล", "แรงโน้มถ่วง"],
              correctIndex: 1,
              explanation: "restitution 0 = ไม่กระดอน, 1 = กระดอนเต็มที่"
            },
            {
              question: "ความแตกต่างระหว่าง applyForce และ applyImpulse?",
              options: ["ไม่ต่าง", "Force ต่อเนื่อง, Impulse ทันที", "Impulse ต่อเนื่อง", "Force ใช้กับ trigger"],
              correctIndex: 1,
              explanation: "Force ใช้ต่อเนื่อง (engines), Impulse ใช้ทันที (jumps)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["PhysicsAggregate", "Mesh + Physics body"],
            ["PhysicsShapeType", "Collision shape"],
            ["mass", "0 = static, >0 = dynamic"],
            ["applyForce", "Continuous force"],
            ["applyImpulse", "Instant push"],
            ["CollisionObservable", "Detect collisions"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Havok physics ได้",
            "สร้าง physics bodies ได้",
            "ใช้ forces และ impulses ได้",
            "จัดการ collision events ได้",
            "พร้อมเรียน XR Development!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: XR Development! 🥽</strong>
        </TipBox>
      </Section>
    </div>
  );
}
