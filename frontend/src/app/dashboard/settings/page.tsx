import type { Metadata } from "next";
import { SettingsPage } from "@/components/dashboard/settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsRoute() {
  return <SettingsPage />;
}
