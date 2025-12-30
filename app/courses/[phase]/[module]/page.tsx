import { ModuleView } from "@/src/presentation/components/module/ModuleView";
import { createServerModulePresenter } from "@/src/presentation/presenters/module/ModulePresenter";
import type { Metadata } from "next";
import Link from "next/link";

interface ModulePageProps {
  params: Promise<{ phase: string; module: string }>;
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const phaseNumber = parseInt(resolvedParams.phase, 10);
  const moduleNumber = resolvedParams.module;

  const presenter = await createServerModulePresenter();
  const viewModel = await presenter.getViewModel(phaseNumber, moduleNumber);

  if (!viewModel) {
    return {
      title: "ไม่พบ Module | Play Stack",
    };
  }

  return presenter.generateMetadata(viewModel.module, viewModel.phase);
}

export default async function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = await params;
  const phaseNumber = parseInt(resolvedParams.phase, 10);
  const moduleNumber = resolvedParams.module;

  if (isNaN(phaseNumber)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ข้อมูลไม่ถูกต้อง
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

  const presenter = await createServerModulePresenter();
  const viewModel = await presenter.getViewModel(phaseNumber, moduleNumber);

  return (
    <ModuleView
      phaseNumber={phaseNumber}
      moduleNumber={moduleNumber}
      initialViewModel={viewModel || undefined}
    />
  );
}
