"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_1_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">AI และ Pathfinding</h1>

      <Objectives
        items={[
          "พื้นฐาน Game AI",
          "A* Pathfinding Algorithm",
          "Steering Behaviors",
          "Behavior Trees",
        ]}
      />

      <Section title="Game AI Overview" icon="🤖">
        <p className="mb-4">
          AI ในเกมไม่จำเป็นต้อง smart แต่ต้อง <strong>fun และ believable</strong>:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>🎯 ศัตรูหาทางมาหาผู้เล่น</li>
          <li>🧠 NPC มี behavior ที่น่าเชื่อ</li>
          <li>🎮 ท้าทายแต่ไม่โกง</li>
        </ul>
      </Section>

      <Section title="A* Pathfinding" icon="🗺️">
        <Diagram caption="A* Algorithm">
{`
┌───┬───┬───┬───┬───┬───┬───┐
│ S │   │   │ █ │   │   │   │
├───┼───┼───┼───┼───┼───┼───┤
│ ↓ │   │   │ █ │   │   │   │
├───┼───┼───┼───┼───┼───┼───┤
│ ↓ │ → │ → │ ↓ │   │   │   │
├───┼───┼───┼───┼───┼───┼───┤
│   │   │   │ ↓ │ → │ → │ E │
└───┴───┴───┴───┴───┴───┴───┘

S = Start, E = End, █ = Wall
`}
        </Diagram>

        <CodeBlock
          title="A* Implementation"
          language="javascript"
          code={`
class PathFinder {
  constructor(grid) {
    this.grid = grid;  // 2D array: 0 = walkable, 1 = blocked
    this.cols = grid[0].length;
    this.rows = grid.length;
  }
  
  findPath(startX, startY, endX, endY) {
    const openList = [];
    const closedList = new Set();
    const cameFrom = new Map();
    
    const start = { x: startX, y: startY };
    const end = { x: endX, y: endY };
    
    // G = cost from start, H = heuristic (estimate to end)
    const gScore = new Map();
    const fScore = new Map();
    
    const key = (n) => \`\${n.x},\${n.y}\`;
    
    gScore.set(key(start), 0);
    fScore.set(key(start), this.heuristic(start, end));
    openList.push(start);
    
    while (openList.length > 0) {
      // Get node with lowest fScore
      openList.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));
      const current = openList.shift();
      
      // Found the goal!
      if (current.x === end.x && current.y === end.y) {
        return this.reconstructPath(cameFrom, current);
      }
      
      closedList.add(key(current));
      
      // Check neighbors
      const neighbors = this.getNeighbors(current);
      
      for (const neighbor of neighbors) {
        if (closedList.has(key(neighbor))) continue;
        
        const tentativeG = gScore.get(key(current)) + 1;
        
        if (!gScore.has(key(neighbor)) || tentativeG < gScore.get(key(neighbor))) {
          cameFrom.set(key(neighbor), current);
          gScore.set(key(neighbor), tentativeG);
          fScore.set(key(neighbor), tentativeG + this.heuristic(neighbor, end));
          
          if (!openList.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
            openList.push(neighbor);
          }
        }
      }
    }
    
    return null;  // No path found
  }
  
  heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  
  getNeighbors(node) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -1 },  // up
      { x: 0, y: 1 },   // down
      { x: -1, y: 0 },  // left
      { x: 1, y: 0 },   // right
      // Diagonals (optional)
      // { x: -1, y: -1 }, { x: 1, y: -1 },
      // { x: -1, y: 1 }, { x: 1, y: 1 }
    ];
    
    for (const dir of directions) {
      const nx = node.x + dir.x;
      const ny = node.y + dir.y;
      
      if (nx >= 0 && nx < this.cols && 
          ny >= 0 && ny < this.rows && 
          this.grid[ny][nx] === 0) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    
    return neighbors;
  }
  
  reconstructPath(cameFrom, current) {
    const path = [current];
    const key = (n) => \`\${n.x},\${n.y}\`;
    
    while (cameFrom.has(key(current))) {
      current = cameFrom.get(key(current));
      path.unshift(current);
    }
    
    return path;
  }
}

// Usage
const grid = [
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const pathfinder = new PathFinder(grid);
const path = pathfinder.findPath(0, 0, 6, 3);
console.log(path);  // [{x:0,y:0}, {x:0,y:1}, {x:0,y:2}, ...]
          `}
        />
      </Section>

      <Section title="Steering Behaviors" icon="🚗">
        <CodeBlock
          title="Common Steering Behaviors"
          language="javascript"
          code={`
class SteeringBehaviors {
  constructor(entity) {
    this.entity = entity;
    this.maxSpeed = 5;
    this.maxForce = 0.1;
  }
  
  // ─────────────────────────────────
  // Seek - Move towards target
  // ─────────────────────────────────
  seek(target) {
    const desired = {
      x: target.x - this.entity.x,
      y: target.y - this.entity.y
    };
    
    // Normalize and scale to max speed
    const mag = Math.sqrt(desired.x ** 2 + desired.y ** 2);
    if (mag > 0) {
      desired.x = (desired.x / mag) * this.maxSpeed;
      desired.y = (desired.y / mag) * this.maxSpeed;
    }
    
    // Steering = desired - velocity
    const steer = {
      x: desired.x - this.entity.vx,
      y: desired.y - this.entity.vy
    };
    
    // Limit force
    return this.limit(steer, this.maxForce);
  }
  
  // ─────────────────────────────────
  // Flee - Run away from target
  // ─────────────────────────────────
  flee(target) {
    const force = this.seek(target);
    return { x: -force.x, y: -force.y };
  }
  
  // ─────────────────────────────────
  // Arrive - Slow down when approaching
  // ─────────────────────────────────
  arrive(target, slowRadius = 100) {
    const desired = {
      x: target.x - this.entity.x,
      y: target.y - this.entity.y
    };
    
    const dist = Math.sqrt(desired.x ** 2 + desired.y ** 2);
    let speed = this.maxSpeed;
    
    // Slow down when close
    if (dist < slowRadius) {
      speed = this.maxSpeed * (dist / slowRadius);
    }
    
    if (dist > 0) {
      desired.x = (desired.x / dist) * speed;
      desired.y = (desired.y / dist) * speed;
    }
    
    const steer = {
      x: desired.x - this.entity.vx,
      y: desired.y - this.entity.vy
    };
    
    return this.limit(steer, this.maxForce);
  }
  
  // ─────────────────────────────────
  // Wander - Random movement
  // ─────────────────────────────────
  wander() {
    this.wanderAngle = this.wanderAngle || 0;
    this.wanderAngle += (Math.random() - 0.5) * 0.5;
    
    const circleDistance = 20;
    const circleRadius = 10;
    
    // Calculate circle center ahead of entity
    const circleCenter = {
      x: this.entity.vx * circleDistance,
      y: this.entity.vy * circleDistance
    };
    
    // Calculate displacement force
    const displacement = {
      x: Math.cos(this.wanderAngle) * circleRadius,
      y: Math.sin(this.wanderAngle) * circleRadius
    };
    
    return {
      x: circleCenter.x + displacement.x,
      y: circleCenter.y + displacement.y
    };
  }
  
  // ─────────────────────────────────
  // Separation - Avoid crowding
  // ─────────────────────────────────
  separation(neighbors, desiredSeparation = 50) {
    const steer = { x: 0, y: 0 };
    let count = 0;
    
    for (const other of neighbors) {
      const dist = this.distance(this.entity, other);
      
      if (dist > 0 && dist < desiredSeparation) {
        const diff = {
          x: this.entity.x - other.x,
          y: this.entity.y - other.y
        };
        diff.x /= dist;  // Weight by distance
        diff.y /= dist;
        
        steer.x += diff.x;
        steer.y += diff.y;
        count++;
      }
    }
    
    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
    }
    
    return this.limit(steer, this.maxForce);
  }
  
  limit(vector, max) {
    const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    if (mag > max) {
      vector.x = (vector.x / mag) * max;
      vector.y = (vector.y / mag) * max;
    }
    return vector;
  }
  
  distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }
}

// Usage
const steering = new SteeringBehaviors(enemy);

function updateEnemy(dt) {
  const force = steering.seek(player.position);
  enemy.vx += force.x;
  enemy.vy += force.y;
  enemy.x += enemy.vx * dt;
  enemy.y += enemy.vy * dt;
}
          `}
        />
      </Section>

      <Section title="Behavior Trees" icon="🌳">
        <CodeBlock
          title="Simple Behavior Tree"
          language="javascript"
          code={`
// Node types
const NodeStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  RUNNING: 'running'
};

// ─────────────────────────────────
// Base Node
// ─────────────────────────────────
class BehaviorNode {
  tick(entity) {
    return NodeStatus.FAILURE;
  }
}

// ─────────────────────────────────
// Composite Nodes
// ─────────────────────────────────
class Sequence extends BehaviorNode {
  constructor(children) {
    super();
    this.children = children;
  }
  
  tick(entity) {
    for (const child of this.children) {
      const status = child.tick(entity);
      if (status !== NodeStatus.SUCCESS) {
        return status;  // Stop on first non-success
      }
    }
    return NodeStatus.SUCCESS;
  }
}

class Selector extends BehaviorNode {
  constructor(children) {
    super();
    this.children = children;
  }
  
  tick(entity) {
    for (const child of this.children) {
      const status = child.tick(entity);
      if (status !== NodeStatus.FAILURE) {
        return status;  // Stop on first non-failure
      }
    }
    return NodeStatus.FAILURE;
  }
}

// ─────────────────────────────────
// Leaf Nodes (Actions/Conditions)
// ─────────────────────────────────
class IsPlayerInRange extends BehaviorNode {
  constructor(range) {
    super();
    this.range = range;
  }
  
  tick(entity) {
    const dist = distance(entity, player);
    return dist <= this.range ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}

class MoveToPlayer extends BehaviorNode {
  tick(entity) {
    const dir = normalize({
      x: player.x - entity.x,
      y: player.y - entity.y
    });
    
    entity.x += dir.x * entity.speed;
    entity.y += dir.y * entity.speed;
    
    return NodeStatus.RUNNING;
  }
}

class Attack extends BehaviorNode {
  tick(entity) {
    entity.attack(player);
    return NodeStatus.SUCCESS;
  }
}

class Patrol extends BehaviorNode {
  tick(entity) {
    if (!entity.patrolTarget) {
      entity.patrolTarget = getRandomPatrolPoint();
    }
    
    const dist = distance(entity, entity.patrolTarget);
    if (dist < 10) {
      entity.patrolTarget = getRandomPatrolPoint();
    }
    
    moveTo(entity, entity.patrolTarget);
    return NodeStatus.RUNNING;
  }
}

// ─────────────────────────────────
// Build Tree
// ─────────────────────────────────
const enemyBehavior = new Selector([
  new Sequence([
    new IsPlayerInRange(50),  // Attack range
    new Attack()
  ]),
  new Sequence([
    new IsPlayerInRange(200), // Chase range
    new MoveToPlayer()
  ]),
  new Patrol()
]);

// Update loop
function updateEnemy() {
  enemyBehavior.tick(enemy);
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "A* Pathfinding ใช้ทำอะไร?",
              options: ["สร้าง animation", "หาทางรอบสิ่งกีดขวาง", "เล่นเสียง", "โหลดรูป"],
              correctIndex: 1,
              explanation: "A* หาทางที่สั้นที่สุดจากจุด A ไป B"
            },
            {
              question: "Seek behavior ทำอะไร?",
              options: ["หนีจาก target", "เคลื่อนที่เข้าหา target", "หยุดนิ่ง", "หมุนสุ่ม"],
              correctIndex: 1,
              explanation: "Seek คำนวณ steering force เข้าหา target"
            },
            {
              question: "Behavior Tree Selector ทำงานอย่างไร?",
              options: ["รันทุก child", "หยุดเมื่อ child แรกที่ไม่ fail สำเร็จ", "รัน child สุดท้าย", "สุ่มเลือก"],
              correctIndex: 1,
              explanation: "Selector หยุดเมื่อเจอ success หรือ running"
            },
            {
              question: "Arrive behavior ต่างจาก Seek อย่างไร?",
              options: ["เร็วกว่า", "ชะลอตัวลงเมื่อใกล้ target", "วิ่งไปทิศตรงข้าม", "หมุนสุ่ม"],
              correctIndex: 1,
              explanation: "Arrive ชะลอเมื่อใกล้จุดหมาย ไม่วิ่งผ่าน"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Technique", "Use Case"]}
          rows={[
            ["A* Pathfinding", "Navigate around obstacles"],
            ["Seek/Flee", "Follow/avoid target"],
            ["Arrive", "Slow down at destination"],
            ["Wander", "Random natural movement"],
            ["Behavior Tree", "Complex AI decisions"],
          ]}
        />

        <ProgressCheck
          items={[
            "ใช้ A* Pathfinding ได้",
            "เข้าใจ Steering Behaviors ได้",
            "สร้าง Behavior Tree ได้",
            "ออกแบบ AI สำหรับศัตรูได้",
            "พร้อมเรียน Networking!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Networking และ Multiplayer! 🌐</strong>
        </TipBox>
      </Section>
    </div>
  );
}
