import { BadgesView } from "@/src/presentation/components/badges/BadgesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badges | Play Stack",
  description: "สะสม badges และ achievements จากการเรียนรู้ Game Development",
};

export default function BadgesPage() {
  return <BadgesView />;
}
