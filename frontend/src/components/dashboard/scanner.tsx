"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { usePredict } from "@/hooks/usePredictions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  UploadIcon, ScanIcon, CheckCircleIcon, AlertCircleIcon,
  LeafIcon, XIcon, InfoIcon,
} from "@/components/icons";
import { formatConfidence, isHealthy } from "@/lib/utils";
import type { PredictResponse } from "@/types";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const { mutateAsync: predict, isPending } = usePredict();

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length === 0) return;
    const f = accepted[0];
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0];
      toast({
        title: "File rejected",
        description: err?.code === "file-too-large"
          ? "File must be under 10MB."
          : "Only JPG, JPEG, and PNG are supported.",
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      const data = await predict(file);
      setResult(data);
      toast({ title: "Analysis complete", description: `Detected: ${data.disease}` });
    } catch {
      toast({ title: "Analysis failed", description: "Could not process the image. Please try again.", variant: "destructive" });
    }
  };

  const confident = isHealthy(result?.disease ?? "");

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Scan Disease</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a crop leaf photo to get an instant AI diagnosis.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4"
        >
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
              isDragActive
                ? "border-blue-400 bg-blue-50"
                : preview
                ? "border-gray-200 bg-gray-50"
                : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
            }`}
            style={{ minHeight: 300 }}
          >
            <input {...getInputProps()} aria-label="Upload crop image" />

            {preview ? (
              <div className="relative w-full h-full" style={{ minHeight: 300 }}>
                <Image
                  src={preview}
                  alt="Uploaded crop"
                  fill
                  className="object-contain rounded-xl p-2"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleReset(); }}
                  className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                  aria-label="Remove image"
                >
                  <XIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDragActive ? "bg-blue-100" : "bg-gray-100"}`}>
                  <UploadIcon className={`w-7 h-7 ${isDragActive ? "text-blue-600" : "text-gray-400"}`} />
                </div>
                <p className="font-medium text-gray-700 mb-1">
                  {isDragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-gray-400">Supports JPG, JPEG, PNG — max 10MB</p>
              </div>
            )}
          </div>

          {file && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <LeafIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file || isPending}
            className="w-full gap-2"
            size="lg"
          >
            {isPending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Analyzing...
              </>
            ) : (
              <>
                <ScanIcon className="w-4 h-4" />
                Analyze Image
              </>
            )}
          </Button>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
            <InfoIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-600 leading-relaxed">
              For best results, use a clear, well-lit photo of a single leaf. Avoid blurry or dark images.
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full mb-4"
                style={{ borderWidth: 3 }}
              />
              <p className="text-gray-700 font-medium">Analyzing your image...</p>
              <p className="text-gray-400 text-sm mt-1">This usually takes a few seconds</p>
              <div className="w-48 mt-6">
                <Progress value={undefined} className="animate-pulse" />
              </div>
            </motion.div>
          )}

          {!isPending && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Main result card */}
              <div className={`rounded-2xl border p-5 ${confident ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Detected</p>
                    <h2 className="text-xl font-bold text-gray-900">{result.disease}</h2>
                    <p className="text-sm text-gray-600">Crop: {result.crop}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${confident ? "bg-green-100" : "bg-red-100"}`}>
                    {confident
                      ? <CheckCircleIcon className="w-6 h-6 text-green-600" />
                      : <AlertCircleIcon className="w-6 h-6 text-red-600" />
                    }
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Confidence</span>
                    <span className={`font-bold ${confident ? "text-green-700" : "text-orange-700"}`}>
                      {formatConfidence(result.confidence)}
                    </span>
                  </div>
                  <Progress value={result.confidence * 100} />
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{result.description}</p>
              </div>

              {/* Symptoms, Treatment, Prevention */}
              {!confident && (
                <>
                  <ResultSection title="Symptoms" items={result.symptoms} color="red" />
                  <ResultSection title="Treatment" items={result.treatment} color="blue" />
                  <ResultSection title="Prevention" items={result.prevention} color="green" />
                </>
              )}
            </motion.div>
          )}

          {!isPending && !result && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-12 text-center"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <LeafIcon className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Results will appear here</p>
              <p className="text-gray-400 text-sm mt-1">Upload an image and click Analyze</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultSection({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "red" | "blue" | "green";
}) {
  const colorMap = {
    red: "bg-red-50 border-red-100 text-red-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-green-50 border-green-100 text-green-600",
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold flex-shrink-0 mt-0.5 border ${colorMap[color]}`}>
              {i + 1}
            </span>
            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
