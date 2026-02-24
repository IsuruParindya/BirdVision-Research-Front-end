import { Key, useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, FileImage, Film, Trash2, Play, Pause, Leaf, Bird, Feather } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";

type MediaKind = "image" | "video" | null;

interface DetectionResult {
  name: string;
  sinhalaName: string;
  confidence: number;
  habitat: string;
  conservationStatus: string;
  image?: string;
}

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaKind, setMediaKind] = useState<MediaKind>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [confidence, setConfidence] = useState([75]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // Video controls helpers
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Background leaves
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

  // Create / cleanup preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      setMediaKind(null);
      return;
    }

    const kind: MediaKind = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : null;

    setMediaKind(kind);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Keep play/pause state in sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [previewUrl]);

  const resetAll = () => {
    setFile(null);
    setResult(null);
    setIsAnalyzing(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const onPickFile = (f: File | null) => {
    setResult(null);
    setIsAnalyzing(false);
    setFile(f);
  };

  // Optional helper: capture a frame from video as a Blob (image/jpeg)
  const captureVideoFrame = async (): Promise<Blob | null> => {
    const v = videoRef.current;
    if (!v) return null;

    // Ensure metadata loaded
    if (v.readyState < 2) {
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          v.removeEventListener("loadeddata", onLoaded);
          resolve();
        };
        v.addEventListener("loadeddata", onLoaded);
      });
    }

    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  };

  const analyzeMedia = async () => {
    if (!file || !mediaKind) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // ✅ Here is where you will call your backend/model.
      // For now: mock detection that works for both image and video.

      // Example: if video, capture a frame (so image-based pipeline can run)
      if (mediaKind === "video") {
        await captureVideoFrame();
        // You can send this frame blob to your API instead of the whole video
        // e.g. POST /detect/frame
      } else {
        // For image: you can send file directly
        // e.g. POST /detect/image
      }

      // Fake delay for demo UX
      await new Promise((r) => setTimeout(r, 1200));

      setResult({
        name: "Sri Lanka Blue Magpie",
        sinhalaName: "කැහැටාලිහිණියා",
        confidence: 92.5,
        habitat: "Rainforests and wet zones",
        conservationStatus: "Vulnerable",
        image:
          "https://images.unsplash.com/photo-1713299713432-21f7241ddcc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div className="relative min-h-dvh">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[var(--nature-gradient-from)] via-[var(--nature-gradient-to)] to-[var(--sky-blue-light)] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-52 h-52 bg-[var(--forest-green)] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--sky-blue)] rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </div>

      {/* Floating Feathers */}
      {leaves.map((f: { startX: any; endX: any; duration: any; delay: any; }, i: Key | null | undefined) => (
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

      <div className="container mx-auto px-6 py-8 pb-16">
        {/* Title */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Upload & Analyze</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload an image or a video to identify bird species
          </p>
        </motion.div>

        {/* ✅ Option A: stretch both columns to equal height */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: Upload + Preview */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-xl p-6 border border-white/20 h-full"
          >
            {/* Upload Area */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-xl flex items-center justify-center shadow-lg">
                  <UploadCloud className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Media</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Supports image & video</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="gap-2"
                onClick={resetAll}
                disabled={!file && !result}
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>

            <label className="block">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
              />

              <div className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/15 bg-white/40 dark:bg-slate-900/20 p-6 text-center hover:bg-white/55 dark:hover:bg-slate-900/30 transition">
                <div className="flex items-center justify-center gap-3">
                  <FileImage className="w-6 h-6 text-[var(--forest-green)]" />
                  <Film className="w-6 h-6 text-[var(--sky-blue)]" />
                </div>
                <p className="mt-3 font-medium text-gray-900 dark:text-white">
                  Click to select an image or video
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  JPG, PNG, WEBP, MP4, MOV, WEBM (depending on browser)
                </p>
              </div>
            </label>

            {/* Preview */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Preview</p>
                {file && (
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {mediaKind === "image" ? "Image" : mediaKind === "video" ? "Video" : "Unknown"} • {Math.round(file.size / 1024)} KB
                  </span>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-gray-700 shadow-xl aspect-video">
                {!previewUrl ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No media selected
                  </div>
                ) : mediaKind === "image" ? (
                  <img src={previewUrl} alt="Uploaded preview" className="w-full h-full object-contain bg-black" />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      controls
                      className="w-full h-full object-contain bg-black"
                    />
                    <div className="absolute bottom-3 left-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="gap-2"
                        onClick={toggleVideo}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Confidence */}
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Detection Confidence: {confidence[0]}%
              </label>
              <Slider value={confidence} onValueChange={setConfidence} max={100} step={1} className="w-full" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Only show detections above this threshold.
              </p>
            </div>

            {/* Analyze Button */}
            <div className="mt-6 flex gap-3">
              <Button
                onClick={analyzeMedia}
                disabled={!file || !mediaKind || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)] hover:opacity-90 transition-opacity shadow-lg"
                size="lg"
              >
                <Bird className="w-5 h-5 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2"
                disabled={!file || isAnalyzing}
                onClick={() => onPickFile(null)}
              >
                Remove
              </Button>
            </div>
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-xl p-6 border border-white/20"
          >
            {/* ✅ Option A: sticky content on large screens */}
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-xl flex items-center justify-center shadow-lg">
                  <Bird className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detection Result</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Works for both image and video uploads
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl bg-white/50 dark:bg-slate-700/40 border border-white/20 p-6 text-center text-gray-600 dark:text-gray-300"
                  >
                    {isAnalyzing ? "Analyzing... please wait" : "Upload and click Analyze to see results."}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl bg-white/70 dark:bg-slate-900/30 border border-white/20 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{result.name}</h3>
                        <p className="text-base font-semibold text-[var(--forest-green)] dark:text-[var(--forest-green-light)] font-['Noto_Sans_Sinhala'] mt-1">
                          {result.sinhalaName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Confidence</span>
                        <span className="font-semibold text-[var(--sky-blue)]">{result.confidence}%</span>
                      </div>

                      <div>
                        <span className="text-gray-600 dark:text-gray-300 block mb-0.5">Habitat</span>
                        <p className="text-gray-900 dark:text-white">{result.habitat}</p>
                      </div>

                      <div>
                        <span className="text-gray-600 dark:text-gray-300 block mb-0.5">Conservation Status</span>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium">
                          {result.conservationStatus}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}