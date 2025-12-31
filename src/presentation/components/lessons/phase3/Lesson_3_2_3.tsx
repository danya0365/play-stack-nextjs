"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Constraints และ Vehicles</h1>

      <Objectives
        items={[
          "Point-to-Point Constraints (เชือก, โซ่)",
          "Hinge Constraints (บานพับ, ล้อ)",
          "Vehicle System",
          "Ragdoll Physics",
        ]}
      />

      <Section title="Constraint Types" icon="🔗">
        <Diagram caption="Constraint Overview">
{`
Point-to-Point          Hinge                Lock
┌───┐        ┌───┐     ┌───┐───────┌───┐    ┌───────────┐
│ A │────────│ B │     │ A │   O   │ B │    │  A  ≡  B  │
└───┘        └───┘     └───┘───────└───┘    └───────────┘
  Swings freely         Rotates on axis      Fixed together
`}
        </Diagram>

        <CodeBlock
          title="Constraint Basics"
          language="javascript"
          code={`
// ─────────────────────────────────
// Point-to-Point (Ball Joint)
// ─────────────────────────────────
const bodyA = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 5, 0) });
const bodyB = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0, 3, 0) });
world.addBody(bodyA);
world.addBody(bodyB);

const pointConstraint = new CANNON.PointToPointConstraint(
  bodyA,
  new CANNON.Vec3(0, -1, 0),  // pivot on A (local space)
  bodyB,
  new CANNON.Vec3(0, 1, 0)    // pivot on B (local space)
);
world.addConstraint(pointConstraint);

// ─────────────────────────────────
// Hinge (like a door)
// ─────────────────────────────────
const door = new CANNON.Body({ mass: 1 });
const wall = new CANNON.Body({ mass: 0 });
world.addBody(door);
world.addBody(wall);

const hingeConstraint = new CANNON.HingeConstraint(
  wall,
  door,
  {
    pivotA: new CANNON.Vec3(1, 0, 0),   // hinge point on wall
    pivotB: new CANNON.Vec3(-0.5, 0, 0), // hinge point on door
    axisA: new CANNON.Vec3(0, 1, 0),    // rotation axis
    axisB: new CANNON.Vec3(0, 1, 0)
  }
);
world.addConstraint(hingeConstraint);

// Limit rotation
hingeConstraint.setLimits(-Math.PI / 2, Math.PI / 2);

// Motor (auto-rotate)
hingeConstraint.enableMotor();
hingeConstraint.setMotorSpeed(2);
hingeConstraint.setMotorMaxForce(10);

// ─────────────────────────────────
// Lock (fixed together)
// ─────────────────────────────────
const lockConstraint = new CANNON.LockConstraint(bodyA, bodyB);
world.addConstraint(lockConstraint);

// ─────────────────────────────────
// Distance (spring-like)
// ─────────────────────────────────
const distanceConstraint = new CANNON.DistanceConstraint(
  bodyA, bodyB, 
  2  // distance to maintain
);
world.addConstraint(distanceConstraint);
          `}
        />
      </Section>

      <Section title="Rope/Chain" icon="⛓️">
        <CodeBlock
          title="Creating a Chain"
          language="javascript"
          code={`
function createChain(startPos, linkCount = 10, linkLength = 0.3) {
  const links = [];
  const constraints = [];
  
  for (let i = 0; i < linkCount; i++) {
    const y = startPos.y - i * linkLength;
    
    // Physics body
    const body = new CANNON.Body({
      mass: i === 0 ? 0 : 0.5,  // first link is static
      shape: new CANNON.Sphere(0.1),
      position: new CANNON.Vec3(startPos.x, y, startPos.z)
    });
    world.addBody(body);
    
    // Visual
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    scene.add(mesh);
    
    // Connect to previous link
    if (i > 0) {
      const constraint = new CANNON.DistanceConstraint(
        links[i - 1].body,
        body,
        linkLength
      );
      world.addConstraint(constraint);
      constraints.push(constraint);
    }
    
    links.push({ body, mesh });
  }
  
  return { links, constraints };
}

// Usage
const chain = createChain(new CANNON.Vec3(0, 10, 0), 15, 0.4);

// Update visuals
function animate() {
  for (const link of chain.links) {
    link.mesh.position.copy(link.body.position);
  }
  
  // Draw lines between links
  // (use THREE.Line or custom geometry)
}

// Attach object to end
const weight = new CANNON.Body({ mass: 5, shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.3, 0.3)) });
weight.position.copy(chain.links[chain.links.length - 1].body.position);
weight.position.y -= 0.5;
world.addBody(weight);

const attachConstraint = new CANNON.PointToPointConstraint(
  chain.links[chain.links.length - 1].body,
  new CANNON.Vec3(0, -0.1, 0),
  weight,
  new CANNON.Vec3(0, 0.3, 0)
);
world.addConstraint(attachConstraint);
          `}
        />
      </Section>

      <Section title="Vehicle System" icon="🚗">
        <CodeBlock
          title="RaycastVehicle"
          language="javascript"
          code={`
// ─────────────────────────────────
// Create vehicle body
// ─────────────────────────────────
const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.3, 2));
const chassisBody = new CANNON.Body({
  mass: 150,
  shape: chassisShape,
  position: new CANNON.Vec3(0, 1, 0)
});
world.addBody(chassisBody);

// ─────────────────────────────────
// Create vehicle
// ─────────────────────────────────
const vehicle = new CANNON.RaycastVehicle({
  chassisBody: chassisBody,
  indexRightAxis: 0,    // x-axis is right
  indexUpAxis: 1,       // y-axis is up
  indexForwardAxis: 2   // z-axis is forward
});

// ─────────────────────────────────
// Add wheels
// ─────────────────────────────────
const wheelOptions = {
  radius: 0.4,
  directionLocal: new CANNON.Vec3(0, -1, 0),  // suspension direction
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 1.5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  axleLocal: new CANNON.Vec3(1, 0, 0),  // wheel rotation axis
  chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true
};

// Front left
wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1.5);
vehicle.addWheel(wheelOptions);

// Front right
wheelOptions.chassisConnectionPointLocal.set(1, 0, 1.5);
vehicle.addWheel(wheelOptions);

// Rear left
wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1.5);
vehicle.addWheel(wheelOptions);

// Rear right
wheelOptions.chassisConnectionPointLocal.set(1, 0, -1.5);
vehicle.addWheel(wheelOptions);

vehicle.addToWorld(world);

// ─────────────────────────────────
// Create wheel meshes
// ─────────────────────────────────
const wheelMeshes = [];
const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
wheelGeometry.rotateZ(Math.PI / 2);

for (let i = 0; i < vehicle.wheelInfos.length; i++) {
  const mesh = new THREE.Mesh(
    wheelGeometry,
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  scene.add(mesh);
  wheelMeshes.push(mesh);
}

// ─────────────────────────────────
// Controls
// ─────────────────────────────────
const maxSteerVal = 0.5;
const maxForce = 1000;
const brakeForce = 10;

function updateVehicle() {
  // Steering
  let steer = 0;
  if (keys['KeyA']) steer = maxSteerVal;
  if (keys['KeyD']) steer = -maxSteerVal;
  vehicle.setSteeringValue(steer, 0);  // front left
  vehicle.setSteeringValue(steer, 1);  // front right
  
  // Engine
  let engine = 0;
  if (keys['KeyW']) engine = -maxForce;
  if (keys['KeyS']) engine = maxForce / 2;  // reverse slower
  vehicle.applyEngineForce(engine, 2);  // rear left
  vehicle.applyEngineForce(engine, 3);  // rear right
  
  // Brake
  const brake = keys['Space'] ? brakeForce : 0;
  vehicle.setBrake(brake, 0);
  vehicle.setBrake(brake, 1);
  vehicle.setBrake(brake, 2);
  vehicle.setBrake(brake, 3);
}

// ─────────────────────────────────
// Update loop
// ─────────────────────────────────
function animate() {
  updateVehicle();
  world.step(1/60, delta, 3);
  
  // Sync chassis
  chassisMesh.position.copy(chassisBody.position);
  chassisMesh.quaternion.copy(chassisBody.quaternion);
  
  // Sync wheels
  for (let i = 0; i < vehicle.wheelInfos.length; i++) {
    vehicle.updateWheelTransform(i);
    const t = vehicle.wheelInfos[i].worldTransform;
    wheelMeshes[i].position.copy(t.position);
    wheelMeshes[i].quaternion.copy(t.quaternion);
  }
  
  renderer.render(scene, camera);
}
          `}
        />
      </Section>

      <Section title="Ragdoll" icon="🤸">
        <CodeBlock
          title="Simple Ragdoll"
          language="javascript"
          code={`
function createRagdoll(position) {
  const parts = {};
  
  // Head
  parts.head = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(0.25),
    position: new CANNON.Vec3(position.x, position.y + 1.5, position.z)
  });
  world.addBody(parts.head);
  
  // Torso
  parts.torso = new CANNON.Body({
    mass: 2,
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.4, 0.15)),
    position: new CANNON.Vec3(position.x, position.y + 0.9, position.z)
  });
  world.addBody(parts.torso);
  
  // Arms
  parts.leftArm = new CANNON.Body({
    mass: 0.5,
    shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.08, 0.08)),
    position: new CANNON.Vec3(position.x - 0.5, position.y + 1.1, position.z)
  });
  world.addBody(parts.leftArm);
  
  parts.rightArm = new CANNON.Body({
    mass: 0.5,
    shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.08, 0.08)),
    position: new CANNON.Vec3(position.x + 0.5, position.y + 1.1, position.z)
  });
  world.addBody(parts.rightArm);
  
  // Legs
  parts.leftLeg = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.3, 0.1)),
    position: new CANNON.Vec3(position.x - 0.15, position.y + 0.3, position.z)
  });
  world.addBody(parts.leftLeg);
  
  parts.rightLeg = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.3, 0.1)),
    position: new CANNON.Vec3(position.x + 0.15, position.y + 0.3, position.z)
  });
  world.addBody(parts.rightLeg);
  
  // Constraints
  const constraints = [];
  
  // Head to torso
  constraints.push(new CANNON.PointToPointConstraint(
    parts.head, new CANNON.Vec3(0, -0.25, 0),
    parts.torso, new CANNON.Vec3(0, 0.4, 0)
  ));
  
  // Arms to torso
  constraints.push(new CANNON.PointToPointConstraint(
    parts.leftArm, new CANNON.Vec3(0.3, 0, 0),
    parts.torso, new CANNON.Vec3(-0.25, 0.3, 0)
  ));
  constraints.push(new CANNON.PointToPointConstraint(
    parts.rightArm, new CANNON.Vec3(-0.3, 0, 0),
    parts.torso, new CANNON.Vec3(0.25, 0.3, 0)
  ));
  
  // Legs to torso
  constraints.push(new CANNON.PointToPointConstraint(
    parts.leftLeg, new CANNON.Vec3(0, 0.3, 0),
    parts.torso, new CANNON.Vec3(-0.15, -0.4, 0)
  ));
  constraints.push(new CANNON.PointToPointConstraint(
    parts.rightLeg, new CANNON.Vec3(0, 0.3, 0),
    parts.torso, new CANNON.Vec3(0.15, -0.4, 0)
  ));
  
  constraints.forEach(c => world.addConstraint(c));
  
  return { parts, constraints };
}

// Usage
const ragdoll = createRagdoll(new CANNON.Vec3(0, 5, 0));

// Apply force
ragdoll.parts.torso.applyImpulse(
  new CANNON.Vec3(10, 5, 0),
  ragdoll.parts.torso.position
);
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Constraint", "Use Case"]}
          rows={[
            ["PointToPoint", "Ball joints, chains"],
            ["Hinge", "Doors, wheels"],
            ["Lock", "Fixed connections"],
            ["Distance", "Rope, spring"],
            ["RaycastVehicle", "Cars, bikes"],
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Physics Module!</strong>
          <br />
          บทต่อไป: React Three Fiber!
        </TipBox>
      </Section>
    </div>
  );
}
