"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section } from "../LessonComponents";

export default function Lesson_5_5_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">AI และ Pathfinding</h1>

      <Objectives
        items={[
          "Implement A* Algorithm",
          "เข้าใจ Behavior Trees",
          "ใช้ Navigation Mesh",
          "สร้าง Smart AI",
        ]}
      />

      <Section title="A* Pathfinding" icon="🗺️">
        <Diagram caption="A* Algorithm">
{`
Start (S) ─────────────────── Goal (G)
    │                           │
    ▼                           │
  Open List: nodes to explore   │
  Closed List: explored nodes   │
    │                           │
    ▼                           │
  For each node:                │
  f(n) = g(n) + h(n)            │
  g = cost from start           │
  h = heuristic to goal         │
    │                           │
    └───► Pick lowest f ────────┘
`}
        </Diagram>

        <CodeBlock
          title="A* Implementation"
          language="typescript"
          code={`
interface Node {
  x: number;
  y: number;
  g: number;  // Cost from start
  h: number;  // Heuristic to goal
  f: number;  // g + h
  parent: Node | null;
}

function aStar(start: Point, goal: Point, grid: number[][]): Point[] {
  const openList: Node[] = [];
  const closedList: Set<string> = new Set();
  
  const startNode: Node = {
    x: start.x, y: start.y,
    g: 0, h: heuristic(start, goal), f: 0,
    parent: null
  };
  startNode.f = startNode.g + startNode.h;
  
  openList.push(startNode);
  
  while (openList.length > 0) {
    // Get node with lowest f
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;
    
    // Reached goal
    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(current);
    }
    
    closedList.add(\`\${current.x},\${current.y}\`);
    
    // Check neighbors
    for (const [dx, dy] of [[0,1], [1,0], [0,-1], [-1,0]]) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      
      // Skip walls and visited
      if (grid[ny]?.[nx] === 1) continue;
      if (closedList.has(\`\${nx},\${ny}\`)) continue;
      
      const g = current.g + 1;
      const h = heuristic({ x: nx, y: ny }, goal);
      
      const neighbor: Node = {
        x: nx, y: ny, g, h, f: g + h,
        parent: current
      };
      
      openList.push(neighbor);
    }
  }
  
  return []; // No path found
}

function heuristic(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(node: Node): Point[] {
  const path: Point[] = [];
  let current: Node | null = node;
  
  while (current) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }
  
  return path;
}
          `}
        />
      </Section>

      <Section title="Behavior Trees" icon="🌳">
        <CodeBlock
          title="Simple Behavior Tree"
          language="typescript"
          code={`
type Status = 'success' | 'failure' | 'running';

interface BehaviorNode {
  tick(entity: Entity): Status;
}

// Sequence: Run children until one fails
class Sequence implements BehaviorNode {
  constructor(private children: BehaviorNode[]) {}
  
  tick(entity: Entity): Status {
    for (const child of this.children) {
      const status = child.tick(entity);
      if (status !== 'success') return status;
    }
    return 'success';
  }
}

// Selector: Run children until one succeeds
class Selector implements BehaviorNode {
  constructor(private children: BehaviorNode[]) {}
  
  tick(entity: Entity): Status {
    for (const child of this.children) {
      const status = child.tick(entity);
      if (status !== 'failure') return status;
    }
    return 'failure';
  }
}

// Example: Enemy AI
const enemyBehavior = new Selector([
  new Sequence([
    new CanSeePlayer(),
    new ChasePlayer()
  ]),
  new Patrol()
]);

// Each frame
enemyBehavior.tick(enemy);
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "A* ใช้ heuristic ทำอะไร?",
              options: ["สุ่มทาง", "ประมาณระยะทางถึง goal", "วาดเส้น", "ลบ nodes"],
              correctIndex: 1,
              explanation: "Heuristic ประมาณ cost ที่เหลือถึง goal เพื่อเลือก node ที่ดีที่สุด"
            },
            {
              question: "Sequence node ทำงานอย่างไร?",
              options: ["รันทุก children", "รันจนกว่าจะเจอ failure", "รันแค่ตัวแรก", "สุ่มรัน"],
              correctIndex: 1,
              explanation: "Sequence รัน children ตามลำดับจนกว่าจะมี failure"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "Implement A* ได้",
            "เข้าใจ Behavior Trees",
            "สร้าง AI ได้",
            "พร้อมเรียน Advanced Physics!"
          ]}
        />
      </Section>
    </div>
  );
}
