"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePredictions, useDeletePrediction } from "@/hooks/usePredictions";
import { formatDate, formatConfidence, isHealthy } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  HistoryIcon, LeafIcon, ScanIcon, TrashIcon,
  AlertCircleIcon, CheckCircleIcon, ChevronRightIcon,
} from "@/components/icons";
import type { PredictionHistory } from "@/types";

export function HistoryPage() {
  const { data: predictions, isLoading } = usePredictions(50);
  const { mutate: deletePrediction } = useDeletePrediction();
  const [selected, setSelected] = useState<PredictionHistory | null>(null);

  const handleDelete = (id: string) => {
    deletePrediction(id, {
      onSuccess: () => {
        toast({ title: "Deleted", description: "Diagnosis removed from history." });
        if (selected?.id === id) setSelected(null);
      },
      onError: () => toast({ title: "Error", description: "Could not delete.", variant: "destructive" }),
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diagnosis History</h1>
            <p className="text-gray-500 text-sm mt-1">
              {predictions?.length ?? 0} total diagnoses
            </p>
          </div>
          <Link href="/dashboard/scan">
            <Button size="sm" className="gap-2">
              <ScanIcon className="w-4 h-4" />
              New Scan
            </Button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : predictions && predictions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {predictions.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(p)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selected?.id === p.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isHealthy(p.disease_name) ? "bg-green-50" : "bg-red-50"}`}>
                  <LeafIcon className={`w-4 h-4 ${isHealthy(p.disease_name) ? "text-green-600" : "text-red-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.crop_name}</p>
                  <p className="text-xs text-gray-400 truncate">{p.disease_name}</p>
                </div>
                <ChevronRightIcon className={`w-4 h-4 flex-shrink-0 ${selected?.id === p.id ? "text-blue-500" : "text-gray-300"}`} />
              </motion.div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Header card */}
                  <div className={`rounded-2xl border p-5 ${isHealthy(selected.disease_name) ? "bg-green-50 border-green-100" : "bg-white border-gray-100"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {isHealthy(selected.disease_name)
                            ? <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            : <AlertCircleIcon className="w-5 h-5 text-red-500" />
                          }
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {isHealthy(selected.disease_name) ? "Healthy" : "Disease Detected"}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{selected.disease_name}</h2>
                        <p className="text-sm text-gray-500">Crop: {selected.crop_name}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(selected.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        aria-label="Delete this diagnosis"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Confidence</span>
                        <span className="font-bold text-gray-900">{formatConfidence(selected.confidence)}</span>
                      </div>
                      <Progress value={selected.confidence * 100} />
                    </div>

                    <p className="text-xs text-gray-400 mt-3">{formatDate(selected.created_at)}</p>
                  </div>

                  {selected.description && (
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
                    </div>
                  )}

                  {selected.symptoms && selected.symptoms.length > 0 && (
                    <HistoryDetailSection title="Symptoms" items={selected.symptoms} />
                  )}
                  {selected.treatment && selected.treatment.length > 0 && (
                    <HistoryDetailSection title="Treatment" items={selected.treatment} />
                  )}
                  {selected.prevention && selected.prevention.length > 0 && (
                    <HistoryDetailSection title="Prevention" items={selected.prevention} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center p-8"
                >
                  <HistoryIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Select a diagnosis</p>
                  <p className="text-gray-400 text-sm mt-1">Click an item to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <HistoryIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-medium mb-1">No history yet</h3>
          <p className="text-gray-400 text-sm mb-6">Your diagnosis history will appear here after your first scan.</p>
          <Link href="/dashboard/scan">
            <Button className="gap-2">
              <ScanIcon className="w-4 h-4" />
              Run First Scan
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function HistoryDetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-gray-300 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
