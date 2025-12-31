"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_2_2_4() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Tilemaps: สร้าง Level ด้วย Tiled</h1>

      <Objectives
        items={[
          "ใช้ Tiled Map Editor สร้าง level",
          "โหลด Tilemap ใน Phaser",
          "Collision Layers",
          "Object Layers สำหรับ spawn points",
        ]}
      />

      <Section title="Tiled Map Editor" icon="🗺️">
        <p className="mb-4">
          <strong>Tiled</strong> เป็น free level editor ที่นิยมใช้กับ Phaser:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
          <li>📥 ดาวน์โหลดได้ที่ <code>mapeditor.org</code></li>
          <li>🎨 วาด tiles แบบ visual</li>
          <li>📦 Export เป็น JSON</li>
          <li>🔧 ใส่ collision และ objects</li>
        </ul>

        <Diagram caption="Tilemap Structure">
{`
┌────────────────────────────────────┐
│           Tilemap (.json)           │
├────────────────────────────────────┤
│  Tileset (tiles.png)               │
│  ┌────┬────┬────┬────┐            │
│  │ 0  │ 1  │ 2  │ 3  │ ...        │
│  ├────┼────┼────┼────┤            │
│  │ 16 │ 17 │ 18 │ 19 │ ...        │
│  └────┴────┴────┴────┘            │
│                                    │
│  Layers:                           │
│  ├── Background                    │
│  ├── Ground (collision)            │
│  ├── Foreground                    │
│  └── Objects (spawn points)        │
└────────────────────────────────────┘
`}
        </Diagram>
      </Section>

      <Section title="Creating Tilemap in Tiled" icon="🎨">
        <TipBox type="info">
          <strong>Tiled Setup Tips:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Map → New Map → Tile size: 32x32</li>
            <li>• Map → Add Tileset → Embed in map ✓</li>
            <li>• ตั้งชื่อ layer ให้ชัดเจน</li>
            <li>• Export → JSON map files</li>
          </ul>
        </TipBox>

        <CodeBlock
          title="Tileset Configuration in Tiled"
          language="text"
          code={`
Tileset Settings:
- Name: "tileset"
- Image: tiles.png
- Tile Size: 32 x 32
- Margin: 0
- Spacing: 0

⚠️ IMPORTANT:
- "Embed in map" ถ้า export JSON
- หรือ "Export as" .json แยก
          `}
        />
      </Section>

      <Section title="Loading Tilemap" icon="📥">
        <CodeBlock
          title="Preload & Create Tilemap"
          language="javascript"
          code={`
function preload() {
  // โหลด tilemap JSON (exported from Tiled)
  this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
  
  // โหลด tileset image
  this.load.image('tiles', 'assets/tilesets/tileset.png');
  
  // ถ้า tileset มีหลายตัว
  this.load.image('background-tiles', 'assets/tilesets/background.png');
  this.load.image('decorations', 'assets/tilesets/decorations.png');
}

function create() {
  // ─────────────────────────────────
  // Create tilemap
  // ─────────────────────────────────
  const map = this.make.tilemap({ key: 'level1' });
  
  // ─────────────────────────────────
  // Add tileset to map
  // ─────────────────────────────────
  // ชื่อ 'tileset' ต้องตรงกับชื่อใน Tiled
  const tileset = map.addTilesetImage('tileset', 'tiles');
  
  // Multiple tilesets
  const bgTileset = map.addTilesetImage('background', 'background-tiles');
  const decoTileset = map.addTilesetImage('decorations', 'decorations');
  
  // ─────────────────────────────────
  // Create layers
  // ─────────────────────────────────
  // ชื่อ layer ต้องตรงกับใน Tiled
  const backgroundLayer = map.createLayer('Background', bgTileset);
  const groundLayer = map.createLayer('Ground', tileset);
  const foregroundLayer = map.createLayer('Foreground', [tileset, decoTileset]);
  
  // Layer properties
  backgroundLayer.setScrollFactor(0.5);  // parallax
  foregroundLayer.setDepth(100);         // in front of player
}
          `}
        />
      </Section>

      <Section title="Tile Collision" icon="💥">
        <CodeBlock
          title="Setting Up Collisions"
          language="javascript"
          code={`
function create() {
  const map = this.make.tilemap({ key: 'level1' });
  const tileset = map.addTilesetImage('tileset', 'tiles');
  const groundLayer = map.createLayer('Ground', tileset);
  
  // ─────────────────────────────────
  // Method 1: Collision by tile index
  // ─────────────────────────────────
  groundLayer.setCollision([1, 2, 3, 4, 5]);  // specific tiles
  groundLayer.setCollisionBetween(1, 50);      // range of tiles
  
  // ─────────────────────────────────
  // Method 2: Collision by property (recommended)
  // ─────────────────────────────────
  // In Tiled: Select tiles → Custom Properties → Add "collides" = true
  groundLayer.setCollisionByProperty({ collides: true });
  
  // ─────────────────────────────────
  // Method 3: Collision by exclusion
  // ─────────────────────────────────
  groundLayer.setCollisionByExclusion([-1]);  // all except empty
  
  // ─────────────────────────────────
  // Add collision with player
  // ─────────────────────────────────
  this.physics.add.collider(player, groundLayer);
  
  // With callback
  this.physics.add.collider(player, groundLayer, (player, tile) => {
    if (tile.properties.deadly) {
      killPlayer();
    }
    if (tile.properties.bouncy) {
      player.setVelocityY(-500);
    }
  });
  
  // Debug: show collision tiles
  const debugGraphics = this.add.graphics().setAlpha(0.5);
  groundLayer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255)
  });
}
          `}
        />
      </Section>

      <Section title="Object Layers" icon="📍">
        <CodeBlock
          title="Spawn Points & Objects"
          language="javascript"
          code={`
function create() {
  const map = this.make.tilemap({ key: 'level1' });
  
  // ─────────────────────────────────
  // Get objects from layer
  // ─────────────────────────────────
  const objectLayer = map.getObjectLayer('Objects');
  
  objectLayer.objects.forEach(obj => {
    switch (obj.name) {
      case 'PlayerSpawn':
        player = this.physics.add.sprite(obj.x, obj.y, 'player');
        break;
        
      case 'EnemySpawn':
        const enemy = this.physics.add.sprite(obj.x, obj.y, 'enemy');
        enemies.add(enemy);
        break;
        
      case 'Coin':
        const coin = this.physics.add.sprite(obj.x, obj.y, 'coin');
        coins.add(coin);
        break;
        
      case 'Checkpoint':
        checkpoints.push({ x: obj.x, y: obj.y });
        break;
    }
  });
  
  // ─────────────────────────────────
  // Create sprites from object layer
  // ─────────────────────────────────
  const coinsFromMap = map.createFromObjects('Objects', {
    name: 'Coin',           // object name in Tiled
    key: 'coin',            // texture key
    classType: CoinSprite   // optional custom class
  });
  
  // Add to physics group
  coins = this.physics.add.group(coinsFromMap);
  
  // ─────────────────────────────────
  // Object properties
  // ─────────────────────────────────
  objectLayer.objects.forEach(obj => {
    if (obj.name === 'NPC') {
      const npc = createNPC(obj.x, obj.y);
      
      // Get custom properties from Tiled
      if (obj.properties) {
        obj.properties.forEach(prop => {
          if (prop.name === 'dialog') {
            npc.dialog = prop.value;
          }
          if (prop.name === 'shopkeeper') {
            npc.isShopkeeper = prop.value;
          }
        });
      }
    }
  });
}
          `}
        />
      </Section>

      <Section title="Camera & World Bounds" icon="📷">
        <CodeBlock
          title="Camera Following Player"
          language="javascript"
          code={`
function create() {
  const map = this.make.tilemap({ key: 'level1' });
  
  // Set world bounds to match map
  this.physics.world.setBounds(
    0, 0, 
    map.widthInPixels, 
    map.heightInPixels
  );
  
  // Camera follows player
  this.cameras.main.startFollow(player, true, 0.1, 0.1);
  
  // Camera bounds
  this.cameras.main.setBounds(
    0, 0,
    map.widthInPixels,
    map.heightInPixels
  );
  
  // Deadzone (player can move within without camera moving)
  this.cameras.main.setDeadzone(100, 50);
  
  // Zoom
  this.cameras.main.setZoom(1.5);
  
  // ─────────────────────────────────
  // Camera effects
  // ─────────────────────────────────
  // Shake
  this.cameras.main.shake(200, 0.01);
  
  // Flash
  this.cameras.main.flash(500, 255, 0, 0);  // red flash
  
  // Fade
  this.cameras.main.fadeOut(1000);
  this.cameras.main.once('camerafadeoutcomplete', () => {
    this.scene.start('GameOver');
  });
}
          `}
        />
      </Section>

      <Section title="Complete Level System" icon="🎮">
        <CodeBlock
          title="Full Level Loading"
          language="javascript"
          code={`
class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  
  init(data) {
    this.levelNumber = data.level || 1;
  }
  
  preload() {
    this.load.tilemapTiledJSON('level', \`assets/levels/level\${this.levelNumber}.json\`);
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('coin', 'assets/coin.png');
  }
  
  create() {
    // Map
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    
    // Layers
    const bgLayer = map.createLayer('Background', tileset);
    const groundLayer = map.createLayer('Ground', tileset);
    groundLayer.setCollisionByProperty({ collides: true });
    
    // Player from spawn point
    const spawnPoint = map.findObject('Objects', obj => obj.name === 'PlayerSpawn');
    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
    this.player.setCollideWorldBounds(true);
    
    // Coins
    const coinObjects = map.createFromObjects('Objects', { name: 'Coin', key: 'coin' });
    this.coins = this.physics.add.group(coinObjects);
    this.coins.children.iterate(c => c.body.setAllowGravity(false));
    
    // Collisions
    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    
    // Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // Exit zone
    const exit = map.findObject('Objects', obj => obj.name === 'Exit');
    this.exitZone = this.add.zone(exit.x, exit.y, exit.width, exit.height);
    this.physics.world.enable(this.exitZone);
    this.physics.add.overlap(this.player, this.exitZone, this.completeLevel, null, this);
    
    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  
  collectCoin(player, coin) {
    coin.destroy();
    this.registry.inc('coins', 1);
  }
  
  completeLevel() {
    this.cameras.main.fadeOut(1000);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Game', { level: this.levelNumber + 1 });
    });
  }
  
  update() {
    // Player movement...
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Tilemap layer สร้างจาก function ไหน?",
              options: ["make.tilemap()", "map.createLayer()", "map.addTilesetImage()", "load.tilemapTiledJSON()"],
              correctIndex: 1,
              explanation: "createLayer() สร้าง layer จาก tilemap"
            },
            {
              question: "setCollisionByProperty() ใช้ทำอะไร?",
              options: ["ตั้ง collision จาก tile index", "ตั้ง collision จาก custom property ใน Tiled", "ตั้ง collision ทุก tile", "ลบ collision"],
              correctIndex: 1,
              explanation: "ใช้ property เช่น collides: true ที่ตั้งใน Tiled"
            },
            {
              question: "Object Layer ใช้ทำอะไร?",
              options: ["วาด tiles", "กำหนด spawn points และ objects", "ตั้ง parallax", "ใส่ collision"],
              correctIndex: 1,
              explanation: "Object Layer เก็บตำแหน่ง spawn points, triggers, NPCs"
            },
            {
              question: "refreshBody() ต้องเรียกเมื่อไหร่?",
              options: ["หลังเปลี่ยน scale หรือ size ของ static body", "ก่อนสร้าง layer", "หลังโหลด assets", "ก่อนเริ่ม game"],
              correctIndex: 0,
              explanation: "static body ต้อง refreshBody() หลังเปลี่ยน scale/size"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Method", "คำอธิบาย"]}
          rows={[
            ["make.tilemap()", "สร้าง tilemap จาก JSON"],
            ["addTilesetImage()", "เพิ่ม tileset"],
            ["createLayer()", "สร้าง layer"],
            ["setCollisionByProperty()", "ตั้ง collision จาก property"],
            ["getObjectLayer()", "ดึง object layer"],
            ["createFromObjects()", "สร้าง sprites จาก objects"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ Tiled สร้าง level ได้",
            "โหลดและแสดง Tilemap ได้",
            "ตั้ง collision layers ได้",
            "ใช้ Object Layer วาง spawn points ได้",
            "พร้อมเรียน PixiJS!"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 จบ Phaser.js Module!</strong>
          <br />
          บทต่อไป: PixiJS - High-Performance 2D Graphics!
        </TipBox>
      </Section>
    </div>
  );
}
