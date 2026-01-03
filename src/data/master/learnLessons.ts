// Learn Lessons Master Data
// Lessons for the /learn page

export interface LearnLesson {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  codeExample?: string;
  challenge?: {
    description: string;
    starterCode: string;
    expectedOutput: string;
    hints: string[];
  };
}

export const learnLessons: LearnLesson[] = [
  // Topic: Basics
  {
    id: "learn-basics-1",
    topicId: "topic-basics",
    slug: "introduction",
    title: "Introduction to JavaScript",
    titleTh: "แนะนำ JavaScript",
    description: "What is JavaScript and why learn it",
    order: 1,
    duration: 10,
    content: `
# แนะนำ JavaScript

JavaScript เป็นภาษาโปรแกรมที่ใช้กันอย่างแพร่หลายที่สุดในโลก!

## ทำไมต้องเรียน JavaScript?
- 🌐 ทำงานได้บน Browser ทุกตัว
- 📱 พัฒนา Mobile App ได้ (React Native)
- 🖥️ พัฒนา Desktop App ได้ (Electron)
- 🎮 พัฒนาเกมได้

## Hello World
\`\`\`javascript
console.log("Hello World!");
\`\`\`
    `,
    codeExample: `// ลองพิมพ์ข้อความ
console.log("Hello World!");
console.log("สวัสดี JavaScript!");`,
    challenge: {
      description: "พิมพ์ชื่อของคุณออกมาด้วย console.log",
      starterCode: `// พิมพ์ชื่อของคุณ
console.log("ชื่อของคุณ");`,
      expectedOutput: "ชื่อ",
      hints: ["ใช้ console.log()", "ใส่ข้อความใน quotes"]
    }
  },
  {
    id: "learn-basics-2",
    topicId: "topic-basics",
    slug: "variables",
    title: "Variables",
    titleTh: "ตัวแปร",
    description: "let, const and var",
    order: 2,
    duration: 15,
    content: `
# ตัวแปรใน JavaScript

ตัวแปรใช้เก็บข้อมูล เหมือนกล่องที่ใส่ของได้

## let vs const
\`\`\`javascript
let age = 25;        // เปลี่ยนค่าได้
const name = "John"; // เปลี่ยนค่าไม่ได้
\`\`\`

## กฎการตั้งชื่อ
- ห้ามขึ้นต้นด้วยตัวเลข
- ห้ามมีช่องว่าง
- ใช้ camelCase เช่น myName, totalScore
    `,
    codeExample: `let score = 100;
const playerName = "Hero";

console.log(playerName);
console.log(score);

score = 200; // เปลี่ยนค่าได้
console.log(score);`,
    challenge: {
      description: "สร้างตัวแปรเก็บอายุและชื่อ แล้วพิมพ์ออกมา",
      starterCode: `// สร้างตัวแปร
let age = // ใส่อายุ
const name = // ใส่ชื่อ

console.log(name, age);`,
      expectedOutput: "25",
      hints: ["ใช้ let สำหรับ age", "ใช้ const สำหรับ name"]
    }
  },
  {
    id: "learn-basics-3",
    topicId: "topic-basics",
    slug: "data-types",
    title: "Data Types",
    titleTh: "ชนิดข้อมูล",
    description: "Numbers, Strings, Booleans",
    order: 3,
    duration: 15,
    content: `
# ชนิดข้อมูล

## 1. Number (ตัวเลข)
\`\`\`javascript
let age = 25;
let price = 99.99;
\`\`\`

## 2. String (ข้อความ)
\`\`\`javascript
let name = "John";
let message = 'Hello';
\`\`\`

## 3. Boolean (จริง/เท็จ)
\`\`\`javascript
let isActive = true;
let isGameOver = false;
\`\`\`
    `,
    codeExample: `// Number
let score = 100;
let health = 75.5;

// String  
let playerName = "Hero";

// Boolean
let isAlive = true;

console.log(typeof score);    // "number"
console.log(typeof playerName); // "string"
console.log(typeof isAlive);   // "boolean"`,
  },
  {
    id: "learn-basics-4",
    topicId: "topic-basics",
    slug: "operators",
    title: "Operators",
    titleTh: "ตัวดำเนินการ",
    description: "Arithmetic and comparison operators",
    order: 4,
    duration: 15,
    content: `
# Operators

## Arithmetic Operators
\`\`\`javascript
let a = 10 + 5;  // 15
let b = 10 - 5;  // 5
let c = 10 * 5;  // 50
let d = 10 / 5;  // 2
let e = 10 % 3;  // 1 (เศษ)
\`\`\`

## Comparison Operators
\`\`\`javascript
10 > 5   // true
10 < 5   // false
10 === 10 // true
10 !== 5  // true
\`\`\`
    `,
    codeExample: `let a = 10;
let b = 5;

console.log("a + b =", a + b);
console.log("a - b =", a - b);
console.log("a * b =", a * b);
console.log("a / b =", a / b);
console.log("a > b:", a > b);`,
  },
  // Topic: Control Flow
  {
    id: "learn-control-1",
    topicId: "topic-control",
    slug: "if-else",
    title: "If...Else",
    titleTh: "เงื่อนไข If...Else",
    description: "Conditional statements",
    order: 1,
    duration: 15,
    content: `
# If...Else

ใช้ตัดสินใจว่าจะทำอะไรตามเงื่อนไข

\`\`\`javascript
let score = 85;

if (score >= 80) {
  console.log("เกรด A");
} else if (score >= 70) {
  console.log("เกรด B");
} else {
  console.log("เกรด C");
}
\`\`\`
    `,
    codeExample: `let age = 18;

if (age >= 18) {
  console.log("คุณเป็นผู้ใหญ่แล้ว");
} else {
  console.log("คุณยังเป็นเด็ก");
}`,
    challenge: {
      description: "เช็คว่า score เกิน 50 หรือไม่ ถ้าเกินให้พิมพ์ 'ผ่าน'",
      starterCode: `let score = 75;

// เขียน if statement
if (/* เงื่อนไข */) {
  console.log("ผ่าน");
}`,
      expectedOutput: "ผ่าน",
      hints: ["ใช้ score >= 50 หรือ score > 50"]
    }
  },
  {
    id: "learn-control-2",
    topicId: "topic-control",
    slug: "for-loop",
    title: "For Loop",
    titleTh: "For Loop",
    description: "Repeating code with for loop",
    order: 2,
    duration: 15,
    content: `
# For Loop

ใช้ทำซ้ำตามจำนวนรอบที่กำหนด

\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log("รอบที่", i);
}
\`\`\`

## ส่วนประกอบ
1. \`let i = 1\` - ค่าเริ่มต้น
2. \`i <= 5\` - เงื่อนไข
3. \`i++\` - เพิ่มค่า
    `,
    codeExample: `// นับ 1 ถึง 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// นับถอยหลัง
for (let i = 5; i >= 1; i--) {
  console.log(i);
}`,
  },
  // Topic: Functions
  {
    id: "learn-functions-1",
    topicId: "topic-functions",
    slug: "function-basics",
    title: "Function Basics",
    titleTh: "พื้นฐานฟังก์ชัน",
    description: "Creating and calling functions",
    order: 1,
    duration: 15,
    content: `
# ฟังก์ชัน

ฟังก์ชันคือชุดคำสั่งที่สามารถเรียกใช้ซ้ำได้

\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}

greet("John"); // Hello, John
greet("Jane"); // Hello, Jane
\`\`\`
    `,
    codeExample: `function add(a, b) {
  return a + b;
}

let result = add(5, 3);
console.log("5 + 3 =", result);`,
    challenge: {
      description: "สร้างฟังก์ชัน multiply ที่คูณเลขสองตัว",
      starterCode: `function multiply(a, b) {
  // return ผลคูณ
}

console.log(multiply(4, 5));`,
      expectedOutput: "20",
      hints: ["ใช้ return a * b"]
    }
  },
  {
    id: "learn-functions-2",
    topicId: "topic-functions",
    slug: "arrow-functions",
    title: "Arrow Functions",
    titleTh: "Arrow Functions",
    description: "Modern function syntax",
    order: 2,
    duration: 15,
    content: `
# Arrow Functions

วิธีเขียนฟังก์ชันแบบสั้น

\`\`\`javascript
// แบบปกติ
function add(a, b) {
  return a + b;
}

// Arrow Function
const add = (a, b) => a + b;
\`\`\`
    `,
    codeExample: `const greet = (name) => "Hello, " + name;

const add = (a, b) => a + b;

console.log(greet("John"));
console.log(add(10, 5));`,
  },
  // Topic: Objects & Arrays
  {
    id: "learn-objects-1",
    topicId: "topic-objects",
    slug: "objects",
    title: "Objects",
    titleTh: "Objects",
    description: "Creating and using objects",
    order: 1,
    duration: 20,
    content: `
# Objects

Object เก็บข้อมูลเป็นคู่ key-value

\`\`\`javascript
const player = {
  name: "Hero",
  level: 10,
  health: 100
};

console.log(player.name);  // "Hero"
console.log(player.level); // 10
\`\`\`
    `,
    codeExample: `const player = {
  name: "Hero",
  health: 100,
  attack: 25
};

console.log(player.name);
console.log("HP:", player.health);

player.health = 80;
console.log("HP หลังโดนตี:", player.health);`,
  },
  {
    id: "learn-objects-2",
    topicId: "topic-objects",
    slug: "arrays",
    title: "Arrays",
    titleTh: "Arrays",
    description: "Working with arrays",
    order: 2,
    duration: 20,
    content: `
# Arrays

Array เก็บข้อมูลหลายค่าในตัวแปรเดียว

\`\`\`javascript
const fruits = ["Apple", "Banana", "Orange"];

console.log(fruits[0]); // "Apple"
console.log(fruits.length); // 3
\`\`\`
    `,
    codeExample: `const items = ["Sword", "Shield", "Potion"];

console.log("มี", items.length, "ไอเท็ม");

items.push("Bow");
console.log(items);

items.forEach((item, i) => {
  console.log(i + 1 + ".", item);
});`,
  },
  // Topic: TypeScript
  {
    id: "learn-ts-1",
    topicId: "topic-typescript",
    slug: "introduction",
    title: "Introduction to TypeScript",
    titleTh: "แนะนำ TypeScript",
    description: "What is TypeScript and why use it",
    order: 1,
    duration: 15,
    content: `
# แนะนำ TypeScript

TypeScript คือ JavaScript + Type System!

## ทำไมต้อง TypeScript?
- 🛡️ ตรวจจับ bugs ก่อน runtime
- 📝 Auto-complete ดีขึ้น
- 📚 Code documentation ในตัว
- 🏢 ใช้ในบริษัทใหญ่ทั่วโลก

## ความแตกต่าง
\`\`\`typescript
// JavaScript
let name = "John";
name = 123; // ได้ แต่อาจ bug

// TypeScript
let name: string = "John";
name = 123; // ❌ Error!
\`\`\`
    `,
    codeExample: `// TypeScript บอก type ชัดเจน
let playerName: string = "Hero";
let health: number = 100;
let isAlive: boolean = true;

console.log(playerName, health, isAlive);`,
  },
  {
    id: "learn-ts-2",
    topicId: "topic-typescript",
    slug: "basic-types",
    title: "Basic Types",
    titleTh: "Types พื้นฐาน",
    description: "String, number, boolean, array",
    order: 2,
    duration: 20,
    content: `
# Types พื้นฐาน

## Primitive Types
\`\`\`typescript
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
\`\`\`

## Arrays
\`\`\`typescript
let scores: number[] = [100, 90, 85];
let names: string[] = ["A", "B", "C"];
\`\`\`

## Any (หลีกเลี่ยง!)
\`\`\`typescript
let data: any = "hello";
data = 123; // ได้ แต่ไม่ดี
\`\`\`
    `,
    codeExample: `// Basic Types
let name: string = "Hero";
let level: number = 10;
let isAlive: boolean = true;

// Arrays
let skills: string[] = ["Slash", "Shield"];
let damage: number[] = [10, 20, 30];

console.log(name, "Lv.", level);
console.log("Skills:", skills);`,
    challenge: {
      description: "สร้างตัวแปร player ที่มี name (string), hp (number), items (string array)",
      starterCode: `// กำหนด type ให้ตัวแปร
let name = "Hero";
let hp = 100;
let items = ["Sword"];

console.log(name, hp, items);`,
      expectedOutput: "Hero",
      hints: ["ใช้ : string, : number, : string[]"]
    }
  },
  {
    id: "learn-ts-3",
    topicId: "topic-typescript",
    slug: "interfaces",
    title: "Interfaces",
    titleTh: "Interfaces",
    description: "Define object shapes",
    order: 3,
    duration: 25,
    content: `
# Interfaces

Interface กำหนดโครงสร้างของ Object

\`\`\`typescript
interface Player {
  name: string;
  level: number;
  health: number;
}

const player: Player = {
  name: "Hero",
  level: 10,
  health: 100
};
\`\`\`

## Optional Properties
\`\`\`typescript
interface Item {
  name: string;
  damage?: number; // optional
}
\`\`\`
    `,
    codeExample: `interface Enemy {
  name: string;
  health: number;
  damage: number;
}

const slime: Enemy = {
  name: "Slime",
  health: 20,
  damage: 5
};

console.log(slime.name, "HP:", slime.health);`,
    challenge: {
      description: "สร้าง interface Weapon ที่มี name, damage, และ type",
      starterCode: `// สร้าง interface Weapon
interface Weapon {
  // เพิ่ม properties
}

const sword: Weapon = {
  name: "Iron Sword",
  damage: 25,
  type: "melee"
};

console.log(sword);`,
      expectedOutput: "Iron Sword",
      hints: ["name: string", "damage: number", "type: string"]
    }
  },
  {
    id: "learn-ts-4",
    topicId: "topic-typescript",
    slug: "type-aliases",
    title: "Type Aliases",
    titleTh: "Type Aliases",
    description: "Create custom types",
    order: 4,
    duration: 20,
    content: `
# Type Aliases

สร้าง type ใหม่จาก types อื่น

\`\`\`typescript
type ID = string | number;
type Point = { x: number; y: number };

let playerId: ID = "abc123";
let position: Point = { x: 100, y: 200 };
\`\`\`

## Union Types
\`\`\`typescript
type Status = "active" | "inactive" | "banned";
let userStatus: Status = "active";
\`\`\`
    `,
    codeExample: `type GameState = "menu" | "playing" | "paused" | "gameover";
type Position = { x: number; y: number };

let state: GameState = "playing";
let playerPos: Position = { x: 100, y: 200 };

console.log("State:", state);
console.log("Position:", playerPos);`,
  },
  {
    id: "learn-ts-5",
    topicId: "topic-typescript",
    slug: "functions",
    title: "Functions with Types",
    titleTh: "ฟังก์ชันกับ Types",
    description: "Typed function parameters and returns",
    order: 5,
    duration: 20,
    content: `
# Functions with Types

กำหนด type ให้ parameters และ return value

\`\`\`typescript
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => {
  return "Hello, " + name;
};
\`\`\`

## Void
\`\`\`typescript
function log(msg: string): void {
  console.log(msg);
}
\`\`\`
    `,
    codeExample: `function calculateDamage(base: number, multiplier: number): number {
  return base * multiplier;
}

const formatHP = (current: number, max: number): string => {
  return current + "/" + max + " HP";
};

console.log("Damage:", calculateDamage(10, 1.5));
console.log(formatHP(80, 100));`,
  },
  {
    id: "learn-ts-6",
    topicId: "topic-typescript",
    slug: "generics",
    title: "Generics",
    titleTh: "Generics",
    description: "Reusable type-safe components",
    order: 6,
    duration: 25,
    content: `
# Generics

สร้าง functions/classes ที่ทำงานกับหลาย types

\`\`\`typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst<number>([1, 2, 3]); // 1
getFirst<string>(["a", "b"]); // "a"
\`\`\`

## Generic Interface
\`\`\`typescript
interface Response<T> {
  data: T;
  success: boolean;
}
\`\`\`
    `,
    codeExample: `function identity<T>(value: T): T {
  return value;
}

function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(identity<string>("Hello"));
console.log(identity<number>(42));
console.log(getFirst([10, 20, 30]));`,
  },
];

export function getLessonsByTopic(topicId: string): LearnLesson[] {
  return learnLessons.filter(l => l.topicId === topicId).sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(topicSlug: string, lessonSlug: string): LearnLesson | undefined {
  const topicId = `topic-${topicSlug === "basics" ? "basics" : topicSlug === "control-flow" ? "control" : topicSlug}`;
  return learnLessons.find(l => l.topicId === topicId && l.slug === lessonSlug);
}

export function getLessonById(id: string): LearnLesson | undefined {
  return learnLessons.find(l => l.id === id);
}
