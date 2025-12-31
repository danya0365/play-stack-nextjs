"use client";

import { CodeBlock, Objectives, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_4_2_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">Save/Load System</h1>

      <Objectives
        items={[
          "LocalStorage และ IndexedDB",
          "Save game structure design",
          "Serialization และ Deserialization",
          "Cloud save (ถ้ามีเวลา)",
        ]}
      />

      <Section title="Save Data Design" icon="💾">
        <TipBox type="info">
          <strong>Save Data ควรมีอะไรบ้าง?</strong>
          <ul className="mt-2 space-y-1">
            <li>• Player progress (level, XP, skills)</li>
            <li>• Inventory items</li>
            <li>• Game settings</li>
            <li>• World state (ถ้าจำเป็น)</li>
            <li>• Version number (สำหรับ migration)</li>
          </ul>
        </TipBox>

        <CodeBlock
          title="Save Data Interface"
          language="typescript"
          code={`
interface SaveData {
  version: number;
  timestamp: number;
  
  player: {
    name: string;
    level: number;
    experience: number;
    health: number;
    maxHealth: number;
    position: { x: number; y: number };
    skills: string[];
  };
  
  inventory: {
    items: Array<{
      id: string;
      quantity: number;
    }>;
    gold: number;
  };
  
  progress: {
    currentLevel: string;
    unlockedLevels: string[];
    completedQuests: string[];
    achievements: string[];
  };
  
  settings: {
    musicVolume: number;
    sfxVolume: number;
    language: string;
  };
}
          `}
        />
      </Section>

      <Section title="LocalStorage" icon="📦">
        <CodeBlock
          title="Simple Save System"
          language="javascript"
          code={`
class SaveManager {
  constructor(gameKey = 'my_game') {
    this.gameKey = gameKey;
    this.currentVersion = 1;
  }
  
  // ─────────────────────────────────
  // Save game
  // ─────────────────────────────────
  save(slot = 0) {
    const saveData = this.collectSaveData();
    saveData.version = this.currentVersion;
    saveData.timestamp = Date.now();
    
    const key = \`\${this.gameKey}_save_\${slot}\`;
    
    try {
      localStorage.setItem(key, JSON.stringify(saveData));
      console.log(\`Game saved to slot \${slot}\`);
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }
  
  // ─────────────────────────────────
  // Load game
  // ─────────────────────────────────
  load(slot = 0) {
    const key = \`\${this.gameKey}_save_\${slot}\`;
    
    try {
      const data = localStorage.getItem(key);
      
      if (!data) {
        console.log('No save found');
        return null;
      }
      
      const saveData = JSON.parse(data);
      
      // Version migration
      if (saveData.version < this.currentVersion) {
        this.migrateSave(saveData);
      }
      
      this.applySaveData(saveData);
      console.log(\`Game loaded from slot \${slot}\`);
      return saveData;
      
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  }
  
  // ─────────────────────────────────
  // Collect current game state
  // ─────────────────────────────────
  collectSaveData() {
    return {
      player: {
        name: player.name,
        level: player.level,
        experience: player.experience,
        health: player.health,
        maxHealth: player.maxHealth,
        position: { x: player.x, y: player.y },
        skills: [...player.skills]
      },
      inventory: {
        items: inventory.items.map(item => ({
          id: item.id,
          quantity: item.quantity
        })),
        gold: inventory.gold
      },
      progress: {
        currentLevel: gameState.currentLevel,
        unlockedLevels: [...gameState.unlockedLevels],
        completedQuests: [...gameState.completedQuests],
        achievements: [...gameState.achievements]
      },
      settings: {
        musicVolume: settings.musicVolume,
        sfxVolume: settings.sfxVolume,
        language: settings.language
      }
    };
  }
  
  // ─────────────────────────────────
  // Apply loaded data to game
  // ─────────────────────────────────
  applySaveData(data) {
    // Player
    player.name = data.player.name;
    player.level = data.player.level;
    player.experience = data.player.experience;
    player.health = data.player.health;
    player.maxHealth = data.player.maxHealth;
    player.x = data.player.position.x;
    player.y = data.player.position.y;
    player.skills = new Set(data.player.skills);
    
    // Inventory
    inventory.items = data.inventory.items.map(item => 
      new Item(item.id, item.quantity)
    );
    inventory.gold = data.inventory.gold;
    
    // Progress
    gameState.currentLevel = data.progress.currentLevel;
    gameState.unlockedLevels = new Set(data.progress.unlockedLevels);
    gameState.completedQuests = new Set(data.progress.completedQuests);
    gameState.achievements = new Set(data.progress.achievements);
    
    // Settings
    settings.musicVolume = data.settings.musicVolume;
    settings.sfxVolume = data.settings.sfxVolume;
    settings.language = data.settings.language;
  }
  
  // ─────────────────────────────────
  // Delete save
  // ─────────────────────────────────
  deleteSave(slot = 0) {
    const key = \`\${this.gameKey}_save_\${slot}\`;
    localStorage.removeItem(key);
  }
  
  // ─────────────────────────────────
  // List all saves
  // ─────────────────────────────────
  listSaves() {
    const saves = [];
    
    for (let i = 0; i < 5; i++) {
      const key = \`\${this.gameKey}_save_\${i}\`;
      const data = localStorage.getItem(key);
      
      if (data) {
        const save = JSON.parse(data);
        saves.push({
          slot: i,
          timestamp: save.timestamp,
          playerName: save.player.name,
          level: save.player.level
        });
      }
    }
    
    return saves;
  }
  
  // ─────────────────────────────────
  // Migrate old saves
  // ─────────────────────────────────
  migrateSave(data) {
    // v0 -> v1: Add achievements
    if (data.version === 0) {
      data.progress.achievements = [];
      data.version = 1;
    }
    
    // Future migrations...
  }
}

const saveManager = new SaveManager('my_rpg_game');

// Usage
document.getElementById('save-btn').onclick = () => saveManager.save(0);
document.getElementById('load-btn').onclick = () => saveManager.load(0);
          `}
        />
      </Section>

      <Section title="IndexedDB" icon="🗄️">
        <CodeBlock
          title="IndexedDB for Large Data"
          language="javascript"
          code={`
class IndexedDBSaveManager {
  constructor(dbName = 'game_saves', version = 1) {
    this.dbName = dbName;
    this.dbVersion = version;
    this.db = null;
  }
  
  // ─────────────────────────────────
  // Initialize database
  // ─────────────────────────────────
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('saves')) {
          const store = db.createObjectStore('saves', { keyPath: 'slot' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('screenshots')) {
          db.createObjectStore('screenshots', { keyPath: 'slot' });
        }
      };
    });
  }
  
  // ─────────────────────────────────
  // Save game
  // ─────────────────────────────────
  async save(slot, data, screenshot = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['saves', 'screenshots'], 'readwrite');
      
      // Save game data
      const saveStore = transaction.objectStore('saves');
      saveStore.put({
        slot,
        ...data,
        timestamp: Date.now()
      });
      
      // Save screenshot (optional)
      if (screenshot) {
        const screenshotStore = transaction.objectStore('screenshots');
        screenshotStore.put({ slot, data: screenshot });
      }
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }
  
  // ─────────────────────────────────
  // Load game
  // ─────────────────────────────────
  async load(slot) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['saves'], 'readonly');
      const store = transaction.objectStore('saves');
      const request = store.get(slot);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // ─────────────────────────────────
  // Get all saves
  // ─────────────────────────────────
  async getAllSaves() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['saves'], 'readonly');
      const store = transaction.objectStore('saves');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // ─────────────────────────────────
  // Get screenshot
  // ─────────────────────────────────
  async getScreenshot(slot) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['screenshots'], 'readonly');
      const store = transaction.objectStore('screenshots');
      const request = store.get(slot);
      
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
  
  // ─────────────────────────────────
  // Delete save
  // ─────────────────────────────────
  async delete(slot) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['saves', 'screenshots'], 'readwrite');
      
      transaction.objectStore('saves').delete(slot);
      transaction.objectStore('screenshots').delete(slot);
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// Usage
const idbSave = new IndexedDBSaveManager();
await idbSave.init();

// Save with screenshot
const canvas = document.getElementById('game-canvas');
const screenshot = canvas.toDataURL('image/jpeg', 0.5);
await idbSave.save(0, saveData, screenshot);

// Load
const loaded = await idbSave.load(0);
const thumb = await idbSave.getScreenshot(0);
          `}
        />
      </Section>

      <Section title="Auto-Save" icon="⏰">
        <CodeBlock
          title="Auto-Save System"
          language="javascript"
          code={`
class AutoSaveManager {
  constructor(saveManager, intervalMs = 60000) {
    this.saveManager = saveManager;
    this.interval = intervalMs;
    this.timer = null;
    this.enabled = true;
    this.lastSaveTime = 0;
  }
  
  start() {
    if (this.timer) return;
    
    this.timer = setInterval(() => {
      if (this.enabled) {
        this.autoSave();
      }
    }, this.interval);
    
    // Save on visibility change (tab switch/close)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.enabled) {
        this.autoSave();
      }
    });
    
    // Save before unload
    window.addEventListener('beforeunload', () => {
      if (this.enabled) {
        this.saveManager.save('autosave');
      }
    });
  }
  
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  autoSave() {
    // Don't save during critical moments
    if (gameState.inCutscene || gameState.inBattle) {
      return;
    }
    
    console.log('Auto-saving...');
    this.saveManager.save('autosave');
    this.lastSaveTime = Date.now();
    
    showNotification('Auto-saved');
  }
  
  // Save at checkpoints
  checkpoint(name) {
    console.log(\`Checkpoint: \${name}\`);
    this.saveManager.save(\`checkpoint_\${name}\`);
    this.lastSaveTime = Date.now();
  }
}

const autoSave = new AutoSaveManager(saveManager, 60000);
autoSave.start();

// Trigger checkpoint
function onLevelComplete(levelId) {
  autoSave.checkpoint(levelId);
}
          `}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <Table
          headers={["Storage", "Use Case"]}
          rows={[
            ["LocalStorage", "Small data, settings"],
            ["IndexedDB", "Large saves, screenshots"],
            ["Cloud Save", "Cross-device sync"],
            ["Auto-Save", "Prevent progress loss"],
            ["Checkpoints", "Critical progress points"],
          ]}
        />

        <TipBox type="success">
          <strong>บทต่อไป: Deployment & Publishing! 🚀</strong>
        </TipBox>
      </Section>
    </div>
  );
}
