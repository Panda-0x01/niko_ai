import Link from "next/link";
import { LeafIcon } from "@/components/icons";

export function FooterSection() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <LeafIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Niko AI</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-gray-900 transition-colors">Register</Link>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </nav>

          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Niko AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
