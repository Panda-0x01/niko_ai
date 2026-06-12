import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return "text-green-600";
  if (confidence >= 0.7) return "text-yellow-600";
  return "text-red-600";
}

export function getConfidenceBg(confidence: number): string {
  if (confidence >= 0.9) return "bg-green-100 text-green-700";
  if (confidence >= 0.7) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export function isHealthy(diseaseName: string): boolean {
  return diseaseName.toLowerCase().includes("healthy");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
