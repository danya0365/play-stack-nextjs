"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Materials และ Textures</h1>

      <Objectives
        items={[
          "Material types และความแตกต่าง",
          "โหลดและใช้ textures",
          "PBR Materials สำหรับ realistic rendering",
          "Environment maps และ reflections",
        ]}
      />

      <Section title="Material Types" icon="🎨">
        <Table
          headers={["Material", "Use Case", "Performance"]}
          rows={[
            ["MeshBasicMaterial", "ไม่ต้องการ lighting", "เร็วมาก"],
            ["MeshLambertMaterial", "Matte surfaces", "เร็ว"],
            ["MeshPhongMaterial", "Shiny surfaces", "ปานกลาง"],
            ["MeshStandardMaterial", "PBR (realistic)", "ช้ากว่า"],
            ["MeshPhysicalMaterial", "Glass, clearcoat", "ช้าสุด"],
          ]}
        />

        <CodeBlock
          title="Material Comparison"
          language="javascript"
          code={`
// ─────────────────────────────────
// Basic - No lighting
// ─────────────────────────────────
const basicMat = new THREE.MeshBasicMaterial({
  color: 0x4ade80,
  wireframe: false
});

// ─────────────────────────────────
// Lambert - Matte (non-shiny)
// ─────────────────────────────────
const lambertMat = new THREE.MeshLambertMaterial({
  color: 0x60a5fa,
  emissive: 0x222222
});

// ─────────────────────────────────
// Phong - Shiny with specular
// ─────────────────────────────────
const phongMat = new THREE.MeshPhongMaterial({
  color: 0xf472b6,
  specular: 0xffffff,
  shininess: 100
});

// ─────────────────────────────────
// Standard - PBR (recommended)
// ─────────────────────────────────
const standardMat = new THREE.MeshStandardMaterial({
  color: 0xfbbf24,
  metalness: 0.5,      // 0 = plastic, 1 = metal
  roughness: 0.3       // 0 = smooth, 1 = rough
});

// ─────────────────────────────────
// Physical - Advanced PBR
// ─────────────────────────────────
const physicalMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,     // glass transparency
  thickness: 0.5,      // glass thickness
  clearcoat: 1,        // car paint effect
  clearcoatRoughness: 0.1
});
          `}
        />
      </Section>

      <Section title="Loading Textures" icon="🖼️">
        <CodeBlock
          title="TextureLoader"
          language="javascript"
          code={`
const textureLoader = new THREE.TextureLoader();

// ─────────────────────────────────
// Load single texture
// ─────────────────────────────────
const texture = textureLoader.load(
  'textures/brick.jpg',
  // onLoad callback
  (tex) => console.log('Texture loaded!'),
  // onProgress callback
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  // onError callback
  (err) => console.error('Error loading texture')
);

// Apply to material
const material = new THREE.MeshStandardMaterial({
  map: texture
});

// ─────────────────────────────────
// Texture settings
// ─────────────────────────────────
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);  // tile 4x4

texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// ─────────────────────────────────
// Load multiple textures
// ─────────────────────────────────
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => console.log('All textures loaded!');
loadingManager.onProgress = (url, loaded, total) => {
  console.log(\`Loading: \${loaded}/\${total}\`);
};

const loader = new THREE.TextureLoader(loadingManager);
const colorMap = loader.load('textures/color.jpg');
const normalMap = loader.load('textures/normal.jpg');
const roughnessMap = loader.load('textures/roughness.jpg');
          `}
        />
      </Section>

      <Section title="PBR Textures" icon="✨">
        <TipBox type="info">
          <strong>PBR Texture Set:</strong>
          <ul className="mt-2 space-y-1">
            <li>• <strong>Color/Albedo</strong> - Base color</li>
            <li>• <strong>Normal</strong> - Surface detail</li>
            <li>• <strong>Roughness</strong> - Surface smoothness</li>
            <li>• <strong>Metalness</strong> - Metal vs non-metal</li>
            <li>• <strong>AO</strong> - Ambient occlusion</li>
            <li>• <strong>Height/Displacement</strong> - Geometry detail</li>
          </ul>
        </TipBox>

        <CodeBlock
          title="Full PBR Material"
          language="javascript"
          code={`
const loader = new THREE.TextureLoader();

// Load all maps
const colorMap = loader.load('textures/brick/color.jpg');
const normalMap = loader.load('textures/brick/normal.jpg');
const roughnessMap = loader.load('textures/brick/roughness.jpg');
const aoMap = loader.load('textures/brick/ao.jpg');
const displacementMap = loader.load('textures/brick/height.jpg');

// Create PBR material
const brickMaterial = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  normalScale: new THREE.Vector2(1, 1),
  roughnessMap: roughnessMap,
  roughness: 1,
  aoMap: aoMap,
  aoMapIntensity: 1,
  displacementMap: displacementMap,
  displacementScale: 0.1
});

// Important: Set UV2 for AO map
const geometry = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);
geometry.setAttribute('uv2', geometry.attributes.uv);

const mesh = new THREE.Mesh(geometry, brickMaterial);
scene.add(mesh);
          `}
        />
      </Section>

      <Section title="Environment Maps" icon="🌌">
        <CodeBlock
          title="Cube Environment Map"
          language="javascript"
          code={`
// ─────────────────────────────────
// Load cubemap (6 images)
// ─────────────────────────────────
const cubeLoader = new THREE.CubeTextureLoader();
const envMap = cubeLoader.load([
  'envmap/px.jpg', 'envmap/nx.jpg',  // positive/negative X
  'envmap/py.jpg', 'envmap/ny.jpg',  // positive/negative Y
  'envmap/pz.jpg', 'envmap/nz.jpg'   // positive/negative Z
]);

// Set as scene background
scene.background = envMap;
scene.environment = envMap;  // affects all PBR materials

// ─────────────────────────────────
// Reflective material
// ─────────────────────────────────
const chromeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0,
  envMap: envMap,
  envMapIntensity: 1
});

const chromeSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  chromeMaterial
);
scene.add(chromeSphere);

// ─────────────────────────────────
// HDR Environment (more realistic)
// ─────────────────────────────────
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('env.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
          `}
        />
      </Section>

      <Section title="Special Materials" icon="🔮">
        <CodeBlock
          title="Glass & Transparent Materials"
          language="javascript"
          code={`
// ─────────────────────────────────
// Glass
// ─────────────────────────────────
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,      // glass mode
  thickness: 1,
  ior: 1.5,             // index of refraction
  envMapIntensity: 1
});

// ─────────────────────────────────
// Water
// ─────────────────────────────────
const waterMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x4488ff,
  metalness: 0,
  roughness: 0.1,
  transmission: 0.8,
  thickness: 0.5,
  ior: 1.33
});

// ─────────────────────────────────
// Emissive (Glowing)
// ─────────────────────────────────
const glowMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xff0000,
  emissiveIntensity: 2
});

// ─────────────────────────────────
// Two-sided material
// ─────────────────────────────────
const doubleSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x4ade80,
  side: THREE.DoubleSide
});

// ─────────────────────────────────
// Wireframe
// ─────────────────────────────────
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true
});
          `}
        />
      </Section>

      <Section title="Material Properties" icon="🔧">
        <CodeBlock
          title="Runtime Material Updates"
          language="javascript"
          code={`
// Change color
material.color.setHex(0xff0000);
material.color.set('#4ade80');
material.color.setRGB(0.5, 1, 0.5);

// Change properties
material.metalness = 0.8;
material.roughness = 0.2;
material.opacity = 0.5;
material.transparent = true;

// Animate properties
function animate() {
  requestAnimationFrame(animate);
  
  // Pulsing glow
  const intensity = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
  glowMaterial.emissiveIntensity = intensity * 3;
  
  // Color cycling
  const hue = (Date.now() * 0.0001) % 1;
  material.color.setHSL(hue, 1, 0.5);
  
  renderer.render(scene, camera);
}

// Clone material
const newMaterial = material.clone();
newMaterial.color.setHex(0x00ff00);
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Property", "คำอธิบาย"]}
          rows={[
            ["map", "Color/Albedo texture"],
            ["normalMap", "Surface bumps/detail"],
            ["roughnessMap", "Surface smoothness"],
            ["metalnessMap", "Metal areas"],
            ["envMap", "Reflections"],
            ["emissive", "Glow color"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: 3D Models - GLTF Loader! 🏛️</strong>
        </TipBox>
      </Section>
    </div>
  );
}
