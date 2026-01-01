import { TreeCoursesView } from "@/src/presentation/components/courses/TreeCoursesView";
import { createServerCoursesPresenter } from "@/src/presentation/presenters/courses/CoursesPresenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คอร์สเรียน - Tree View | Play Stack",
  description:
    "ดูโครงสร้างคอร์สเรียนแบบ Tree View พร้อม Presentation Mode",
};

export default async function TreeCoursesPage() {
  const presenter = await createServerCoursesPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <TreeCoursesView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading courses:", error);
    return <TreeCoursesView />;
  }
}
