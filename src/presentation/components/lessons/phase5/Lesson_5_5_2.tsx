"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_5_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Procedural Generation</h1>

      <Objectives
        items={[
          "เข้าใจ Noise Functions",
          "สร้าง Procedural Terrain",
          "Generate Dungeons",
          "Random with Seeds",
        ]}
      />

      <Section title="Noise Functions" icon="🌊">
        <Table
          headers={["Type", "Description", "Use"]}
          rows={[
            ["Perlin", "Smooth gradient noise", "Terrain, clouds"],
            ["Simplex", "Faster, no artifacts", "3D terrain"],
            ["Worley", "Cell-based patterns", "Stone, water"],
          ]}
        />

        <CodeBlock
          title="Simple Noise Implementation"
          language="typescript"
          code={`
// Simple 2D noise (for learning)
function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth interpolation
function smoothNoise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;

  const v00 = noise2D(x0, y0);
  const v10 = noise2D(x0 + 1, y0);
  const v01 = noise2D(x0, y0 + 1);
  const v11 = noise2D(x0 + 1, y0 + 1);

  // Bilinear interpolation
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);

  return lerp(lerp(v00, v10, u), lerp(v01, v11, u), v);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
          `}
        />
      </Section>

      <Section title="Terrain Generation" icon="🏔️">
        <CodeBlock
          title="Height Map Generation"
          language="typescript"
          code={`
class TerrainGenerator {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  generateHeightMap(width: number, height: number): number[][] {
    const map: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      map[y] = [];
      for (let x = 0; x < width; x++) {
        // Multiple octaves for detail
        let elevation = 0;
        let frequency = 0.01;
        let amplitude = 1;
        
        for (let octave = 0; octave < 4; octave++) {
          elevation += this.noise(x * frequency, y * frequency) * amplitude;
          frequency *= 2;
          amplitude *= 0.5;
        }
        
        map[y][x] = elevation;
      }
    }
    
    return map;
  }
  
  private noise(x: number, y: number): number {
    // Use seeded noise
    const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
    return n - Math.floor(n);
  }
}

// Generate mesh from height map
function createTerrainMesh(heightMap: number[][]): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(100, 100, heightMap[0].length - 1, heightMap.length - 1);
  const positions = geometry.attributes.position.array;
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = Math.floor((i / 3) % heightMap[0].length);
    const y = Math.floor((i / 3) / heightMap[0].length);
    positions[i + 2] = heightMap[y][x] * 10; // Z = height
  }
  
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}
          `}
        />
      </Section>

      <Section title="Dungeon Generation" icon="🏰">
        <CodeBlock
          title="BSP Dungeon"
          language="typescript"
          code={`
interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

class DungeonGenerator {
  generate(width: number, height: number, minRoomSize: number): number[][] {
    const map = this.createEmptyMap(width, height);
    const rooms: Room[] = [];
    
    // Binary Space Partitioning
    this.split({
      x: 0, y: 0,
      width, height
    }, minRoomSize, rooms);
    
    // Carve rooms
    for (const room of rooms) {
      this.carveRoom(map, room);
    }
    
    // Connect rooms
    for (let i = 1; i < rooms.length; i++) {
      this.connectRooms(map, rooms[i - 1], rooms[i]);
    }
    
    return map;
  }
  
  private split(area: Room, minSize: number, rooms: Room[]) {
    if (area.width < minSize * 2 || area.height < minSize * 2) {
      // Create room in this area
      rooms.push({
        x: area.x + 1,
        y: area.y + 1,
        width: area.width - 2,
        height: area.height - 2
      });
      return;
    }
    
    // Split horizontally or vertically
    const horizontal = Math.random() > 0.5;
    
    if (horizontal) {
      const split = Math.floor(area.height / 2);
      this.split({ ...area, height: split }, minSize, rooms);
      this.split({ ...area, y: area.y + split, height: area.height - split }, minSize, rooms);
    } else {
      const split = Math.floor(area.width / 2);
      this.split({ ...area, width: split }, minSize, rooms);
      this.split({ ...area, x: area.x + split, width: area.width - split }, minSize, rooms);
    }
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Perlin Noise ใช้ทำอะไร?",
              options: ["Random numbers", "Smooth gradient ที่ต่อเนื่อง", "Pixel art", "Compression"],
              correctIndex: 1,
              explanation: "Perlin noise สร้าง smooth patterns ที่เหมาะกับ terrain"
            },
            {
              question: "BSP ย่อมาจากอะไร?",
              options: ["Basic Sound Processing", "Binary Space Partitioning", "Best Sprite Pattern", "Block Storage Protocol"],
              correctIndex: 1,
              explanation: "BSP แบ่งพื้นที่เป็น partitions สำหรับสร้าง dungeons"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "เข้าใจ noise functions",
            "Generate terrain ได้",
            "สร้าง dungeons ได้",
            "พร้อมเรียน AI & Pathfinding!"
          ]}
        />
      </Section>
    </div>
  );
}
