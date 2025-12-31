"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Sprites และ Animations ใน Phaser</h1>

      <Objectives
        items={[
          "โหลดและแสดง Sprites",
          "สร้าง Spritesheet Animations",
          "Animation Events และ Callbacks",
          "สร้าง Character State Machine",
        ]}
      />

      <Section title="Sprite Basics" icon="🖼️">
        <CodeBlock
          title="Creating Sprites"
          language="javascript"
          code={`
function create() {
  // Static image sprite
  const logo = this.add.image(400, 300, 'logo');
  
  // Physics sprite (has physics body)
  const player = this.physics.add.sprite(100, 450, 'player');
  
  // Sprite properties
  player.setScale(2);             // ขยาย 2 เท่า
  player.setOrigin(0.5, 1);       // จุดหมุนที่เท้า
  player.setAlpha(0.8);           // ความโปร่งใส
  player.setTint(0xff0000);       // ใส่สี
  player.setFlipX(true);          // กลับซ้าย-ขวา
  player.setDepth(10);            // layer order
  
  // Physics properties
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.setGravityY(300);
  player.setVelocity(100, -200);
  player.setDrag(50);             // friction
  player.setMaxVelocity(400, 500);
}
          `}
        />
      </Section>

      <Section title="Spritesheet Loading" icon="🎬">
        <Diagram caption="Spritesheet Layout">
{`
┌────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 0  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │
├────┴────┴────┴────┼────┼────┴────┴────┴────┤
│  Walk Left (0-3)  │Idle│  Walk Right (5-8)  │
└───────────────────┴────┴───────────────────┘
        32px x 48px per frame
`}
        </Diagram>

        <CodeBlock
          title="Loading Spritesheets"
          language="javascript"
          code={`
function preload() {
  // Single row spritesheet
  this.load.spritesheet('player', 'assets/player.png', {
    frameWidth: 32,
    frameHeight: 48
  });
  
  // Multi-row spritesheet
  this.load.spritesheet('enemies', 'assets/enemies.png', {
    frameWidth: 64,
    frameHeight: 64,
    startFrame: 0,
    endFrame: 23  // 24 frames total
  });
  
  // Atlas (recommended for complex animations)
  this.load.atlas(
    'hero',
    'assets/hero.png',
    'assets/hero.json'
  );
}
          `}
        />
      </Section>

      <Section title="Creating Animations" icon="🎥">
        <CodeBlock
          title="Animation Config"
          language="javascript"
          code={`
function create() {
  // ─────────────────────────────────
  // Basic Animation
  // ─────────────────────────────────
  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { 
      start: 0, 
      end: 7 
    }),
    frameRate: 10,       // frames per second
    repeat: -1           // -1 = loop forever, 0 = once
  });
  
  // ─────────────────────────────────
  // Custom frame order
  // ─────────────────────────────────
  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('player', { 
      frames: [8, 9, 10, 11, 10, 9]  // custom order
    }),
    frameRate: 12,
    repeat: 0  // play once
  });
  
  // ─────────────────────────────────
  // Different durations per frame
  // ─────────────────────────────────
  this.anims.create({
    key: 'attack',
    frames: [
      { key: 'player', frame: 12, duration: 50 },   // wind up (fast)
      { key: 'player', frame: 13, duration: 100 },  // strike
      { key: 'player', frame: 14, duration: 200 },  // follow through (slow)
      { key: 'player', frame: 13, duration: 100 },
      { key: 'player', frame: 12, duration: 50 }
    ],
    repeat: 0
  });
  
  // ─────────────────────────────────
  // Atlas-based animation
  // ─────────────────────────────────
  this.anims.create({
    key: 'hero-run',
    frames: this.anims.generateFrameNames('hero', {
      prefix: 'run_',     // frame names: run_0, run_1, etc
      suffix: '.png',
      start: 0,
      end: 7,
      zeroPad: 2          // run_00, run_01, etc
    }),
    frameRate: 12,
    repeat: -1
  });
}
          `}
        />
      </Section>

      <Section title="Playing Animations" icon="▶️">
        <CodeBlock
          title="Animation Playback"
          language="javascript"
          code={`
function update() {
  // Play animation (won't restart if already playing)
  player.anims.play('walk', true);
  
  // Force restart
  player.anims.play('attack', false);
  
  // Stop animation
  player.anims.stop();
  
  // Pause/Resume
  player.anims.pause();
  player.anims.resume();
  
  // Check current animation
  if (player.anims.currentAnim?.key === 'attack') {
    // Don't allow movement during attack
    return;
  }
  
  // Check if animation is playing
  if (!player.anims.isPlaying) {
    player.anims.play('idle');
  }
  
  // Get current frame
  const frame = player.anims.currentFrame?.index;
  
  // Chain animations
  player.anims.chain('idle');  // play after current finishes
}
          `}
        />
      </Section>

      <Section title="Animation Events" icon="📡">
        <CodeBlock
          title="Animation Callbacks"
          language="javascript"
          code={`
function create() {
  // ─────────────────────────────────
  // On Complete
  // ─────────────────────────────────
  player.on('animationcomplete', (anim, frame) => {
    if (anim.key === 'death') {
      this.scene.restart();
    }
  });
  
  // ─────────────────────────────────
  // Specific animation complete
  // ─────────────────────────────────
  player.on('animationcomplete-attack', () => {
    console.log('Attack finished!');
    canAttack = true;  // allow next attack
  });
  
  // ─────────────────────────────────
  // On specific frame
  // ─────────────────────────────────
  player.on('animationupdate', (anim, frame) => {
    // Spawn hitbox on attack frame 2
    if (anim.key === 'attack' && frame.index === 2) {
      spawnAttackHitbox();
    }
  });
  
  // ─────────────────────────────────
  // Animation start
  // ─────────────────────────────────
  player.on('animationstart', (anim) => {
    if (anim.key === 'jump') {
      this.sound.play('jump');
    }
  });
  
  // ─────────────────────────────────
  // Loop iteration
  // ─────────────────────────────────
  player.on('animationrepeat', (anim) => {
    // Play footstep sound on each walk cycle
    if (anim.key === 'walk') {
      this.sound.play('footstep');
    }
  });
}
          `}
        />
      </Section>

      <Section title="Character State Machine" icon="🔄">
        <CodeBlock
          title="State-based Animation"
          language="javascript"
          code={`
// Character states
const State = {
  IDLE: 'idle',
  WALKING: 'walking',
  JUMPING: 'jumping',
  FALLING: 'falling',
  ATTACKING: 'attacking',
  HURT: 'hurt',
  DEAD: 'dead'
};

let currentState = State.IDLE;

function setState(newState) {
  if (currentState === newState) return;
  if (currentState === State.DEAD) return;  // can't change from dead
  
  const prevState = currentState;
  currentState = newState;
  
  // Play corresponding animation
  switch (newState) {
    case State.IDLE:
      player.anims.play('idle', true);
      break;
    case State.WALKING:
      player.anims.play('walk', true);
      break;
    case State.JUMPING:
      player.anims.play('jump');
      break;
    case State.FALLING:
      player.anims.play('fall');
      break;
    case State.ATTACKING:
      player.anims.play('attack');
      break;
    case State.HURT:
      player.anims.play('hurt');
      break;
    case State.DEAD:
      player.anims.play('death');
      break;
  }
}

function update() {
  // Skip if in uninterruptible state
  if ([State.ATTACKING, State.HURT, State.DEAD].includes(currentState)) {
    return;
  }
  
  // Input handling
  const onGround = player.body.touching.down;
  
  // Horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.setFlipX(true);
    if (onGround) setState(State.WALKING);
  } 
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.setFlipX(false);
    if (onGround) setState(State.WALKING);
  } 
  else {
    player.setVelocityX(0);
    if (onGround) setState(State.IDLE);
  }
  
  // Jumping
  if (cursors.up.isDown && onGround) {
    player.setVelocityY(-330);
    setState(State.JUMPING);
  }
  
  // Falling
  if (!onGround && player.body.velocity.y > 0) {
    setState(State.FALLING);
  }
  
  // Attack
  if (attackKey.isDown && onGround && currentState !== State.ATTACKING) {
    setState(State.ATTACKING);
  }
}

// Listen for animation complete
player.on('animationcomplete-attack', () => {
  setState(State.IDLE);
});

player.on('animationcomplete-hurt', () => {
  setState(State.IDLE);
});
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Method", "คำอธิบาย"]}
          rows={[
            ["load.spritesheet()", "โหลด spritesheet"],
            ["anims.create()", "สร้าง animation"],
            ["anims.play()", "เล่น animation"],
            ["animationcomplete", "event เมื่อ animation จบ"],
            ["animationupdate", "event ทุก frame"],
            ["State Machine", "จัดการ animation states"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Physics System เชิงลึก! 🔬</strong>
        </TipBox>
      </Section>
    </div>
  );
}
