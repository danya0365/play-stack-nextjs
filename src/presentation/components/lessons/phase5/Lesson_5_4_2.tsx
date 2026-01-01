"use client";

import { CodeBlock, Diagram, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_4_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">เทคนิคการ Optimize</h1>

      <Objectives
        items={[
          "Object Pooling",
          "Level of Detail (LOD)",
          "Frustum Culling",
          "Batching",
        ]}
      />

      <Section title="Object Pooling" icon="♻️">
        <Diagram caption="Pool vs Create/Destroy">
{`
Without Pool:              With Pool:
Create → Use → Destroy     Get → Use → Return
     ↓                          ↓
  GC runs                   No allocations
  (game freezes)            (smooth gameplay)
`}
        </Diagram>

        <CodeBlock
          title="Generic Object Pool"
          language="typescript"
          code={`
class Pool<T> {
  private pool: T[] = [];
  private create: () => T;
  private reset: (obj: T) => void;
  
  constructor(create: () => T, reset: (obj: T) => void, size = 100) {
    this.create = create;
    this.reset = reset;
    
    for (let i = 0; i < size; i++) {
      this.pool.push(create());
    }
  }
  
  get(): T {
    return this.pool.pop() || this.create();
  }
  
  release(obj: T): void {
    this.reset(obj);
    this.pool.push(obj);
  }
}

// Usage
const bulletPool = new Pool(
  () => ({ x: 0, y: 0, active: false }),
  (b) => { b.x = 0; b.y = 0; b.active = false; }
);
          `}
        />
      </Section>

      <Section title="Level of Detail (LOD)" icon="🔍">
        <CodeBlock
          title="LOD Implementation"
          language="typescript"
          code={`
class LODManager {
  getLODLevel(distance: number): 'high' | 'medium' | 'low' | 'hidden' {
    if (distance > 1000) return 'hidden';
    if (distance > 500) return 'low';
    if (distance > 200) return 'medium';
    return 'high';
  }
  
  updateEntity(entity: Entity, camera: Camera) {
    const dist = distance(entity.position, camera.position);
    const lod = this.getLODLevel(dist);
    
    switch (lod) {
      case 'high':
        entity.mesh = entity.highPolyMesh;
        entity.updateRate = 1;  // Every frame
        break;
      case 'medium':
        entity.mesh = entity.medPolyMesh;
        entity.updateRate = 2;  // Every 2 frames
        break;
      case 'low':
        entity.mesh = entity.lowPolyMesh;
        entity.updateRate = 5;  // Every 5 frames
        break;
      case 'hidden':
        entity.visible = false;
        break;
    }
  }
}
          `}
        />
      </Section>

      <Section title="Frustum Culling" icon="📷">
        <CodeBlock
          title="Don't Render What Camera Can't See"
          language="typescript"
          code={`
class Frustum {
  isInView(bounds: AABB, camera: Camera): boolean {
    const planes = camera.getFrustumPlanes();
    
    for (const plane of planes) {
      if (this.boxOutsidePlane(bounds, plane)) {
        return false;
      }
    }
    return true;
  }
}

// In render loop
function render() {
  const frustum = new Frustum();
  
  for (const entity of entities) {
    // Skip entities outside camera view
    if (!frustum.isInView(entity.bounds, camera)) {
      continue;
    }
    
    entity.render();
  }
}
          `}
        />
      </Section>

      <Section title="Batching" icon="📦">
        <Table
          headers={["Technique", "Description"]}
          rows={[
            ["Static Batching", "Combine static meshes"],
            ["Dynamic Batching", "Combine small dynamic meshes"],
            ["Instancing", "Draw many copies efficiently"],
            ["Texture Atlas", "Combine textures to reduce swaps"],
          ]}
        />

        <CodeBlock
          title="Sprite Batching"
          language="typescript"
          code={`
class SpriteBatcher {
  private vertices: Float32Array;
  private index = 0;
  
  begin() {
    this.index = 0;
  }
  
  draw(sprite: Sprite, x: number, y: number) {
    // Add vertices to batch
    this.addQuad(x, y, sprite.width, sprite.height, sprite.uvs);
  }
  
  end() {
    // Single draw call for all sprites
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, this.index / 6);
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Object Pooling ช่วยแก้ปัญหาอะไร?",
              options: ["Graphics", "GC pauses", "Network", "Audio"],
              correctIndex: 1,
              explanation: "Pooling reuse objects แทนการ create/destroy ลด garbage collection"
            },
            {
              question: "Frustum Culling ทำอะไร?",
              options: ["ลด polygons", "ไม่ render objects นอกกล้อง", "Compress textures", "Batch draws"],
              correctIndex: 1,
              explanation: "Culling ข้าม objects ที่ camera มองไม่เห็น"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "Implement Object Pool ได้",
            "ใช้ LOD ได้",
            "เข้าใจ Frustum Culling",
            "พร้อมเรียน Memory Management!"
          ]}
        />
      </Section>
    </div>
  );
}
