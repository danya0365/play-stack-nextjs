"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_3_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Physics with React Three Rapier</h1>

      <Objectives
        items={[
          "ตั้งค่า Rapier physics ใน R3F",
          "RigidBody types (dynamic, static, kinematic)",
          "Colliders และ sensors",
          "Character controllers",
        ]}
      />

      <Section title="React Three Rapier" icon="🔬">
        <p className="mb-4">
          <strong>@react-three/rapier</strong> คือ physics engine ที่เขียนด้วย Rust/WASM:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>⚡ เร็วกว่า Cannon.js มาก</li>
          <li>🎮 ออกแบบมาสำหรับ games</li>
          <li>⚛️ React-friendly API</li>
          <li>🔧 Character controller built-in</li>
        </ul>

        <CodeBlock
          title="Installation"
          language="bash"
          code={`
npm install @react-three/rapier
          `}
        />
      </Section>

      <Section title="Basic Setup" icon="🌍">
        <CodeBlock
          title="Physics World"
          language="tsx"
          code={`
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export default function Scene() {
  return (
    <Canvas>
      <Physics 
        gravity={[0, -9.81, 0]}
        debug  // show collision shapes
      >
        {/* Dynamic body (falls) */}
        <RigidBody>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
        
        {/* Static ground */}
        <RigidBody type="fixed">
          <mesh position={[0, -2, 0]}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
      </Physics>
      
      <ambientLight />
      <directionalLight position={[5, 5, 5]} />
    </Canvas>
  );
}
          `}
        />
      </Section>

      <Section title="RigidBody Types" icon="📦">
        <CodeBlock
          title="Body Types"
          language="tsx"
          code={`
import { RigidBody } from '@react-three/rapier';

// ─────────────────────────────────
// Dynamic - affected by physics
// ─────────────────────────────────
<RigidBody 
  type="dynamic"
  mass={1}
  restitution={0.5}     // bounciness
  friction={0.5}
  linearDamping={0.5}   // air resistance
  angularDamping={0.5}  // rotation damping
>
  <mesh>
    <sphereGeometry args={[0.5]} />
    <meshStandardMaterial color="red" />
  </mesh>
</RigidBody>

// ─────────────────────────────────
// Fixed - static, doesn't move
// ─────────────────────────────────
<RigidBody type="fixed">
  <mesh>
    <boxGeometry args={[10, 0.5, 10]} />
    <meshStandardMaterial color="gray" />
  </mesh>
</RigidBody>

// ─────────────────────────────────
// Kinematic - controlled by code
// ─────────────────────────────────
function MovingPlatform() {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      // Move platform
      ref.current.setNextKinematicTranslation({
        x: Math.sin(state.clock.elapsedTime) * 2,
        y: 0,
        z: 0
      });
    }
  });
  
  return (
    <RigidBody ref={ref} type="kinematicPosition">
      <mesh>
        <boxGeometry args={[3, 0.3, 3]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}
          `}
        />
      </Section>

      <Section title="Colliders" icon="💥">
        <CodeBlock
          title="Collision Shapes"
          language="tsx"
          code={`
import { 
  RigidBody, 
  CuboidCollider, 
  BallCollider, 
  CapsuleCollider,
  TrimeshCollider,
  CylinderCollider
} from '@react-three/rapier';

// ─────────────────────────────────
// Auto collider (from mesh)
// ─────────────────────────────────
<RigidBody colliders="cuboid">
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial />
  </mesh>
</RigidBody>

// Collider types: "cuboid", "ball", "hull", "trimesh"

// ─────────────────────────────────
// Manual colliders
// ─────────────────────────────────
<RigidBody colliders={false}>
  <mesh>
    <torusGeometry args={[1, 0.3, 16, 32]} />
    <meshStandardMaterial />
  </mesh>
  
  {/* Add custom colliders */}
  <BallCollider args={[0.5]} position={[0, 0, 0]} />
  <CuboidCollider args={[0.5, 0.5, 0.5]} position={[1, 0, 0]} />
</RigidBody>

// ─────────────────────────────────
// Complex shape (trimesh)
// ─────────────────────────────────
function ComplexModel() {
  const { nodes } = useGLTF('/model.glb');
  
  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={nodes.Scene} />
    </RigidBody>
  );
}

// ─────────────────────────────────
// Sensors (triggers)
// ─────────────────────────────────
<CuboidCollider 
  args={[2, 1, 2]} 
  sensor 
  onIntersectionEnter={() => console.log('Entered zone!')}
  onIntersectionExit={() => console.log('Left zone!')}
/>
          `}
        />
      </Section>

      <Section title="Forces & Impulses" icon="⚡">
        <CodeBlock
          title="Applying Physics Forces"
          language="tsx"
          code={`
import { RigidBody, vec3 } from '@react-three/rapier';

function JumpingBall() {
  const rigidBody = useRef();
  
  const jump = () => {
    // Apply impulse (instant force)
    rigidBody.current?.applyImpulse(
      { x: 0, y: 10, z: 0 },
      true  // wake up if sleeping
    );
  };
  
  const push = () => {
    // Apply continuous force
    rigidBody.current?.applyForce(
      { x: 50, y: 0, z: 0 },
      true
    );
  };
  
  const spin = () => {
    // Apply torque
    rigidBody.current?.applyTorqueImpulse(
      { x: 0, y: 5, z: 0 },
      true
    );
  };
  
  const reset = () => {
    // Reset position and velocity
    rigidBody.current?.setTranslation({ x: 0, y: 5, z: 0 }, true);
    rigidBody.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rigidBody.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };
  
  return (
    <RigidBody ref={rigidBody}>
      <mesh onClick={jump}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
}
          `}
        />
      </Section>

      <Section title="Character Controller" icon="🏃">
        <CodeBlock
          title="First Person Character"
          language="tsx"
          code={`
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';

function Player() {
  const rigidBody = useRef();
  const [, getKeys] = useKeyboardControls();
  
  const speed = 5;
  const jumpForce = 8;
  const isGrounded = useRef(false);
  
  useFrame((state, delta) => {
    if (!rigidBody.current) return;
    
    const { forward, backward, left, right, jump } = getKeys();
    
    // Get current velocity
    const velocity = rigidBody.current.linvel();
    
    // Calculate direction
    let moveX = 0;
    let moveZ = 0;
    
    if (forward) moveZ -= 1;
    if (backward) moveZ += 1;
    if (left) moveX -= 1;
    if (right) moveX += 1;
    
    // Normalize
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX /= length;
      moveZ /= length;
    }
    
    // Apply movement (keep Y velocity for gravity)
    rigidBody.current.setLinvel({
      x: moveX * speed,
      y: velocity.y,
      z: moveZ * speed
    }, true);
    
    // Jump
    if (jump && isGrounded.current) {
      rigidBody.current.applyImpulse({ x: 0, y: jumpForce, z: 0 }, true);
      isGrounded.current = false;
    }
    
    // Update camera
    const position = rigidBody.current.translation();
    state.camera.position.set(position.x, position.y + 1, position.z);
  });
  
  return (
    <RigidBody
      ref={rigidBody}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}  // no rotation
      onCollisionEnter={() => {
        isGrounded.current = true;
      }}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
    </RigidBody>
  );
}

// Keyboard controls setup
import { KeyboardControls } from '@react-three/drei';

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
];

export default function Game() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas>
        <Physics>
          <Player />
          {/* Level */}
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "type='fixed' หมายความว่าอะไร?",
              options: ["เคลื่อนที่เร็ว", "Static object (ไม่เคลื่อนที่)", "ลอยได้", "ไม่มี collision"],
              correctIndex: 1,
              explanation: "type='fixed' ทำให้เป็น static object เช่น ground"
            },
            {
              question: "applyImpulse() ใช้ทำอะไร?",
              options: ["แรงต่อเนื่อง", "แรงทันที (เช่น jump)", "หมุน", "ย้าย"],
              correctIndex: 1,
              explanation: "applyImpulse ใช้แรงทันที เช่น jump, explosion"
            },
            {
              question: "sensor collider ทำอะไร?",
              options: ["ชนแล้วเด้งออก", "ตรวจจับโดยไม่ชน (trigger zone)", "สร้างแสง", "เล่นเสียง"],
              correctIndex: 1,
              explanation: "sensor ตรวจจับโดยไม่มี physics response"
            },
            {
              question: "enabledRotations={[false, false, false]} ใช้ทำอะไร?",
              options: ["หมุนเร็วขึ้น", "ไม่ให้หมุน (character controller)", "หมุนกลับด้าน", "หมุนตามเมาส์"],
              correctIndex: 1,
              explanation: "ปิดการหมุน เหมาะกับ character controllers"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Component", "Use Case"]}
          rows={[
            ["<Physics>", "Physics world wrapper"],
            ["<RigidBody>", "Physics-enabled object"],
            ["type='fixed'", "Static objects (ground)"],
            ["type='dynamic'", "Moving objects"],
            ["<CapsuleCollider>", "Character collider"],
            ["applyImpulse()", "Instant force (jump)"],
          ]}
        />

        <ProgressCheck
          items={[
            "ตั้งค่า Rapier physics ได้",
            "ใช้ RigidBody types ได้",
            "ใช้ Colliders และ sensors ได้",
            "สร้าง character controller ได้",
            "พร้อมสำหรับ Phase 4!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phase 3: 3D Games!</strong>
          <br />
          Phase 4: Advanced Concepts!
        </TipBox>
      </Section>
    </div>
  );
}
