"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Loading 3D Models</h1>

      <Objectives
        items={[
          "โหลด GLTF/GLB models",
          "Model animations",
          "FBX และ OBJ loaders",
          "Model optimization",
        ]}
      />

      <Section title="GLTF Format" icon="📦">
        <TipBox type="info">
          <strong>ทำไมต้อง GLTF?</strong>
          <ul className="mt-2 space-y-1">
            <li>• 📦 รองรับ meshes, materials, textures, animations</li>
            <li>• ⚡ Optimized สำหรับ web</li>
            <li>• 🎨 PBR materials built-in</li>
            <li>• 📁 .gltf (JSON) หรือ .glb (binary)</li>
          </ul>
        </TipBox>

        <CodeBlock
          title="GLTFLoader"
          language="javascript"
          code={`
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

// ─────────────────────────────────
// Load model
// ─────────────────────────────────
loader.load(
  'models/character.glb',
  
  // onLoad
  (gltf) => {
    const model = gltf.scene;
    
    // Position & scale
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    
    // Enable shadows
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(model);
    
    // Access animations
    const animations = gltf.animations;
    console.log('Animations:', animations.map(a => a.name));
  },
  
  // onProgress
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  
  // onError
  (error) => {
    console.error('Error loading model:', error);
  }
);
          `}
        />
      </Section>

      <Section title="Animation Mixer" icon="🎬">
        <CodeBlock
          title="Playing Animations"
          language="javascript"
          code={`
let mixer;
let actions = {};

loader.load('models/character.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  
  // ─────────────────────────────────
  // Create AnimationMixer
  // ─────────────────────────────────
  mixer = new THREE.AnimationMixer(model);
  
  // ─────────────────────────────────
  // Create actions from clips
  // ─────────────────────────────────
  gltf.animations.forEach((clip) => {
    actions[clip.name] = mixer.clipAction(clip);
  });
  
  // Play idle animation
  if (actions['Idle']) {
    actions['Idle'].play();
  }
});

// ─────────────────────────────────
// Update in animation loop
// ─────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  // Update animation mixer
  if (mixer) {
    mixer.update(delta);
  }
  
  renderer.render(scene, camera);
}

animate();
          `}
        />
      </Section>

      <Section title="Animation Transitions" icon="🔄">
        <CodeBlock
          title="Smooth Animation Blending"
          language="javascript"
          code={`
let currentAction = null;

function playAnimation(name, fadeTime = 0.5) {
  const newAction = actions[name];
  if (!newAction || newAction === currentAction) return;
  
  // Fade out current action
  if (currentAction) {
    currentAction.fadeOut(fadeTime);
  }
  
  // Fade in new action
  newAction.reset();
  newAction.fadeIn(fadeTime);
  newAction.play();
  
  currentAction = newAction;
}

// ─────────────────────────────────
// State-based animation
// ─────────────────────────────────
function updateCharacter() {
  const isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1;
  const isJumping = !isGrounded;
  
  if (isJumping) {
    playAnimation('Jump', 0.2);
  } else if (isMoving) {
    playAnimation('Run', 0.3);
  } else {
    playAnimation('Idle', 0.5);
  }
}

// ─────────────────────────────────
// One-shot animation (attack)
// ─────────────────────────────────
function attack() {
  const attackAction = actions['Attack'];
  if (!attackAction) return;
  
  attackAction.reset();
  attackAction.setLoop(THREE.LoopOnce, 1);
  attackAction.clampWhenFinished = true;
  
  // Blend with current
  if (currentAction) {
    attackAction.crossFadeFrom(currentAction, 0.2);
  }
  
  attackAction.play();
  
  // Listen for completion
  mixer.addEventListener('finished', (e) => {
    if (e.action === attackAction) {
      playAnimation('Idle');
    }
  });
}
          `}
        />
      </Section>

      <Section title="Other Model Formats" icon="📁">
        <CodeBlock
          title="FBX and OBJ Loaders"
          language="javascript"
          code={`
// ─────────────────────────────────
// FBX Loader
// ─────────────────────────────────
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const fbxLoader = new FBXLoader();
fbxLoader.load('models/character.fbx', (fbx) => {
  fbx.scale.set(0.01, 0.01, 0.01);  // FBX often needs scaling
  
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  scene.add(fbx);
  
  // Animations
  if (fbx.animations.length > 0) {
    mixer = new THREE.AnimationMixer(fbx);
    const action = mixer.clipAction(fbx.animations[0]);
    action.play();
  }
});

// ─────────────────────────────────
// OBJ Loader (no animations)
// ─────────────────────────────────
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

// Load materials first
mtlLoader.load('models/car.mtl', (materials) => {
  materials.preload();
  objLoader.setMaterials(materials);
  
  objLoader.load('models/car.obj', (obj) => {
    scene.add(obj);
  });
});
          `}
        />
      </Section>

      <Section title="Model Optimization" icon="⚡">
        <CodeBlock
          title="Optimization Tips"
          language="javascript"
          code={`
// ─────────────────────────────────
// Draco Compression
// ─────────────────────────────────
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('models/compressed.glb', (gltf) => {
  scene.add(gltf.scene);
});

// ─────────────────────────────────
// Level of Detail (LOD)
// ─────────────────────────────────
const lod = new THREE.LOD();

// High detail (close)
gltfLoader.load('models/character_high.glb', (gltf) => {
  lod.addLevel(gltf.scene, 0);  // distance 0
});

// Medium detail
gltfLoader.load('models/character_med.glb', (gltf) => {
  lod.addLevel(gltf.scene, 50);  // distance 50
});

// Low detail (far)
gltfLoader.load('models/character_low.glb', (gltf) => {
  lod.addLevel(gltf.scene, 100);  // distance 100
});

scene.add(lod);

// Update in render loop
lod.update(camera);

// ─────────────────────────────────
// Instance for repeated objects
// ─────────────────────────────────
gltfLoader.load('models/tree.glb', (gltf) => {
  const treeGeometry = gltf.scene.children[0].geometry;
  const treeMaterial = gltf.scene.children[0].material;
  
  const count = 1000;
  const mesh = new THREE.InstancedMesh(treeGeometry, treeMaterial, count);
  
  const matrix = new THREE.Matrix4();
  
  for (let i = 0; i < count; i++) {
    matrix.setPosition(
      Math.random() * 100 - 50,
      0,
      Math.random() * 100 - 50
    );
    mesh.setMatrixAt(i, matrix);
  }
  
  scene.add(mesh);
});
          `}
        />
      </Section>

      <Section title="Complete Character System" icon="🎮">
        <CodeBlock
          title="Animated Character"
          language="javascript"
          code={`
class Character {
  constructor(scene) {
    this.scene = scene;
    this.model = null;
    this.mixer = null;
    this.actions = {};
    this.currentAction = null;
  }
  
  async load(path) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      
      loader.load(path, (gltf) => {
        this.model = gltf.scene;
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        this.mixer = new THREE.AnimationMixer(this.model);
        
        gltf.animations.forEach((clip) => {
          this.actions[clip.name] = this.mixer.clipAction(clip);
        });
        
        this.scene.add(this.model);
        resolve(this);
      }, undefined, reject);
    });
  }
  
  play(name, fadeTime = 0.3) {
    const action = this.actions[name];
    if (!action || action === this.currentAction) return;
    
    if (this.currentAction) {
      this.currentAction.fadeOut(fadeTime);
    }
    
    action.reset().fadeIn(fadeTime).play();
    this.currentAction = action;
  }
  
  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
  
  setPosition(x, y, z) {
    if (this.model) {
      this.model.position.set(x, y, z);
    }
  }
  
  lookAt(x, y, z) {
    if (this.model) {
      this.model.lookAt(x, y, z);
    }
  }
}

// Usage
const player = new Character(scene);
await player.load('models/player.glb');
player.play('Idle');

function animate() {
  const delta = clock.getDelta();
  player.update(delta);
  // ...
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Loader", "Format", "Animations"]}
          rows={[
            ["GLTFLoader", ".gltf, .glb", "✅ Yes"],
            ["FBXLoader", ".fbx", "✅ Yes"],
            ["OBJLoader", ".obj", "❌ No"],
            ["DRACOLoader", "compressed", "N/A"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Camera Controls และ First-Person! 📷</strong>
        </TipBox>
      </Section>
    </div>
  );
}
