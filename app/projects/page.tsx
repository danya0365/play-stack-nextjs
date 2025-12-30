import { ProjectsView } from "@/src/presentation/components/projects/ProjectsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ผลงานนักเรียน | Play Stack",
  description: "ชมผลงานเกมจากนักเรียน Play Stack - แรงบันดาลใจสำหรับโปรเจกต์ของคุณ!",
  keywords: ["student projects", "game showcase", "portfolio", "game development"],
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
