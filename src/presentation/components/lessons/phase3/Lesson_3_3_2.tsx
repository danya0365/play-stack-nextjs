"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_3_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Drei - Helper Components</h1>

      <Objectives
        items={[
          "ใช้ Drei helpers สำหรับ common tasks",
          "OrbitControls, PerspectiveCamera",
          "Text, Html, Billboard",
          "Environment, useGLTF",
        ]}
      />

      <Section title="Drei คืออะไร?" icon="🛠️">
        <p className="mb-4">
          <strong>@react-three/drei</strong> เป็น collection ของ useful helpers:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>📷 Camera controls</li>
          <li>✍️ Text และ HTML</li>
          <li>🌍 Environment และ Lighting</li>
          <li>📦 Model loaders</li>
          <li>🎨 Shaders และ Effects</li>
        </ul>

        <CodeBlock
          title="Installation"
          language="bash"
          code={`
npm install @react-three/drei
          `}
        />
      </Section>

      <Section title="Camera Controls" icon="📷">
        <CodeBlock
          title="OrbitControls"
          language="tsx"
          code={`
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

export default function Scene() {
  return (
    <Canvas>
      {/* Custom camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      
      {/* Orbit controls */}
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}  // don't go below ground
        target={[0, 1, 0]}           // look at point
      />
      
      {/* Scene content */}
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}

// ─────────────────────────────────
// Other camera controls
// ─────────────────────────────────
import { 
  FirstPersonControls,
  FlyControls,
  MapControls,
  TrackballControls,
  PointerLockControls
} from '@react-three/drei';

// First person (WASD + mouse)
<FirstPersonControls movementSpeed={5} lookSpeed={0.1} />

// Pointer lock (FPS style)
<PointerLockControls />

// Map controls (pan, zoom, no rotate)
<MapControls />
          `}
        />
      </Section>

      <Section title="Text & HTML" icon="✍️">
        <CodeBlock
          title="3D Text and HTML"
          language="tsx"
          code={`
import { Text, Text3D, Html, Billboard } from '@react-three/drei';

// ─────────────────────────────────
// 2D Text (always faces camera)
// ─────────────────────────────────
<Text
  position={[0, 2, 0]}
  fontSize={0.5}
  color="white"
  anchorX="center"
  anchorY="middle"
  font="/fonts/Roboto-Bold.woff"
>
  Hello World!
</Text>

// ─────────────────────────────────
// 3D Text (geometry)
// ─────────────────────────────────
<Text3D
  font="/fonts/helvetiker_regular.typeface.json"
  size={0.5}
  height={0.2}
  curveSegments={12}
  bevelEnabled
  bevelThickness={0.02}
  bevelSize={0.02}
>
  3D TEXT
  <meshStandardMaterial color="gold" />
</Text3D>

// ─────────────────────────────────
// HTML in 3D space
// ─────────────────────────────────
<Html
  position={[0, 2, 0]}
  center              // center on position
  distanceFactor={5}  // scale with distance
  occlude             // hide when behind objects
  transform           // use CSS3D transform
>
  <div className="bg-black/50 p-4 rounded">
    <h2>UI in 3D!</h2>
    <button onClick={() => alert('Clicked!')}>
      Click me
    </button>
  </div>
</Html>

// ─────────────────────────────────
// Billboard (always faces camera)
// ─────────────────────────────────
<Billboard position={[0, 1, 0]} follow lockX={false} lockY={false}>
  <mesh>
    <planeGeometry args={[1, 1]} />
    <meshBasicMaterial map={spriteTexture} transparent />
  </mesh>
</Billboard>
          `}
        />
      </Section>

      <Section title="Environment & Lighting" icon="🌍">
        <CodeBlock
          title="Easy Environment Setup"
          language="tsx"
          code={`
import { 
  Environment, 
  Sky, 
  Stars, 
  Cloud,
  ContactShadows,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';

// ─────────────────────────────────
// HDRI Environment
// ─────────────────────────────────
<Environment 
  preset="sunset"  // city, sunset, dawn, night, warehouse, forest, apartment, studio, etc.
  background      // show as background
/>

// Custom HDR
<Environment files="/hdri/field.hdr" background />

// ─────────────────────────────────
// Sky
// ─────────────────────────────────
<Sky
  distance={450000}
  sunPosition={[5, 1, 8]}
  inclination={0}
  azimuth={0.25}
/>

// ─────────────────────────────────
// Stars
// ─────────────────────────────────
<Stars
  radius={100}
  depth={50}
  count={5000}
  factor={4}
  saturation={0}
  fade
  speed={1}
/>

// ─────────────────────────────────
// Soft shadows
// ─────────────────────────────────
<ContactShadows
  position={[0, 0, 0]}
  opacity={0.5}
  scale={10}
  blur={2}
  far={4}
/>

// Accumulated shadows (more realistic)
<AccumulativeShadows>
  <RandomizedLight amount={8} position={[5, 5, -10]} />
</AccumulativeShadows>
          `}
        />
      </Section>

      <Section title="Model Loading" icon="📦">
        <CodeBlock
          title="useGLTF Hook"
          language="tsx"
          code={`
import { useGLTF, Clone, useAnimations } from '@react-three/drei';

// ─────────────────────────────────
// Load GLTF model
// ─────────────────────────────────
function Model({ url, ...props }) {
  const { scene, nodes, materials, animations } = useGLTF(url);
  
  return <primitive object={scene} {...props} />;
}

// Preload
useGLTF.preload('/models/character.glb');

// ─────────────────────────────────
// With animations
// ─────────────────────────────────
function AnimatedModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/character.glb');
  const { actions, names } = useAnimations(animations, group);
  
  useEffect(() => {
    // Play animation by name
    actions['Idle']?.play();
  }, [actions]);
  
  return <primitive ref={group} object={scene} />;
}

// ─────────────────────────────────
// Clone model (instancing)
// ─────────────────────────────────
function Forest() {
  const { scene } = useGLTF('/models/tree.glb');
  
  return (
    <>
      {trees.map((pos, i) => (
        <Clone key={i} object={scene} position={pos} />
      ))}
    </>
  );
}

// ─────────────────────────────────
// Using nodes directly
// ─────────────────────────────────
function Character() {
  const { nodes, materials } = useGLTF('/models/character.glb');
  
  return (
    <group>
      <mesh 
        geometry={nodes.Body.geometry} 
        material={materials.Skin}
      />
      <mesh 
        geometry={nodes.Hair.geometry}
        material={materials.Hair}
      />
    </group>
  );
}
          `}
        />
      </Section>

      <Section title="Useful Helpers" icon="🧰">
        <CodeBlock
          title="Common Drei Components"
          language="tsx"
          code={`
import {
  Box, Sphere, Plane, Cylinder,  // Geometry shortcuts
  Float,                          // Floating animation
  Sparkles,                       // Particle effect
  MeshReflectorMaterial,         // Reflective floor
  useTexture,                    // Load textures
  Loader,                        // Loading screen
  useProgress                    // Loading progress
} from '@react-three/drei';

// ─────────────────────────────────
// Geometry shortcuts
// ─────────────────────────────────
<Box args={[1, 1, 1]} position={[0, 0, 0]}>
  <meshStandardMaterial color="orange" />
</Box>

<Sphere args={[0.5, 32, 32]} position={[2, 0, 0]}>
  <meshStandardMaterial color="blue" />
</Sphere>

// ─────────────────────────────────
// Float animation
// ─────────────────────────────────
<Float
  speed={2}
  rotationIntensity={1}
  floatIntensity={2}
>
  <mesh>
    <torusGeometry />
    <meshStandardMaterial color="gold" />
  </mesh>
</Float>

// ─────────────────────────────────
// Sparkles
// ─────────────────────────────────
<Sparkles
  count={100}
  scale={5}
  size={2}
  speed={0.5}
  color="yellow"
/>

// ─────────────────────────────────
// Reflective floor
// ─────────────────────────────────
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
  <planeGeometry args={[10, 10]} />
  <MeshReflectorMaterial
    blur={[300, 100]}
    resolution={1024}
    mixBlur={1}
    mixStrength={50}
    roughness={1}
    depthScale={1.2}
    minDepthThreshold={0.4}
    maxDepthThreshold={1.4}
    color="#151515"
    metalness={0.5}
  />
</mesh>

// ─────────────────────────────────
// Loading progress
// ─────────────────────────────────
function LoadingScreen() {
  const { progress } = useProgress();
  return <Html center>{progress}% loaded</Html>;
}

// With Suspense
<Suspense fallback={<LoadingScreen />}>
  <Model url="/models/heavy-model.glb" />
</Suspense>
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "OrbitControls ใช้ทำอะไร?",
              options: ["โหลด models", "หมุนกล้องรอบ target", "สร้างแสง", "เล่นเสียง"],
              correctIndex: 1,
              explanation: "OrbitControls ช่วยหมุนกล้องรอบ objects"
            },
            {
              question: "useGLTF() hook ใช้ทำอะไร?",
              options: ["สร้างแสง", "โหลด 3D models", "เล่น animation", "สร้าง text"],
              correctIndex: 1,
              explanation: "useGLTF โหลด GLTF models แบบ React hook"
            },
            {
              question: "<Environment preset='sunset'/> ทำอะไร?",
              options: ["เพิ่ม object", "ตั้งค่า HDRI lighting", "โหลด textures", "สร้าง shadows"],
              correctIndex: 1,
              explanation: "Environment ให้ HDRI lighting อัตโนมัติ"
            },
            {
              question: "<Html> component ใช้ทำอะไร?",
              options: ["สร้าง 3D text", "แสดง HTML ใน 3D space", "โหลด HTML files", "สร้าง website"],
              correctIndex: 1,
              explanation: "Html แสดง React components ใน 3D"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Component", "Use Case"]}
          rows={[
            ["OrbitControls", "Camera orbit"],
            ["Environment", "HDRI lighting"],
            ["useGLTF", "Load 3D models"],
            ["Text / Html", "Text in 3D"],
            ["Float", "Floating animation"],
            ["ContactShadows", "Soft shadows"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ OrbitControls ได้",
            "โหลด models ด้วย useGLTF ได้",
            "ใช้ Environment ได้",
            "ใช้ Html แสดง UI ได้",
            "พร้อมเรียน Rapier Physics!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Physics with React Three Rapier! 🎮</strong>
        </TipBox>
      </Section>
    </div>
  );
}
