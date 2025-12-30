import { CommunityView } from "@/src/presentation/components/community/CommunityView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Play Stack",
  description: "พูดคุย ถามคำถาม และแชร์ผลงานกับ Play Stack Community",
  keywords: ["community", "forum", "game development", "discussion"],
};

export default function CommunityPage() {
  return <CommunityView />;
}
