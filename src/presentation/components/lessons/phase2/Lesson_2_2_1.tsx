"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">เริ่มต้นกับ Phaser.js</h1>

      <Objectives
        items={[
          "ทำความเข้าใจว่า Phaser คืออะไร",
          "ติดตั้งและ setup Phaser project",
          "สร้าง Game Config และ Scenes",
          "โหลด assets และแสดง sprites",
        ]}
      />

      <Section title="Phaser คืออะไร?" icon="🎮">
        <p className="mb-4">
          <strong>Phaser</strong> เป็น open-source game framework ที่ได้รับความนิยมสูงสุดสำหรับ 2D web games:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🚀 รองรับ WebGL และ Canvas</li>
          <li>⚡ Built-in Physics (Arcade, Matter.js)</li>
          <li>🎬 Sprites, Animations, Tilemaps</li>
          <li>🔊 Audio, Input, Particles</li>
          <li>📚 Documentation และ Examples มากมาย</li>
        </ul>

        <TipBox type="info">
          <strong>Version:</strong> เราจะใช้ Phaser 3 ซึ่งเป็น version ล่าสุดและดีที่สุด
        </TipBox>
      </Section>

      <Section title="Installation" icon="📦">
        <CodeBlock
          title="Install via npm"
          language="bash"
          code={`
# สร้าง project ใหม่
mkdir my-phaser-game
cd my-phaser-game
npm init -y

# ติดตั้ง Phaser
npm install phaser

# ติดตั้ง dev dependencies
npm install --save-dev vite
          `}
        />

        <CodeBlock
          title="หรือใช้ CDN"
          language="html"
          code={`
<!DOCTYPE html>
<html>
<head>
  <title>My Phaser Game</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head>
<body>
  <script src="game.js"></script>
</body>
</html>
          `}
        />
      </Section>

      <Section title="Game Configuration" icon="⚙️">
        <CodeBlock
          title="Basic Phaser Setup"
          language="javascript"
          code={`
// game.js
const config = {
  type: Phaser.AUTO,  // WebGL if available, else Canvas
  width: 800,
  height: 600,
  
  // Physics settings
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true  // แสดง collision boxes
    }
  },
  
  // Scene functions
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// สร้าง game instance
const game = new Phaser.Game(config);

function preload() {
  // โหลด assets ที่นี่
}

function create() {
  // สร้าง game objects ที่นี่
}

function update() {
  // game loop logic ที่นี่
}
          `}
        />

        <Diagram caption="Phaser Scene Lifecycle">
{`
┌─────────────┐
│   preload   │  ← โหลด images, audio, spritesheets
└──────┬──────┘
       ↓
┌──────┴──────┐
│   create    │  ← สร้าง game objects, setup input
└──────┬──────┘
       ↓
┌──────┴──────┐
│   update    │  ← game loop (60 FPS)
└──────┬──────┘
       ↑
       └──── loop ────┘
`}
        </Diagram>
      </Section>

      <Section title="Loading Assets" icon="🖼️">
        <CodeBlock
          title="Preload Function"
          language="javascript"
          code={`
function preload() {
  // Images
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  
  // Spritesheet (for animation)
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
  
  // Audio
  this.load.audio('jump', 'assets/jump.mp3');
  this.load.audio('collect', 'assets/collect.wav');
  
  // Tilemap
  this.load.tilemapTiledJSON('map', 'assets/level1.json');
  
  // Loading progress
  this.load.on('progress', (value) => {
    console.log(\`Loading: \${Math.round(value * 100)}%\`);
  });
  
  this.load.on('complete', () => {
    console.log('All assets loaded!');
  });
}
          `}
        />
      </Section>

      <Section title="Creating Game Objects" icon="🎯">
        <CodeBlock
          title="Create Function"
          language="javascript"
          code={`
let player;
let platforms;
let cursors;
let stars;
let score = 0;
let scoreText;

function create() {
  // 1. Background
  this.add.image(400, 300, 'sky');
  
  // 2. Platforms (static physics group)
  platforms = this.physics.add.staticGroup();
  
  // Ground
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  
  // Ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  
  // 3. Player (physics sprite)
  player = this.physics.add.sprite(100, 450, 'dude');
  
  player.setBounce(0.2);              // เด้งเมื่อตกลงพื้น
  player.setCollideWorldBounds(true); // ไม่ให้ออกนอกจอ
  
  // 4. Player animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1  // loop forever
  });
  
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });
  
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  
  // 5. Collisions
  this.physics.add.collider(player, platforms);
  
  // 6. Stars (collectibles)
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  
  stars.children.iterate((child) => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  
  // 7. Score text
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#fff'
  });
  
  // 8. Input
  cursors = this.input.keyboard.createCursorKeys();
}

function collectStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
}
          `}
        />
      </Section>

      <Section title="Update Loop" icon="🔄">
        <CodeBlock
          title="Update Function"
          language="javascript"
          code={`
function update() {
  // ─────────────────────────────────
  // Player Movement
  // ─────────────────────────────────
  
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  
  // ─────────────────────────────────
  // Jump
  // ─────────────────────────────────
  
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
          `}
        />

        <TipBox type="tip">
          <strong>player.body.touching.down</strong> = true เมื่อ player ยืนบนพื้น
          ใช้ป้องกันไม่ให้กระโดดกลางอากาศ
        </TipBox>
      </Section>

      <Section title="Complete Example" icon="🎮">
        <CodeBlock
          title="Full Platformer Game"
          language="javascript"
          code={`
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, platforms, cursors, stars, bombs;
let score = 0, scoreText, gameOver = false;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32, frameHeight: 48
  });
}

function create() {
  this.add.image(400, 300, 'sky');
  
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  
  // Animations...
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10, repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10, repeat: -1
  });
  
  this.physics.add.collider(player, platforms);
  
  stars = this.physics.add.group({
    key: 'star', repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(c => c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));
  
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  
  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOver) return;
  
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
  
  if (stars.countActive(true) === 0) {
    stars.children.iterate(c => c.enableBody(true, c.x, 0, true, true));
    
    const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Phaser Scene lifecycle เริ่มจาก function ไหน?",
              options: ["create", "preload", "update", "init"],
              correctIndex: 1,
              explanation: "preload() ถูกเรียกก่อนเพื่อโหลด assets"
            },
            {
              question: "this.physics.add.staticGroup() ใช้สร้างอะไร?",
              options: ["Player ที่เคลื่อนที่ได้", "Objects ที่ไม่เคลื่อนที่ (เช่น platform)", "Animations", "Particles"],
              correctIndex: 1,
              explanation: "staticGroup สร้าง objects ที่ไม่เคลื่อนที่ เช่น platform, กำแพง"
            },
            {
              question: "player.body.touching.down หมายความว่าอะไร?",
              options: ["กำลังตก", "Player ยืนบนพื้น/platform", "กำลังกระโดด", "ชนกับผนัง"],
              correctIndex: 1,
              explanation: "touching.down = true เมื่อเท้าสัมผัสพื้นด้านล่าง"
            },
            {
              question: "this.physics.add.overlap() ใช้ทำอะไร?",
              options: ["ทำให้ objects ชนแล้วเด้งออก", "เรียก callback เมื่อชนกัน (ไม่มี physics response)", "สร้าง gravity", "ทำให้วัตถุหายไป"],
              correctIndex: 1,
              explanation: "overlap ใช้เมื่อต้องการตรวจจับการชนแต่ไม่ต้องการ physics response"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Phaser.Game", "สร้าง game instance"],
            ["config", "ตั้งค่า size, physics, scenes"],
            ["preload()", "โหลด assets"],
            ["create()", "สร้าง game objects"],
            ["update()", "game loop"],
            ["this.physics.add", "สร้าง physics objects"],
            ["this.anims.create", "สร้าง animations"],
          ]}
        />

        <ProgressCheck
          items={[
            "ติดตั้ง Phaser project ได้",
            "เข้าใจ Scene lifecycle (preload, create, update)",
            "โหลด assets และแสดง sprites ได้",
            "สร้าง physics objects และ collisions ได้",
            "พร้อมเรียน Sprites & Animations!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Sprites และ Animations เชิงลึก! 🎬</strong>
        </TipBox>
      </Section>
    </div>
  );
}
