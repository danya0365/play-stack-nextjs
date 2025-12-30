import { CoursesView } from "@/src/presentation/components/courses/CoursesView";
import { createServerCoursesPresenter } from "@/src/presentation/presenters/courses/CoursesPresenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คอร์สเรียน | Play Stack",
  description:
    "เรียนรู้การพัฒนาเกมตั้งแต่พื้นฐานจนถึงระดับมืออาชีพ ครอบคลุม 5 เฟส ตั้งแต่ Text-Based Games ไปจนถึง 3D Multiplayer",
  keywords: [
    "game development courses",
    "คอร์สพัฒนาเกม",
    "เรียนทำเกม",
    "phaser.js",
    "three.js",
  ],
};

export default async function CoursesPage() {
  const presenter = await createServerCoursesPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <CoursesView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading courses:", error);
    return <CoursesView />;
  }
}
