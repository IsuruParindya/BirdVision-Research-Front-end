import { useEffect, useMemo, useState } from "react";
import { Globe, Palette, Sliders, Save, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

export function SettingsPage() {
  const [language, setLanguage] = useState("both");
  const [theme, setTheme] = useState("light");
  const [confidence, setConfidence] = useState([75]);
  const [boundingBoxAnimation, setBoundingBoxAnimation] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [frameRate, setFrameRate] = useState("medium");

  // ✅ Viewport size for floating leaves animation
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  // ✅ Shared radio style (white circle in dark theme even before selecting)
  const radioItemClass =
  "h-4 w-4 border-2 border-gray-400 " +
  "text-[var(--forest-green)] dark:text-[var(--forest-green)] " + 
  "dark:border-white/90 " +
  "data-[state=checked]:border-[var(--forest-green)] " +
  "dark:data-[state=checked]:border-[var(--forest-green)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sky-blue)] focus-visible:ring-offset-2 " +
  "dark:focus-visible:ring-offset-slate-900";

  // ✅ Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "auto") {
      setTheme(saved);
    }
  }, []);

  // ✅ Apply theme logic (light / dark / auto) by toggling the `dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;

    const setDark = (on: boolean | undefined) => root.classList.toggle("dark", on);

    // cleanup placeholder (only used for "auto")
    let cleanup = undefined;

    if (theme === "light") {
      setDark(false);
    } else if (theme === "dark") {
      setDark(true);
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setDark(mq.matches);

      const onChange = (e: { matches: any; }) => setDark(e.matches);

      // Safari fallback
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else mq.addListener(onChange);

      cleanup = () => {
        if (mq.removeEventListener) mq.removeEventListener("change", onChange);
        else mq.removeListener(onChange);
      };
    }

    localStorage.setItem("theme", theme);
    return () => cleanup?.();
  }, [theme]);

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

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="relative min-h-dvh">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[var(--nature-gradient-from)] via-[var(--nature-gradient-to)] to-[var(--sky-blue-light)] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-52 h-52 bg-[var(--forest-green)] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--sky-blue)] rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </div>

      {/* ✅ Animated Leaves */}
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="fixed text-[var(--forest-green)] opacity-20 pointer-events-none -z-0"
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

      <div className="relative container mx-auto px-6 py-8 pb-16">
        {/* Page Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your BirdVision experience
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Language Options */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-xl p-8 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Language Options
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose how bird names are displayed
                </p>
              </div>
            </div>

            <RadioGroup value={language} onValueChange={setLanguage} className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                <RadioGroupItem value="english" id="english" className={radioItemClass} />
                <Label htmlFor="english" className="flex-1 cursor-pointer text-gray-900 dark:text-white">
                  English Only
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                <RadioGroupItem value="sinhala" id="sinhala" className={radioItemClass} />
                <Label
                  htmlFor="sinhala"
                  className="flex-1 cursor-pointer text-gray-900 dark:text-white font-['Noto_Sans_Sinhala']"
                >
                  සිංහල පමණක් (Sinhala Only)
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                <RadioGroupItem value="both" id="both" className={radioItemClass} />
                <Label htmlFor="both" className="flex-1 cursor-pointer text-gray-900 dark:text-white">
                  Both Languages (English & සිංහල)
                </Label>
              </div>
            </RadioGroup>
          </motion.div>

          {/* Theme Options */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-xl p-8 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Theme Options
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose your preferred color scheme
                </p>
              </div>
            </div>

            <RadioGroup value={theme} onValueChange={setTheme} className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                <RadioGroupItem value="light" id="light" className={radioItemClass} />
                <Label htmlFor="light" className="flex-1 cursor-pointer text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <span>Light Mode</span>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300"></div>
                      <div className="w-6 h-6 rounded-full bg-[var(--sky-blue-light)]"></div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                <RadioGroupItem value="dark" id="dark" className={radioItemClass} />
                <Label htmlFor="dark" className="flex-1 cursor-pointer text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-700"></div>
                      <div className="w-6 h-6 rounded-full bg-[var(--sky-blue)]"></div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                <RadioGroupItem value="auto" id="auto" className={radioItemClass} />
                <Label htmlFor="auto" className="flex-1 cursor-pointer text-gray-900 dark:text-white">
                  Auto (System Preference)
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
          
          {/* Save Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)] hover:opacity-90 transition-opacity shadow-xl px-12"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}