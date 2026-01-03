"use client";

import { CodeEditor } from "@/src/presentation/components/editor/CodeEditor";
import Link from "next/link";
import { useState } from "react";

const examples = [
  {
    id: "hello-world",
    title: "Hello World",
    category: "basics",
    description: "ลองพิมพ์ Hello World ออกมา",
    code: `// พิมพ์ข้อความออกมา
console.log("Hello World");`,
    expectedOutput: "Hello World",
    hints: [
      "ใช้ console.log() เพื่อพิมพ์ข้อความ",
      "ข้อความต้องอยู่ในเครื่องหมาย quotes",
    ],
  },
  {
    id: "variables",
    title: "Variables",
    category: "basics",
    description: "สร้างตัวแปรเก็บชื่อและอายุ แล้วพิมพ์ออกมา",
    code: `// สร้างตัวแปร
let name = "Player1";
let age = 25;

// พิมพ์ค่าออกมา
console.log("Name:", name);
console.log("Age:", age);`,
    expectedOutput: "Name: Player1",
    hints: [
      "ใช้ let หรือ const ในการประกาศตัวแปร",
      "ใช้ console.log() หลายครั้งได้",
    ],
  },
  {
    id: "loop",
    title: "For Loop",
    category: "basics",
    description: "ใช้ for loop นับ 1 ถึง 5",
    code: `// นับ 1 ถึง 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
    expectedOutput: "1",
    hints: [
      "for loop มี 3 ส่วน: เริ่มต้น, เงื่อนไข, เพิ่มค่า",
      "i++ คือ i = i + 1",
    ],
  },
  {
    id: "function",
    title: "Functions",
    category: "intermediate",
    description: "สร้างฟังก์ชันบวกเลขสองตัว",
    code: `// สร้างฟังก์ชัน
function add(a, b) {
  return a + b;
}

// เรียกใช้ฟังก์ชัน
let result = add(5, 3);
console.log("5 + 3 =", result);`,
    expectedOutput: "5 + 3 = 8",
    hints: [
      "function ใช้ return เพื่อส่งค่ากลับ",
      "เรียกฟังก์ชันด้วย ชื่อ(arguments)",
    ],
  },
  {
    id: "array",
    title: "Arrays",
    category: "intermediate",
    description: "สร้าง array เก็บผลไม้และวน loop แสดงผล",
    code: `// สร้าง array
let fruits = ["Apple", "Banana", "Orange"];

// วน loop
fruits.forEach((fruit, index) => {
  console.log(index + 1 + ". " + fruit);
});`,
    expectedOutput: "1. Apple",
    hints: [
      "Array ใช้ [] ในการสร้าง",
      "forEach() ใช้วน loop ผ่านทุก element",
    ],
  },
  {
    id: "object",
    title: "Objects - Game Character",
    category: "game",
    description: "สร้าง object เก็บข้อมูลตัวละครในเกม",
    code: `// สร้างตัวละคร
const player = {
  name: "Hero",
  hp: 100,
  attack: 25,
  level: 1
};

// แสดงข้อมูล
console.log("=== " + player.name + " ===");
console.log("HP:", player.hp);
console.log("ATK:", player.attack);
console.log("Level:", player.level);`,
    expectedOutput: "=== Hero ===",
    hints: [
      "Object ใช้ {} ในการสร้าง",
      "เข้าถึง property ด้วย . (dot notation)",
    ],
  },
  {
    id: "attack-system",
    title: "Attack System",
    category: "game",
    description: "สร้างระบบโจมตีในเกม",
    code: `// ตัวละคร
const player = { name: "Hero", attack: 30, critChance: 0.2 };
const enemy = { name: "Goblin", hp: 100 };

// ฟังก์ชันโจมตี
function attack(attacker, target) {
  const isCrit = Math.random() < attacker.critChance;
  const damage = isCrit ? attacker.attack * 2 : attacker.attack;
  
  target.hp -= damage;
  
  console.log(attacker.name + " attacks " + target.name + "!");
  if (isCrit) console.log("💥 Critical Hit!");
  console.log("Damage:", damage);
  console.log(target.name + " HP:", Math.max(0, target.hp));
}

// โจมตี!
attack(player, enemy);`,
    expectedOutput: "Hero attacks Goblin!",
    hints: [
      "Math.random() สุ่มเลข 0-1",
      "ternary operator: condition ? ifTrue : ifFalse",
    ],
  },
  {
    id: "inventory",
    title: "Inventory System",
    category: "game",
    description: "สร้างระบบกระเป๋าไอเท็ม",
    code: `// กระเป๋าไอเท็ม
const inventory = {
  items: [],
  maxSlots: 5,
  
  addItem(item) {
    if (this.items.length >= this.maxSlots) {
      console.log("❌ Inventory full!");
      return false;
    }
    this.items.push(item);
    console.log("✅ Added:", item.name);
    return true;
  },
  
  showItems() {
    console.log("🎒 Inventory:");
    this.items.forEach((item, i) => {
      console.log((i + 1) + ".", item.name, "x" + item.quantity);
    });
  }
};

// ทดสอบ
inventory.addItem({ name: "Potion", quantity: 3 });
inventory.addItem({ name: "Sword", quantity: 1 });
inventory.addItem({ name: "Shield", quantity: 1 });
inventory.showItems();`,
    expectedOutput: "✅ Added: Potion",
    hints: [
      "this ใช้อ้างถึง object ปัจจุบัน",
      "Method shorthand: addItem(item) แทน addItem: function(item)",
    ],
  },
];

const categories = [
  { id: "all", name: "ทั้งหมด", icon: "📚" },
  { id: "basics", name: "พื้นฐาน", icon: "🌱" },
  { id: "intermediate", name: "กลาง", icon: "⚡" },
  { id: "game", name: "เกม", icon: "🎮" },
];

export function PlaygroundView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter examples
  const filteredExamples = examples.filter((example) => {
    const matchesSearch =
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || example.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Clear all saved code
  const clearAllProgress = () => {
    examples.forEach((example) => {
      localStorage.removeItem(`playground_${example.id}`);
    });
    // Force re-render by reloading
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🕹️ Code Playground</h1>
        <p className="text-gray-400">
          ลองเขียนโค้ดและ run ได้ทันที ไม่ต้องติดตั้งอะไร
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          href="/courses"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          📚 ไปที่ Courses
        </Link>
        <Link
          href="/certificates"
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          🎓 ดู Certificates
        </Link>
        <button
          onClick={clearAllProgress}
          className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
        >
          🗑️ Clear All Progress
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 ค้นหา examples..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Examples count */}
      <div className="mb-6 text-sm text-gray-400">
        แสดง {filteredExamples.length} จาก {examples.length} examples
      </div>

      {/* Examples */}
      <div className="space-y-8">
        {filteredExamples.map((example) => (
          <div key={example.id}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-white">{example.title}</h2>
              <span className="px-2 py-0.5 text-xs bg-slate-700 text-gray-400 rounded-full">
                {categories.find((c) => c.id === example.category)?.name}
              </span>
            </div>
            <CodeEditor
              initialCode={example.code}
              title={example.title}
              description={example.description}
              expectedOutput={example.expectedOutput}
              hints={example.hints}
              storageKey={example.id}
            />
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredExamples.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400">ไม่พบ examples ที่ค้นหา</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}

      {/* More coming */}
      <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          🚀 ต้องการเรียนเพิ่ม?
        </h3>
        <p className="text-gray-400 mb-4">
          ดูคอร์สเต็มรูปแบบพร้อม Interactive Challenges
        </p>
        <Link
          href="/courses"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
        >
          ดู Courses ทั้งหมด
        </Link>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
        <h4 className="text-sm font-semibold text-white mb-3">⌨️ Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">⌘/Ctrl + Enter</kbd>
            <span>Run code</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Esc</kbd>
            <span>Clear output</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Tab</kbd>
            <span>Indent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
