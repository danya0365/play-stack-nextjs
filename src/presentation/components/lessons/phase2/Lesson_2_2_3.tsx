"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_2_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Phaser Physics System</h1>

      <Objectives
        items={[
          "Arcade Physics vs Matter.js",
          "Physics Bodies และ Properties",
          "Collisions และ Overlaps",
          "Custom Collision Handling",
        ]}
      />

      <Section title="Physics Engines ใน Phaser" icon="🔬">
        <Table
          headers={["Feature", "Arcade", "Matter.js"]}
          rows={[
            ["Performance", "⚡ เร็วมาก", "🐢 ช้ากว่า"],
            ["Shapes", "กล่อง/วงกลม", "รูปทรงซับซ้อน"],
            ["Rotation", "❌ ไม่มี", "✅ มี"],
            ["Joints", "❌ ไม่มี", "✅ มี"],
            ["Use Case", "Platformer, Shooter", "Physics puzzle, Ragdoll"],
          ]}
        />

        <CodeBlock
          title="Physics Config"
          language="javascript"
          code={`
const config = {
  physics: {
    default: 'arcade',  // or 'matter'
    
    arcade: {
      gravity: { y: 300 },
      debug: true,       // แสดง collision boxes
      fps: 60,
      timeScale: 1       // slow motion: < 1
    },
    
    // หรือ Matter.js
    matter: {
      gravity: { y: 1 },
      debug: true,
      enableSleep: true
    }
  }
};
          `}
        />
      </Section>

      <Section title="Physics Bodies" icon="📦">
        <CodeBlock
          title="Creating Physics Bodies"
          language="javascript"
          code={`
function create() {
  // ─────────────────────────────────
  // Dynamic body (affected by gravity)
  // ─────────────────────────────────
  const player = this.physics.add.sprite(100, 100, 'player');
  
  // Body properties
  player.body.setSize(24, 40);        // collision box size
  player.body.setOffset(4, 8);        // offset from sprite
  player.body.setCircle(20);          // use circle instead
  player.body.setBounce(0.2, 0.2);    // x, y bounce
  player.body.setDrag(100, 0);        // air resistance
  player.body.setFriction(0.5);       // ground friction
  player.body.setGravityY(500);       // additional gravity
  player.body.setMaxVelocity(400, 600);
  player.body.setCollideWorldBounds(true);
  
  // ─────────────────────────────────
  // Static body (doesn't move)
  // ─────────────────────────────────
  const ground = this.physics.add.staticImage(400, 580, 'ground');
  ground.body.setSize(800, 40);
  ground.refreshBody();  // important after changing static body!
  
  // ─────────────────────────────────
  // Static Group (optimized for many static objects)
  // ─────────────────────────────────
  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  
  // ─────────────────────────────────
  // Dynamic Group
  // ─────────────────────────────────
  const enemies = this.physics.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: { x: 100, y: 0, stepX: 120 },
    // Group defaults
    bounceX: 1,
    bounceY: 0.2,
    collideWorldBounds: true
  });
}
          `}
        />

        <Diagram caption="Body vs Sprite Size">
{`
┌─────────────────────────┐
│     Sprite (32x48)      │
│  ┌───────────────────┐  │
│  │                   │  │
│  │   Body (24x40)    │  │
│  │   ← offset →      │  │
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘
`}
        </Diagram>
      </Section>

      <Section title="Velocity และ Movement" icon="🚀">
        <CodeBlock
          title="Movement Methods"
          language="javascript"
          code={`
function update() {
  // ─────────────────────────────────
  // Direct velocity control
  // ─────────────────────────────────
  player.setVelocityX(-160);
  player.setVelocityY(-330);
  player.setVelocity(100, -200);  // both at once
  
  // ─────────────────────────────────
  // Add velocity (impulse)
  // ─────────────────────────────────
  const currentVel = player.body.velocity;
  player.setVelocity(
    currentVel.x + 10,  // add horizontal force
    currentVel.y - 50   // jump boost
  );
  
  // ─────────────────────────────────
  // Acceleration-based movement
  // ─────────────────────────────────
  player.body.setAccelerationX(0);
  
  if (cursors.left.isDown) {
    player.body.setAccelerationX(-500);
  } else if (cursors.right.isDown) {
    player.body.setAccelerationX(500);
  }
  
  // ─────────────────────────────────
  // Move to point
  // ─────────────────────────────────
  this.physics.moveTo(
    enemy, 
    player.x, 
    player.y, 
    100  // speed
  );
  
  // ─────────────────────────────────
  // Move at angle
  // ─────────────────────────────────
  const angle = Phaser.Math.Angle.Between(
    bullet.x, bullet.y,
    target.x, target.y
  );
  this.physics.velocityFromAngle(
    Phaser.Math.RadToDeg(angle),
    300,  // speed
    bullet.body.velocity
  );
}
          `}
        />
      </Section>

      <Section title="Collisions" icon="💥">
        <CodeBlock
          title="Collision Setup"
          language="javascript"
          code={`
function create() {
  // ─────────────────────────────────
  // Collider - physical collision (blocks)
  // ─────────────────────────────────
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(enemies, enemies);  // enemies collide with each other
  
  // ─────────────────────────────────
  // Collider with callback
  // ─────────────────────────────────
  this.physics.add.collider(
    player, 
    enemies, 
    onPlayerHitEnemy,  // callback
    null,              // process callback (return false to skip)
    this               // context
  );
  
  // ─────────────────────────────────
  // Overlap - trigger only (no blocking)
  // ─────────────────────────────────
  this.physics.add.overlap(player, coins, collectCoin, null, this);
  this.physics.add.overlap(bullets, enemies, bulletHitEnemy, null, this);
  
  // ─────────────────────────────────
  // Process callback (filter collisions)
  // ─────────────────────────────────
  this.physics.add.collider(
    player,
    platforms,
    null,
    (player, platform) => {
      // One-way platform: only collide from above
      return player.body.velocity.y > 0 && 
             player.body.bottom <= platform.body.top + 10;
    },
    this
  );
}

function collectCoin(player, coin) {
  coin.disableBody(true, true);  // hide and disable
  score += 10;
  updateScoreText();
  this.sound.play('coin');
}

function bulletHitEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.health -= bullet.damage;
  
  if (enemy.health <= 0) {
    enemy.destroy();
    spawnExplosion(enemy.x, enemy.y);
  }
}

function onPlayerHitEnemy(player, enemy) {
  // Check if stomping
  if (player.body.velocity.y > 0 && player.body.bottom < enemy.body.top + 20) {
    // Stomp enemy
    enemy.destroy();
    player.setVelocityY(-200);  // bounce
    score += 100;
  } else {
    // Take damage
    takeDamage(enemy.damage);
    knockback(player, enemy);
  }
}
          `}
        />
      </Section>

      <Section title="Advanced Collision" icon="🔧">
        <CodeBlock
          title="Collision Categories"
          language="javascript"
          code={`
// ─────────────────────────────────
// World bounds collision
// ─────────────────────────────────
player.setCollideWorldBounds(true);
player.body.onWorldBounds = true;

this.physics.world.on('worldbounds', (body) => {
  if (body.gameObject === player) {
    // Hit world edge
    if (body.blocked.down) {
      // Fell off bottom
      loseLife();
    }
  }
});

// Custom world bounds
this.physics.world.setBounds(0, 0, 1600, 600);

// ─────────────────────────────────
// Body events
// ─────────────────────────────────
player.body.onOverlap = true;
player.body.onCollide = true;

this.physics.world.on('overlap', (obj1, obj2, body1, body2) => {
  console.log('Overlap detected');
});

// ─────────────────────────────────
// Check touching/blocked
// ─────────────────────────────────
function update() {
  // Is player on ground?
  if (player.body.touching.down || player.body.blocked.down) {
    isGrounded = true;
  }
  
  // Is player touching wall?
  if (player.body.touching.left || player.body.touching.right) {
    // Wall slide
    if (!isGrounded) {
      player.setVelocityY(Math.min(player.body.velocity.y, 100));
    }
  }
}

// ─────────────────────────────────
// Raycasting (line collision)
// ─────────────────────────────────
const ray = new Phaser.Geom.Line(
  player.x, player.y,
  player.x + (facingRight ? 200 : -200), player.y
);

const hits = [];
this.physics.world.intersects(ray, enemies.getChildren(), hits);

if (hits.length > 0) {
  // Enemy in line of sight
  const closestEnemy = hits[0];
}
          `}
        />
      </Section>

      <Section title="Physics Groups" icon="👥">
        <CodeBlock
          title="Group Methods"
          language="javascript"
          code={`
function create() {
  // Create group with config
  bullets = this.physics.add.group({
    classType: Bullet,       // custom class
    maxSize: 20,             // object pool size
    runChildUpdate: true,    // call update() on each
    
    // Default properties for all children
    allowGravity: false,
    collideWorldBounds: true
  });
  
  // Get from pool or create new
  const bullet = bullets.get(player.x, player.y);
  if (bullet) {
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.fire(direction);
  }
}

// Custom Bullet class
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');
  }
  
  fire(direction) {
    this.setVelocityX(direction * 500);
    this.lifespan = 1000;
  }
  
  update(time, delta) {
    this.lifespan -= delta;
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
      this.body.stop();
    }
  }
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Method", "คำอธิบาย"]}
          rows={[
            ["physics.add.collider()", "Physical collision (blocks)"],
            ["physics.add.overlap()", "Trigger collision (no block)"],
            ["body.touching", "Check collision direction"],
            ["body.blocked", "Check against world bounds"],
            ["setCollideWorldBounds()", "Keep in world"],
            ["physics.add.group()", "Group for pooling"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Tilemaps - สร้าง Level ด้วย Tiled! 🗺️</strong>
        </TipBox>
      </Section>
    </div>
  );
}
