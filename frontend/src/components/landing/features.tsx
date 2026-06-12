"use client";

import { motion } from "framer-motion";
import { ScanIcon, BrainIcon, ShieldIcon, ClockIcon, ChartIcon, DatabaseIcon } from "@/components/icons";

const features = [
  {
    icon: ScanIcon,
    title: "Instant Disease Scan",
    description: "Upload any crop leaf photo and get a detailed diagnosis within seconds using state-of-the-art YOLOv8 classification.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BrainIcon,
    title: "AI-Powered Analysis",
    description: "Our model is trained on 87,000+ images across 38 disease classes to deliver accurate and reliable predictions.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: ShieldIcon,
    title: "Treatment Recommendations",
    description: "Get actionable treatment plans and prevention methods tailored to the specific disease detected in your crop.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: ClockIcon,
    title: "Diagnosis History",
    description: "Track all your scans over time. Review past diagnoses and monitor the health of your crops systematically.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: ChartIcon,
    title: "Confidence Scoring",
    description: "Every prediction comes with a confidence score so you know exactly how certain the AI is about its diagnosis.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: DatabaseIcon,
    title: "Disease Knowledge Base",
    description: "Access a comprehensive database of crop diseases with detailed descriptions, symptoms, and expert recommendations.",
    color: "bg-red-50 text-red-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to protect your crops</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            From instant AI detection to detailed treatment guides — Niko AI gives farmers the tools they need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
