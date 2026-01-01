"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_4_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">WebGL Optimization</h1>

      <Objectives
        items={[
          "Optimization techniques สำหรับ WebGL",
          "ลด loading time",
          "เพิ่ม runtime performance",
          "Memory management",
        ]}
      />

      <Section title="Build Size Optimization" icon="📦">
        <CodeBlock
          title="Reduce Build Size"
          language="text"
          code={`
1. Texture Compression
   ├── ใช้ ASTC หรือ ETC2
   ├── ลด resolution ที่ไม่จำเป็น
   └── ใช้ Sprite Atlases

2. Audio
   ├── ใช้ MP3/OGG
   ├── ลด quality สำหรับ SFX
   └── ใช้ Streaming สำหรับ music

3. Code
   ├── IL2CPP Code Generation: Faster runtime
   ├── Managed Stripping Level: High
   └── ลบ unused packages

4. Assets
   ├── ใช้ Addressables
   ├── Lazy loading
   └── Remove unused assets
          `}
        />

        <TipBox type="tip">
          <strong>Target Size:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Initial: &lt; 5MB (ideal)</li>
            <li>• Total: &lt; 30MB (acceptable)</li>
            <li>• ใช้ Asset Bundles สำหรับ content เพิ่ม</li>
          </ul>
        </TipBox>
      </Section>

      <Section title="Loading Optimization" icon="⏱️">
        <CodeBlock
          title="Streaming and Lazy Loading"
          language="csharp"
          code={`
using UnityEngine;
using UnityEngine.AddressableAssets;
using System.Collections;

public class AsyncLoader : MonoBehaviour
{
    // ─────────────────────────────────
    // Load scene asynchronously
    // ─────────────────────────────────
    IEnumerator LoadSceneAsync(string sceneName)
    {
        AsyncOperation asyncLoad = 
            SceneManager.LoadSceneAsync(sceneName);
        
        asyncLoad.allowSceneActivation = false;
        
        while (!asyncLoad.isDone)
        {
            float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f);
            UpdateLoadingBar(progress);
            
            if (asyncLoad.progress >= 0.9f)
            {
                asyncLoad.allowSceneActivation = true;
            }
            
            yield return null;
        }
    }
    
    // ─────────────────────────────────
    // Load assets with Addressables
    // ─────────────────────────────────
    async void LoadCharacter(string characterId)
    {
        var handle = Addressables.LoadAssetAsync<GameObject>(characterId);
        await handle.Task;
        
        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            Instantiate(handle.Result);
        }
    }
}
          `}
        />
      </Section>

      <Section title="Runtime Performance" icon="🚀">
        <CodeBlock
          title="Performance Tips"
          language="csharp"
          code={`
public class PerformanceOptimizations : MonoBehaviour
{
    // ─────────────────────────────────
    // Object Pooling
    // ─────────────────────────────────
    private Queue<GameObject> bulletPool = new Queue<GameObject>();
    
    GameObject GetBullet()
    {
        if (bulletPool.Count > 0)
        {
            var bullet = bulletPool.Dequeue();
            bullet.SetActive(true);
            return bullet;
        }
        return Instantiate(bulletPrefab);
    }
    
    void ReturnBullet(GameObject bullet)
    {
        bullet.SetActive(false);
        bulletPool.Enqueue(bullet);
    }
    
    // ─────────────────────────────────
    // Avoid GC allocations
    // ─────────────────────────────────
    // BAD: Creates garbage every frame
    void BadUpdate()
    {
        var enemies = FindObjectsByType<Enemy>(FindObjectsSortMode.None);
    }
    
    // GOOD: Cache and reuse
    private List<Enemy> enemies = new List<Enemy>();
    
    void GoodUpdate()
    {
        enemies.Clear();
        // Populate list without new allocation
    }
    
    // ─────────────────────────────────
    // Use coroutines instead of threads
    // ─────────────────────────────────
    IEnumerator HeavyCalculation()
    {
        for (int i = 0; i < 10000; i++)
        {
            // Do work
            if (i % 100 == 0)
            {
                yield return null; // Spread across frames
            }
        }
    }
}
          `}
        />
      </Section>

      <Section title="Graphics Optimization" icon="🎨">
        <Table
          headers={["Technique", "Description"]}
          rows={[
            ["Batching", "รวม draw calls"],
            ["LOD", "ลด polygons ตามระยะ"],
            ["Occlusion Culling", "ไม่วาดที่มองไม่เห็น"],
            ["Texture Atlases", "รวม textures"],
            ["Simple Shaders", "หลีกเลี่ยง complex shaders"],
          ]}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Object Pooling ใช้ทำอะไร?",
              options: ["เพิ่ม graphics", "ลด GC โดย reuse objects", "เพิ่ม memory", "ลด code"],
              correctIndex: 1,
              explanation: "Object Pooling reuse objects แทนการ Instantiate/Destroy บ่อยๆ"
            },
            {
              question: "ทำไมต้องหลีกเลี่ยง allocations ใน Update()?",
              options: ["ทำให้ code ยาว", "สร้าง garbage ที่ GC ต้อง collect", "ทำให้ graphics ช้า", "ทำให้ build ใหญ่"],
              correctIndex: 1,
              explanation: "allocations สร้าง garbage ที่ทำให้ GC pause game"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "ลด build size ได้",
            "ใช้ async loading ได้",
            "ใช้ Object Pooling ได้",
            "Optimize graphics ได้",
            "พร้อมเรียน JS Integration!"
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: JavaScript Integration! 🔗</strong>
        </TipBox>
      </Section>
    </div>
  );
}
