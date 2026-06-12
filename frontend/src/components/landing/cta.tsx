"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4">Start protecting your crops today</h2>
            <p className="text-blue-100 text-xl mb-8 max-w-xl mx-auto">
              Join farmers using AI to detect plant diseases early and save their harvests. It's free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50 gap-2 group">
                  Create Free Account
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
