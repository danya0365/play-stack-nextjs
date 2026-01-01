import { CinemaCoursesView } from "@/src/presentation/components/courses/CinemaCoursesView";
import { createServerCoursesPresenter } from "@/src/presentation/presenters/courses/CoursesPresenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinema Mode | Play Stack",
  description:
    "ดูคอร์สเรียนแบบ Cinema Mode พร้อมเสียงอ่านอัตโนมัติและเพลงพื้นหลัง",
};

export default async function CinemaCoursesPage() {
  const presenter = await createServerCoursesPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <CinemaCoursesView viewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading courses:", error);
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⚠️</div>
          <p>ไม่สามารถโหลดคอร์สได้</p>
        </div>
      </div>
    );
  }
}
