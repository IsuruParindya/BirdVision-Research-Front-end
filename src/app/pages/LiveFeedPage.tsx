import { useState, useRef, useEffect, useMemo } from "react";
import { Camera, CameraOff, Aperture, Bird, Volume2, Feather } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";

interface DetectedBird {
  name: string;
  sinhalaName: string;
  confidence: number;
  habitat: string;
  conservationStatus: string;
  image: string;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export function LiveFeedPage() {
  const [isActive, setIsActive] = useState(false);
  const [detectedBird, setDetectedBird] = useState<DetectedBird | null>(null);
  const [confidence, setConfidence] = useState([75]);
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);
  const videoRef = useRef<HTMLDivElement>(null);

  // Handle viewport dimensions
  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth || 1200);
      setVh(window.innerHeight || 800);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Floating feathers positions
  const feathers = useMemo(
    () =>
      [...Array(6)].map(() => ({
        startX: Math.random() * vw,
        endX: Math.random() * vw,
        duration: 18 + Math.random() * 8,
        delay: Math.random() * 5,
      })),
    [vw]
  );

  // Mock detection
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setDetectedBird({
          name: "Sri Lanka Blue Magpie",
          sinhalaName: "කැහැටාලිහිණියා",
          confidence: 92.5,
          habitat: "Rainforests and wet zones",
          conservationStatus: "Vulnerable",
          image:
            "https://images.unsplash.com/photo-1713299713432-21f7241ddcc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=figma&utm_medium=referral",
          boundingBox: { x: 25, y: 20, width: 50, height: 60 },
        });
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setDetectedBird(null);
    }
  }, [isActive]);

  const startCamera = () => setIsActive(true);
  const stopCamera = () => setIsActive(false);

  const playAudio = () => {
    const speech = new SpeechSynthesisUtterance(detectedBird?.sinhalaName || "");
    speech.lang = "si-LK";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="relative min-h-dvh">
      {/* ✅ Full-viewport background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[var(--nature-gradient-from)] via-[var(--nature-gradient-to)] to-[var(--sky-blue-light)] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-52 h-52 bg-[var(--forest-green)] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--sky-blue)] rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </div>

      {/* Floating Feathers */}
      {feathers.map((f, i) => (
        <motion.div
          key={i}
          className="fixed text-[var(--forest-green)] opacity-20 pointer-events-none"
          style={{ left: 0, top: 0 }}
          initial={{ y: -120, x: f.startX, rotate: 0 }}
          animate={{ y: vh + 140, x: f.endX, rotate: 360 }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: "linear" }}
        >
          <Feather className="w-6 h-6" />
        </motion.div>
      ))}

      {/* Page Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Live Bird Detection</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Point your camera at birds to identify them in real-time
          </p>
        </motion.div>

        {/* Camera Feed */}
        <div className="w-full max-w-[700px] mx-auto px-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            <div
              ref={videoRef}
              className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative"
            >
              {!isActive ? (
                <div className="text-center text-gray-400">
                  <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Camera is off</p>
                  <p className="text-sm mt-2">Click "Start Camera" to begin detection</p>
                </div>
              ) : (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1626003922358-12d5b6c9f756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Camera feed"
                    className="w-full h-full object-cover"
                  />

                  {/* Bounding Box */}
                  <AnimatePresence>
                    {detectedBird && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute border-4 border-[var(--detection-blue)] rounded-lg shadow-lg"
                        style={{
                          left: `${detectedBird.boundingBox.x}%`,
                          top: `${detectedBird.boundingBox.y}%`,
                          width: `${detectedBird.boundingBox.width}%`,
                          height: `${detectedBird.boundingBox.height}%`,
                          boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 border-4 border-[var(--detection-blue)]"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ✅ Sinhala Name OUTSIDE the card (overlay near bounding box) */}
                  <AnimatePresence>
                    {detectedBird && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-20"
                        style={{
                          left: `${detectedBird.boundingBox.x}%`,
                          top: `calc(${detectedBird.boundingBox.y}% - 40px)`,
                        }}
                      >
                        <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-black/55 border border-white/15 shadow-lg">
                          <span className="text-base font-semibold text-white font-['Noto_Sans_Sinhala']">
                            {detectedBird.sinhalaName}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {!isActive ? (
                  <Button
                    onClick={startCamera}
                    size="lg"
                    className="bg-gradient-to-r from-[var(--forest-green)] to-[var(--forest-green-light)] hover:opacity-90 transition-opacity shadow-lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} size="lg" variant="destructive" className="shadow-lg">
                    <CameraOff className="w-5 h-5 mr-2" />
                    Stop Camera
                  </Button>
                )}

                <Button
                  disabled={!isActive}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[var(--sky-blue)] text-[var(--sky-blue)] hover:bg-[var(--sky-blue)] hover:text-white dark:border-[var(--sky-blue-light)] dark:text-[var(--sky-blue-light)] shadow-lg disabled:opacity-50"
                >
                  <Aperture className="w-5 h-5 mr-2" />
                  Capture Snapshot
                </Button>
              </div>

              {/* Confidence Slider */}
              <div className="flex-1 min-w-[200px] max-w-md">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Detection Confidence: {confidence[0]}%
                </label>
                <Slider value={confidence} onValueChange={setConfidence} max={100} step={1} className="w-full" />
              </div>
            </div>
          </div>

          {/* Info Banner */}
          {isActive && !detectedBird && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 shadow-lg border border-white/20">
                <Bird className="w-5 h-5 text-[var(--forest-green)] animate-pulse" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Scanning for birds...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}