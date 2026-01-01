"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table } from "../LessonComponents";

export default function Lesson_5_4_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">การ Profiling</h1>

      <Objectives
        items={[
          "ใช้ Chrome DevTools Profiler",
          "หา Performance Bottlenecks",
          "วัด Frame Time",
          "Analyze Memory Usage",
        ]}
      />

      <Section title="Chrome DevTools" icon="🔧">
        <CodeBlock
          title="Performance Panel"
          language="text"
          code={`
1. เปิด DevTools (F12)
2. ไปที่ Performance tab
3. กด Record (●)
4. เล่นเกมสักครู่
5. กด Stop
6. วิเคราะห์ผล:

┌─────────────────────────────────────────────┐
│ FPS Chart     ███████▄▄▄███████████        │
│               ↑ drop here = problem         │
├─────────────────────────────────────────────┤
│ Main Thread   [Scripting][Rendering][Paint] │
│               ↑ ดูว่าอะไรใช้เวลามาก          │
├─────────────────────────────────────────────┤
│ Call Tree     ▼ update() 15ms               │
│               ├─ physics() 8ms              │
│               └─ render() 5ms               │
│               ↑ drill down หาปัญหา          │
└─────────────────────────────────────────────┘
          `}
        />
      </Section>

      <Section title="Performance API" icon="⏱️">
        <CodeBlock
          title="Measure Code Performance"
          language="typescript"
          code={`
class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measurements: Map<string, number[]> = new Map();
  
  // ─────────────────────────────────
  // Mark start/end of operations
  // ─────────────────────────────────
  start(label: string) {
    this.marks.set(label, performance.now());
  }
  
  end(label: string) {
    const start = this.marks.get(label);
    if (!start) return;
    
    const duration = performance.now() - start;
    
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    this.measurements.get(label)!.push(duration);
  }
  
  // ─────────────────────────────────
  // Get average time
  // ─────────────────────────────────
  getAverage(label: string): number {
    const times = this.measurements.get(label);
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b) / times.length;
  }
  
  report() {
    console.table(
      Array.from(this.measurements.entries()).map(([label, times]) => ({
        label,
        avg: this.getAverage(label).toFixed(2) + 'ms',
        min: Math.min(...times).toFixed(2) + 'ms',
        max: Math.max(...times).toFixed(2) + 'ms',
        calls: times.length
      }))
    );
  }
}

// Usage
const perf = new PerformanceMonitor();

function gameLoop() {
  perf.start('frame');
  
  perf.start('physics');
  updatePhysics();
  perf.end('physics');
  
  perf.start('ai');
  updateAI();
  perf.end('ai');
  
  perf.start('render');
  render();
  perf.end('render');
  
  perf.end('frame');
}

// Every 60 frames
if (frameCount % 60 === 0) {
  perf.report();
}
          `}
        />
      </Section>

      <Section title="Frame Time Budget" icon="🎯">
        <Table
          headers={["Target FPS", "Frame Budget", "ถ้าเกิน"]}
          rows={[
            ["60 FPS", "16.67ms", "Frame drops"],
            ["30 FPS", "33.33ms", "Still playable"],
            ["120 FPS", "8.33ms", "Competitive"],
          ]}
        />

        <CodeBlock
          title="FPS Counter"
          language="typescript"
          code={`
class FPSCounter {
  private frames = 0;
  private lastTime = performance.now();
  fps = 0;
  
  update() {
    this.frames++;
    const now = performance.now();
    
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fps < 30 ? 'red' : 'green';
    ctx.font = '14px monospace';
    ctx.fillText(\`FPS: \${this.fps}\`, 10, 20);
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "60 FPS ต้องใช้ frame budget เท่าไหร่?",
              options: ["60ms", "16.67ms", "33ms", "100ms"],
              correctIndex: 1,
              explanation: "1000ms / 60 = 16.67ms ต่อ frame"
            },
            {
              question: "ใช้เครื่องมือไหนดู JavaScript performance?",
              options: ["Network tab", "Performance tab", "Elements tab", "Console"],
              correctIndex: 1,
              explanation: "Performance tab ใน DevTools แสดง call stack และ time breakdown"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "ใช้ DevTools Profiler ได้",
            "วัด frame time ได้",
            "หา bottlenecks ได้",
            "พร้อมเรียน Optimization Techniques!"
          ]}
        />
      </Section>
    </div>
  );
}
