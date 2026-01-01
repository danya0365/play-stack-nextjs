"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">PBR Materials ใน Babylon.js</h1>

      <Objectives
        items={[
          "เข้าใจ PBR (Physically Based Rendering)",
          "ใช้ PBRMaterial และ properties",
          "โหลด textures และ environment maps",
          "สร้าง realistic materials",
        ]}
      />

      <Section title="PBR คืออะไร?" icon="✨">
        <Diagram caption="PBR Material Properties">
{`
┌──────────────────────────────────────────┐
│           PBR Material                    │
├──────────────────────────────────────────┤
│  Albedo (Base Color)                     │
│  ├── สีพื้นฐาน                           │
│  │                                        │
│  Metallic                                │
│  ├── 0 = plastic, 1 = metal              │
│  │                                        │
│  Roughness                               │
│  ├── 0 = mirror, 1 = matte               │
│  │                                        │
│  Normal                                  │
│  ├── Surface detail without geometry     │
│  │                                        │
│  Ambient Occlusion                       │
│  └── ที่แสงเข้าไม่ถึง (เงามุม)           │
└──────────────────────────────────────────┘
`}
        </Diagram>
      </Section>

      <Section title="PBRMaterial Basics" icon="🎨">
        <CodeBlock
          title="Creating PBR Materials"
          language="typescript"
          code={`
import { 
  PBRMaterial, 
  Color3,
  Texture 
} from "@babylonjs/core";

// ─────────────────────────────────
// Basic PBR Material
// ─────────────────────────────────
const pbr = new PBRMaterial("pbr", scene);
pbr.albedoColor = new Color3(0.3, 0.8, 0.5);
pbr.metallic = 0;       // Non-metallic (plastic/wood)
pbr.roughness = 0.5;    // Semi-rough

mesh.material = pbr;

// ─────────────────────────────────
// Metallic Material
// ─────────────────────────────────
const metalPbr = new PBRMaterial("metal", scene);
metalPbr.albedoColor = new Color3(0.9, 0.9, 0.9);
metalPbr.metallic = 1;     // Full metal
metalPbr.roughness = 0.2;  // Slightly rough

// ─────────────────────────────────
// Glass Material
// ─────────────────────────────────
const glassPbr = new PBRMaterial("glass", scene);
glassPbr.albedoColor = new Color3(1, 1, 1);
glassPbr.metallic = 0;
glassPbr.roughness = 0;
glassPbr.alpha = 0.3;                    // Transparency
glassPbr.transparencyMode = 2;           // Alpha blend
glassPbr.indexOfRefraction = 1.5;        // Refraction

// ─────────────────────────────────
// Emissive (Glow)
// ─────────────────────────────────
const glowPbr = new PBRMaterial("glow", scene);
glowPbr.emissiveColor = new Color3(1, 0.5, 0);
glowPbr.emissiveIntensity = 2;
          `}
        />
      </Section>

      <Section title="Texture Maps" icon="🖼️">
        <CodeBlock
          title="Using Textures"
          language="typescript"
          code={`
import { Texture, PBRMaterial } from "@babylonjs/core";

const pbr = new PBRMaterial("texturedPbr", scene);

// ─────────────────────────────────
// Albedo (Color) Map
// ─────────────────────────────────
pbr.albedoTexture = new Texture("/textures/brick_albedo.jpg", scene);

// ─────────────────────────────────
// Normal Map (Bump)
// ─────────────────────────────────
pbr.bumpTexture = new Texture("/textures/brick_normal.jpg", scene);
pbr.bumpTexture.level = 1;  // intensity

// ─────────────────────────────────
// Metallic/Roughness Map
// ─────────────────────────────────
// Combined texture: R = unused, G = Roughness, B = Metallic
pbr.metallicTexture = new Texture("/textures/brick_roughness.jpg", scene);
pbr.useRoughnessFromMetallicTextureAlpha = false;
pbr.useRoughnessFromMetallicTextureGreen = true;

// ─────────────────────────────────
// Ambient Occlusion Map
// ─────────────────────────────────
pbr.ambientTexture = new Texture("/textures/brick_ao.jpg", scene);
pbr.ambientTextureStrength = 1;

// ─────────────────────────────────
// Texture Tiling
// ─────────────────────────────────
pbr.albedoTexture.uScale = 4;  // Repeat horizontal
pbr.albedoTexture.vScale = 4;  // Repeat vertical
          `}
        />

        <TipBox type="tip">
          <strong>Free PBR Textures:</strong> ดาวน์โหลดจาก
          polyhaven.com, ambientcg.com, textures.com
        </TipBox>
      </Section>

      <Section title="Environment & Reflections" icon="🌍">
        <CodeBlock
          title="HDR Environment"
          language="typescript"
          code={`
import { CubeTexture, HDRCubeTexture } from "@babylonjs/core";

// ─────────────────────────────────
// HDR Environment (recommended)
// ─────────────────────────────────
const hdrTexture = new HDRCubeTexture(
  "/environment/sunset.hdr",
  scene,
  512  // size
);

// Set as background
scene.environmentTexture = hdrTexture;
scene.createDefaultSkybox(hdrTexture, true, 1000);

// ─────────────────────────────────
// Pre-baked reflection probes
// ─────────────────────────────────
// PBR materials automatically use scene.environmentTexture
// for reflections

// Override for specific material
pbr.reflectionTexture = hdrTexture;
pbr.reflectionTexture.level = 1;

// ─────────────────────────────────
// Fresnel effect
// ─────────────────────────────────
// Already built into PBR - edges more reflective
pbr.useRadianceOverAlpha = true;
          `}
        />
      </Section>

      <Section title="Material Presets" icon="🎭">
        <CodeBlock
          title="Common Material Types"
          language="typescript"
          code={`
// ─────────────────────────────────
// Chrome/Mirror
// ─────────────────────────────────
function createChrome(name: string) {
  const mat = new PBRMaterial(name, scene);
  mat.albedoColor = new Color3(0.9, 0.9, 0.9);
  mat.metallic = 1;
  mat.roughness = 0;
  return mat;
}

// ─────────────────────────────────
// Brushed Metal
// ─────────────────────────────────
function createBrushedMetal(name: string) {
  const mat = new PBRMaterial(name, scene);
  mat.albedoColor = new Color3(0.7, 0.7, 0.8);
  mat.metallic = 1;
  mat.roughness = 0.4;
  return mat;
}

// ─────────────────────────────────
// Plastic
// ─────────────────────────────────
function createPlastic(name: string, color: Color3) {
  const mat = new PBRMaterial(name, scene);
  mat.albedoColor = color;
  mat.metallic = 0;
  mat.roughness = 0.5;
  return mat;
}

// ─────────────────────────────────
// Wood
// ─────────────────────────────────
function createWood(name: string) {
  const mat = new PBRMaterial(name, scene);
  mat.albedoTexture = new Texture("/textures/wood_albedo.jpg", scene);
  mat.bumpTexture = new Texture("/textures/wood_normal.jpg", scene);
  mat.metallic = 0;
  mat.roughness = 0.8;
  return mat;
}

// ─────────────────────────────────
// Water/Glass
// ─────────────────────────────────
function createWater(name: string) {
  const mat = new PBRMaterial(name, scene);
  mat.albedoColor = new Color3(0.3, 0.5, 0.7);
  mat.metallic = 0;
  mat.roughness = 0;
  mat.alpha = 0.5;
  mat.transparencyMode = 2;
  mat.indexOfRefraction = 1.33;  // water
  return mat;
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "metallic: 1 หมายความว่าอะไร?",
              options: ["พื้นผิวเรียบ", "วัสดุเป็นโลหะ", "โปร่งใส", "มันวาว"],
              correctIndex: 1,
              explanation: "metallic 1 = โลหะ (สะท้อนสี environment), 0 = non-metallic"
            },
            {
              question: "Normal Map ใช้ทำอะไร?",
              options: ["เปลี่ยนสี", "เพิ่ม detail โดยไม่เพิ่ม geometry", "ทำให้โปร่งใส", "เพิ่มแสง"],
              correctIndex: 1,
              explanation: "Normal map fake surface detail ทำให้ดู realistic โดยไม่เพิ่ม polygons"
            },
            {
              question: "roughness: 0 หมายความว่าอะไร?",
              options: ["ผิวหยาบ", "ผิวเรียบ/สะท้อนแสงเหมือนกระจก", "โปร่งใส", "เป็นโลหะ"],
              correctIndex: 1,
              explanation: "roughness 0 = เรียบมาก (mirror), 1 = หยาบ (diffuse)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Property", "คำอธิบาย"]}
          rows={[
            ["Albedo", "สีพื้นฐาน/texture"],
            ["Metallic", "0 = non-metal, 1 = metal"],
            ["Roughness", "0 = smooth/shiny, 1 = rough/matte"],
            ["Normal/Bump", "Surface detail without geometry"],
            ["AO", "Ambient occlusion (เงามุม)"],
            ["Emissive", "Self-illumination (glow)"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ PBR concepts",
            "สร้าง PBRMaterial ได้",
            "ใช้ texture maps ได้",
            "ตั้งค่า environment reflections ได้",
            "พร้อมเรียน Physics Engine!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Physics Engine! ⚡</strong>
        </TipBox>
      </Section>
    </div>
  );
}
