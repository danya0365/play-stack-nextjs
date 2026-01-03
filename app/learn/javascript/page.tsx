import { LearnCourseView } from "@/src/presentation/components/learn/LearnCourseView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn JavaScript | Play Stack",
  description: "เรียน JavaScript จากพื้นฐาน ตัวแปร, ฟังก์ชัน, Objects, Arrays และอื่นๆ",
};

export default function LearnJavaScriptPage() {
  return <LearnCourseView courseType="javascript" />;
}
