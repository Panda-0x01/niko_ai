"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@/components/icons";

const faqs = [
  {
    q: "What crops does Niko AI support?",
    a: "Niko AI currently supports Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato — across 38 disease classes total.",
  },
  {
    q: "How accurate is the disease detection?",
    a: "Our YOLOv8 model achieves 95%+ accuracy on the validation set of the New Plant Diseases Dataset (87,000+ images). Real-world accuracy may vary based on image quality and lighting conditions.",
  },
  {
    q: "What image formats are supported?",
    a: "We support JPG, JPEG, and PNG formats up to 10MB. For best results, use a clear, well-lit photo focused on the affected leaf.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. All images are stored securely and are only accessible to you. We use JWT authentication, bcrypt password hashing, and HTTPS encryption for all data in transit.",
  },
  {
    q: "Is Niko AI free to use?",
    a: "Yes, Niko AI is completely free to use. You can scan as many crop images as you need.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Niko AI is a web application that works directly in your browser on desktop, tablet, or mobile devices.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <p className="text-xl text-gray-500">Have questions? We have answers.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
