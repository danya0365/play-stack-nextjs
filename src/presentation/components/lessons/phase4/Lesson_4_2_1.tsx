"use client";

import { CodeBlock, Diagram, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Performance Optimization</h1>

      <Objectives
        items={[
          "Profiling และ identifying bottlenecks",
          "Rendering optimization",
          "Memory management",
          "Object pooling",
        ]}
      />

      <Section title="Performance Profiling" icon="📊">
        <CodeBlock
          title="Basic Performance Monitoring"
          language="javascript"
          code={`
// ─────────────────────────────────
// FPS Counter
// ─────────────────────────────────
class FPSCounter {
  constructor() {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
  }
  
  update() {
    this.frames++;
    const now = performance.now();
    
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
    }
    
    return this.fps;
  }
}

const fpsCounter = new FPSCounter();

function gameLoop() {
  const fps = fpsCounter.update();
  // Display FPS
  
  requestAnimationFrame(gameLoop);
}

// ─────────────────────────────────
// Performance marks
// ─────────────────────────────────
function update(dt) {
  performance.mark('update-start');
  
  // Update logic...
  updatePhysics(dt);
  updateAI(dt);
  updateAnimations(dt);
  
  performance.mark('update-end');
  performance.measure('update', 'update-start', 'update-end');
}

function render() {
  performance.mark('render-start');
  
  // Render logic...
  
  performance.mark('render-end');
  performance.measure('render', 'render-start', 'render-end');
}

// Log performance data
setInterval(() => {
  const updateMeasures = performance.getEntriesByName('update');
  const renderMeasures = performance.getEntriesByName('render');
  
  if (updateMeasures.length > 0) {
    const avgUpdate = updateMeasures.reduce((a, b) => a + b.duration, 0) / updateMeasures.length;
    const avgRender = renderMeasures.reduce((a, b) => a + b.duration, 0) / renderMeasures.length;
    
    console.log(\`Update: \${avgUpdate.toFixed(2)}ms, Render: \${avgRender.toFixed(2)}ms\`);
  }
  
  performance.clearMeasures();
}, 5000);
          `}
        />
      </Section>

      <Section title="Object Pooling" icon="♻️">
        <Diagram caption="Object Pool Concept">
{`
┌─────────────────────────────────────────────┐
│              OBJECT POOL                     │
│                                              │
│   Available: [●] [●] [●] [ ] [ ]            │
│                                              │
│   acquire() ──► Get from pool               │
│   release() ◄── Return to pool              │
│                                              │
│   Benefits:                                  │
│   • No garbage collection spikes             │
│   • Faster than new object creation          │
│   • Consistent memory usage                  │
└─────────────────────────────────────────────┘
`}
        </Diagram>

        <CodeBlock
          title="Generic Object Pool"
          language="javascript"
          code={`
class ObjectPool {
  constructor(factory, initialSize = 10) {
    this.factory = factory;
    this.pool = [];
    this.active = new Set();
    
    // Pre-create objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createNew());
    }
  }
  
  createNew() {
    const obj = this.factory();
    obj.__pooled = true;
    return obj;
  }
  
  acquire() {
    let obj = this.pool.pop();
    
    if (!obj) {
      obj = this.createNew();
    }
    
    this.active.add(obj);
    return obj;
  }
  
  release(obj) {
    if (!obj.__pooled) return;
    
    this.active.delete(obj);
    this.pool.push(obj);
  }
  
  releaseAll() {
    this.active.forEach(obj => this.pool.push(obj));
    this.active.clear();
  }
  
  get activeCount() {
    return this.active.size;
  }
  
  get poolSize() {
    return this.pool.length;
  }
}

// ─────────────────────────────────
// Usage: Bullet Pool
// ─────────────────────────────────
class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.alive = false;
  }
  
  init(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.alive = true;
  }
  
  update(dt) {
    if (!this.alive) return;
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    // Out of bounds
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.alive = false;
    }
  }
}

const bulletPool = new ObjectPool(() => new Bullet(), 50);

function shoot(x, y, angle, speed) {
  const bullet = bulletPool.acquire();
  bullet.init(
    x, y,
    Math.cos(angle) * speed,
    Math.sin(angle) * speed
  );
  return bullet;
}

function update(dt) {
  bulletPool.active.forEach(bullet => {
    bullet.update(dt);
    
    if (!bullet.alive) {
      bulletPool.release(bullet);
    }
  });
}

// ─────────────────────────────────
// Particle Pool
// ─────────────────────────────────
const particlePool = new ObjectPool(() => ({
  x: 0, y: 0,
  vx: 0, vy: 0,
  life: 0,
  maxLife: 60,
  color: 0xffffff,
  size: 5
}), 200);

function spawnParticle(x, y, color) {
  const p = particlePool.acquire();
  p.x = x;
  p.y = y;
  p.vx = (Math.random() - 0.5) * 5;
  p.vy = (Math.random() - 0.5) * 5;
  p.life = p.maxLife;
  p.color = color;
  return p;
}
          `}
        />
      </Section>

      <Section title="Rendering Optimization" icon="🎨">
        <CodeBlock
          title="Canvas Optimization"
          language="javascript"
          code={`
// ─────────────────────────────────
// Batch similar draw calls
// ─────────────────────────────────

// BAD: Switch context for each sprite
sprites.forEach(sprite => {
  ctx.fillStyle = sprite.color;  // Context switch
  ctx.fillRect(sprite.x, sprite.y, sprite.w, sprite.h);
});

// GOOD: Group by color
const byColor = new Map();
sprites.forEach(sprite => {
  if (!byColor.has(sprite.color)) {
    byColor.set(sprite.color, []);
  }
  byColor.get(sprite.color).push(sprite);
});

byColor.forEach((sprites, color) => {
  ctx.fillStyle = color;  // One context switch per color
  sprites.forEach(s => {
    ctx.fillRect(s.x, s.y, s.w, s.h);
  });
});

// ─────────────────────────────────
// Offscreen canvas for complex drawings
// ─────────────────────────────────
const offscreen = document.createElement('canvas');
offscreen.width = 100;
offscreen.height = 100;
const offCtx = offscreen.getContext('2d');

// Draw complex shape once
function prerenderComplexShape() {
  offCtx.clearRect(0, 0, 100, 100);
  // Complex drawing...
  offCtx.beginPath();
  offCtx.arc(50, 50, 40, 0, Math.PI * 2);
  offCtx.fill();
  // More drawing...
}
prerenderComplexShape();

// Use as stamp
function render() {
  entities.forEach(e => {
    ctx.drawImage(offscreen, e.x, e.y);  // Fast!
  });
}

// ─────────────────────────────────
// Dirty rectangles
// ─────────────────────────────────
class DirtyRectRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.dirtyRects = [];
  }
  
  markDirty(x, y, w, h) {
    this.dirtyRects.push({ x, y, w, h });
  }
  
  render(drawFn) {
    if (this.dirtyRects.length === 0) return;
    
    // Merge overlapping rects
    const merged = this.mergeRects(this.dirtyRects);
    
    merged.forEach(rect => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(rect.x, rect.y, rect.w, rect.h);
      this.ctx.clip();
      
      // Clear and redraw only this area
      this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
      drawFn(rect);
      
      this.ctx.restore();
    });
    
    this.dirtyRects = [];
  }
}
          `}
        />
      </Section>

      <Section title="Memory Management" icon="🧹">
        <CodeBlock
          title="Avoiding Memory Leaks"
          language="javascript"
          code={`
// ─────────────────────────────────
// Cleanup event listeners
// ─────────────────────────────────
class GameObject {
  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.onKeyDown);
  }
  
  onKeyDown(e) {
    // Handle input
  }
  
  destroy() {
    // IMPORTANT: Remove listeners!
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

// ─────────────────────────────────
// Cleanup textures/resources
// ─────────────────────────────────
function unloadLevel(level) {
  // Dispose textures
  level.textures.forEach(tex => {
    tex.dispose();
  });
  
  // Clear arrays
  level.enemies.length = 0;
  level.items.length = 0;
  
  // Clear references
  level.player = null;
}

// ─────────────────────────────────
// Reuse vectors (avoid allocation)
// ─────────────────────────────────

// BAD: Creates new vector every frame
function update() {
  const direction = new Vector2(target.x - player.x, target.y - player.y);
  direction.normalize();
  // ...
}

// GOOD: Reuse pre-allocated vector
const tempVec = new Vector2();

function update() {
  tempVec.x = target.x - player.x;
  tempVec.y = target.y - player.y;
  tempVec.normalize();
  // ...
}

// ─────────────────────────────────
// WeakMap for metadata
// ─────────────────────────────────
// When object is garbage collected, so is metadata
const entityData = new WeakMap();

function setEntityHealth(entity, health) {
  entityData.set(entity, { health });
}

function getEntityHealth(entity) {
  return entityData.get(entity)?.health ?? 0;
}
          `}
        />
      </Section>

      <Section title="Spatial Optimization" icon="🗺️">
        <CodeBlock
          title="Spatial Partitioning"
          language="javascript"
          code={`
// ─────────────────────────────────
// Grid-based spatial hash
// ─────────────────────────────────
class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }
  
  getKey(x, y) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return \`\${cx},\${cy}\`;
  }
  
  insert(entity) {
    const key = this.getKey(entity.x, entity.y);
    
    if (!this.cells.has(key)) {
      this.cells.set(key, new Set());
    }
    
    this.cells.get(key).add(entity);
    entity.__spatialKey = key;
  }
  
  remove(entity) {
    const cell = this.cells.get(entity.__spatialKey);
    if (cell) {
      cell.delete(entity);
    }
  }
  
  update(entity) {
    const newKey = this.getKey(entity.x, entity.y);
    
    if (newKey !== entity.__spatialKey) {
      this.remove(entity);
      this.insert(entity);
    }
  }
  
  getNearby(x, y, radius = 1) {
    const nearby = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = \`\${cx + dx},\${cy + dy}\`;
        const cell = this.cells.get(key);
        
        if (cell) {
          nearby.push(...cell);
        }
      }
    }
    
    return nearby;
  }
  
  clear() {
    this.cells.clear();
  }
}

// Usage
const spatialHash = new SpatialHash(100);

// Insert all entities
entities.forEach(e => spatialHash.insert(e));

// Fast collision check
function checkCollisions(entity) {
  // Only check nearby entities, not all!
  const nearby = spatialHash.getNearby(entity.x, entity.y, 50);
  
  for (const other of nearby) {
    if (other !== entity && isColliding(entity, other)) {
      handleCollision(entity, other);
    }
  }
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Technique", "Improvement"]}
          rows={[
            ["Object Pooling", "No GC spikes, faster spawn"],
            ["Batch Rendering", "Fewer draw calls"],
            ["Spatial Hashing", "O(1) nearby lookup"],
            ["Dirty Rectangles", "Partial screen update"],
            ["Listener Cleanup", "Prevent memory leaks"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Save/Load System! 💾</strong>
        </TipBox>
      </Section>
    </div>
  );
}
