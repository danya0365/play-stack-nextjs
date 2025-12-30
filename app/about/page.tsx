import { AboutView } from "@/src/presentation/components/about/AboutView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับ | Play Stack",
  description: "เรียนรู้เกี่ยวกับ Play Stack - แพลตฟอร์มเรียน Game Development ออนไลน์",
};

export default function AboutPage() {
  return <AboutView />;
}
