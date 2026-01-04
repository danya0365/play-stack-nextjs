// Learn Courses Master Data
// Defines available programming language courses

export interface LearnCourse {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  color: string;
  bgGradient: string;
  order: number;
}

export const learnCourses: LearnCourse[] = [
  {
    id: "course-javascript",
    slug: "javascript",
    title: "JavaScript",
    titleTh: "JavaScript",
    description: "The language of the web - Variables, Functions, Objects, Arrays and more",
    descriptionTh: "พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    icon: "JS",
    color: "yellow",
    bgGradient: "from-yellow-600 to-orange-600",
    order: 1,
  },
  {
    id: "course-typescript",
    slug: "typescript",
    title: "TypeScript",
    titleTh: "TypeScript",
    description: "Type safety, Interfaces, Generics and more",
    descriptionTh: "Type safety และ Advanced features",
    icon: "TS",
    color: "blue",
    bgGradient: "from-blue-600 to-indigo-600",
    order: 2,
  },
  {
    id: "course-go",
    slug: "go",
    title: "Go",
    titleTh: "Go (Golang)",
    description: "Fast, simple, and efficient programming language",
    descriptionTh: "ภาษาที่เร็ว เรียบง่าย และมีประสิทธิภาพสูง",
    icon: "Go",
    color: "cyan",
    bgGradient: "from-cyan-600 to-teal-600",
    order: 3,
  },
];

export function getCourseBySlug(slug: string): LearnCourse | undefined {
  return learnCourses.find((course) => course.slug === slug);
}

export function getCourseById(id: string): LearnCourse | undefined {
  return learnCourses.find((course) => course.id === id);
}

export function getValidCourseSlugs(): string[] {
  return learnCourses.map((course) => course.slug);
}

// Map course slug to the topic filter logic
export function getTopicFilterForCourse(courseSlug: string): (topicId: string) => boolean {
  switch (courseSlug) {
    case "javascript":
      return (topicId: string) => topicId !== "topic-typescript" && !topicId.startsWith("topic-go");
    case "typescript":
      return (topicId: string) => topicId === "topic-typescript";
    case "go":
      return (topicId: string) => topicId.startsWith("topic-go");
    default:
      return () => false;
  }
}
