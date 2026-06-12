import type { Metadata } from "next";
import { ScannerPage } from "@/components/dashboard/scanner";

export const metadata: Metadata = { title: "Scan Disease" };

export default function ScanPage() {
  return <ScannerPage />;
}
