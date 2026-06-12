"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, LeafIcon, ScanIcon, CheckCircleIcon } from "@/components/icons";

const stats = [
  { label: "Disease Classes", value: "38+" },
  { label: "Training Images", value: "87K+" },
  { label: "Detection Accuracy", value: "95%+" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-white">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft blue glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-8"
        >
          <LeafIcon className="w-4 h-4" />
          <span>AI-Powered Crop Disease Detection</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6"
        >
          Identify crop diseases{" "}
          <span className="text-gradient">instantly with AI</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload a photo of your crop leaf and get an instant AI diagnosis — disease name, confidence score,
          treatment plan, and prevention methods in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/register">
            <Button size="xl" className="gap-2 group">
              Start Scanning Free
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="xl" variant="outline" className="gap-2">
              <ScanIcon className="w-4 h-4" />
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mb-16"
        >
          {["No credit card required", "Free to use", "Instant results"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-100 p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 bg-gray-100 rounded h-6 ml-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl h-40 flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <ScanIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Drop leaf image here</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold">Disease Detected</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">Tomato Early Blight</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Confidence Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-4/5" />
                    </div>
                    <span className="text-xs font-bold text-green-600">94.2%</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-green-600 font-semibold">Treatment Ready</p>
                  <p className="text-xs text-gray-500 mt-0.5">3 recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
