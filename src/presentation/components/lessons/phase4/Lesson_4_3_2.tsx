"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_3_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">PlayCanvas Scripting</h1>

      <Objectives
        items={[
          "เขียน Scripts ขั้นสูงใน PlayCanvas",
          "ใช้ Events และ Communication",
          "จัดการ Physics",
          "Publish และ Deploy",
        ]}
      />

      <Section title="Entity Communication" icon="📡">
        <CodeBlock
          title="Find and Access Entities"
          language="javascript"
          code={`
var GameManager = pc.createScript('gameManager');

GameManager.prototype.initialize = function() {
  // ─────────────────────────────────
  // Find entities
  // ─────────────────────────────────
  this.player = this.app.root.findByName('Player');
  this.enemies = this.app.root.findByTag('enemy');
  
  // Find by path
  this.healthUI = this.app.root.findByPath('UI/Canvas/HealthBar');
  
  // ─────────────────────────────────
  // Access components
  // ─────────────────────────────────
  var playerScript = this.player.script.playerController;
  playerScript.takeDamage(10);
  
  // Access rigidbody
  var rb = this.player.rigidbody;
  rb.applyImpulse(0, 10, 0);
};

GameManager.prototype.update = function(dt) {
  // Check all enemies
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy = this.enemies[i];
    // Do something with each enemy
  }
};
          `}
        />
      </Section>

      <Section title="Events System" icon="🎯">
        <CodeBlock
          title="Custom Events"
          language="javascript"
          code={`
// ─────────────────────────────────
// Fire events
// ─────────────────────────────────
var Player = pc.createScript('player');

Player.prototype.takeDamage = function(amount) {
  this.health -= amount;
  
  // Fire event on this entity
  this.entity.fire('damage', amount, this.health);
  
  // Fire global event
  this.app.fire('player:damaged', { 
    damage: amount, 
    health: this.health 
  });
  
  if (this.health <= 0) {
    this.app.fire('player:died');
  }
};

// ─────────────────────────────────
// Listen to events
// ─────────────────────────────────
var HealthUI = pc.createScript('healthUI');

HealthUI.prototype.initialize = function() {
  // Listen to app events
  this.app.on('player:damaged', this.onPlayerDamaged, this);
  this.app.on('player:died', this.onPlayerDied, this);
};

HealthUI.prototype.onPlayerDamaged = function(data) {
  // Update health bar
  var percent = data.health / 100;
  this.entity.element.width = percent * 200;
};

HealthUI.prototype.onPlayerDied = function() {
  // Show game over
  this.app.root.findByName('GameOverScreen').enabled = true;
};

// ─────────────────────────────────
// Cleanup listeners
// ─────────────────────────────────
HealthUI.prototype.destroy = function() {
  this.app.off('player:damaged', this.onPlayerDamaged, this);
  this.app.off('player:died', this.onPlayerDied, this);
};
          `}
        />
      </Section>

      <Section title="Physics" icon="⚡">
        <CodeBlock
          title="Physics in PlayCanvas"
          language="javascript"
          code={`
var PhysicsExample = pc.createScript('physicsExample');

PhysicsExample.prototype.initialize = function() {
  var rb = this.entity.rigidbody;
  
  // ─────────────────────────────────
  // Apply forces
  // ─────────────────────────────────
  rb.applyForce(0, 100, 0);           // Continuous force
  rb.applyImpulse(0, 10, 0);          // Instant impulse
  rb.applyTorque(0, 50, 0);           // Rotation force
  
  // Set velocity directly
  rb.linearVelocity = new pc.Vec3(0, 5, 0);
  rb.angularVelocity = new pc.Vec3(0, 3, 0);
  
  // ─────────────────────────────────
  // Collision events
  // ─────────────────────────────────
  this.entity.collision.on('collisionstart', function(result) {
    console.log('Hit:', result.other.name);
    
    // Get contact point
    var contact = result.contacts[0];
    console.log('Contact point:', contact.point);
    console.log('Contact normal:', contact.normal);
  });
  
  this.entity.collision.on('triggerenter', function(entity) {
    console.log('Entered trigger:', entity.name);
  });
};

PhysicsExample.prototype.update = function(dt) {
  // ─────────────────────────────────
  // Raycast
  // ─────────────────────────────────
  var from = this.entity.getPosition();
  var to = from.clone().add(new pc.Vec3(0, 0, -10));
  
  var result = this.app.systems.rigidbody.raycastFirst(from, to);
  
  if (result) {
    console.log('Ray hit:', result.entity.name);
    console.log('Distance:', result.point.distance(from));
  }
};
          `}
        />
      </Section>

      <Section title="Publishing" icon="🚀">
        <CodeBlock
          title="Publish Your Game"
          language="text"
          code={`
1. เปิด Project Settings (gear icon)
2. ไปที่ Publish tab

Publishing Options:
├── PlayCanvas Hosting (free)
│   └── yourproject.playcanvas.com
│
├── Download Build
│   └── ZIP file สำหรับ self-host
│
└── Facebook Instant Games
    └── Export สำหรับ Facebook
          `}
        />

        <TipBox type="tip">
          <strong>Optimization Tips:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Compress textures (JPEG, PNG)</li>
            <li>• Use texture atlases</li>
            <li>• Reduce polygon count</li>
            <li>• Enable asset preloading</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "findByTag() ใช้ทำอะไร?",
              options: ["หา entity ตามชื่อ", "หา entities ทั้งหมดที่มี tag เดียวกัน", "สร้าง tag", "ลบ entity"],
              correctIndex: 1,
              explanation: "findByTag return array ของ entities ที่มี tag นั้น"
            },
            {
              question: "this.app.fire() ใช้ทำอะไร?",
              options: ["ยิงกระสุน", "ส่ง global event", "สร้างไฟ effect", "ลบ entity"],
              correctIndex: 1,
              explanation: "app.fire ส่ง event ที่ทุก script ใน app ฟังได้"
            },
            {
              question: "rb.applyImpulse() ต่างจาก applyForce() อย่างไร?",
              options: ["ไม่ต่าง", "Impulse = instant, Force = continuous", "Force = instant", "Impulse ใช้กับ static เท่านั้น"],
              correctIndex: 1,
              explanation: "Impulse ใช้ทันที (jump), Force ใช้ต่อเนื่อง (engine)"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["findByName/Tag", "ค้นหา entities"],
            ["fire()/on()", "Event system"],
            ["rigidbody", "Physics component"],
            ["collision", "Collision detection"],
            ["raycastFirst", "Ray casting"],
          ]}
        />

        <ProgressCheck
          items={[
            "ค้นหาและสื่อสารระหว่าง entities ได้",
            "ใช้ event system ได้",
            "จัดการ physics ได้",
            "Publish เกมได้",
            "พร้อมเรียน Unity WebGL!"
          ]}
        />

        <TipBox type="success">
          <strong>Module ต่อไป: Unity WebGL! 🎯</strong>
        </TipBox>
      </Section>
    </div>
  );
}
