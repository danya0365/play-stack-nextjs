"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_1_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Design Patterns สำหรับเกม</h1>

      <Objectives
        items={[
          "เข้าใจ Game Design Patterns ที่สำคัญ",
          "Implement Object Pool",
          "ใช้ Command Pattern",
          "ใช้ Observer Pattern",
        ]}
      />

      <Section title="Object Pool" icon="🔄">
        <Diagram caption="Object Pooling">
{`
Without Pool:                 With Pool:
┌──────────┐                 ┌──────────────────┐
│ Create   │                 │    Pool          │
│ Bullet   │─────┐           │ ┌────┐ ┌────┐    │
└──────────┘     │           │ │Bul │ │Bul │    │
      ↓          │           │ └────┘ └────┘    │
┌──────────┐     │           │ ┌────┐ ┌────┐    │
│  Use     │     │           │ │Bul │ │Bul │    │
└──────────┘     │           │ └────┘ └────┘    │
      ↓          │           └────────┬─────────┘
┌──────────┐     │                    │
│ Destroy  │─────┘           Get() ←──┴──→ Return()
│ (GC)     │
└──────────┘

❌ Creates garbage         ✅ Reuses objects
❌ GC pauses               ✅ No allocations
`}
        </Diagram>

        <CodeBlock
          title="Object Pool Implementation"
          language="typescript"
          code={`
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  
  constructor(
    createFn: () => T,
    resetFn: (obj: T) => void,
    initialSize: number = 10
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    // Pool empty, create new
    return this.createFn();
  }
  
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// ─────────────────────────────────
// Usage: Bullet Pool
// ─────────────────────────────────
interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

const bulletPool = new ObjectPool<Bullet>(
  // Create function
  () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false }),
  // Reset function
  (bullet) => {
    bullet.x = 0;
    bullet.y = 0;
    bullet.vx = 0;
    bullet.vy = 0;
    bullet.active = false;
  },
  100  // initial size
);

// Shoot
function shoot(x: number, y: number, dir: number) {
  const bullet = bulletPool.get();
  bullet.x = x;
  bullet.y = y;
  bullet.vx = Math.cos(dir) * 500;
  bullet.vy = Math.sin(dir) * 500;
  bullet.active = true;
  activeBullets.push(bullet);
}

// Destroy
function destroyBullet(bullet: Bullet) {
  bullet.active = false;
  const idx = activeBullets.indexOf(bullet);
  activeBullets.splice(idx, 1);
  bulletPool.release(bullet);
}
          `}
        />
      </Section>

      <Section title="Command Pattern" icon="📝">
        <CodeBlock
          title="Command Pattern for Undo/Replay"
          language="typescript"
          code={`
// ─────────────────────────────────
// Command Interface
// ─────────────────────────────────
interface Command {
  execute(): void;
  undo(): void;
}

// ─────────────────────────────────
// Concrete Commands
// ─────────────────────────────────
class MoveCommand implements Command {
  private unit: Unit;
  private dx: number;
  private dy: number;
  private prevX: number;
  private prevY: number;
  
  constructor(unit: Unit, dx: number, dy: number) {
    this.unit = unit;
    this.dx = dx;
    this.dy = dy;
    this.prevX = unit.x;
    this.prevY = unit.y;
  }
  
  execute(): void {
    this.unit.x += this.dx;
    this.unit.y += this.dy;
  }
  
  undo(): void {
    this.unit.x = this.prevX;
    this.unit.y = this.prevY;
  }
}

class AttackCommand implements Command {
  private attacker: Unit;
  private target: Unit;
  private damageDealt: number = 0;
  
  execute(): void {
    this.damageDealt = calculateDamage(this.attacker, this.target);
    this.target.health -= this.damageDealt;
  }
  
  undo(): void {
    this.target.health += this.damageDealt;
  }
}

// ─────────────────────────────────
// Command Manager (for undo/replay)
// ─────────────────────────────────
class CommandManager {
  private history: Command[] = [];
  private undoStack: Command[] = [];
  
  execute(command: Command): void {
    command.execute();
    this.history.push(command);
    this.undoStack = [];  // Clear redo stack
  }
  
  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.undoStack.push(command);
    }
  }
  
  redo(): void {
    const command = this.undoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }
  
  // For replay system
  getHistory(): Command[] {
    return [...this.history];
  }
}

// ─────────────────────────────────
// Usage
// ─────────────────────────────────
const commands = new CommandManager();

// Player moves
commands.execute(new MoveCommand(player, 1, 0));
commands.execute(new MoveCommand(player, 0, 1));
commands.execute(new AttackCommand(player, enemy));

// Undo last action
commands.undo();
          `}
        />
      </Section>

      <Section title="Observer Pattern" icon="📡">
        <CodeBlock
          title="Event System"
          language="typescript"
          code={`
// ─────────────────────────────────
// Event Emitter / Event Bus
// ─────────────────────────────────
type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private listeners: Map<string, EventCallback[]> = new Map();
  
  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }
  }
}

// ─────────────────────────────────
// Global Event Bus
// ─────────────────────────────────
const gameEvents = new EventEmitter();

// ─────────────────────────────────
// Usage: Decoupled systems
// ─────────────────────────────────

// Player (publisher)
class Player {
  takeDamage(amount: number) {
    this.health -= amount;
    
    gameEvents.emit('player:damaged', { 
      damage: amount, 
      health: this.health 
    });
    
    if (this.health <= 0) {
      gameEvents.emit('player:died');
    }
  }
  
  collectItem(item: Item) {
    this.inventory.add(item);
    gameEvents.emit('item:collected', item);
  }
}

// UI (subscriber) - doesn't know about Player directly
class HealthBar {
  constructor() {
    gameEvents.on('player:damaged', this.onPlayerDamaged.bind(this));
    gameEvents.on('player:died', this.onPlayerDied.bind(this));
  }
  
  onPlayerDamaged(data: { damage: number; health: number }) {
    this.updateDisplay(data.health);
    this.showDamageNumber(data.damage);
  }
  
  onPlayerDied() {
    this.showGameOver();
  }
}

// Sound (subscriber)
class SoundManager {
  constructor() {
    gameEvents.on('player:damaged', () => this.play('hit'));
    gameEvents.on('player:died', () => this.play('death'));
    gameEvents.on('item:collected', () => this.play('pickup'));
  }
}

// Achievement System (subscriber)
class Achievements {
  constructor() {
    gameEvents.on('player:died', this.checkDeathAchievements.bind(this));
    gameEvents.on('item:collected', this.checkCollectionAchievements.bind(this));
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Object Pool ช่วยแก้ปัญหาอะไร?",
              options: ["Rendering ช้า", "GC pauses จาก allocations บ่อยๆ", "Network lag", "Audio delay"],
              correctIndex: 1,
              explanation: "Object Pool reuse objects แทนการ create/destroy ลด GC"
            },
            {
              question: "Command Pattern ใช้ทำอะไรได้?",
              options: ["Rendering", "Undo/Redo และ Replay", "Collision detection", "Pathfinding"],
              correctIndex: 1,
              explanation: "Command เก็บ action เป็น object ทำให้ undo และ replay ได้"
            },
            {
              question: "Observer Pattern ช่วยเรื่องอะไร?",
              options: ["เพิ่ม performance", "Decouple systems", "ลด memory", "เพิ่ม graphics"],
              correctIndex: 1,
              explanation: "Observer ทำให้ systems สื่อสารโดยไม่ต้องรู้จักกันโดยตรง"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Pattern", "Use Case"]}
          rows={[
            ["Object Pool", "Bullets, particles, enemies"],
            ["Command", "Undo/redo, replay, AI"],
            ["Observer", "Events, UI updates, achievements"],
            ["Singleton", "GameManager, AudioManager"],
            ["Factory", "Create entities, spawn enemies"],
          ]}
        />

        <ProgressCheck
          items={[
            "Implement Object Pool ได้",
            "ใช้ Command Pattern ได้",
            "ใช้ Observer Pattern ได้",
            "เลือก pattern ที่เหมาะสมได้",
            "จบ Phase 5: Advanced Topics! 🎉"
          ]}
        />

        <TipBox type="success">
          <strong>🎉 ยินดีด้วย! คุณเรียนจบ PlayStack แล้ว!</strong>
          <p className="mt-2">
            จาก text games → 2D → 3D → Multiplayer → Architecture
            <br />
            พร้อมสร้างเกมของตัวเองแล้ว! 🚀
          </p>
        </TipBox>
      </Section>
    </div>
  );
}
