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
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option (0-based)
  }[];
}

export const learnLessons: LearnLesson[] = [
  // ============================================
  // Topic: Basics (JavaScript Fundamentals)
  // ============================================
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

## JavaScript ทำอะไรได้บ้าง?
- เปลี่ยนเนื้อหาในเว็บไซต์แบบ Dynamic
- ตรวจสอบข้อมูลฟอร์มก่อนส่ง
- สร้าง Animation และ Effects
- เชื่อมต่อกับ API และฐานข้อมูล
    `,
    codeExample: `// ลองพิมพ์ข้อความ
console.log("Hello World!");
console.log("สวัสดี JavaScript!");

// แสดงข้อความหลายบรรทัด
console.log("Welcome to");
console.log("JavaScript!");`,
    challenge: {
      description: "พิมพ์ชื่อของคุณออกมาด้วย console.log",
      starterCode: `// พิมพ์ชื่อของคุณ
console.log("ชื่อของคุณ");`,
      expectedOutput: "ชื่อ",
      hints: ["ใช้ console.log()", "ใส่ข้อความใน quotes"]
    },
    quiz: [
      {
        question: "JavaScript ใช้ทำอะไรได้?",
        options: ["แก้ไขรูปภาพ", "สร้างเว็บที่มี Dynamic", "ออกแบบ Database", "เขียน System OS"],
        correctAnswer: 1
      },
      {
        question: "คำสั่งใดใช้แสดงข้อความบน Console?",
        options: ["print()", "echo()", "console.log()", "display()"],
        correctAnswer: 2
      }
    ]
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

## var (ไม่แนะนำ)
\`\`\`javascript
var oldStyle = "legacy"; // แบบเก่า ไม่แนะนำ
\`\`\`

## กฎการตั้งชื่อ
- ห้ามขึ้นต้นด้วยตัวเลข
- ห้ามมีช่องว่าง
- ใช้ camelCase เช่น myName, totalScore
- Case-sensitive (name ≠ Name)
    `,
    codeExample: `let score = 100;
const playerName = "Hero";

console.log(playerName);
console.log(score);

score = 200; // เปลี่ยนค่าได้
console.log(score);

// playerName = "Villain"; // Error! const เปลี่ยนค่าไม่ได้`,
    challenge: {
      description: "สร้างตัวแปรเก็บอายุและชื่อ แล้วพิมพ์ออกมา",
      starterCode: `// สร้างตัวแปร
let age = 25;
const name = "Hero";

console.log(name, age);`,
      expectedOutput: "Hero 25",
      hints: ["ใช้ let สำหรับ age", "ใช้ const สำหรับ name"]
    },
    quiz: [
      {
        question: "คำสั่งใดใช้ประกาศตัวแปรที่เปลี่ยนค่าได้?",
        options: ["const", "let", "final", "static"],
        correctAnswer: 1
      },
      {
        question: "ชื่อตัวแปรใดถูกต้อง?",
        options: ["1stPlayer", "player name", "playerScore", "player-score"],
        correctAnswer: 2
      },
      {
        question: "const ใช้ทำอะไร?",
        options: ["ประกาศตัวแปรที่เปลี่ยนค่าได้", "ประกาศค่าคงที่", "สร้าง function", "วน loop"],
        correctAnswer: 1
      }
    ]
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
let negative = -10;
\`\`\`

## 2. String (ข้อความ)
\`\`\`javascript
let name = "John";
let message = 'Hello';
let template = \`Hello \${name}\`;
\`\`\`

## 3. Boolean (จริง/เท็จ)
\`\`\`javascript
let isActive = true;
let isGameOver = false;
\`\`\`

## 4. Undefined & Null
\`\`\`javascript
let notDefined;       // undefined
let empty = null;     // null (ตั้งใจให้ว่าง)
\`\`\`
    `,
    codeExample: `// Number
let score = 100;
let health = 75.5;

// String  
let playerName = "Hero";
let greeting = \`Hello \${playerName}!\`;

// Boolean
let isAlive = true;

console.log(typeof score);      // "number"
console.log(typeof playerName); // "string"
console.log(typeof isAlive);    // "boolean"
console.log(greeting);          // "Hello Hero!"`,
    challenge: {
      description: "ใช้ typeof เพื่อหาชนิดของตัวแปร myVar",
      starterCode: `let myVar = "Hello";

// ใช้ typeof แล้วพิมพ์ผลลัพธ์
console.log(typeof myVar);`,
      expectedOutput: "string",
      hints: ["typeof จะคืนค่าเป็น string บอกชนิดข้อมูล", "ใช้ typeof ตัวแปร"]
    },
    quiz: [
      {
        question: "ค่า true หรือ false เป็นชนิดข้อมูลอะไร?",
        options: ["String", "Number", "Boolean", "Object"],
        correctAnswer: 2
      },
      {
        question: "typeof 42 จะได้ผลลัพธ์อะไร?",
        options: ["\"integer\"", "\"number\"", "\"numeric\"", "\"float\""],
        correctAnswer: 1
      }
    ]
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

## Arithmetic Operators (คำนวณ)
\`\`\`javascript
let a = 10 + 5;  // 15 (บวก)
let b = 10 - 5;  // 5  (ลบ)
let c = 10 * 5;  // 50 (คูณ)
let d = 10 / 5;  // 2  (หาร)
let e = 10 % 3;  // 1  (เศษ)
let f = 2 ** 3;  // 8  (ยกกำลัง)
\`\`\`

## Comparison Operators (เปรียบเทียบ)
\`\`\`javascript
10 > 5    // true  (มากกว่า)
10 < 5    // false (น้อยกว่า)
10 >= 10  // true  (มากกว่าหรือเท่ากับ)
10 === 10 // true  (เท่ากับ)
10 !== 5  // true  (ไม่เท่ากับ)
\`\`\`

## Logical Operators (ตรรกะ)
\`\`\`javascript
true && true   // true  (และ)
true || false  // true  (หรือ)
!true          // false (กลับค่า)
\`\`\`
    `,
    codeExample: `let a = 10;
let b = 5;

console.log("a + b =", a + b);
console.log("a - b =", a - b);
console.log("a * b =", a * b);
console.log("a / b =", a / b);
console.log("a % b =", a % b);
console.log("a > b:", a > b);
console.log("a === 10:", a === 10);`,
    challenge: {
      description: "คำนวณพื้นที่สี่เหลี่ยม (กว้าง x ยาว)",
      starterCode: `let width = 5;
let height = 10;

// คำนวณพื้นที่
let area = width * height;

console.log("พื้นที่ =", area);`,
      expectedOutput: "พื้นที่ = 50",
      hints: ["ใช้ * เพื่อคูณ", "area = width * height"]
    },
    quiz: [
      {
        question: "10 % 3 จะได้ผลลัพธ์เท่าไหร่?",
        options: ["3", "1", "0", "3.33"],
        correctAnswer: 1
      },
      {
        question: "ตัวดำเนินการใดใช้เปรียบเทียบว่าเท่ากัน?",
        options: ["=", "==", "===", "!="],
        correctAnswer: 2
      },
      {
        question: "true && false จะได้ผลลัพธ์อะไร?",
        options: ["true", "false", "undefined", "error"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: Control Flow
  // ============================================
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

## โครงสร้างพื้นฐาน
\`\`\`javascript
if (condition) {
  // ทำเมื่อ condition เป็น true
} else {
  // ทำเมื่อ condition เป็น false
}
\`\`\`

## หลายเงื่อนไข
\`\`\`javascript
let score = 85;

if (score >= 80) {
  console.log("เกรด A");
} else if (score >= 70) {
  console.log("เกรด B");
} else if (score >= 60) {
  console.log("เกรด C");
} else {
  console.log("เกรด F");
}
\`\`\`
    `,
    codeExample: `let age = 18;

if (age >= 18) {
  console.log("คุณเป็นผู้ใหญ่แล้ว");
} else {
  console.log("คุณยังเป็นเด็ก");
}

// Ternary operator (แบบสั้น)
let status = age >= 18 ? "ผู้ใหญ่" : "เด็ก";
console.log("สถานะ:", status);`,
    challenge: {
      description: "เช็คว่า score เกิน 50 หรือไม่ ถ้าเกินให้พิมพ์ 'ผ่าน'",
      starterCode: `let score = 75;

// เขียน if statement
if (score > 50) {
  console.log("ผ่าน");
} else {
  console.log("ไม่ผ่าน");
}`,
      expectedOutput: "ผ่าน",
      hints: ["ใช้ score > 50 หรือ score >= 50", "อย่าลืมปีกกา {}"]
    },
    quiz: [
      {
        question: "else if ใช้ทำอะไร?",
        options: ["จบ loop", "เช็คเงื่อนไขเพิ่มเติม", "สร้าง function", "ประกาศตัวแปร"],
        correctAnswer: 1
      },
      {
        question: "ถ้า if condition เป็น false จะเกิดอะไร?",
        options: ["Error", "ทำ code ใน if", "ทำ code ใน else", "หยุดทำงาน"],
        correctAnswer: 2
      }
    ]
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

## โครงสร้าง
\`\`\`javascript
for (เริ่มต้น; เงื่อนไข; เพิ่มค่า) {
  // code ที่ทำซ้ำ
}
\`\`\`

## ตัวอย่าง
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log("รอบที่", i);
}
\`\`\`

## ส่วนประกอบ
1. \`let i = 1\` - ค่าเริ่มต้น
2. \`i <= 5\` - เงื่อนไข (ทำซ้ำตราบที่เป็น true)
3. \`i++\` - เพิ่มค่าหลังทำแต่ละรอบ
    `,
    codeExample: `// นับ 1 ถึง 5
console.log("นับขึ้น:");
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// นับถอยหลัง
console.log("\\nนับถอยหลัง:");
for (let i = 5; i >= 1; i--) {
  console.log(i);
}`,
    challenge: {
      description: "ใช้ loop พิมพ์ตัวเลข 1 ถึง 3",
      starterCode: `// เขียน for loop
for (let i = 1; i <= 3; i++) {
  console.log(i);
}`,
      expectedOutput: "1\n2\n3",
      hints: ["เริ่มที่ i = 1", "เงื่อนไข i <= 3", "เพิ่มค่า i++"]
    },
    quiz: [
      {
        question: "i++ หมายความว่าอะไร?",
        options: ["i = i - 1", "i = i + 1", "i = i * 2", "i = 0"],
        correctAnswer: 1
      },
      {
        question: "for loop จะหยุดเมื่อไหร่?",
        options: ["เมื่อ code จบ", "เมื่อ condition เป็น false", "ไม่เคยหยุด", "เมื่อเจอ continue"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-control-3",
    topicId: "topic-control",
    slug: "while-loop",
    title: "While Loop",
    titleTh: "While Loop",
    description: "Loop with condition",
    order: 3,
    duration: 12,
    content: `
# While Loop

ทำซ้ำตราบที่เงื่อนไขเป็น true

## โครงสร้าง
\`\`\`javascript
while (condition) {
  // code ที่ทำซ้ำ
}
\`\`\`

## ตัวอย่าง
\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
\`\`\`

## Do-While (ทำอย่างน้อย 1 รอบ)
\`\`\`javascript
do {
  // code
} while (condition);
\`\`\`
    `,
    codeExample: `let hp = 100;

console.log("เริ่มเกม HP:", hp);

while (hp > 0) {
  hp -= 30;
  console.log("โดนตี! HP เหลือ:", hp);
}

console.log("Game Over!");`,
    challenge: {
      description: "ใช้ while loop นับ 1, 2, 3",
      starterCode: `let i = 1;

while (i <= 3) {
  console.log(i);
  i++;
}`,
      expectedOutput: "1\n2\n3",
      hints: ["เริ่มที่ i = 1", "เงื่อนไข i <= 3", "อย่าลืม i++ ไม่งั้น loop ไม่จบ"]
    },
    quiz: [
      {
        question: "while loop ต่างจาก for loop อย่างไร?",
        options: ["ทำซ้ำไม่ได้", "ไม่มีเงื่อนไข", "ไม่รู้จำนวนรอบล่วงหน้า", "เร็วกว่า"],
        correctAnswer: 2
      }
    ]
  },

  // ============================================
  // Topic: Functions
  // ============================================
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

## ประกาศฟังก์ชัน
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}
\`\`\`

## เรียกใช้ฟังก์ชัน
\`\`\`javascript
greet("John"); // Hello, John
greet("Jane"); // Hello, Jane
\`\`\`

## Return ค่า
\`\`\`javascript
function add(a, b) {
  return a + b;
}

let result = add(5, 3); // result = 8
\`\`\`
    `,
    codeExample: `function add(a, b) {
  return a + b;
}

function greet(name) {
  return "Hello, " + name + "!";
}

let sum = add(5, 3);
let message = greet("Hero");

console.log("5 + 3 =", sum);
console.log(message);`,
    challenge: {
      description: "สร้างฟังก์ชัน multiply ที่คูณเลขสองตัว",
      starterCode: `function multiply(a, b) {
  return a * b;
}

console.log(multiply(4, 5));`,
      expectedOutput: "20",
      hints: ["ใช้ return a * b", "อย่าลืม return"]
    },
    quiz: [
      {
        question: "function ใช้ทำอะไร?",
        options: ["เก็บข้อมูล", "รวม code ที่ใช้ซ้ำได้", "สร้าง loop", "ประกาศตัวแปร"],
        correctAnswer: 1
      },
      {
        question: "return ทำอะไร?",
        options: ["จบ function", "ส่งค่ากลับและจบ function", "พิมพ์ค่า", "สร้าง loop"],
        correctAnswer: 1
      }
    ]
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

วิธีเขียนฟังก์ชันแบบสั้นกระชับ (ES6+)

## เปรียบเทียบ
\`\`\`javascript
// แบบปกติ
function add(a, b) {
  return a + b;
}

// Arrow Function
const add = (a, b) => a + b;
\`\`\`

## รูปแบบต่างๆ
\`\`\`javascript
// หลายบรรทัด
const greet = (name) => {
  const msg = "Hello, " + name;
  return msg;
};

// Parameter ตัวเดียว (ไม่ต้องมีวงเล็บ)
const double = n => n * 2;
\`\`\`
    `,
    codeExample: `const greet = (name) => "Hello, " + name;

const add = (a, b) => a + b;

const double = n => n * 2;

console.log(greet("John"));
console.log(add(10, 5));
console.log(double(7));`,
    challenge: {
      description: "สร้าง arrow function ที่ยกกำลังสอง",
      starterCode: `const square = n => n * n;

console.log(square(5));`,
      expectedOutput: "25",
      hints: ["ใช้ n * n หรือ n ** 2", "arrow function ไม่ต้อง return ถ้าบรรทัดเดียว"]
    },
    quiz: [
      {
        question: "Arrow function ต่างจาก function ปกติอย่างไร?",
        options: ["ทำงานเร็วกว่า", "สั้นกว่า ไม่มี this ของตัวเอง", "ใช้ parameter ไม่ได้", "ไม่มี return"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-functions-3",
    topicId: "topic-functions",
    slug: "scope",
    title: "Scope",
    titleTh: "ขอบเขตตัวแปร",
    description: "Variable scope and closure",
    order: 3,
    duration: 15,
    content: `
# Scope (ขอบเขตตัวแปร)

## Global Scope
\`\`\`javascript
let globalVar = "ใช้ได้ทุกที่";

function test() {
  console.log(globalVar); // OK
}
\`\`\`

## Local Scope
\`\`\`javascript
function test() {
  let localVar = "ใช้ได้ใน function นี้เท่านั้น";
  console.log(localVar); // OK
}
// console.log(localVar); // Error!
\`\`\`

## Block Scope (let, const)
\`\`\`javascript
if (true) {
  let blockVar = "ใช้ได้ใน block นี้";
}
// console.log(blockVar); // Error!
\`\`\`
    `,
    codeExample: `let globalScore = 100;

function updateScore(points) {
  let bonus = 10;
  globalScore += points + bonus;
  console.log("Bonus:", bonus);
  console.log("Total:", globalScore);
}

updateScore(50);
console.log("Final Score:", globalScore);
// console.log(bonus); // Error - bonus is local`,
    challenge: {
      description: "สร้าง function ที่เข้าถึง global variable",
      starterCode: `let playerName = "Hero";

function showPlayer() {
  console.log("Player:", playerName);
}

showPlayer();`,
      expectedOutput: "Player: Hero",
      hints: ["Global variable ใช้ได้ใน function", "ไม่ต้องส่งเป็น parameter"]
    },
    quiz: [
      {
        question: "let และ const มี scope แบบไหน?",
        options: ["Global เสมอ", "Function scope", "Block scope", "ไม่มี scope"],
        correctAnswer: 2
      }
    ]
  },

  // ============================================
  // Topic: Objects & Arrays
  // ============================================
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

## สร้าง Object
\`\`\`javascript
const player = {
  name: "Hero",
  level: 10,
  health: 100
};
\`\`\`

## เข้าถึงข้อมูล
\`\`\`javascript
console.log(player.name);    // "Hero"
console.log(player["level"]); // 10
\`\`\`

## แก้ไขข้อมูล
\`\`\`javascript
player.health = 80;
player.mana = 50; // เพิ่ม property ใหม่
\`\`\`
    `,
    codeExample: `const player = {
  name: "Hero",
  health: 100,
  attack: 25,
  defend: function() {
    console.log(this.name + " is defending!");
  }
};

console.log(player.name);
console.log("HP:", player.health);

player.health = 80;
console.log("HP หลังโดนตี:", player.health);

player.defend();`,
    challenge: {
      description: "สร้าง object ที่มี name และ level แล้วพิมพ์ออกมา",
      starterCode: `const enemy = {
  name: "Slime",
  level: 5
};

console.log(enemy.name, "Lv.", enemy.level);`,
      expectedOutput: "Slime Lv. 5",
      hints: ["ใช้ {} เพื่อสร้าง object", "ใช้ . เพื่อเข้าถึง property"]
    },
    quiz: [
      {
        question: "Object เก็บข้อมูลแบบไหน?",
        options: ["ตัวเลขเท่านั้น", "คู่ key-value", "แบบ array", "text เท่านั้น"],
        correctAnswer: 1
      },
      {
        question: "วิธีเข้าถึง property ของ object?",
        options: ["object.property", "object(property)", "object[property]", "ทั้ง A และ C"],
        correctAnswer: 3
      }
    ]
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

## สร้าง Array
\`\`\`javascript
const fruits = ["Apple", "Banana", "Orange"];
const numbers = [1, 2, 3, 4, 5];
\`\`\`

## เข้าถึงข้อมูล (index เริ่มจาก 0)
\`\`\`javascript
console.log(fruits[0]); // "Apple"
console.log(fruits[1]); // "Banana"
\`\`\`

## Array Methods
\`\`\`javascript
fruits.push("Mango");    // เพิ่มท้าย
fruits.pop();            // ลบท้าย
fruits.length;           // จำนวนสมาชิก
\`\`\`
    `,
    codeExample: `const items = ["Sword", "Shield", "Potion"];

console.log("มี", items.length, "ไอเท็ม");
console.log("ไอเท็มแรก:", items[0]);

items.push("Bow");
console.log("เพิ่ม Bow:", items);

items.forEach((item, i) => {
  console.log(i + 1 + ".", item);
});`,
    challenge: {
      description: "สร้าง array ของตัวเลข แล้วหาผลรวม",
      starterCode: `const numbers = [10, 20, 30];

let sum = 0;
for (let num of numbers) {
  sum += num;
}

console.log("ผลรวม:", sum);`,
      expectedOutput: "ผลรวม: 60",
      hints: ["ใช้ for...of หรือ forEach", "sum += num เพื่อบวกเข้า"]
    },
    quiz: [
      {
        question: "Array index เริ่มจากเลขอะไร?",
        options: ["1", "0", "-1", "ไม่มี index"],
        correctAnswer: 1
      },
      {
        question: "push() ทำอะไร?",
        options: ["ลบตัวแรก", "เพิ่มตัวท้าย", "เรียงลำดับ", "กลับด้าน"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "learn-objects-3",
    topicId: "topic-objects",
    slug: "array-methods",
    title: "Array Methods",
    titleTh: "Array Methods",
    description: "map, filter, reduce",
    order: 3,
    duration: 20,
    content: `
# Array Methods ขั้นสูง

## map() - แปลงทุกตัว
\`\`\`javascript
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
// [2, 4, 6]
\`\`\`

## filter() - กรอง
\`\`\`javascript
const nums = [1, 2, 3, 4, 5];
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]
\`\`\`

## reduce() - รวม
\`\`\`javascript
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
// 10
\`\`\`
    `,
    codeExample: `const scores = [85, 92, 78, 65, 90];

// map: เพิ่มคะแนน 5
const adjusted = scores.map(s => s + 5);
console.log("ปรับคะแนน:", adjusted);

// filter: เอาเฉพาะที่ผ่าน
const passed = scores.filter(s => s >= 80);
console.log("ผ่าน:", passed);

// reduce: หาผลรวม
const total = scores.reduce((sum, s) => sum + s, 0);
console.log("รวม:", total);`,
    challenge: {
      description: "ใช้ filter หาตัวเลขที่มากกว่า 50",
      starterCode: `const numbers = [25, 75, 50, 100, 30];

const big = numbers.filter(n => n > 50);

console.log(big);`,
      expectedOutput: "[75, 100]",
      hints: ["filter รับ function ที่ return true/false", "n > 50 คือเงื่อนไข"]
    },
    quiz: [
      {
        question: "map() ทำอะไร?",
        options: ["กรองข้อมูล", "แปลงทุกตัวใน array", "รวมข้อมูล", "เรียงลำดับ"],
        correctAnswer: 1
      },
      {
        question: "[1,2,3].filter(n => n > 1) ได้ผลลัพธ์อะไร?",
        options: ["[1, 2, 3]", "[2, 3]", "[1]", "[]"],
        correctAnswer: 1
      }
    ]
  },

  // ============================================
  // Topic: TypeScript
  // ============================================
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

console.log(playerName, health, isAlive);

// Type inference (อนุมานเอง)
let score = 50; // TypeScript รู้ว่าเป็น number
console.log("Score:", score);`,
    challenge: {
      description: "ประกาศตัวแปรพร้อม type annotation",
      starterCode: `let name: string = "Hero";
let level: number = 10;
let isOnline: boolean = true;

console.log(name, "Lv.", level, "Online:", isOnline);`,
      expectedOutput: "Hero Lv. 10 Online: true",
      hints: ["ใช้ : type หลังชื่อตัวแปร", "string, number, boolean"]
    },
    quiz: [
      {
        question: "TypeScript เป็นอะไร?",
        options: ["ภาษาใหม่", "JavaScript + Type", "Framework", "Library"],
        correctAnswer: 1
      },
      {
        question: "ประโยชน์หลักของ TypeScript?",
        options: ["เร็วขึ้น", "หา bug ก่อน run", "ใช้ง่ายกว่า", "มีขนาดเล็ก"],
        correctAnswer: 1
      }
    ]
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
let mixed: (string | number)[] = [1, "two"];
\`\`\`

## Any (หลีกเลี่ยง!)
\`\`\`typescript
let data: any = "hello";
data = 123; // ได้ แต่ไม่ดี
\`\`\`

## Union Types
\`\`\`typescript
let id: string | number = "abc";
id = 123; // OK
\`\`\`
    `,
    codeExample: `// Basic Types
let name: string = "Hero";
let level: number = 10;
let isAlive: boolean = true;

// Arrays
let skills: string[] = ["Slash", "Shield"];
let damage: number[] = [10, 20, 30];

// Union type
let id: string | number = "P001";

console.log(name, "Lv.", level);
console.log("Skills:", skills);
console.log("ID:", id);`,
    challenge: {
      description: "สร้าง array ของตัวเลขพร้อม type",
      starterCode: `let scores: number[] = [85, 90, 78];

let total: number = 0;
for (let score of scores) {
  total += score;
}

console.log("Total:", total);`,
      expectedOutput: "Total: 253",
      hints: ["ใช้ number[] สำหรับ array ของตัวเลข", "TypeScript จะเช็ค type ให้"]
    },
    quiz: [
      {
        question: "number[] หมายถึงอะไร?",
        options: ["ตัวเลขหนึ่งตัว", "Array ของตัวเลข", "Object", "Function"],
        correctAnswer: 1
      },
      {
        question: "Union type ใช้เครื่องหมายอะไร?",
        options: ["&", "|", "||", "&&"],
        correctAnswer: 1
      }
    ]
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

## สร้าง Interface
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

## Readonly
\`\`\`typescript
interface Config {
  readonly id: string;
}
\`\`\`
    `,
    codeExample: `interface Enemy {
  name: string;
  health: number;
  damage: number;
  isBoss?: boolean;
}

const slime: Enemy = {
  name: "Slime",
  health: 20,
  damage: 5
};

const dragon: Enemy = {
  name: "Dragon",
  health: 500,
  damage: 50,
  isBoss: true
};

console.log(slime.name, "HP:", slime.health);
console.log(dragon.name, "HP:", dragon.health, "Boss:", dragon.isBoss);`,
    challenge: {
      description: "สร้าง interface Weapon ที่มี name, damage, และ type",
      starterCode: `interface Weapon {
  name: string;
  damage: number;
  type: string;
}

const sword: Weapon = {
  name: "Iron Sword",
  damage: 25,
  type: "melee"
};

console.log(sword.name, "-", sword.damage, "dmg");`,
      expectedOutput: "Iron Sword - 25 dmg",
      hints: ["interface กำหนดโครงสร้าง object", "ใช้ : type สำหรับ property"]
    },
    quiz: [
      {
        question: "Interface ใช้ทำอะไร?",
        options: ["สร้าง function", "กำหนดโครงสร้าง object", "สร้าง loop", "ประกาศตัวแปร"],
        correctAnswer: 1
      },
      {
        question: "? หลังชื่อ property หมายถึง?",
        options: ["Required", "Optional", "Readonly", "Private"],
        correctAnswer: 1
      }
    ]
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

## Basic Alias
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

## Intersection Types
\`\`\`typescript
type Named = { name: string };
type Leveled = { level: number };
type Player = Named & Leveled;
\`\`\`
    `,
    codeExample: `type GameState = "menu" | "playing" | "paused" | "gameover";
type Position = { x: number; y: number };

let state: GameState = "playing";
let playerPos: Position = { x: 100, y: 200 };

console.log("State:", state);
console.log("Position:", playerPos);

// เปลี่ยน state
state = "paused";
console.log("New State:", state);`,
    challenge: {
      description: "สร้าง type alias สำหรับ Direction",
      starterCode: `type Direction = "up" | "down" | "left" | "right";

let move: Direction = "up";
console.log("Moving:", move);

move = "left";
console.log("Moving:", move);`,
      expectedOutput: "Moving: up\nMoving: left",
      hints: ["ใช้ | เพื่อ union", "เฉพาะค่าที่กำหนดเท่านั้น"]
    },
    quiz: [
      {
        question: "Type alias ต่างจาก interface อย่างไร?",
        options: ["เหมือนกัน", "Type alias ใช้ union ได้", "Interface เร็วกว่า", "Type alias ไม่มี property"],
        correctAnswer: 1
      }
    ]
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

## Basic Typed Function
\`\`\`typescript
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

## Arrow Function
\`\`\`typescript
const greet = (name: string): string => {
  return "Hello, " + name;
};
\`\`\`

## Void (ไม่มี return)
\`\`\`typescript
function log(msg: string): void {
  console.log(msg);
}
\`\`\`

## Optional Parameters
\`\`\`typescript
function greet(name: string, title?: string): string {
  return title ? title + " " + name : name;
}
\`\`\`
    `,
    codeExample: `function calculateDamage(base: number, multiplier: number): number {
  return base * multiplier;
}

const formatHP = (current: number, max: number): string => {
  return current + "/" + max + " HP";
};

function logAction(action: string): void {
  console.log("[ACTION]", action);
}

console.log("Damage:", calculateDamage(10, 1.5));
console.log(formatHP(80, 100));
logAction("Player attacks!");`,
    challenge: {
      description: "สร้าง function ที่รับ 2 ตัวเลขและ return ผลรวม",
      starterCode: `function sum(a: number, b: number): number {
  return a + b;
}

console.log("5 + 3 =", sum(5, 3));
console.log("10 + 20 =", sum(10, 20));`,
      expectedOutput: "5 + 3 = 8\n10 + 20 = 30",
      hints: ["กำหนด type ให้ parameters", "กำหนด return type ด้วย"]
    },
    quiz: [
      {
        question: ": void หมายถึงอะไร?",
        options: ["Return undefined", "Return null", "ไม่มี return", "Error"],
        correctAnswer: 2
      },
      {
        question: "Optional parameter ใช้เครื่องหมายอะไร?",
        options: ["!", "?", "*", "&"],
        correctAnswer: 1
      }
    ]
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

## Generic Function
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

const userRes: Response<User> = {
  data: { name: "John" },
  success: true
};
\`\`\`

## Constraints
\`\`\`typescript
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
\`\`\`
    `,
    codeExample: `function identity<T>(value: T): T {
  return value;
}

function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}

console.log(identity<string>("Hello"));
console.log(identity<number>(42));
console.log(getFirst([10, 20, 30]));
console.log(merge({ name: "Hero" }, { level: 10 }));`,
    challenge: {
      description: "สร้าง generic function ที่ return ตัวสุดท้ายใน array",
      starterCode: `function getLast<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

console.log(getLast([1, 2, 3]));
console.log(getLast(["a", "b", "c"]));`,
      expectedOutput: "3\nc",
      hints: ["ใช้ arr[arr.length - 1]", "<T> คือ generic type parameter"]
    },
    quiz: [
      {
        question: "Generics ใช้ทำอะไร?",
        options: ["สร้าง loop", "ทำให้ code ใช้ซ้ำได้กับหลาย types", "ประกาศตัวแปร", "สร้าง class"],
        correctAnswer: 1
      },
      {
        question: "<T> คืออะไร?",
        options: ["Type ชื่อ T", "Generic type parameter", "Template", "ทั้งหมด"],
        correctAnswer: 1
      }
    ]
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
