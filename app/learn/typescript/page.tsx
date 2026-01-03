import { LearnTopicView } from "@/src/presentation/components/learn/LearnTopicView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TypeScript | Play Stack",
  description: "เรียน TypeScript - Types, Interfaces, Generics และอื่นๆ",
};

export default function LearnTSTopicPage() {
  return <LearnTopicView topicSlug="typescript" courseType="typescript" />;
}
