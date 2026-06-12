import type { Metadata } from "next";
import { HistoryPage } from "@/components/dashboard/history";

export const metadata: Metadata = { title: "Diagnosis History" };

export default function HistoryPageRoute() {
  return <HistoryPage />;
}
