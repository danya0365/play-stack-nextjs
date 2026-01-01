import { PodcastCoursesView } from "@/src/presentation/components/courses/PodcastCoursesView";
import { createServerCoursesPresenter } from "@/src/presentation/presenters/courses/CoursesPresenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast Mode | Play Stack",
  description:
    "ฟังคอร์สเรียนแบบ Podcast พร้อม Sleep Timer เหมาะสำหรับการเดินทาง",
};

export default async function PodcastCoursesPage() {
  const presenter = await createServerCoursesPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <PodcastCoursesView viewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading courses:", error);
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-purple-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⚠️</div>
          <p>ไม่สามารถโหลดคอร์สได้</p>
        </div>
      </div>
    );
  }
}
