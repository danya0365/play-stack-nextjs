"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_3_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">React Three Fiber พื้นฐาน</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ React Three Fiber",
          "ตั้งค่า R3F project",
          "สร้าง 3D scenes ด้วย JSX",
          "Component-based 3D development",
        ]}
      />

      <Section title="React Three Fiber คืออะไร?" icon="⚛️">
        <p className="mb-4">
          <strong>React Three Fiber (R3F)</strong> คือ React renderer สำหรับ Three.js:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>⚛️ ใช้ React components แทน imperative code</li>
          <li>🔄 Automatic disposal และ cleanup</li>
          <li>🪝 React hooks (useFrame, useThree)</li>
          <li>📦 Rich ecosystem (drei, rapier, postprocessing)</li>
          <li>⚡ No performance overhead</li>
        </ul>

        <TipBox type="info">
          <strong>ทำไมต้อง R3F?</strong>
          <br />
          เหมาะกับ React developers ที่ต้องการสร้าง 3D content
          โดยใช้ patterns ที่คุ้นเคย
        </TipBox>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Setup R3F Project"
          language="bash"
          code={`
# Create React/Next.js project
npx create-next-app@latest my-3d-app
cd my-3d-app

# Install R3F and dependencies
npm install three @react-three/fiber @react-three/drei

# TypeScript types
npm install -D @types/three
          `}
        />
      </Section>

      <Section title="Basic Scene" icon="🎬">
        <CodeBlock
          title="First R3F Scene"
          language="tsx"
          code={`
import { Canvas } from '@react-three/fiber';

export default function Scene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        
        {/* 3D Objects */}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
    </div>
  );
}
          `}
        />

        <TipBox type="tip">
          <strong>JSX = Three.js objects!</strong>
          <ul className="mt-2 space-y-1">
            <li>• &lt;mesh&gt; = THREE.Mesh</li>
            <li>• &lt;boxGeometry&gt; = THREE.BoxGeometry</li>
            <li>• &lt;meshStandardMaterial&gt; = THREE.MeshStandardMaterial</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Canvas Configuration" icon="⚙️">
        <CodeBlock
          title="Canvas Props"
          language="tsx"
          code={`
<Canvas
  // Camera settings
  camera={{ 
    fov: 75, 
    near: 0.1, 
    far: 1000, 
    position: [0, 0, 5] 
  }}
  
  // Renderer settings
  gl={{ 
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  }}
  
  // Shadows
  shadows
  
  // DPI
  dpr={[1, 2]}
  
  // Performance
  frameloop="demand"  // only render when needed
  
  // Event handling
  onCreated={({ gl, scene, camera }) => {
    console.log('Canvas ready!');
  }}
>
  {/* Scene content */}
</Canvas>
          `}
        />
      </Section>

      <Section title="Creating Components" icon="📦">
        <CodeBlock
          title="Reusable 3D Components"
          language="tsx"
          code={`
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────
// Basic rotating box
// ─────────────────────────────────
function SpinningBox({ position, color = 'orange' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animation loop (runs every frame)
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// ─────────────────────────────────
// Interactive component
// ─────────────────────────────────
function InteractiveBox({ position }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  return (
    <mesh
      position={position}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

// ─────────────────────────────────
// Usage
// ─────────────────────────────────
export default function Scene() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[5, 5, 5]} />
      
      <SpinningBox position={[-2, 0, 0]} color="cyan" />
      <SpinningBox position={[0, 0, 0]} color="lime" />
      <InteractiveBox position={[2, 0, 0]} />
    </Canvas>
  );
}
          `}
        />
      </Section>

      <Section title="useFrame Hook" icon="🔄">
        <CodeBlock
          title="Animation with useFrame"
          language="tsx"
          code={`
import { useFrame, useThree } from '@react-three/fiber';

function AnimatedObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    // state.clock - elapsed time
    // state.camera - camera reference
    // state.mouse - normalized mouse position (-1 to 1)
    // delta - time since last frame
    
    if (!meshRef.current) return;
    
    // Rotation
    meshRef.current.rotation.y += delta;
    
    // Floating motion
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    
    // Follow mouse
    meshRef.current.position.x = state.mouse.x * 3;
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
}

// ─────────────────────────────────
// Priority (execution order)
// ─────────────────────────────────
function CameraController() {
  useFrame((state, delta) => {
    // Run first (priority 1)
    state.camera.position.lerp(targetPosition, 0.1);
  }, 1);
  
  return null;
}

function ObjectUpdater() {
  useFrame((state, delta) => {
    // Run after camera (priority 2)
  }, 2);
  
  return null;
}
          `}
        />
      </Section>

      <Section title="useThree Hook" icon="🪝">
        <CodeBlock
          title="Accessing Three.js Internals"
          language="tsx"
          code={`
import { useThree } from '@react-three/fiber';

function SceneInfo() {
  const { 
    camera,      // Current camera
    scene,       // Scene object
    gl,          // WebGLRenderer
    size,        // Canvas size { width, height }
    viewport,    // Viewport info
    clock,       // THREE.Clock
    mouse,       // Normalized mouse (-1 to 1)
    raycaster,   // THREE.Raycaster
    set,         // Update store
    get          // Get current store state
  } = useThree();
  
  console.log('Canvas size:', size.width, size.height);
  console.log('Camera position:', camera.position);
  
  return null;
}

// ─────────────────────────────────
// Responsive camera
// ─────────────────────────────────
function ResponsiveCamera() {
  const { viewport } = useThree();
  
  // viewport.width/height = world units visible
  useEffect(() => {
    console.log('Visible area:', viewport.width, viewport.height);
  }, [viewport]);
  
  return null;
}

// ─────────────────────────────────
// Screenshot
// ─────────────────────────────────
function ScreenshotButton() {
  const { gl, scene, camera } = useThree();
  
  const takeScreenshot = () => {
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL('image/png');
    // Download or display
  };
  
  return (
    <Html>
      <button onClick={takeScreenshot}>Screenshot</button>
    </Html>
  );
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["<Canvas>", "Root component, creates scene"],
            ["<mesh>", "THREE.Mesh equivalent"],
            ["useFrame()", "Animation loop hook"],
            ["useThree()", "Access Three.js objects"],
            ["ref", "Reference to Three.js object"],
            ["args={[]}", "Constructor arguments"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Drei - Helper Components! 🛠️</strong>
        </TipBox>
      </Section>
    </div>
  );
}
