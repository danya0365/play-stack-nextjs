"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_4_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">จัดการ Memory</h1>

      <Objectives
        items={[
          "เข้าใจ JavaScript Memory Model",
          "หา Memory Leaks",
          "Asset Loading Strategies",
          "Best Practices",
        ]}
      />

      <Section title="Memory Leaks" icon="🔍">
        <Table
          headers={["Cause", "Example", "Fix"]}
          rows={[
            ["Event listeners", "ไม่ removeEventListener", "Cleanup on destroy"],
            ["References", "เก็บ reference ที่ไม่ใช้", "Set to null"],
            ["Intervals", "setInterval ไม่ clear", "clearInterval"],
            ["Closures", "Closure จับ objects ไว้", "ระวัง scope"],
          ]}
        />

        <CodeBlock
          title="Memory Leak Examples"
          language="typescript"
          code={`
// ❌ BAD: Event listener not removed
class Enemy {
  constructor() {
    window.addEventListener('resize', this.onResize);
  }
  
  onResize = () => { /* ... */ }
  
  // Enemy destroyed but listener still exists!
}

// ✅ GOOD: Cleanup properly
class Enemy {
  constructor() {
    window.addEventListener('resize', this.onResize);
  }
  
  onResize = () => { /* ... */ }
  
  destroy() {
    window.removeEventListener('resize', this.onResize);
  }
}

// ❌ BAD: Interval never cleared
class Spawner {
  interval = setInterval(() => {
    this.spawn();
  }, 1000);
  // Runs forever even after spawner is "gone"
}

// ✅ GOOD: Clear on destroy
class Spawner {
  interval: number;
  
  start() {
    this.interval = setInterval(() => {
      this.spawn();
    }, 1000);
  }
  
  destroy() {
    clearInterval(this.interval);
  }
}
          `}
        />
      </Section>

      <Section title="Memory Profiling" icon="📊">
        <CodeBlock
          title="Chrome Memory Tab"
          language="text"
          code={`
1. DevTools → Memory tab
2. Take heap snapshot
3. เล่นเกมสักครู่
4. Take another snapshot
5. Compare snapshots

ดู:
- Objects เพิ่มขึ้นเรื่อยๆ = leak
- Detached DOM nodes = event listener leak
- Array/Object ที่โตไม่หยุด = ลืม cleanup
          `}
        />
      </Section>

      <Section title="Asset Loading" icon="📦">
        <CodeBlock
          title="Smart Asset Loading"
          language="typescript"
          code={`
class AssetManager {
  private loaded: Map<string, any> = new Map();
  private loading: Map<string, Promise<any>> = new Map();
  
  // ─────────────────────────────────
  // Load with caching
  // ─────────────────────────────────
  async load(url: string): Promise<any> {
    // Already loaded
    if (this.loaded.has(url)) {
      return this.loaded.get(url);
    }
    
    // Currently loading
    if (this.loading.has(url)) {
      return this.loading.get(url);
    }
    
    // Start loading
    const promise = fetch(url)
      .then(r => r.blob())
      .then(blob => createImageBitmap(blob))
      .then(bitmap => {
        this.loaded.set(url, bitmap);
        this.loading.delete(url);
        return bitmap;
      });
    
    this.loading.set(url, promise);
    return promise;
  }
  
  // ─────────────────────────────────
  // Unload unused assets
  // ─────────────────────────────────
  unload(url: string) {
    const asset = this.loaded.get(url);
    if (asset && asset.close) {
      asset.close(); // ImageBitmap
    }
    this.loaded.delete(url);
  }
  
  // ─────────────────────────────────
  // Unload all for level change
  // ─────────────────────────────────
  unloadAll() {
    this.loaded.forEach((asset, url) => {
      this.unload(url);
    });
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Memory leak ที่พบบ่อยที่สุดคืออะไร?",
              options: ["Too many images", "Event listeners ไม่ remove", "Too much code", "Large arrays"],
              correctIndex: 1,
              explanation: "Event listeners ที่ไม่ถูก remove ทำให้ objects ไม่ถูก GC"
            },
            {
              question: "จะหา memory leak ได้อย่างไร?",
              options: ["Console.log", "Compare heap snapshots", "Network tab", "ดู FPS"],
              correctIndex: 1,
              explanation: "เปรียบเทียบ heap snapshots เพื่อดูว่า objects เพิ่มขึ้นเรื่อยๆ ไหม"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "หา memory leaks ได้",
            "Cleanup resources ถูกต้อง",
            "จัดการ asset loading ได้",
            "จบ Module 5.4! พร้อมเรียน Advanced 3D!"
          ]}
        />
      </Section>
    </div>
  );
}
