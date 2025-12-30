import { PhaseView } from "@/src/presentation/components/phase/PhaseView";
import { createServerPhasePresenter } from "@/src/presentation/presenters/phase/PhasePresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface PhasePageProps {
  params: Promise<{ phase: string }>;
}

export async function generateMetadata({
  params,
}: PhasePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const phaseNumber = parseInt(resolvedParams.phase, 10);
  const presenter = await createServerPhasePresenter();
  const viewModel = await presenter.getViewModel(phaseNumber);

  if (!viewModel) {
    return {
      title: "ไม่พบ Phase | Play Stack",
    };
  }

  return presenter.generateMetadata(viewModel.phase);
}

export default async function PhasePage({ params }: PhasePageProps) {
  const resolvedParams = await params;
  const phaseNumber = parseInt(resolvedParams.phase, 10);

  if (isNaN(phaseNumber)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Phase ไม่ถูกต้อง
          </p>
          <Link
            href="/courses"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            กลับไปหน้าคอร์ส
          </Link>
        </div>
      </div>
    );
  }

  const presenter = await createServerPhasePresenter();
  const viewModel = await presenter.getViewModel(phaseNumber);

  return <PhaseView phaseNumber={phaseNumber} initialViewModel={viewModel || undefined} />;
}
