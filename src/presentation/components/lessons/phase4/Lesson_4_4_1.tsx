"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_4_1() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Unity สำหรับ Web</h1>

      <Objectives
        items={[
          "ทำความเข้าใจ Unity WebGL",
          "ตั้งค่า project สำหรับ web",
          "Build และ Deploy",
          "ข้อจำกัดและ Best practices",
        ]}
      />

      <Section title="Unity WebGL Overview" icon="🎯">
        <Table
          headers={["Aspect", "Description"]}
          rows={[
            ["Platform", "Compile C# → WebAssembly"],
            ["Graphics", "WebGL 2.0"],
            ["Audio", "Web Audio API"],
            ["Input", "Touch, Keyboard, Mouse"],
            ["Limitations", "No threads, limited memory"],
          ]}
        />

        <TipBox type="warning">
          <strong>Limitations:</strong>
          <ul className="mt-2 space-y-1">
            <li>• ไม่มี multi-threading (ใช้ coroutines แทน)</li>
            <li>• Memory จำกัด (~2GB)</li>
            <li>• Initial load อาจช้า</li>
            <li>• บาง features ไม่รองรับ</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Project Setup" icon="⚙️">
        <CodeBlock
          title="WebGL Project Settings"
          language="text"
          code={`
1. File → Build Settings
2. เลือก WebGL
3. Switch Platform

Project Settings ที่สำคัญ:
├── Player → Resolution
│   └── Default Canvas Width/Height
│
├── Player → WebGL Template
│   └── Minimal หรือ Default
│
├── Player → Publishing Settings
│   ├── Compression Format: Gzip
│   └── Decompression Fallback: Enable
│
└── Quality → Graphics
    └── ลด quality สำหรับ web
          `}
        />

        <CodeBlock
          title="Platform Detection"
          language="csharp"
          code={`
using UnityEngine;

public class PlatformCheck : MonoBehaviour
{
    void Start()
    {
        #if UNITY_WEBGL
            Debug.Log("Running in WebGL");
            // WebGL specific setup
            SetupForWeb();
        #else
            Debug.Log("Running in other platform");
        #endif
    }
    
    void SetupForWeb()
    {
        // Disable features not supported in WebGL
        QualitySettings.shadows = ShadowQuality.Disable;
        Application.targetFrameRate = 60;
    }
}
          `}
        />
      </Section>

      <Section title="Build Settings" icon="🔨">
        <CodeBlock
          title="Optimization Settings"
          language="text"
          code={`
Player Settings → Publishing Settings:

Compression:
├── Gzip: ดี, รองรับกว้าง
├── Brotli: ดีกว่า, ต้องตั้ง server
└── Disabled: ไฟล์ใหญ่, debug ง่าย

Code Stripping:
└── Medium/High: ลดขนาด build

Data Caching:
└── Enable: cache assets ใน IndexedDB

Exception Handling:
├── Explicitly Thrown: เร็ว
└── Full: debug ง่าย, ช้า
          `}
        />

        <TipBox type="tip">
          <strong>Reduce Build Size:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Compress textures</li>
            <li>• Use Addressables</li>
            <li>• Strip unused code</li>
            <li>• Minimize scenes</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Embedding in Website" icon="🌐">
        <CodeBlock
          title="HTML Integration"
          language="html"
          code={`
<!DOCTYPE html>
<html>
<head>
  <title>My Unity Game</title>
  <style>
    #unity-canvas {
      width: 100%;
      height: 100vh;
    }
  </style>
</head>
<body>
  <canvas id="unity-canvas"></canvas>
  
  <script src="Build/UnityLoader.js"></script>
  <script>
    var unityInstance = UnityLoader.instantiate(
      "unity-canvas",
      "Build/MyGame.json",
      {
        onProgress: function(instance, progress) {
          // Update loading bar
          document.getElementById("loading").style.width = 
            (progress * 100) + "%";
        }
      }
    );
  </script>
</body>
</html>
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Unity WebGL compile เป็นอะไร?",
              options: ["JavaScript", "WebAssembly", "Native code", "Java"],
              correctIndex: 1,
              explanation: "Unity WebGL compile C# เป็น WebAssembly (WASM)"
            },
            {
              question: "ข้อจำกัดหลักของ WebGL build คืออะไร?",
              options: ["ไม่มี graphics", "ไม่มี multi-threading", "ไม่มี input", "ไม่มี audio"],
              correctIndex: 1,
              explanation: "WebGL ไม่รองรับ threads ต้องใช้ coroutines แทน"
            },
            {
              question: "Compression format ไหนดีที่สุดสำหรับ WebGL?",
              options: ["Disabled", "Gzip หรือ Brotli", "ZIP", "RAR"],
              correctIndex: 1,
              explanation: "Gzip รองรับดี, Brotli compress ดีกว่าแต่ต้อง config server"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Topic", "คำอธิบาย"]}
          rows={[
            ["WebGL Platform", "Build Unity games สำหรับ browser"],
            ["Compression", "Gzip/Brotli ลดขนาด"],
            ["Code Stripping", "ลบ unused code"],
            ["Limitations", "No threads, limited memory"],
          ]}
        />

        <ProgressCheck
          items={[
            "เข้าใจ Unity WebGL",
            "ตั้งค่า project ได้",
            "Build และ deploy ได้",
            "รู้ข้อจำกัด",
            "พร้อมเรียน WebGL Optimization!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: WebGL Optimization! ⚡</strong>
        </TipBox>
      </Section>
    </div>
  );
}
