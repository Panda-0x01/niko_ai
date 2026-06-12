"use client";

import { motion } from "framer-motion";
import { UploadIcon, BrainIcon, CheckCircleIcon } from "@/components/icons";

const steps = [
  {
    step: "01",
    icon: UploadIcon,
    title: "Upload a Leaf Image",
    description: "Take a photo of your crop leaf and upload it to Niko AI. Supports JPG, JPEG, and PNG up to 10MB. Drag and drop or click to browse.",
  },
  {
    step: "02",
    icon: BrainIcon,
    title: "AI Analyzes the Image",
    description: "Our YOLOv8 classification model processes the image in seconds, identifying the crop type and any disease with high confidence.",
  },
  {
    step: "03",
    icon: CheckCircleIcon,
    title: "Get Your Diagnosis",
    description: "Receive a complete diagnosis: disease name, confidence score, description, symptoms, treatment plan, and prevention methods.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Three steps to a diagnosis</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            No expertise needed. Just upload a photo and let the AI do the heavy lifting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[calc(33.33%-1px)] w-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-blue-200" />
          <div className="hidden lg:block absolute top-16 left-[calc(66.66%-1px)] w-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs font-bold border border-blue-100 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
