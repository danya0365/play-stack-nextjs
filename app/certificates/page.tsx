import { CertificatesView } from "@/src/presentation/components/certificate/CertificatesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates | Play Stack",
  description: "ดู Certificates ที่คุณได้รับจากการเรียนจบคอร์ส",
};

export default function CertificatesPage() {
  return <CertificatesView />;
}
