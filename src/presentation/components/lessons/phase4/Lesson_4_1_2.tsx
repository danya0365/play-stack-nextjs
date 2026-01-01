"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Geometry และ Materials</h1>

      <Objectives
        items={[
          "เข้าใจ built-in geometries",
          "ใช้ materials ประเภทต่างๆ",
          "โหลดและใช้ textures",
          "สร้าง custom geometries",
        ]}
      />

      <Section title="Built-in Geometries" icon="📦">
        <CodeBlock
          title="Common Geometries"
          language="javascript"
          code={`
import * as THREE from 'three';

// ─────────────────────────────────
// Box
// ─────────────────────────────────
const box = new THREE.BoxGeometry(
  1,    // width
  1,    // height
  1,    // depth
  2,    // widthSegments (optional)
  2,    // heightSegments
  2     // depthSegments
);

// ─────────────────────────────────
// Sphere
// ─────────────────────────────────
const sphere = new THREE.SphereGeometry(
  0.5,   // radius
  32,    // widthSegments (horizontal)
  16     // heightSegments (vertical)
);

// ─────────────────────────────────
// Cylinder
// ─────────────────────────────────
const cylinder = new THREE.CylinderGeometry(
  0.5,   // radiusTop
  0.5,   // radiusBottom
  1,     // height
  32     // radialSegments
);

// ─────────────────────────────────
// Cone
// ─────────────────────────────────
const cone = new THREE.ConeGeometry(
  0.5,   // radius
  1,     // height
  32     // radialSegments
);

// ─────────────────────────────────
// Torus (Donut)
// ─────────────────────────────────
const torus = new THREE.TorusGeometry(
  0.5,   // radius
  0.2,   // tube radius
  16,    // radialSegments
  100    // tubularSegments
);

// ─────────────────────────────────
// Plane
// ─────────────────────────────────
const plane = new THREE.PlaneGeometry(10, 10, 10, 10);
          `}
        />
      </Section>

      <Section title="Materials Overview" icon="🎨">
        <Table
          headers={["Material", "Description", "Use Case"]}
          rows={[
            ["MeshBasicMaterial", "ไม่สนใจแสง, สีเรียบ", "UI, particles, debug"],
            ["MeshStandardMaterial", "PBR, realistic", "เกมส่วนใหญ่"],
            ["MeshPhongMaterial", "แสงสะท้อน, shiny", "โลหะ, พลาสติก"],
            ["MeshLambertMaterial", "Diffuse, matte", "ผิวด้าน, ประหยัด GPU"],
            ["MeshPhysicalMaterial", "Advanced PBR", "โลหะ, แก้ว, น้ำ"],
          ]}
        />

        <CodeBlock
          title="Material Examples"
          language="javascript"
          code={`
// ─────────────────────────────────
// Basic Material (no light)
// ─────────────────────────────────
const basicMat = new THREE.MeshBasicMaterial({
  color: 0x4ade80,
  wireframe: false
});

// ─────────────────────────────────
// Standard Material (PBR)
// ─────────────────────────────────
const standardMat = new THREE.MeshStandardMaterial({
  color: 0x4ade80,
  roughness: 0.5,  // 0 = smooth/shiny, 1 = rough/matte
  metalness: 0.0    // 0 = plastic, 1 = metal
});

// ─────────────────────────────────
// Physical Material (advanced PBR)
// ─────────────────────────────────
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,    // transparent
  thickness: 0.5,
  ior: 1.5            // index of refraction
});

// ─────────────────────────────────
// Common Properties
// ─────────────────────────────────
const mat = new THREE.MeshStandardMaterial({
  color: 0x4ade80,
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide,  // visible from both sides
  flatShading: false
});
          `}
        />
      </Section>

      <Section title="Textures" icon="🖼️">
        <CodeBlock
          title="Loading Textures"
          language="javascript"
          code={`
const textureLoader = new THREE.TextureLoader();

// ─────────────────────────────────
// Load single texture
// ─────────────────────────────────
const colorTexture = textureLoader.load('/textures/brick_color.jpg');

const material = new THREE.MeshStandardMaterial({
  map: colorTexture
});

// ─────────────────────────────────
// PBR Texture Maps
// ─────────────────────────────────
const colorMap = textureLoader.load('/textures/brick_color.jpg');
const normalMap = textureLoader.load('/textures/brick_normal.jpg');
const roughnessMap = textureLoader.load('/textures/brick_roughness.jpg');
const aoMap = textureLoader.load('/textures/brick_ao.jpg');

const pbrMaterial = new THREE.MeshStandardMaterial({
  map: colorMap,           // Base color
  normalMap: normalMap,    // Surface detail
  roughnessMap: roughnessMap,
  aoMap: aoMap,            // Ambient occlusion
  aoMapIntensity: 1
});

// ─────────────────────────────────
// Texture Settings
// ─────────────────────────────────
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
colorTexture.repeat.set(4, 4);  // Repeat 4x4

colorTexture.minFilter = THREE.LinearMipmapLinearFilter;
colorTexture.magFilter = THREE.LinearFilter;

// For pixel art (no smoothing)
pixelTexture.magFilter = THREE.NearestFilter;
pixelTexture.minFilter = THREE.NearestFilter;
          `}
        />

        <TipBox type="tip">
          <strong>PBR Textures:</strong> ดาวน์โหลด free textures ได้จาก
          polyhaven.com, ambientcg.com, textures.com
        </TipBox>
      </Section>

      <Section title="Environment Maps" icon="🌍">
        <CodeBlock
          title="Reflections with Environment Map"
          language="javascript"
          code={`
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// ─────────────────────────────────
// Load HDR Environment
// ─────────────────────────────────
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/hdri/sunset.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  
  // Set as scene background
  scene.background = texture;
  
  // Set as environment for reflections
  scene.environment = texture;
});

// ─────────────────────────────────
// Cube Map (6 images)
// ─────────────────────────────────
const cubeLoader = new THREE.CubeTextureLoader();
const envMap = cubeLoader.load([
  '/cubemap/px.jpg', '/cubemap/nx.jpg',
  '/cubemap/py.jpg', '/cubemap/ny.jpg',
  '/cubemap/pz.jpg', '/cubemap/nz.jpg'
]);

scene.environment = envMap;

// Chrome ball
const chrome = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0,
    envMap: envMap,
    envMapIntensity: 1
  })
);
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "roughness: 0 หมายความว่าอะไร?",
              options: ["ผิวหยาบมาก", "ผิวเรียบ/มันวาวมาก", "โปร่งใส", "เป็นโลหะ"],
              correctIndex: 1,
              explanation: "roughness 0 = เรียบและมันวาว, 1 = หยาบและด้าน"
            },
            {
              question: "Normal Map ใช้ทำอะไร?",
              options: ["เปลี่ยนสี", "เพิ่มรายละเอียดพื้นผิวโดยไม่เพิ่ม polygons", "ทำให้โปร่งใส", "เพิ่มแสง"],
              correctIndex: 1,
              explanation: "Normal map สร้าง illusion ของ depth และ detail โดยเปลี่ยน surface normals"
            },
            {
              question: "MeshBasicMaterial ต่างจาก MeshStandardMaterial อย่างไร?",
              options: ["เร็วกว่า", "ไม่ตอบสนองต่อแสง", "ใช้ PBR", "รองรับ texture"],
              correctIndex: 1,
              explanation: "BasicMaterial ไม่คำนวณแสง จึงเร็วแต่ดูไม่ realistic"
            },
            {
              question: "Environment map ใช้ทำอะไร?",
              options: ["วาดพื้นหลัง", "สร้าง reflections บนวัตถุ", "โหลด geometry", "เพิ่มแสง"],
              correctIndex: 1,
              explanation: "Environment map ใช้สร้าง reflections และ ambient lighting"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Geometry", "รูปร่างของ 3D object"],
            ["Material", "ลักษณะพื้นผิว (สี, ความมันวาว)"],
            ["Texture", "รูปภาพที่ wrap บน surface"],
            ["Normal Map", "เพิ่ม detail โดยไม่เพิ่ม polygons"],
            ["Environment Map", "สร้าง reflections"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ built-in geometries ได้",
            "เลือก material ที่เหมาะสมได้",
            "โหลดและใช้ textures ได้",
            "ใช้ environment maps สร้าง reflections ได้",
            "พร้อมเรียน Lighting & Shadows!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Lighting & Shadows! 💡</strong>
        </TipBox>
      </Section>
    </div>
  );
}
