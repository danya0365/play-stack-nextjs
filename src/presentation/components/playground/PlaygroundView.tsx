"use client";

import { CodeEditor } from "@/src/presentation/components/editor/CodeEditor";
import Link from "next/link";

const examples = [
  {
    id: "hello-world",
    title: "Hello World",
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
];

export function PlaygroundView() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🕹️ Code Playground</h1>
        <p className="text-gray-400">
          ลองเขียนโค้ดและ run ได้ทันที ไม่ต้องติดตั้งอะไร
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 mb-8">
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
      </div>

      {/* Examples */}
      <div className="space-y-8">
        {examples.map((example) => (
          <div key={example.id}>
            <h2 className="text-xl font-bold text-white mb-4">
              {example.title}
            </h2>
            <CodeEditor
              initialCode={example.code}
              title={example.title}
              description={example.description}
              expectedOutput={example.expectedOutput}
              hints={example.hints}
            />
          </div>
        ))}
      </div>

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
    </div>
  );
}
