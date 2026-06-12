"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { usePredictions } from "@/hooks/usePredictions";
import { formatDate, formatConfidence, isHealthy } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanIcon, HistoryIcon, ChartIcon, LeafIcon, ArrowRightIcon, AlertCircleIcon } from "@/components/icons";

export function DashboardOverview() {
  const { user } = useAuth();
  const { data: predictions, isLoading } = usePredictions(5);

  const totalScans = predictions?.length ?? 0;
  const diseasedCount = predictions?.filter((p) => !isHealthy(p.disease_name)).length ?? 0;
  const healthyCount = totalScans - diseasedCount;
  const avgConfidence = predictions?.length
    ? predictions.reduce((a, p) => a + p.confidence, 0) / predictions.length
    : 0;

  const statsCards = [
    {
      label: "Total Scans",
      value: totalScans.toString(),
      icon: ScanIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Diseases Found",
      value: diseasedCount.toString(),
      icon: AlertCircleIcon,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Healthy Plants",
      value: healthyCount.toString(),
      icon: LeafIcon,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Avg Confidence",
      value: avgConfidence > 0 ? formatConfidence(avgConfidence) : "—",
      icon: ChartIcon,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Good day, {firstName}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your crop health diagnostics.</p>
      </motion.div>

      {/* Quick action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Scan a new crop image</h2>
            <p className="text-blue-100 text-sm">Upload a leaf photo and get an instant AI diagnosis.</p>
          </div>
          <Link href="/dashboard/scan">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2 flex-shrink-0">
              <ScanIcon className="w-4 h-4" />
              Start Scan
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent scans */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-100"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Recent Scans</h3>
          </div>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
              View All
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : predictions && predictions.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {predictions.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/history?id=${p.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isHealthy(p.disease_name) ? "bg-green-50" : "bg-red-50"}`}>
                  <LeafIcon className={`w-5 h-5 ${isHealthy(p.disease_name) ? "text-green-600" : "text-red-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.crop_name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.disease_name}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={isHealthy(p.disease_name) ? "success" : "warning"} className="text-xs">
                    {formatConfidence(p.confidence)}
                  </Badge>
                  <span className="text-xs text-gray-400">{formatDate(p.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ScanIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No scans yet.</p>
            <Link href="/dashboard/scan" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
              Run your first scan
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
