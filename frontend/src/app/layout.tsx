import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Niko AI — Intelligent Crop Disease Detection",
    template: "%s | Niko AI",
  },
  description:
    "AI-powered crop disease detection platform. Upload a leaf image and get instant diagnosis, treatment recommendations, and prevention methods.",
  keywords: ["crop disease", "plant disease detection", "AI agriculture", "YOLOv8", "farming AI"],
  authors: [{ name: "Niko AI" }],
  openGraph: {
    title: "Niko AI — Intelligent Crop Disease Detection",
    description: "Detect crop diseases instantly with AI-powered image analysis.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
