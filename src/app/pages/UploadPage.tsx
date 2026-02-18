import { useState, useRef, useEffect, useMemo } from "react";
import {Upload,Image as ImageIcon,Video as VideoIcon,X,Volume2,Leaf,}
from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";

interface DetectionResult {
  name: string;
  sinhalaName: string;
  confidence: number;
  habitat: string;
  conservationStatus: string;
  image: string;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Viewport size for floating leaves animation (avoids window usage in render)
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

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile(e.target?.result as string);
      setIsProcessing(true);

      // Mock detection process
      setTimeout(() => {
        setDetection({
          name: "Oriental White-eye",
          sinhalaName: "ඇස්කිළිලියා",
          confidence: 87.3,
          habitat: "Gardens and forest edges",
          conservationStatus: "Least Concern",
          image:
            "https://images.unsplash.com/photo-1656590277881-68a65ee8eb1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJpcmQlMjBuYXR1cmUlMjBmb3Jlc3R8ZW58MXx8fHwxNzcxMzE0NDY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          boundingBox: { x: 30, y: 25, width: 40, height: 50 },
        });
        setIsProcessing(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setFileName("");
    setDetection(null);
    setIsProcessing(false);
  };

  const playAudio = () => {
    const speech = new SpeechSynthesisUtterance(detection?.sinhalaName || "");
    speech.lang = "si-LK";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="relative min-h-dvh">
      {/* ✅ Full viewport background (no white gaps) */}
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

      {/* Page Content */}
      <div className="relative container mx-auto px-6 py-8 pb-16">
        {/* Page Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Upload & Detect
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload an image or video to identify bird species
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {!uploadedFile ? (
            /* Upload Area */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-2xl border-4 border-dashed transition-all cursor-pointer overflow-hidden ${
                isDragging
                  ? "border-[var(--sky-blue)] bg-[var(--sky-blue)]/10 scale-[1.02]"
                  : "border-gray-300 dark:border-gray-600 hover:border-[var(--forest-green)]"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-16 text-center">
                <motion.div
                  animate={{ y: isDragging ? -10 : 0 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-2xl flex items-center justify-center shadow-xl">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  Drag and drop your file here
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  or click to browse your files
                </p>

                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm">Images</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <VideoIcon className="w-5 h-5" />
                    <span className="text-sm">Videos</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)] hover:opacity-90 transition-opacity shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </motion.div>
          ) : (
            /* Preview and Detection Area */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              {/* Preview Card */}
              <div className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--forest-green)] to-[var(--sky-blue)] rounded-lg flex items-center justify-center">
                      {fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <ImageIcon className="w-5 h-5 text-white" />
                      ) : (
                        <VideoIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{fileName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded file</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearUpload}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </Button>
                </div>

                {/* Image Preview with Bounding Box */}
                <div className="relative aspect-video bg-black">
                  <img
                    src={uploadedFile}
                    alt="Uploaded content"
                    className="w-full h-full object-contain"
                  />

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--sky-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white font-medium">Processing image...</p>
                      </div>
                    </div>
                  )}

                  {/* Bounding Box */}
                  <AnimatePresence>
                    {detection && !isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute border-4 border-[var(--detection-blue)] rounded-lg"
                        style={{
                          left: `${detection.boundingBox.x}%`,
                          top: `${detection.boundingBox.y}%`,
                          width: `${detection.boundingBox.width}%`,
                          height: `${detection.boundingBox.height}%`,
                          boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)",
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
                </div>
              </div>

              {/* Detection Results */}
              <AnimatePresence>
                {detection && !isProcessing && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    className="backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-3xl shadow-2xl p-8 border border-white/20"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      {/* Bird Thumbnail */}
                      <img
                        src={detection.image}
                        alt={detection.name}
                        className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                      />

                      {/* Bird Info */}
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {detection.name}
                        </h2>
                        <p className="text-4xl font-semibold text-[var(--forest-green)] dark:text-[var(--forest-green-light)] font-['Noto_Sans_Sinhala'] mb-6">
                          {detection.sinhalaName}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">
                              Confidence
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${detection.confidence}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)]"
                                />
                              </div>
                              <span className="font-bold text-[var(--sky-blue)]">
                                {detection.confidence}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">
                              Conservation Status
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                              {detection.conservationStatus}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="text-sm text-gray-600 dark:text-gray-300 block mb-2">
                            Habitat
                          </span>
                          <p className="text-gray-900 dark:text-white">{detection.habitat}</p>
                        </div>

                        <Button
                          onClick={playAudio}
                          size="lg"
                          className="bg-gradient-to-r from-[var(--forest-green)] to-[var(--sky-blue)] hover:opacity-90 transition-opacity shadow-lg"
                        >
                          <Volume2 className="w-5 h-5 mr-2" />
                          Play Sinhala Pronunciation
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}