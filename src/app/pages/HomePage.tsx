import { Link } from "react-router";
import { Video, Upload, Leaf, Bird, Globe,Scroll} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import boris from "../../assets/boris.jpg";

export function HomePage() {
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth || 1200);
      setVh(window.innerHeight || 800);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const leaves = useMemo(
    () =>
      [...Array(6)].map(() => ({
        startX: Math.random() * vw,
        endX: Math.random() * vw,
        duration: 18 + Math.random() * 8,
        delay: Math.random() * 5,
      })),
    [vw]
  );

  return (
    <div className="relative min-h-dvh">
      {/* FULL-VIEWPORT BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[var(--nature-gradient-from)] via-[var(--nature-gradient-to)] to-[var(--sky-blue-light)] dark:from-[var(--nature-gradient-from)] dark:via-[var(--nature-gradient-to)] dark:to-slate-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-52 h-52 bg-[var(--forest-green)] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--sky-blue)] rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </div>

      {/* Floating Leaves */}
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="fixed text-[var(--forest-green)] opacity-20 pointer-events-none"
          style={{ left: 0, top: 0 }}
          initial={{ y: -120, x: l.startX, rotate: 0 }}
          animate={{ y: vh + 140, x: l.endX, rotate: 360 }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: "linear",
          }}
        >
          <Leaf className="w-6 h-6" />
        </motion.div>
      ))}

      {/* Hero Content */}
      <div className="relative container mx-auto px-6 py-6 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Hero Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 relative"
          >
            <div className="relative w-full h-[250px] md:h-[320px] rounded-3xl overflow-hidden shadow-xl">
              <img
                src={boris}
                alt="Hero bird"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <Bird className="absolute top-6 right-6 w-16 h-16 text-zinc-300" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-4xl font-bold mb-1 text-gray-900 dark:text-white"
          >
            Discover Birds Around You
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto"
          >
            Recognize bird species instantly with{" "}
            <span className="font-semibold text-[var(--forest-green)] dark:text-[var(--forest-green-light)] font-['Noto_Sans_Sinhala']">
              Sinhala
            </span>{" "}
            language support
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/live"
              className="px-6 py-3 bg-gradient-to-r from-[var(--forest-green)] to-[var(--forest-green-light)] text-white rounded-xl shadow-md hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span className="font-medium">Start Live Detection</span>
            </Link>

            <Link
              to="/upload"
              className="px-6 py-3 bg-gradient-to-r from-[var(--sky-blue)] to-[var(--sky-blue-light)] text-white rounded-xl shadow-md hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="font-medium">Upload Image or Video</span>
            </Link>
          </motion.div>

          {/* Features (smaller cards) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-9 grid grid-cols-1 md:grid-cols-[repeat(3,auto)] justify-center gap-5"
          >
            {[
              {
                icon: <Bird className="w-5 h-5 text-white" />,
                title: "Real-time Detection",
                desc: "Identify bird species instantly using your camera",
              },
              {
                icon: <Scroll className="w-5 h-5 text-white" />,
                title: "සිංහල Support",
                desc: "View bird names in English and Sinhala",
              },
              {
                icon: <Upload className="w-5 h-5 text-white" />,
                title: "Upload & Analyze",
                desc: "Upload images or videos for identification",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg shadow-md border border-white/20 max-w-[190px] mx-auto min-h-[120px]"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-lg flex items-center justify-center mb-2 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}