import { ProfileView } from "@/src/presentation/components/profile/ProfileView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "โปรไฟล์ | Play Stack",
  description: "ดูความคืบหน้าการเรียนและใบรับรองของคุณ",
};

export default function ProfilePage() {
  return <ProfileView />;
}
