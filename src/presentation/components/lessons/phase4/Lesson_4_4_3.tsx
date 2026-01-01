"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_4_3() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">JavaScript Integration</h1>

      <Objectives
        items={[
          "เรียก JavaScript จาก Unity",
          "เรียก Unity จาก JavaScript",
          "ใช้ browser APIs",
          "Integration กับ web app",
        ]}
      />

      <Section title="Unity → JavaScript" icon="➡️">
        <CodeBlock
          title="jslib Plugin"
          language="javascript"
          code={`
// Plugins/WebGL/MyPlugin.jslib
mergeInto(LibraryManager.library, {
  
  // ─────────────────────────────────
  // Simple function
  // ─────────────────────────────────
  ShowAlert: function(message) {
    var msg = UTF8ToString(message);
    alert(msg);
  },
  
  // ─────────────────────────────────
  // LocalStorage
  // ─────────────────────────────────
  SaveToLocalStorage: function(key, value) {
    var k = UTF8ToString(key);
    var v = UTF8ToString(value);
    localStorage.setItem(k, v);
  },
  
  LoadFromLocalStorage: function(key) {
    var k = UTF8ToString(key);
    var value = localStorage.getItem(k) || "";
    // Return string to Unity
    var bufferSize = lengthBytesUTF8(value) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(value, buffer, bufferSize);
    return buffer;
  },
  
  // ─────────────────────────────────
  // Call external API
  // ─────────────────────────────────
  PostScore: function(score, callback) {
    fetch('/api/scores', {
      method: 'POST',
      body: JSON.stringify({ score: score })
    })
    .then(response => response.json())
    .then(data => {
      // Call Unity callback
      SendMessage('GameManager', 'OnScorePosted', JSON.stringify(data));
    });
  }
  
});
          `}
        />

        <CodeBlock
          title="C# Side"
          language="csharp"
          code={`
using System.Runtime.InteropServices;
using UnityEngine;

public class JSBridge : MonoBehaviour
{
    // ─────────────────────────────────
    // Import JS functions
    // ─────────────────────────────────
    [DllImport("__Internal")]
    private static extern void ShowAlert(string message);
    
    [DllImport("__Internal")]
    private static extern void SaveToLocalStorage(string key, string value);
    
    [DllImport("__Internal")]
    private static extern string LoadFromLocalStorage(string key);
    
    [DllImport("__Internal")]
    private static extern void PostScore(int score);
    
    // ─────────────────────────────────
    // Use in code
    // ─────────────────────────────────
    public void SaveGame()
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        SaveToLocalStorage("save", JsonUtility.ToJson(gameData));
        #else
        PlayerPrefs.SetString("save", JsonUtility.ToJson(gameData));
        #endif
    }
    
    // Callback from JS
    public void OnScorePosted(string jsonData)
    {
        Debug.Log("Score posted: " + jsonData);
    }
}
          `}
        />
      </Section>

      <Section title="JavaScript → Unity" icon="⬅️">
        <CodeBlock
          title="Call Unity from JS"
          language="javascript"
          code={`
// From your website JavaScript:

// ─────────────────────────────────
// SendMessage to Unity
// ─────────────────────────────────
// Format: unityInstance.SendMessage(GameObjectName, MethodName, Parameter)

unityInstance.SendMessage('Player', 'SetPlayerName', 'John');
unityInstance.SendMessage('GameManager', 'StartGame');
unityInstance.SendMessage('Shop', 'PurchaseItem', '123');

// ─────────────────────────────────
// With parameters
// ─────────────────────────────────
function setPlayerData(data) {
  unityInstance.SendMessage(
    'GameManager',
    'SetPlayerData', 
    JSON.stringify(data)
  );
}

setPlayerData({
  name: 'John',
  level: 5,
  gold: 100
});
          `}
        />

        <CodeBlock
          title="Unity Receiver"
          language="csharp"
          code={`
// GameManager.cs - attached to "GameManager" GameObject
public class GameManager : MonoBehaviour
{
    // Called from JavaScript
    public void StartGame()
    {
        SceneManager.LoadScene("Game");
    }
    
    public void SetPlayerData(string jsonData)
    {
        var data = JsonUtility.FromJson<PlayerData>(jsonData);
        player.name = data.name;
        player.level = data.level;
        player.gold = data.gold;
    }
}
          `}
        />
      </Section>

      <Section title="Browser APIs" icon="🌐">
        <CodeBlock
          title="Common Browser APIs"
          language="javascript"
          code={`
// MyPlugin.jslib
mergeInto(LibraryManager.library, {
  
  // ─────────────────────────────────
  // Get URL parameters
  // ─────────────────────────────────
  GetURLParam: function(param) {
    var p = UTF8ToString(param);
    var urlParams = new URLSearchParams(window.location.search);
    var value = urlParams.get(p) || "";
    // Return to Unity...
  },
  
  // ─────────────────────────────────
  // Clipboard
  // ─────────────────────────────────
  CopyToClipboard: function(text) {
    var t = UTF8ToString(text);
    navigator.clipboard.writeText(t);
  },
  
  // ─────────────────────────────────
  // Fullscreen
  // ─────────────────────────────────
  RequestFullscreen: function() {
    document.body.requestFullscreen();
  },
  
  ExitFullscreen: function() {
    document.exitFullscreen();
  },
  
  // ─────────────────────────────────
  // Open URL
  // ─────────────────────────────────
  OpenURL: function(url) {
    var u = UTF8ToString(url);
    window.open(u, '_blank');
  }
  
});
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: ".jslib file คืออะไร?",
              options: ["Unity script", "JavaScript plugin สำหรับ WebGL", "Shader file", "Asset bundle"],
              correctIndex: 1,
              explanation: ".jslib คือ JavaScript plugin ที่ Unity WebGL เรียกใช้ได้"
            },
            {
              question: "SendMessage ใช้ทำอะไร?",
              options: ["ส่ง email", "เรียก Unity method จาก JavaScript", "ส่ง network request", "แสดง alert"],
              correctIndex: 1,
              explanation: "SendMessage เรียก method บน Unity GameObject จาก JS"
            },
            {
              question: "[DllImport(\"__Internal\")] ใช้ทำอะไร?",
              options: ["Import Unity package", "Import jslib functions เข้า C#", "Import DLL", "Import assets"],
              correctIndex: 1,
              explanation: "DllImport(\"__Internal\") ให้ C# เรียก functions ใน jslib ได้"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Direction", "Method"]}
          rows={[
            ["Unity → JS", ".jslib + DllImport"],
            ["JS → Unity", "SendMessage()"],
            ["Return values", "UTF8ToString, _malloc"],
            ["Callbacks", "SendMessage จาก JS"],
          ]}
        />

        <ProgressCheck
          items={[
            "สร้าง jslib plugin ได้",
            "เรียก JS จาก C# ได้",
            "เรียก Unity จาก JS ได้",
            "ใช้ browser APIs ได้",
            "จบ Phase 4: 3D Game Development! 🎉"
          ]}
        />

        <TipBox type="success">
          <strong>Phase ต่อไป: Advanced Topics! 🚀</strong>
        </TipBox>
      </Section>
    </div>
  );
}
