// Learn Topics Master Data
// Similar structure to phases for the /learn page

export interface LearnTopic {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  color: string;
  order: number;
  lessonCount: number;
}

export const learnTopics: LearnTopic[] = [
  {
    id: "topic-basics",
    slug: "basics",
    title: "JavaScript Basics",
    titleTh: "พื้นฐาน JavaScript",
    description: "Variables, data types, operators, and basic syntax",
    descriptionTh: "ตัวแปร, ชนิดข้อมูล, operators และ syntax พื้นฐาน",
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
    order: 1,
    lessonCount: 8,
  },
  {
    id: "topic-control",
    slug: "control-flow",
    title: "Control Flow",
    titleTh: "การควบคุมการทำงาน",
    description: "Conditionals, loops, and program flow",
    descriptionTh: "เงื่อนไข, loops และการควบคุมโปรแกรม",
    icon: "🔀",
    color: "from-blue-500 to-cyan-600",
    order: 2,
    lessonCount: 6,
  },
  {
    id: "topic-functions",
    slug: "functions",
    title: "Functions",
    titleTh: "ฟังก์ชัน",
    description: "Function declarations, expressions, arrows, and closures",
    descriptionTh: "การประกาศฟังก์ชัน, expressions, arrows และ closures",
    icon: "⚡",
    color: "from-purple-500 to-pink-600",
    order: 3,
    lessonCount: 7,
  },
  {
    id: "topic-objects",
    slug: "objects-arrays",
    title: "Objects & Arrays",
    titleTh: "Objects และ Arrays",
    description: "Object creation, arrays, and data structures",
    descriptionTh: "การสร้าง Object, arrays และโครงสร้างข้อมูล",
    icon: "📦",
    color: "from-orange-500 to-red-600",
    order: 4,
    lessonCount: 8,
  },
  {
    id: "topic-classes",
    slug: "classes",
    title: "Classes & OOP",
    titleTh: "Classes และ OOP",
    description: "Object-oriented programming with JavaScript classes",
    descriptionTh: "การเขียนโปรแกรมเชิงวัตถุด้วย JavaScript classes",
    icon: "🏗️",
    color: "from-indigo-500 to-violet-600",
    order: 5,
    lessonCount: 5,
  },
  {
    id: "topic-async",
    slug: "async",
    title: "Async JavaScript",
    titleTh: "Async JavaScript",
    description: "Callbacks, Promises, Async/Await",
    descriptionTh: "Callbacks, Promises และ Async/Await",
    icon: "⏳",
    color: "from-teal-500 to-cyan-600",
    order: 6,
    lessonCount: 6,
  },
  {
    id: "topic-dom",
    slug: "dom",
    title: "DOM & Events",
    titleTh: "DOM และ Events",
    description: "DOM manipulation and event handling",
    descriptionTh: "การจัดการ DOM และ Events",
    icon: "🌐",
    color: "from-rose-500 to-pink-600",
    order: 7,
    lessonCount: 6,
  },
  {
    id: "topic-typescript",
    slug: "typescript",
    title: "TypeScript",
    titleTh: "TypeScript",
    description: "Type safety, interfaces, generics, and more",
    descriptionTh: "Type safety, interfaces, generics และอื่นๆ",
    icon: "🔷",
    color: "from-blue-600 to-indigo-700",
    order: 8,
    lessonCount: 8,
  },
];

export function getTopicBySlug(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug);
}

export function getTopicById(id: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.id === id);
}
