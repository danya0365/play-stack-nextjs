"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_3_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Collision Events และ Forces</h1>

      <Objectives
        items={[
          "Collision events และ callbacks",
          "Apply forces และ impulses",
          "Character controller ด้วย physics",
          "Projectiles และ explosions",
        ]}
      />

      <Section title="Collision Events" icon="💥">
        <CodeBlock
          title="Collision Callbacks"
          language="javascript"
          code={`
// ─────────────────────────────────
// Collision event on body
// ─────────────────────────────────
playerBody.addEventListener('collide', (event) => {
  const otherBody = event.body;
  const contact = event.contact;
  
  console.log('Collided with:', otherBody.id);
  
  // Get collision strength
  const impactVelocity = contact.getImpactVelocityAlongNormal();
  console.log('Impact velocity:', impactVelocity);
  
  // Strong impact = damage
  if (Math.abs(impactVelocity) > 10) {
    takeDamage(Math.abs(impactVelocity));
    playSound('impact');
  }
  
  // Check what we hit
  if (otherBody.userData?.type === 'enemy') {
    handleEnemyCollision(otherBody);
  }
  else if (otherBody.userData?.type === 'pickup') {
    collectItem(otherBody);
  }
});

// ─────────────────────────────────
// World collision event
// ─────────────────────────────────
world.addEventListener('postStep', () => {
  // Called after each physics step
  // Good for checking all contacts
});

// ─────────────────────────────────
// Begin/End contact (trigger style)
// ─────────────────────────────────
world.addEventListener('beginContact', (event) => {
  const bodyA = event.bodyA;
  const bodyB = event.bodyB;
  
  console.log('Contact started between', bodyA.id, 'and', bodyB.id);
});

world.addEventListener('endContact', (event) => {
  console.log('Contact ended');
});
          `}
        />
      </Section>

      <Section title="Forces vs Impulses" icon="⚡">
        <TipBox type="info">
          <strong>Force vs Impulse:</strong>
          <ul className="mt-2 space-y-1">
            <li>• <strong>Force:</strong> ใช้ต่อเนื่อง (เช่น thrust, gravity)</li>
            <li>• <strong>Impulse:</strong> ใช้ครั้งเดียว (เช่น jump, explosion)</li>
          </ul>
        </TipBox>

        <CodeBlock
          title="Applying Forces"
          language="javascript"
          code={`
// ─────────────────────────────────
// Apply force (continuous)
// ─────────────────────────────────
// World space force
body.applyForce(
  new CANNON.Vec3(100, 0, 0),  // force vector
  body.position               // point of application
);

// Local space force (relative to body rotation)
body.applyLocalForce(
  new CANNON.Vec3(0, 0, -100),  // forward thrust
  new CANNON.Vec3(0, 0, 0)      // at center
);

// ─────────────────────────────────
// Apply impulse (instant)
// ─────────────────────────────────
// World space
body.applyImpulse(
  new CANNON.Vec3(0, 50, 0),  // jump impulse
  body.position
);

// Local space
body.applyLocalImpulse(
  new CANNON.Vec3(0, 0, -20),  // push forward
  new CANNON.Vec3(0, 0, 0)
);

// ─────────────────────────────────
// Apply torque (rotation force)
// ─────────────────────────────────
body.applyTorque(new CANNON.Vec3(0, 10, 0));  // spin

// ─────────────────────────────────
// Direct velocity control
// ─────────────────────────────────
body.velocity.set(5, 0, 0);           // set velocity
body.angularVelocity.set(0, 5, 0);    // set spin
          `}
        />
      </Section>

      <Section title="Character Controller" icon="🏃">
        <CodeBlock
          title="Physics-Based Character"
          language="javascript"
          code={`
class PhysicsCharacter {
  constructor(world, scene) {
    this.world = world;
    this.scene = scene;
    
    // Physics body
    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.5),
      position: new CANNON.Vec3(0, 2, 0),
      fixedRotation: true,  // don't tumble
      linearDamping: 0.9    // stop quickly
    });
    world.addBody(this.body);
    
    // Visual
    this.mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x4ade80 })
    );
    scene.add(this.mesh);
    
    // State
    this.speed = 10;
    this.jumpForce = 8;
    this.isGrounded = false;
    
    // Ground check
    this.setupGroundCheck();
  }
  
  setupGroundCheck() {
    this.body.addEventListener('collide', (e) => {
      const contact = e.contact;
      const normal = contact.ni;
      
      // Check if collision is from below
      if (normal.y > 0.5) {
        this.isGrounded = true;
      }
    });
  }
  
  move(direction, delta) {
    const force = new CANNON.Vec3(
      direction.x * this.speed,
      0,
      direction.z * this.speed
    );
    
    // Apply force only if on ground
    if (this.isGrounded) {
      this.body.velocity.x = force.x;
      this.body.velocity.z = force.z;
    } else {
      // Air control (reduced)
      this.body.velocity.x += force.x * 0.1 * delta;
      this.body.velocity.z += force.z * 0.1 * delta;
    }
  }
  
  jump() {
    if (this.isGrounded) {
      this.body.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }
  }
  
  update() {
    // Sync visual
    this.mesh.position.copy(this.body.position);
    this.mesh.position.y -= 0.5;  // offset for capsule
    
    // Reset grounded each frame
    this.isGrounded = false;
  }
}

// Usage
const player = new PhysicsCharacter(world, scene);

function animate() {
  const direction = new THREE.Vector3();
  if (keys['KeyW']) direction.z = -1;
  if (keys['KeyS']) direction.z = 1;
  if (keys['KeyA']) direction.x = -1;
  if (keys['KeyD']) direction.x = 1;
  direction.normalize();
  
  player.move(direction, delta);
  if (keys['Space']) player.jump();
  
  world.step(1/60, delta, 3);
  player.update();
}
          `}
        />
      </Section>

      <Section title="Projectiles" icon="🎯">
        <CodeBlock
          title="Shooting Projectiles"
          language="javascript"
          code={`
class Projectile {
  constructor(world, scene, position, direction, speed = 50) {
    this.world = world;
    this.scene = scene;
    this.alive = true;
    this.damage = 10;
    this.lifetime = 3;  // seconds
    
    // Physics
    this.body = new CANNON.Body({
      mass: 0.1,
      shape: new CANNON.Sphere(0.1),
      position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    
    // Set velocity
    this.body.velocity.set(
      direction.x * speed,
      direction.y * speed,
      direction.z * speed
    );
    
    // Disable gravity for projectile
    this.body.linearDamping = 0;
    this.body.angularDamping = 0;
    
    world.addBody(this.body);
    
    // Visual
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    scene.add(this.mesh);
    
    // Collision
    this.body.addEventListener('collide', (e) => {
      this.onHit(e.body);
    });
  }
  
  onHit(otherBody) {
    if (otherBody.userData?.type === 'enemy') {
      otherBody.userData.health -= this.damage;
      spawnHitEffect(this.body.position);
    }
    this.destroy();
  }
  
  update(delta) {
    if (!this.alive) return;
    
    this.lifetime -= delta;
    if (this.lifetime <= 0) {
      this.destroy();
      return;
    }
    
    this.mesh.position.copy(this.body.position);
  }
  
  destroy() {
    if (!this.alive) return;
    this.alive = false;
    
    this.world.removeBody(this.body);
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

// Shooting
const projectiles = [];

function shoot(origin, direction) {
  const proj = new Projectile(world, scene, origin, direction);
  projectiles.push(proj);
}

// Update all projectiles
function animate() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update(delta);
    if (!projectiles[i].alive) {
      projectiles.splice(i, 1);
    }
  }
}
          `}
        />
      </Section>

      <Section title="Explosions" icon="💣">
        <CodeBlock
          title="Explosion Force"
          language="javascript"
          code={`
function createExplosion(position, radius = 5, strength = 100) {
  // Find all bodies in radius
  for (const body of world.bodies) {
    if (body.mass === 0) continue;  // skip static
    
    const distance = body.position.distanceTo(position);
    
    if (distance < radius) {
      // Calculate force
      const falloff = 1 - (distance / radius);
      const direction = new CANNON.Vec3();
      direction.copy(body.position);
      direction.vsub(position, direction);
      direction.normalize();
      
      // Apply impulse
      const force = direction.scale(strength * falloff);
      body.applyImpulse(force, body.position);
      
      // Damage (if has health)
      if (body.userData?.health !== undefined) {
        body.userData.health -= 50 * falloff;
      }
    }
  }
  
  // Visual effect
  spawnExplosionEffect(position);
  playSound('explosion');
  cameraShake.shake(0.5, 0.3);
}

// Delayed explosion (grenade)
function throwGrenade(position, velocity) {
  const grenade = createProjectile(position, velocity);
  grenade.body.linearDamping = 0.3;
  
  setTimeout(() => {
    createExplosion(grenade.body.position, 5, 150);
    grenade.destroy();
  }, 2000);
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Method", "Use Case"]}
          rows={[
            ["applyForce()", "Continuous force (thrust)"],
            ["applyImpulse()", "Instant force (jump)"],
            ["applyTorque()", "Rotation force"],
            ["addEventListener('collide')", "On collision"],
            ["fixedRotation: true", "Prevent tumbling"],
            ["linearDamping", "Slow down over time"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Constraints และ Vehicles! 🚗</strong>
        </TipBox>
      </Section>
    </div>
  );
}
