import { Link } from "react-router";
import { Bird, Home } from "lucide-react";
import { motion } from "motion/react";

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-[var(--nature-gradient-from)] via-[var(--nature-gradient-to)] to-[var(--sky-blue-light)] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <Bird className="w-32 h-32 mx-auto text-[var(--forest-green)] dark:text-[var(--forest-green-light)] opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-gray-900 dark:text-white">404</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Looks like this bird has flown away! The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)] text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold">Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}
