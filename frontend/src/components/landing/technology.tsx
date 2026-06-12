"use client";

import { motion } from "framer-motion";
import { LayersIcon, DatabaseIcon, ZapIcon, GlobeIcon } from "@/components/icons";

const tech = [
  {
    icon: LayersIcon,
    name: "YOLOv8 Classification",
    description: "State-of-the-art real-time object classification model by Ultralytics, fine-tuned on the New Plant Diseases Dataset.",
    badge: "AI Model",
  },
  {
    icon: DatabaseIcon,
    name: "87,000+ Training Images",
    description: "Trained on the Kaggle New Plant Diseases Dataset covering 38 disease classes across 10+ crops for high accuracy.",
    badge: "Dataset",
  },
  {
    icon: ZapIcon,
    name: "FastAPI Backend",
    description: "High-performance async Python API built with FastAPI, SQLAlchemy, and PostgreSQL for reliable and scalable operations.",
    badge: "Backend",
  },
  {
    icon: GlobeIcon,
    name: "Next.js 15 Frontend",
    description: "Modern React framework with App Router, TypeScript, Tailwind CSS, and Framer Motion for a premium user experience.",
    badge: "Frontend",
  },
];

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Technology</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Built on proven AI technology</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Niko AI is built with production-grade tools trusted by researchers and developers worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tech.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.badge}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech logos strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-gray-100"
        >
          <p className="text-center text-sm text-gray-400 mb-8">Powered by industry-standard technologies</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["Next.js", "FastAPI", "YOLOv8", "PyTorch", "PostgreSQL", "TailwindCSS", "Docker"].map((tech) => (
              <span key={tech} className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
