// Master Data: Sample Lessons
// First few lessons for each module

export interface Lesson {
  id: string;
  moduleId: string;
  number: string; // e.g., "1.1.1"
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  duration: string; // e.g., "30 mins"
  type: "theory" | "practice" | "project" | "challenge";
  order: number;
  content?: string; // Markdown content
}

// Sample lessons for Phase 1
export const lessons: Lesson[] = [
  // Module 1.1: Programming Basics
  {
    id: "lesson-1-1-1",
    moduleId: "module-1-1",
    number: "1.1.1",
    title: "JavaScript Fundamentals",
    titleTh: "พื้นฐาน JavaScript",
    description: "Variables, functions, loops, conditionals, and ES6+ features",
    descriptionTh: "ตัวแปร, ฟังก์ชัน, loops, conditionals และฟีเจอร์ ES6+",
    duration: "45 mins",
    type: "theory",
    order: 1,
  },
  {
    id: "lesson-1-1-2",
    moduleId: "module-1-1",
    number: "1.1.2",
    title: "Game Loop Concept",
    titleTh: "แนวคิด Game Loop",
    description: "Understanding the game loop, delta time, and frame rate",
    descriptionTh: "ทำความเข้าใจ Game Loop, delta time และ frame rate",
    duration: "30 mins",
    type: "theory",
    order: 2,
  },
  {
    id: "lesson-1-1-3",
    moduleId: "module-1-1",
    number: "1.1.3",
    title: "Math for Games",
    titleTh: "คณิตศาสตร์สำหรับเกม",
    description: "Vectors, distance calculation, collision detection basics",
    descriptionTh: "เวกเตอร์, การคำนวณระยะทาง, พื้นฐานการตรวจจับการชน",
    duration: "45 mins",
    type: "theory",
    order: 3,
  },

  // Module 1.2: Text-Based Games
  {
    id: "lesson-1-2-1",
    moduleId: "module-1-2",
    number: "1.2.1",
    title: "Console Interaction",
    titleTh: "การโต้ตอบกับ Console",
    description: "Reading input, printing output, creating menus",
    descriptionTh: "อ่าน input, แสดง output, สร้างเมนู",
    duration: "30 mins",
    type: "practice",
    order: 1,
  },
  {
    id: "lesson-1-2-2",
    moduleId: "module-1-2",
    number: "1.2.2",
    title: "State Management",
    titleTh: "การจัดการ State",
    description: "Game state, player data, inventory systems",
    descriptionTh: "Game state, ข้อมูลผู้เล่น, ระบบ inventory",
    duration: "45 mins",
    type: "practice",
    order: 2,
  },
  {
    id: "lesson-1-2-3",
    moduleId: "module-1-2",
    number: "1.2.3",
    title: "Story Branching",
    titleTh: "การแตกกิ่งเรื่องราว",
    description: "Creating branching narratives and multiple endings",
    descriptionTh: "สร้างเรื่องราวหลายทาง และตอนจบหลายแบบ",
    duration: "60 mins",
    type: "project",
    order: 3,
  },

  // Module 2.1: Canvas API
  {
    id: "lesson-2-1-1",
    moduleId: "module-2-1",
    number: "2.1.1",
    title: "Canvas Basics",
    titleTh: "พื้นฐาน Canvas",
    description: "Setup canvas, drawing context, shapes and colors",
    descriptionTh: "ตั้งค่า canvas, drawing context, รูปทรงและสี",
    duration: "30 mins",
    type: "practice",
    order: 1,
  },
  {
    id: "lesson-2-1-2",
    moduleId: "module-2-1",
    number: "2.1.2",
    title: "Animation Loop",
    titleTh: "Animation Loop",
    description: "requestAnimationFrame, smooth animations, sprite rendering",
    descriptionTh: "requestAnimationFrame, animation ที่ลื่นไหล, การเรนเดอร์ sprite",
    duration: "45 mins",
    type: "practice",
    order: 2,
  },
  {
    id: "lesson-2-1-3",
    moduleId: "module-2-1",
    number: "2.1.3",
    title: "Input Handling",
    titleTh: "จัดการ Input",
    description: "Keyboard events, mouse events, touch support",
    descriptionTh: "Keyboard events, mouse events, รองรับ touch",
    duration: "30 mins",
    type: "practice",
    order: 3,
  },
  {
    id: "lesson-2-1-4",
    moduleId: "module-2-1",
    number: "2.1.4",
    title: "Collision Detection",
    titleTh: "ตรวจจับการชน",
    description: "AABB collision, circle collision, response handling",
    descriptionTh: "AABB collision, circle collision, การจัดการการตอบสนอง",
    duration: "45 mins",
    type: "practice",
    order: 4,
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonsByModuleId(moduleId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}
