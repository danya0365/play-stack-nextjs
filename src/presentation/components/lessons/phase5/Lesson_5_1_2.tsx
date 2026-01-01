"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">State Machines</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ Finite State Machines",
          "Implement FSM สำหรับ character AI",
          "ใช้ Hierarchical State Machines",
          "จัดการ state transitions",
        ]}
      />

      <Section title="State Machine คืออะไร?" icon="🔄">
        <Diagram caption="Player State Machine">
{`
                    ┌─────────┐
                    │  IDLE   │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │ move          │ attack        │ jump
         ▼               ▼               ▼
    ┌─────────┐    ┌───────────┐    ┌─────────┐
    │ WALKING │    │ ATTACKING │    │ JUMPING │
    └────┬────┘    └─────┬─────┘    └────┬────┘
         │               │               │
         │ stop          │ done          │ land
         └───────────────┴───────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │  IDLE   │
                    └─────────┘
`}
        </Diagram>

        <TipBox type="info">
          <strong>Why State Machines?</strong>
          <ul className="mt-2 space-y-1">
            <li>• จัดการ complex behaviors</li>
            <li>• ป้องกัน invalid states</li>
            <li>• Debug และ visualize ง่าย</li>
            <li>• เพิ่ม states ใหม่ได้ง่าย</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Basic FSM Implementation" icon="📦">
        <CodeBlock
          title="State Interface"
          language="typescript"
          code={`
// ─────────────────────────────────
// State interface
// ─────────────────────────────────
interface State<T> {
  enter(owner: T): void;
  update(owner: T, dt: number): void;
  exit(owner: T): void;
}

// ─────────────────────────────────
// State Machine class
// ─────────────────────────────────
class StateMachine<T> {
  private owner: T;
  private states: Map<string, State<T>> = new Map();
  private currentState: State<T> | null = null;
  private currentStateName: string = '';
  
  constructor(owner: T) {
    this.owner = owner;
  }
  
  addState(name: string, state: State<T>): void {
    this.states.set(name, state);
  }
  
  setState(name: string): void {
    const newState = this.states.get(name);
    if (!newState) {
      console.warn(\`State "\${name}" not found\`);
      return;
    }
    
    // Exit current state
    if (this.currentState) {
      this.currentState.exit(this.owner);
    }
    
    // Enter new state
    this.currentState = newState;
    this.currentStateName = name;
    this.currentState.enter(this.owner);
  }
  
  update(dt: number): void {
    if (this.currentState) {
      this.currentState.update(this.owner, dt);
    }
  }
  
  getCurrentState(): string {
    return this.currentStateName;
  }
}
          `}
        />
      </Section>

      <Section title="Player States Example" icon="🎮">
        <CodeBlock
          title="Player States"
          language="typescript"
          code={`
class Player {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  
  speed = 200;
  jumpForce = 400;
  isGrounded = false;
  
  input = {
    left: false,
    right: false,
    jump: false,
    attack: false
  };
  
  stateMachine: StateMachine<Player>;
  sprite: Sprite;
  
  constructor() {
    this.stateMachine = new StateMachine(this);
    
    this.stateMachine.addState('idle', new IdleState());
    this.stateMachine.addState('walking', new WalkingState());
    this.stateMachine.addState('jumping', new JumpingState());
    this.stateMachine.addState('attacking', new AttackingState());
    
    this.stateMachine.setState('idle');
  }
  
  update(dt: number) {
    this.stateMachine.update(dt);
    
    // Apply physics
    this.vy += 980 * dt;  // gravity
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    // Ground check
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.isGrounded = true;
    }
  }
}

// ─────────────────────────────────
// Idle State
// ─────────────────────────────────
class IdleState implements State<Player> {
  enter(player: Player) {
    player.sprite.play('idle');
    player.vx = 0;
  }
  
  update(player: Player, dt: number) {
    if (player.input.left || player.input.right) {
      player.stateMachine.setState('walking');
    }
    if (player.input.jump && player.isGrounded) {
      player.stateMachine.setState('jumping');
    }
    if (player.input.attack) {
      player.stateMachine.setState('attacking');
    }
  }
  
  exit(player: Player) {}
}

// ─────────────────────────────────
// Walking State
// ─────────────────────────────────
class WalkingState implements State<Player> {
  enter(player: Player) {
    player.sprite.play('walk');
  }
  
  update(player: Player, dt: number) {
    // Movement
    if (player.input.left) {
      player.vx = -player.speed;
    } else if (player.input.right) {
      player.vx = player.speed;
    }
    
    // Transitions
    if (!player.input.left && !player.input.right) {
      player.stateMachine.setState('idle');
    }
    if (player.input.jump && player.isGrounded) {
      player.stateMachine.setState('jumping');
    }
    if (player.input.attack) {
      player.stateMachine.setState('attacking');
    }
  }
  
  exit(player: Player) {}
}

// ─────────────────────────────────
// Jumping State
// ─────────────────────────────────
class JumpingState implements State<Player> {
  enter(player: Player) {
    player.sprite.play('jump');
    player.vy = -player.jumpForce;
    player.isGrounded = false;
  }
  
  update(player: Player, dt: number) {
    // Air control
    if (player.input.left) {
      player.vx = -player.speed * 0.8;
    } else if (player.input.right) {
      player.vx = player.speed * 0.8;
    }
    
    // Land
    if (player.isGrounded) {
      player.stateMachine.setState('idle');
    }
  }
  
  exit(player: Player) {}
}

// ─────────────────────────────────
// Attacking State
// ─────────────────────────────────
class AttackingState implements State<Player> {
  timer = 0;
  duration = 0.4;
  
  enter(player: Player) {
    player.sprite.play('attack');
    player.vx = 0;
    this.timer = 0;
    
    // Spawn hitbox
    createHitbox(player.x + 40, player.y, 30, 40);
  }
  
  update(player: Player, dt: number) {
    this.timer += dt;
    
    if (this.timer >= this.duration) {
      player.stateMachine.setState('idle');
    }
  }
  
  exit(player: Player) {}
}
          `}
        />
      </Section>

      <Section title="Hierarchical State Machines" icon="📊">
        <CodeBlock
          title="Nested States"
          language="typescript"
          code={`
// ─────────────────────────────────
// HSM: States can contain sub-states
// ─────────────────────────────────
class CombatState implements State<Enemy> {
  subStateMachine: StateMachine<Enemy>;
  
  constructor() {
    // Sub-states within Combat
  }
  
  enter(enemy: Enemy) {
    this.subStateMachine = new StateMachine(enemy);
    this.subStateMachine.addState('approach', new ApproachState());
    this.subStateMachine.addState('attack', new AttackState());
    this.subStateMachine.addState('retreat', new RetreatState());
    
    this.subStateMachine.setState('approach');
  }
  
  update(enemy: Enemy, dt: number) {
    // Update sub-state
    this.subStateMachine.update(dt);
    
    // Global transitions (exit combat)
    if (!enemy.canSeePlayer()) {
      enemy.stateMachine.setState('patrol');
    }
  }
  
  exit(enemy: Enemy) {}
}

// Enemy FSM structure:
// ┌─────────────────────────────────┐
// │ Enemy State Machine             │
// ├─────────────────────────────────┤
// │ - Idle                          │
// │ - Patrol                        │
// │ - Combat                        │
// │   ├─ Approach                   │
// │   ├─ Attack                     │
// │   └─ Retreat                    │
// │ - Flee                          │
// │ - Dead                          │
// └─────────────────────────────────┘
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "State Machine ใช้แก้ปัญหาอะไร?",
              options: ["Rendering", "จัดการ complex behaviors และ transitions", "Memory management", "Networking"],
              correctIndex: 1,
              explanation: "FSM จัดการ behaviors ที่มีหลาย states และ transitions ระหว่างกัน"
            },
            {
              question: "enter() ถูกเรียกเมื่อไหร่?",
              options: ["ทุก frame", "เมื่อเข้า state ใหม่", "เมื่อออกจาก state", "เมื่อ game start"],
              correctIndex: 1,
              explanation: "enter() เรียกครั้งเดียวเมื่อ transition เข้า state นั้น"
            },
            {
              question: "Hierarchical State Machine (HSM) คืออะไร?",
              options: ["FSM ที่เร็ว", "FSM ที่มี sub-states ซ้อนกัน", "FSM หลายตัว", "FSM แบบ async"],
              correctIndex: 1,
              explanation: "HSM คือ FSM ที่ states สามารถมี sub-state machine ภายในได้"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Concept", "คำอธิบาย"]}
          rows={[
            ["State", "Behavior เฉพาะ (idle, walk, attack)"],
            ["Transition", "เปลี่ยนจาก state หนึ่งไปอีก state"],
            ["enter()", "เรียกเมื่อเข้า state"],
            ["update()", "เรียกทุก frame"],
            ["exit()", "เรียกเมื่อออกจาก state"],
            ["HSM", "States ซ้อนกันหลายชั้น"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ FSM concepts",
            "Implement basic state machine ได้",
            "สร้าง player states ได้",
            "เข้าใจ HSM",
            "พร้อมเรียน Design Patterns!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Design Patterns! 🎯</strong>
        </TipBox>
      </Section>
    </div>
  );
}
