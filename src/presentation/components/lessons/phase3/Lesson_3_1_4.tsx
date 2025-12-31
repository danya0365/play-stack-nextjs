"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_1_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Camera Controls</h1>

      <Objectives
        items={[
          "OrbitControls สำหรับ 3rd person",
          "PointerLockControls สำหรับ FPS",
          "Custom camera follow",
          "Raycast สำหรับ picking objects",
        ]}
      />

      <Section title="OrbitControls" icon="🔄">
        <CodeBlock
          title="Orbit Around Target"
          language="javascript"
          code={`
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);

// Configuration
controls.enableDamping = true;     // smooth movement
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1;
controls.panSpeed = 0.5;

// Limits
controls.minDistance = 2;          // min zoom
controls.maxDistance = 50;         // max zoom
controls.minPolarAngle = 0;        // top limit (0 = top down)
controls.maxPolarAngle = Math.PI / 2;  // bottom limit (PI/2 = horizon)

// Lock vertical axis
controls.minAzimuthAngle = -Math.PI / 4;  // left limit
controls.maxAzimuthAngle = Math.PI / 4;   // right limit

// Disable features
controls.enablePan = false;        // no panning
controls.enableZoom = true;
controls.enableRotate = true;

// Target (what camera looks at)
controls.target.set(0, 1, 0);

// Update in animation loop
function animate() {
  requestAnimationFrame(animate);
  
  controls.update();  // required when damping is enabled
  
  renderer.render(scene, camera);
}
          `}
        />
      </Section>

      <Section title="PointerLock (FPS)" icon="🎯">
        <CodeBlock
          title="First Person Controls"
          language="javascript"
          code={`
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

// Create controls
const controls = new PointerLockControls(camera, document.body);

// Click to lock
document.addEventListener('click', () => {
  controls.lock();
});

// Events
controls.addEventListener('lock', () => {
  console.log('Pointer locked');
  // Hide menu, show crosshair
});

controls.addEventListener('unlock', () => {
  console.log('Pointer unlocked');
  // Show menu
});

// Add to scene (for movement)
scene.add(controls.getObject());

// Movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const moveForward = { pressed: false };
const moveBackward = { pressed: false };
const moveLeft = { pressed: false };
const moveRight = { pressed: false };

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW': moveForward.pressed = true; break;
    case 'KeyS': moveBackward.pressed = true; break;
    case 'KeyA': moveLeft.pressed = true; break;
    case 'KeyD': moveRight.pressed = true; break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': moveForward.pressed = false; break;
    case 'KeyS': moveBackward.pressed = false; break;
    case 'KeyA': moveLeft.pressed = false; break;
    case 'KeyD': moveRight.pressed = false; break;
  }
});

// Update
const speed = 10;
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  if (controls.isLocked) {
    const delta = clock.getDelta();
    
    // Damping
    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;
    
    // Direction
    direction.z = Number(moveForward.pressed) - Number(moveBackward.pressed);
    direction.x = Number(moveRight.pressed) - Number(moveLeft.pressed);
    direction.normalize();
    
    // Apply movement
    if (moveForward.pressed || moveBackward.pressed) {
      velocity.z -= direction.z * speed * delta;
    }
    if (moveLeft.pressed || moveRight.pressed) {
      velocity.x -= direction.x * speed * delta;
    }
    
    controls.moveRight(-velocity.x);
    controls.moveForward(-velocity.z);
  }
  
  renderer.render(scene, camera);
}
          `}
        />
      </Section>

      <Section title="Third Person Camera" icon="👤">
        <CodeBlock
          title="Follow Player Camera"
          language="javascript"
          code={`
class ThirdPersonCamera {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;
    
    this.offset = new THREE.Vector3(0, 3, 5);
    this.lookAtOffset = new THREE.Vector3(0, 1, 0);
    this.smoothness = 0.1;
    
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
  }
  
  update() {
    // Calculate desired position
    const targetPosition = this.target.position.clone();
    const desiredPosition = targetPosition.clone().add(this.offset);
    
    // Smooth follow
    this.currentPosition.lerp(desiredPosition, this.smoothness);
    this.camera.position.copy(this.currentPosition);
    
    // Calculate look at
    const desiredLookAt = targetPosition.clone().add(this.lookAtOffset);
    this.currentLookAt.lerp(desiredLookAt, this.smoothness);
    this.camera.lookAt(this.currentLookAt);
  }
  
  // Rotate camera around target
  setRotation(angle) {
    const radius = Math.sqrt(this.offset.x ** 2 + this.offset.z ** 2);
    this.offset.x = Math.sin(angle) * radius;
    this.offset.z = Math.cos(angle) * radius;
  }
}

// Usage
const thirdPersonCam = new ThirdPersonCamera(camera, player);

let cameraAngle = 0;

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement) {
    cameraAngle += e.movementX * 0.002;
    thirdPersonCam.setRotation(cameraAngle);
  }
});

function animate() {
  requestAnimationFrame(animate);
  
  thirdPersonCam.update();
  renderer.render(scene, camera);
}
          `}
        />
      </Section>

      <Section title="Raycasting" icon="🎯">
        <CodeBlock
          title="Mouse Picking"
          language="javascript"
          code={`
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Update mouse position
document.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Click to select
document.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const selected = intersects[0].object;
    console.log('Clicked:', selected.name);
    
    // Highlight
    selected.material.emissive?.setHex(0xff0000);
  }
});

// Hover effect
let hoveredObject = null;

function updateHover() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(selectableObjects, true);
  
  // Reset previous
  if (hoveredObject) {
    hoveredObject.material.emissive?.setHex(0x000000);
    hoveredObject = null;
  }
  
  if (intersects.length > 0) {
    hoveredObject = intersects[0].object;
    hoveredObject.material.emissive?.setHex(0x333333);
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

// ─────────────────────────────────
// Raycast from camera center (FPS shooting)
// ─────────────────────────────────
function shoot() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  
  const intersects = raycaster.intersectObjects(enemies, true);
  
  if (intersects.length > 0) {
    const enemy = intersects[0].object;
    const point = intersects[0].point;
    const distance = intersects[0].distance;
    
    // Hit enemy
    enemy.userData.health -= 10;
    spawnHitEffect(point);
    
    console.log(\`Hit at distance: \${distance.toFixed(2)}\`);
  }
}

// ─────────────────────────────────
// Ground picking (RTS style)
// ─────────────────────────────────
function getGroundPosition() {
  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObject(ground);
  
  if (intersects.length > 0) {
    return intersects[0].point;
  }
  return null;
}

document.addEventListener('click', () => {
  const pos = getGroundPosition();
  if (pos) {
    // Move unit to position
    selectedUnit.moveTo(pos.x, pos.z);
  }
});
          `}
        />
      </Section>

      <Section title="Camera Shake" icon="📳">
        <CodeBlock
          title="Screen Shake Effect"
          language="javascript"
          code={`
class CameraShake {
  constructor(camera) {
    this.camera = camera;
    this.originalPosition = camera.position.clone();
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
  }
  
  shake(intensity = 0.5, duration = 0.3) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = 0;
    this.originalPosition.copy(this.camera.position);
  }
  
  update(delta) {
    if (this.shakeTimer < this.shakeDuration) {
      this.shakeTimer += delta;
      
      const progress = this.shakeTimer / this.shakeDuration;
      const currentIntensity = this.shakeIntensity * (1 - progress);
      
      this.camera.position.x = this.originalPosition.x + 
        (Math.random() - 0.5) * currentIntensity;
      this.camera.position.y = this.originalPosition.y + 
        (Math.random() - 0.5) * currentIntensity;
      this.camera.position.z = this.originalPosition.z + 
        (Math.random() - 0.5) * currentIntensity;
      
      if (this.shakeTimer >= this.shakeDuration) {
        this.camera.position.copy(this.originalPosition);
      }
    }
  }
}

// Usage
const cameraShake = new CameraShake(camera);

function onExplosion() {
  cameraShake.shake(0.5, 0.3);
}

function animate() {
  const delta = clock.getDelta();
  cameraShake.update(delta);
  // ...
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "OrbitControls เหมาะกับเกมแบบไหน?",
              options: ["FPS shooter", "3rd person / 3D viewer", "Racing game", "2D platformer"],
              correctIndex: 1,
              explanation: "OrbitControls ช่วยหมุนกล้องรอบ target เหมาะกับ 3D viewer"
            },
            {
              question: "PointerLockControls ใช้ทำอะไร?",
              options: ["หมุนกล้องรอบ object", "ควบคุมกล้องแบบ FPS (ล็อคเมาส์)", "Zoom in/out", "เลื่อนกล้อง"],
              correctIndex: 1,
              explanation: "PointerLockControls ล็อคเมาส์และควบคุมด้วย mouse movement"
            },
            {
              question: "Raycaster ใช้ทำอะไร?",
              options: ["สร้างแสง", "ตรวจจับ object ที่เมาส์ชี้/คลิก", "เคลื่อนย้าย object", "หมุน camera"],
              correctIndex: 1,
              explanation: "Raycaster ยิงลำแสงเพื่อหา objects ที่ถูกชี้ (mouse picking)"
            },
            {
              question: "controls.update() ต้องเรียกเมื่อไหร่?",
              options: ["เมื่อเปิดเกม", "ทุก frame (ถ้าใช้ damping)", "เมื่อคลิก", "เมื่อ resize"],
              correctIndex: 1,
              explanation: "ถ้าใช้ enableDamping ต้องเรียก controls.update() ทุก frame"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Control Type", "Use Case"]}
          rows={[
            ["OrbitControls", "3rd person, editor, viewer"],
            ["PointerLockControls", "First person shooter"],
            ["Custom Follow", "3rd person action game"],
            ["Raycaster", "Mouse picking, shooting"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ OrbitControls ได้",
            "ใช้ PointerLockControls สำหรับ FPS ได้",
            "สร้าง third-person camera follow ได้",
            "ใช้ Raycaster ตรวจจับ object ได้",
            "พร้อมเรียน Physics!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Three.js Basics Module!</strong>
          <br />
          บทต่อไป: Physics with Cannon.js!
        </TipBox>
      </Section>
    </div>
  );
}
