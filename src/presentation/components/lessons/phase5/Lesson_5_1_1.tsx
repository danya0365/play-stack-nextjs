"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Entity Component System (ECS)</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ ECS architecture",
          "สร้าง Entity, Component, System",
          "เปรียบเทียบ ECS กับ OOP",
          "Implement ECS pattern",
        ]}
      />

      <Section title="ECS คืออะไร?" icon="🏗️">
        <Diagram caption="ECS vs OOP">
{`
┌────────────────────────────────────────────────┐
│                    OOP                          │
│  ┌──────────┐                                  │
│  │ GameObject│                                  │
│  ├──────────┤                                  │
│  │ position │                                  │
│  │ velocity │                                  │
│  │ render() │                                  │
│  │ update() │                                  │
│  └──────────┘                                  │
│  • Data + Logic รวมกัน                          │
│  • Inheritance hierarchy                        │
│  • Flexible แต่ messy เมื่อซับซ้อน              │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│                    ECS                          │
│  Entity = ID (e.g., 42)                        │
│     │                                          │
│  Components = Pure Data                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐        │
│  │Position │ │ Velocity │ │ Sprite   │        │
│  │x: 100   │ │ vx: 5    │ │ img: ... │        │
│  │y: 200   │ │ vy: 0    │ │          │        │
│  └─────────┘ └──────────┘ └──────────┘        │
│                                                │
│  Systems = Pure Logic                          │
│  ┌─────────────┐ ┌─────────────┐              │
│  │MovementSystem│ │RenderSystem │              │
│  │(Pos + Vel)  │ │(Pos + Sprite)│              │
│  └─────────────┘ └─────────────┘              │
└────────────────────────────────────────────────┘
`}
        </Diagram>

        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["Entity", "แค่ ID, container สำหรับ components"],
            ["Component", "Pure data, ไม่มี logic"],
            ["System", "Pure logic, process entities with specific components"],
          ]}
        />
      </Section>

      <Section title="Basic ECS Implementation" icon="📦">
        <CodeBlock
          title="Components (Data Only)"
          language="typescript"
          code={`
// ─────────────────────────────────
// Components are plain data
// ─────────────────────────────────
interface PositionComponent {
  x: number;
  y: number;
}

interface VelocityComponent {
  vx: number;
  vy: number;
}

interface SpriteComponent {
  image: HTMLImageElement;
  width: number;
  height: number;
}

interface HealthComponent {
  current: number;
  max: number;
}

interface AIComponent {
  target: number | null;  // target entity id
  state: 'idle' | 'chase' | 'attack';
}
          `}
        />

        <CodeBlock
          title="Entity Manager"
          language="typescript"
          code={`
// ─────────────────────────────────
// Entity = just an ID
// ─────────────────────────────────
type Entity = number;

class World {
  private nextEntityId = 0;
  
  // Store components by type
  private positions = new Map<Entity, PositionComponent>();
  private velocities = new Map<Entity, VelocityComponent>();
  private sprites = new Map<Entity, SpriteComponent>();
  private healths = new Map<Entity, HealthComponent>();
  private ais = new Map<Entity, AIComponent>();
  
  // ─────────────────────────────────
  // Create entity
  // ─────────────────────────────────
  createEntity(): Entity {
    return this.nextEntityId++;
  }
  
  destroyEntity(entity: Entity): void {
    this.positions.delete(entity);
    this.velocities.delete(entity);
    this.sprites.delete(entity);
    this.healths.delete(entity);
    this.ais.delete(entity);
  }
  
  // ─────────────────────────────────
  // Add/Get/Has components
  // ─────────────────────────────────
  addPosition(entity: Entity, data: PositionComponent) {
    this.positions.set(entity, data);
  }
  
  getPosition(entity: Entity): PositionComponent | undefined {
    return this.positions.get(entity);
  }
  
  hasPosition(entity: Entity): boolean {
    return this.positions.has(entity);
  }
  
  // Same for other components...
  addVelocity(entity: Entity, data: VelocityComponent) {
    this.velocities.set(entity, data);
  }
  
  getVelocity(entity: Entity): VelocityComponent | undefined {
    return this.velocities.get(entity);
  }
  
  // ─────────────────────────────────
  // Query entities with specific components
  // ─────────────────────────────────
  query(...componentMaps: Map<Entity, any>[]): Entity[] {
    const entities: Entity[] = [];
    const firstMap = componentMaps[0];
    
    for (const entity of firstMap.keys()) {
      let hasAll = true;
      for (const map of componentMaps) {
        if (!map.has(entity)) {
          hasAll = false;
          break;
        }
      }
      if (hasAll) {
        entities.push(entity);
      }
    }
    return entities;
  }
  
  // Query helpers
  withPositionAndVelocity(): Entity[] {
    return this.query(this.positions, this.velocities);
  }
  
  withPositionAndSprite(): Entity[] {
    return this.query(this.positions, this.sprites);
  }
}
          `}
        />
      </Section>

      <Section title="Systems (Logic Only)" icon="⚙️">
        <CodeBlock
          title="System Examples"
          language="typescript"
          code={`
// ─────────────────────────────────
// Movement System
// ─────────────────────────────────
function movementSystem(world: World, dt: number): void {
  const entities = world.withPositionAndVelocity();
  
  for (const entity of entities) {
    const pos = world.getPosition(entity)!;
    const vel = world.getVelocity(entity)!;
    
    pos.x += vel.vx * dt;
    pos.y += vel.vy * dt;
  }
}

// ─────────────────────────────────
// Render System
// ─────────────────────────────────
function renderSystem(world: World, ctx: CanvasRenderingContext2D): void {
  const entities = world.withPositionAndSprite();
  
  for (const entity of entities) {
    const pos = world.getPosition(entity)!;
    const sprite = world.getSprite(entity)!;
    
    ctx.drawImage(
      sprite.image,
      pos.x - sprite.width / 2,
      pos.y - sprite.height / 2,
      sprite.width,
      sprite.height
    );
  }
}

// ─────────────────────────────────
// AI System
// ─────────────────────────────────
function aiSystem(world: World, dt: number): void {
  const entities = world.withAI();
  
  for (const entity of entities) {
    const ai = world.getAI(entity)!;
    const pos = world.getPosition(entity)!;
    
    switch (ai.state) {
      case 'idle':
        // Look for target
        const target = findNearestPlayer(world, pos);
        if (target) {
          ai.target = target;
          ai.state = 'chase';
        }
        break;
        
      case 'chase':
        if (ai.target) {
          const targetPos = world.getPosition(ai.target);
          if (targetPos) {
            moveTowards(pos, targetPos, 100 * dt);
          }
        }
        break;
    }
  }
}

// ─────────────────────────────────
// Game Loop
// ─────────────────────────────────
const world = new World();
let lastTime = 0;

function gameLoop(time: number) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  
  // Run systems in order
  movementSystem(world, dt);
  aiSystem(world, dt);
  collisionSystem(world);
  renderSystem(world, ctx);
  
  requestAnimationFrame(gameLoop);
}
          `}
        />
      </Section>

      <Section title="Creating Game Entities" icon="🎮">
        <CodeBlock
          title="Entity Factories"
          language="typescript"
          code={`
// ─────────────────────────────────
// Factory functions
// ─────────────────────────────────
function createPlayer(world: World, x: number, y: number): Entity {
  const player = world.createEntity();
  
  world.addPosition(player, { x, y });
  world.addVelocity(player, { vx: 0, vy: 0 });
  world.addSprite(player, { image: playerImg, width: 32, height: 32 });
  world.addHealth(player, { current: 100, max: 100 });
  
  return player;
}

function createEnemy(world: World, x: number, y: number): Entity {
  const enemy = world.createEntity();
  
  world.addPosition(enemy, { x, y });
  world.addVelocity(enemy, { vx: 0, vy: 0 });
  world.addSprite(enemy, { image: enemyImg, width: 32, height: 32 });
  world.addHealth(enemy, { current: 50, max: 50 });
  world.addAI(enemy, { target: null, state: 'idle' });
  
  return enemy;
}

function createBullet(world: World, x: number, y: number, vx: number, vy: number): Entity {
  const bullet = world.createEntity();
  
  world.addPosition(bullet, { x, y });
  world.addVelocity(bullet, { vx, vy });
  world.addSprite(bullet, { image: bulletImg, width: 8, height: 8 });
  
  return bullet;
}

// ─────────────────────────────────
// Usage
// ─────────────────────────────────
const player = createPlayer(world, 400, 300);
const enemy1 = createEnemy(world, 100, 100);
const enemy2 = createEnemy(world, 700, 500);
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "ECS ย่อมาจากอะไร?",
              options: ["Easy Code System", "Entity Component System", "Event Control System", "Engine Core Service"],
              correctIndex: 1,
              explanation: "ECS = Entity Component System แยก data (Components) ออกจาก logic (Systems)"
            },
            {
              question: "Component ใน ECS ควรมีอะไร?",
              options: ["Logic อย่างเดียว", "Data อย่างเดียว", "ทั้ง data และ logic", "ไม่มีอะไร"],
              correctIndex: 1,
              explanation: "Components เก็บเฉพาะ data, Systems ทำ logic"
            },
            {
              question: "System ใน ECS ทำหน้าที่อะไร?",
              options: ["เก็บ data", "Process entities ที่มี components ที่ต้องการ", "สร้าง entities", "จัดการ memory"],
              correctIndex: 1,
              explanation: "Systems มี logic ที่ทำงานกับ entities ที่มี components ที่ต้องการ"
            },
            {
              question: "ข้อดีของ ECS คืออะไร?",
              options: ["Code สั้นกว่า", "Cache-friendly และ decoupled", "ใช้ memory น้อย", "เขียนง่ายกว่า OOP"],
              correctIndex: 1,
              explanation: "ECS จัด data ติดกันใน memory (cache-friendly) และแยก concerns ชัดเจน"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Pattern", "Pros", "Cons"]}
          rows={[
            ["OOP", "Intuitive, easy to start", "Inheritance hell, tight coupling"],
            ["ECS", "Decoupled, cache-friendly, scalable", "Learning curve, boilerplate"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ ECS architecture",
            "สร้าง Entity, Component, System ได้",
            "Query entities ตาม components ได้",
            "ใช้ factory functions สร้าง entities ได้",
            "พร้อมเรียน State Machines!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: State Machines! 🔄</strong>
        </TipBox>
      </Section>
    </div>
  );
}
