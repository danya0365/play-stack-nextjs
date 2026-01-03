"use client";

import { Float, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Floating Game Controller
function GameController({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} position={position} scale={0.5}>
        {/* Controller body */}
        <mesh>
          <boxGeometry args={[2, 0.8, 0.4]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Left handle */}
        <mesh position={[-0.8, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
          <meshStandardMaterial color="#7c3aed" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Right handle */}
        <mesh position={[0.8, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
          <meshStandardMaterial color="#7c3aed" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* D-pad */}
        <mesh position={[-0.5, 0.1, 0.21]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.5, 0.1, 0.21]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* Buttons */}
        <mesh position={[0.35, 0.15, 0.21]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.55, 0.05, 0.21]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.45, 0.25, 0.21]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.65, 0.15, 0.21]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating Code Block
function CodeBlock({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial 
          color="#1e1e2e" 
          metalness={0.3} 
          roughness={0.7}
        />
        {/* Screen glow */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshBasicMaterial color="#0d9488" opacity={0.8} transparent />
        </mesh>
        {/* Code lines */}
        {[0.25, 0.1, -0.05, -0.2, -0.35].map((y, i) => (
          <mesh key={i} position={[-0.3 + i * 0.05, y, 0.07]}>
            <planeGeometry args={[0.6 + Math.random() * 0.4, 0.06]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#a78bfa" : "#60a5fa"} />
          </mesh>
        ))}
      </mesh>
    </Float>
  );
}

// Floating Polyhedron (like Three.js Journey)
function FloatingPoly({ position, color, speed = 1 }: { 
  position: [number, number, number]; 
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const geometries = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.DodecahedronGeometry(0.4, 0),
    ];
    return geometries[Math.floor(Math.random() * geometries.length)];
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.4} 
          roughness={0.3}
          wireframe={Math.random() > 0.5}
        />
      </mesh>
    </Float>
  );
}

// Mouse-following particles
function MouseParticles() {
  const { mouse, viewport } = useThree();
  const meshRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 0.1, 0.02);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 0.1, 0.02);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#a78bfa" 
        sizeAttenuation 
        transparent 
        opacity={0.6}
      />
    </points>
  );
}

// Animated ring
function AnimatedRing({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
    </mesh>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#06b6d4" />
      
      {/* Stars background */}
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floating objects */}
      <GameController position={[-3, 1, 0]} />
      <CodeBlock position={[3, 0, 0]} />
      
      {/* Polyhedrons */}
      <FloatingPoly position={[-2, -1.5, -2]} color="#8b5cf6" speed={0.8} />
      <FloatingPoly position={[2, 1.5, -1]} color="#06b6d4" speed={1.2} />
      <FloatingPoly position={[0, -2, -3]} color="#ec4899" speed={0.6} />
      <FloatingPoly position={[-3.5, 0.5, -2]} color="#22c55e" speed={1} />
      <FloatingPoly position={[3.5, -1, -1.5]} color="#f59e0b" speed={0.9} />
      
      {/* Rings */}
      <AnimatedRing position={[0, 0, -5]} />
      
      {/* Mouse particles */}
      <MouseParticles />
    </>
  );
}

// Loading fallback
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function Hero3DCanvas() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900" />
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
