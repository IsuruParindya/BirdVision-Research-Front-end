import { Bird } from "lucide-react";
import { motion } from "motion/react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[var(--nature-gradient-from)] via-[var(--nature-gradient-to)] to-[var(--sky-blue-light)]">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <Bird className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-semibold text-gray-900 bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)] bg-clip-text"
        >
          BirdVision
        </motion.h2>
        <p className="text-gray-600 mt-2 text-sm">Loading...</p>
      </div>
    </div>
  );
}