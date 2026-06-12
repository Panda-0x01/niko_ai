"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon } from "@/components/icons";

const benefits = [
  "Detect diseases before they spread across your field",
  "Reduce crop losses with timely treatment",
  "Save money on unnecessary pesticides",
  "Get expert-level recommendations without hiring a specialist",
  "Track crop health trends over time",
  "Works with 10+ common crops and 38 disease classes",
  "Instant results — no waiting, no lab fees",
  "Available anywhere with a mobile browser",
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Benefits</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Smarter farming starts with better diagnosis
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Crop disease can wipe out an entire season's work. Niko AI gives you the power to act fast —
              before a small infection becomes a catastrophic loss.
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sample Diagnosis Output</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Crop</span>
                <span className="text-sm font-semibold text-gray-900">Tomato</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Disease</span>
                <span className="text-sm font-semibold text-red-600">Early Blight</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full w-[94%]" />
                  </div>
                  <span className="text-sm font-bold text-green-600">94.2%</span>
                </div>
              </div>
              <div className="py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500 block mb-2">Symptoms</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Dark lesions", "Yellow halos", "Leaf drop"].map((s) => (
                    <span key={s} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-100">{s}</span>
                  ))}
                </div>
              </div>
              <div className="py-3">
                <span className="text-sm text-gray-500 block mb-2">Treatment</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Apply fungicide", "Remove infected leaves", "Improve air flow"].map((t) => (
                    <span key={t} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
