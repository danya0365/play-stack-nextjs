import { PlaygroundView } from "@/src/presentation/components/playground/PlaygroundView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground | Play Stack",
  description: "ทดลองเขียนโค้ดเกมและรันได้ทันที! เรียนรู้ Game Development แบบ Interactive",
  keywords: ["code playground", "game development", "javascript", "canvas", "phaser"],
};

export default function PlaygroundPage() {
  return <PlaygroundView />;
}
