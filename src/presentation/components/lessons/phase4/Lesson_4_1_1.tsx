"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Game Architecture Patterns</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ Game Architecture",
          "Entity Component System (ECS)",
          "State Machines",
          "Event-Driven Architecture",
        ]}
      />

      <Section title="ทำไมต้องมี Architecture?" icon="🏗️">
        <p className="mb-4">
          เกมเล็กๆ อาจเขียนแบบ spaghetti code ได้ แต่เมื่อเกมใหญ่ขึ้น:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>❌ Code ซ้ำซ้อน</li>
          <li>❌ Bug หายาก</li>
          <li>❌ เพิ่ม feature ยาก</li>
          <li>❌ ทำงานเป็นทีมยาก</li>
        </ul>

        <TipBox type="info">
          <strong>Good Architecture = Maintainable Game</strong>
        </TipBox>
      </Section>

      <Section title="Entity Component System (ECS)" icon="📦">
        <Diagram caption="ECS Structure">
{`
┌──────────────────────────────────────────────┐
│                   WORLD                       │
│  ┌──────────────────────────────────────┐    │
│  │              ENTITIES                 │    │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │    │
│  │  │ E1  │ │ E2  │ │ E3  │ │ E4  │    │    │
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘    │    │
│  │     │       │       │       │        │    │
│  │  ┌──┴──┬────┴──┬────┴──┬────┴──┐    │    │
│  │  │Pos │Vel  │Render│Health│AI  │    │    │
│  │  └────┴─────┴──────┴──────┴────┘    │    │
│  │            COMPONENTS               │    │
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │              SYSTEMS                  │    │
│  │  Movement │ Render │ Combat │ AI     │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
`}
        </Diagram>

        <CodeBlock
          title="ECS Implementation"
          language="javascript"
          code={`
// ─────────────────────────────────
// Components (data only)
// ─────────────────────────────────
class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Velocity {
  constructor(vx = 0, vy = 0) {
    this.vx = vx;
    this.vy = vy;
  }
}

class Renderable {
  constructor(sprite, width, height) {
    this.sprite = sprite;
    this.width = width;
    this.height = height;
  }
}

class Health {
  constructor(max = 100) {
    this.current = max;
    this.max = max;
  }
}

// ─────────────────────────────────
// Entity (just an ID + components)
// ─────────────────────────────────
class Entity {
  static nextId = 0;
  
  constructor() {
    this.id = Entity.nextId++;
    this.components = new Map();
  }
  
  addComponent(component) {
    this.components.set(component.constructor.name, component);
    return this;
  }
  
  getComponent(componentClass) {
    return this.components.get(componentClass.name);
  }
  
  hasComponent(componentClass) {
    return this.components.has(componentClass.name);
  }
}

// ─────────────────────────────────
// Systems (logic only)
// ─────────────────────────────────
class MovementSystem {
  update(entities, deltaTime) {
    for (const entity of entities) {
      if (entity.hasComponent(Position) && entity.hasComponent(Velocity)) {
        const pos = entity.getComponent(Position);
        const vel = entity.getComponent(Velocity);
        
        pos.x += vel.vx * deltaTime;
        pos.y += vel.vy * deltaTime;
      }
    }
  }
}

class RenderSystem {
  constructor(ctx) {
    this.ctx = ctx;
  }
  
  update(entities) {
    for (const entity of entities) {
      if (entity.hasComponent(Position) && entity.hasComponent(Renderable)) {
        const pos = entity.getComponent(Position);
        const render = entity.getComponent(Renderable);
        
        this.ctx.drawImage(
          render.sprite,
          pos.x, pos.y,
          render.width, render.height
        );
      }
    }
  }
}

// ─────────────────────────────────
// World
// ─────────────────────────────────
class World {
  constructor() {
    this.entities = [];
    this.systems = [];
  }
  
  createEntity() {
    const entity = new Entity();
    this.entities.push(entity);
    return entity;
  }
  
  addSystem(system) {
    this.systems.push(system);
  }
  
  update(deltaTime) {
    for (const system of this.systems) {
      system.update(this.entities, deltaTime);
    }
  }
}

// ─────────────────────────────────
// Usage
// ─────────────────────────────────
const world = new World();

// Create player
const player = world.createEntity()
  .addComponent(new Position(100, 100))
  .addComponent(new Velocity(0, 0))
  .addComponent(new Renderable(playerSprite, 32, 32))
  .addComponent(new Health(100));

// Create enemy
const enemy = world.createEntity()
  .addComponent(new Position(300, 200))
  .addComponent(new Velocity(-50, 0))
  .addComponent(new Renderable(enemySprite, 32, 32))
  .addComponent(new Health(50));

// Add systems
world.addSystem(new MovementSystem());
world.addSystem(new RenderSystem(ctx));

// Game loop
function gameLoop(deltaTime) {
  world.update(deltaTime);
}
          `}
        />
      </Section>

      <Section title="State Machines" icon="🔄">
        <CodeBlock
          title="Finite State Machine"
          language="javascript"
          code={`
// ─────────────────────────────────
// State Machine Class
// ─────────────────────────────────
class StateMachine {
  constructor(owner) {
    this.owner = owner;
    this.states = {};
    this.currentState = null;
  }
  
  addState(name, state) {
    this.states[name] = state;
    state.owner = this.owner;
    state.machine = this;
  }
  
  setState(name) {
    if (this.currentState) {
      this.currentState.exit();
    }
    
    this.currentState = this.states[name];
    
    if (this.currentState) {
      this.currentState.enter();
    }
  }
  
  update(deltaTime) {
    if (this.currentState) {
      this.currentState.update(deltaTime);
    }
  }
}

// ─────────────────────────────────
// States
// ─────────────────────────────────
class IdleState {
  enter() {
    this.owner.playAnimation('idle');
  }
  
  update(dt) {
    if (this.owner.isMoving()) {
      this.machine.setState('walking');
    }
    if (this.owner.input.attack) {
      this.machine.setState('attacking');
    }
  }
  
  exit() {}
}

class WalkingState {
  enter() {
    this.owner.playAnimation('walk');
  }
  
  update(dt) {
    this.owner.move(dt);
    
    if (!this.owner.isMoving()) {
      this.machine.setState('idle');
    }
    if (this.owner.input.jump) {
      this.machine.setState('jumping');
    }
  }
  
  exit() {}
}

class AttackingState {
  enter() {
    this.owner.playAnimation('attack');
    this.timer = 0.5;  // attack duration
  }
  
  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.machine.setState('idle');
    }
  }
  
  exit() {}
}

// ─────────────────────────────────
// Usage
// ─────────────────────────────────
class Player {
  constructor() {
    this.stateMachine = new StateMachine(this);
    this.stateMachine.addState('idle', new IdleState());
    this.stateMachine.addState('walking', new WalkingState());
    this.stateMachine.addState('attacking', new AttackingState());
    this.stateMachine.setState('idle');
  }
  
  update(dt) {
    this.stateMachine.update(dt);
  }
}
          `}
        />
      </Section>

      <Section title="Event System" icon="📡">
        <CodeBlock
          title="Event-Driven Architecture"
          language="javascript"
          code={`
// ─────────────────────────────────
// Event Bus
// ─────────────────────────────────
class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

// Global event bus
const events = new EventBus();

// ─────────────────────────────────
// Usage
// ─────────────────────────────────

// UI listens for events
events.on('player:damaged', ({ damage, currentHealth }) => {
  updateHealthBar(currentHealth);
  showDamageNumber(damage);
});

events.on('enemy:killed', ({ enemy, points }) => {
  updateScore(points);
  spawnLoot(enemy.position);
});

events.on('level:complete', ({ levelId, time }) => {
  showLevelComplete(time);
  unlockNextLevel(levelId + 1);
});

// Game logic emits events
class Player {
  takeDamage(amount) {
    this.health -= amount;
    events.emit('player:damaged', {
      damage: amount,
      currentHealth: this.health
    });
    
    if (this.health <= 0) {
      events.emit('player:died');
    }
  }
}

class Enemy {
  die() {
    events.emit('enemy:killed', {
      enemy: this,
      points: this.pointValue
    });
    this.destroy();
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "ECS ย่อมาจากอะไร?",
              options: ["Extra Code System", "Entity Component System", "Event Control State", "Element CSS Style"],
              correctIndex: 1,
              explanation: "ECS = Entity Component System แยก data (Components) ออกจาก logic (Systems)"
            },
            {
              question: "State Machine เหมาะกับอะไร?",
              options: ["การรับ input", "การจัดการ character states (idle, walk, attack)", "การวาดภาพ", "การโหลด assets"],
              correctIndex: 1,
              explanation: "State Machine จัดการ transitions ระหว่าง states"
            },
            {
              question: "Event Bus ใช้ทำอะไร?",
              options: ["เคลื่อนย้าย objects", "Decouple systems (ส่ง events แทนการเรียกตรง)", "โหลดไฟล์", "วาดรูป"],
              correctIndex: 1,
              explanation: "Event Bus ช่วยให้ systems สื่อสารโดยไม่ต้องรู้จักกัน"
            },
            {
              question: "Component ใน ECS ควรมีอะไร?",
              options: ["เฉพาะ data", "เฉพาะ logic", "ทั้ง data และ logic", "ไม่มีอะไร"],
              correctIndex: 0,
              explanation: "Components เก็บเฉพาะ data, Systems ทำ logic"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Pattern", "Use Case"]}
          rows={[
            ["ECS", "Large games, many entities"],
            ["State Machine", "Character AI, game states"],
            ["Event Bus", "Decouple systems, UI updates"],
            ["Component", "Reusable behaviors"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ ECS pattern ได้",
            "สร้าง State Machine ได้",
            "ใช้ Event Bus decouple systems ได้",
            "ออกแบบ game architecture ได้",
            "พร้อมเรียน AI และ Pathfinding!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: AI และ Pathfinding! 🤖</strong>
        </TipBox>
      </Section>
    </div>
  );
}
