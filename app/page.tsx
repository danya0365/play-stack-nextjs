import { HomeView } from "@/src/presentation/components/home/HomeView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Stack - Game Development Courses",
  description:
    "เรียนรู้การพัฒนาเกมตั้งแต่พื้นฐานจนถึงระดับมืออาชีพ ครอบคลุม Text-Based, 2D, 3D และ Multiplayer Games",
  keywords: [
    "game development",
    "เรียนทำเกม",
    "javascript games",
    "phaser.js",
    "three.js",
    "multiplayer games",
  ],
};

export default function HomePage() {
  return <HomeView />;
}
