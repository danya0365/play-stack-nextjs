"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_5_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">เขียน Shaders</h1>

      <Objectives
        items={[
          "เข้าใจ GLSL Basics",
          "เขียน Vertex Shader",
          "เขียน Fragment Shader",
          "สร้าง Custom Effects",
        ]}
      />

      <Section title="Shader Pipeline" icon="🎨">
        <Table
          headers={["Shader", "บทบาท", "ตัวอย่าง"]}
          rows={[
            ["Vertex", "กำหนดตำแหน่ง vertices", "Animation, deformation"],
            ["Fragment", "กำหนดสี pixels", "Textures, lighting, effects"],
          ]}
        />
      </Section>

      <Section title="GLSL Basics" icon="📝">
        <CodeBlock
          title="Vertex Shader"
          language="glsl"
          code={`
// Basic Vertex Shader
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normal;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
          `}
        />

        <CodeBlock
          title="Fragment Shader"
          language="glsl"
          code={`
// Basic Fragment Shader
precision mediump float;

uniform sampler2D map;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec4 texColor = texture2D(map, vUv);
  
  // Simple lighting
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float light = dot(vNormal, lightDir) * 0.5 + 0.5;
  
  gl_FragColor = texColor * light;
}
          `}
        />
      </Section>

      <Section title="Three.js Custom Shader" icon="⚡">
        <CodeBlock
          title="ShaderMaterial"
          language="typescript"
          code={`
import * as THREE from 'three';

const vertexShader = \`
  varying vec2 vUv;
  varying float vElevation;
  
  uniform float uTime;
  uniform float uAmplitude;
  
  void main() {
    vUv = uv;
    
    // Wave effect
    float elevation = sin(position.x * 4.0 + uTime) * 
                     sin(position.z * 4.0 + uTime) * 
                     uAmplitude;
    
    vElevation = elevation;
    
    vec3 newPosition = position;
    newPosition.y += elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
\`;

const fragmentShader = \`
  varying vec2 vUv;
  varying float vElevation;
  
  uniform vec3 uLowColor;
  uniform vec3 uHighColor;
  
  void main() {
    float mixStrength = (vElevation + 0.1) * 5.0;
    vec3 color = mix(uLowColor, uHighColor, mixStrength);
    
    gl_FragColor = vec4(color, 1.0);
  }
\`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uAmplitude: { value: 0.1 },
    uLowColor: { value: new THREE.Color('#1e3a5f') },
    uHighColor: { value: new THREE.Color('#4ade80') }
  }
});

// Animate
function animate() {
  material.uniforms.uTime.value += 0.01;
  requestAnimationFrame(animate);
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Vertex Shader ทำหน้าที่อะไร?",
              options: ["กำหนดสี", "กำหนดตำแหน่ง vertices", "โหลด textures", "Physics"],
              correctIndex: 1,
              explanation: "Vertex shader กำหนดตำแหน่งของแต่ละ vertex บนหน้าจอ"
            },
            {
              question: "Fragment Shader ทำหน้าที่อะไร?",
              options: ["กำหนดตำแหน่ง", "กำหนดสีของแต่ละ pixel", "Load models", "Animation"],
              correctIndex: 1,
              explanation: "Fragment shader คำนวณสีของแต่ละ pixel"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "เข้าใจ shader pipeline",
            "เขียน GLSL ได้",
            "ใช้ ShaderMaterial ได้",
            "พร้อมเรียน Procedural Generation!"
          ]}
        />
      </Section>
    </div>
  );
}
