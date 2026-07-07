"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Step =
  | "welcome"
  | "template"
  | "camera"
  | "preview"
  | "edit"
  | "final"
  | "email"
  | "success"
  | "gallery";

 type PhotoSlot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type BoothTemplate = {
  id: string;
  name: string;
  description: string;
  count: number;
  emoji: string;
  accent: string;
  frameOverlay?: string;
  previewImage?: string;
  slots: PhotoSlot[];
  canvasWidth: number;
  canvasHeight: number;
};

type GalleryItem = {
  id: string;
  image: string;
  templateName: string;
  createdAt: string;
};

const grid4Slots = [
  { x: 125, y: 250, w: 395, h: 420 },
  { x: 560, y: 250, w: 395, h: 420 },
  { x: 125, y: 715, w: 395, h: 420 },
  { x: 560, y: 715, w: 395, h: 420 }
];

const strip4NarrowSlots = [
  { x: 65, y: 364.4, w: 450, h: 394.2 },
  { x: 565, y: 364.4, w: 450, h: 394.2 },
  { x: 65, y: 882, w: 450, h: 394.2 },
  { x: 565, y: 882, w: 450, h: 394.2 }
];

const strip4Classic = [
  { x: 189, y: 10, w: 298, h: 390 },
  { x: 189, y: 415, w: 298, h: 390 },
  { x: 189, y: 817, w: 298, h: 390 },
  { x: 189, y: 1221, w:298, h: 390 }
];

const strip4Slots = [
  { x: 54, y: 165, w: 432, h: 265 },
  { x: 54, y: 438, w: 432, h: 274 },
  { x: 54, y: 718, w: 432, h: 265 },
  { x: 54, y: 991, w: 432, h: 265 }
];
const fourSlots = [
  { x: 46.7, y: 237.8, w: 453.6, h: 263.7 },
  { x: 46.7, y: 531.3, w: 453.6, h: 263.7 },
  { x: 46.7, y: 824.9, w: 453.6, h: 263.7 },
  { x: 46.7, y: 1118.4, w: 453.6, h: 263.7 }
];
const doubleSlots = [
  { x: 54, y: 252.8, w: 432, h: 311.1 },
  { x: 54, y: 580.3, w: 432, h: 311.1 },
  { x: 54, y: 907.7, w: 432, h: 311.1 }
];

const sixSlots = [
  { x: 135, y: 223, w: 380, h: 352 },
  { x: 575, y: 223, w: 380, h: 352 },
  { x: 135, y: 620, w: 380, h: 352 },
  { x: 575, y: 620, w: 380, h: 352 },
  { x: 135, y: 1017, w:380, h: 352 },
  { x: 575, y: 1017, w:380, h: 352 }
];


const templates: BoothTemplate[] = [
  {
  id: "classic-4",
  name: "Classic 4 Pose",
  description: "4 foto gaya photobooth strip.",
  count: 4,
  emoji: "📸",
  accent: "from-violet-500 to-fuchsia-500",
  frameOverlay: "/frames/frame-classic-4.png",
  previewImage: "/template-previews/classic-preview.png",
  slots: strip4Classic,
  canvasWidth: 540,
  canvasHeight: 1620
  },
  {
  id: "minimal-strip",  
  name: "Pose Grid 4",
  description: "4 foto 2 layer grid.",
  count: 4,
  emoji: "🎞️",
  accent: "from-slate-800 to-slate-500",
  frameOverlay: "/frames/frame-4-orange.png",
  previewImage: "/template-previews/preview-orange.png",
  slots: strip4NarrowSlots,
  canvasWidth: 1080,
  canvasHeight: 1620
  },
  {
  id: "birthday",
  name: "Birthday Frame",
  description: "Frame ceria untuk ulang tahun.",
  count: 4,
  emoji: "🎂",
  accent: "from-pink-500 to-orange-400",
  frameOverlay: "/frames/frame-birtday.png",
  previewImage: "/template-previews/preview-birtday.png",
  slots: fourSlots,
  canvasWidth: 540,
  canvasHeight: 1620
  },
  {
    id: "wedding",
    name: "Wedding Frame",
    description: "2 pose elegan untuk wedding.",
    count: 3,
    emoji: "💍",
    accent: "from-rose-400 to-amber-300",
    frameOverlay: "/frames/frame-wedding.png",
    previewImage: "/template-previews/preview-wedding.png",
    slots: doubleSlots,
    canvasWidth: 540,
    canvasHeight: 1620
  },
  {
    id: "graduation",
    name: "Graduation Frame",
    description: "4 pose untuk wisuda dan kelulusan.",
    count: 4,
    emoji: "🎓",
    accent: "from-blue-600 to-cyan-400",
    frameOverlay: "/frames/frame-graduation.png",
    previewImage: "/template-previews/preview-graduation.png",
    slots: fourSlots,
    canvasWidth: 540,
    canvasHeight: 1620
  },
  {
    id: "couple",
    name: "Couple Frame",
    description: "4 pose manis untuk pasangan/sahabat.",
    count: 4,
    emoji: "🫶",
    accent: "from-purple-500 to-pink-500",
    frameOverlay: "/frames/coople-4.png",
    previewImage: "/template-previews/preview-cat-couple.png",
    slots: strip4Slots,
    canvasWidth: 540,
    canvasHeight: 1620
  },

 {
  id: "cute-grid-6",
  name: "Cute Grid 6",
  description: "Template kawaii pink untuk 6 foto.",
  count: 6,
  emoji: "🐰",
  accent: "from-pink-400 to-rose-400",
  frameOverlay: "/frames/design-frame-6.png",
  previewImage: "/template-previews/preview-6-boneka.png",
  slots: sixSlots,
  canvasWidth: 1080,
  canvasHeight: 1620
}
];
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}


function AppShell({
  children,
  step,
  setStep
}: {
  children: React.ReactNode;
  step: Step;
  setStep: (step: Step) => void;
}) {
  return (
    <main className="snap-page">
      <div className="snap-container">
        <header className="snap-header">
          <button className="snap-brand" onClick={() => setStep("welcome")}>
            <span className="snap-brand-icon">
            {templates.find((item) => item.previewImage)?.previewImage ? (
                    <img
                      src="/template-previews/snapbooth-logo1.png"
                    
                    />
                  ) : (
                    <div className="snap-brand-icon">
                      📸
                    </div>
                  )} 
            </span>
            <span>
              <span className="snap-brand-title">SnapBooth</span>
              <span className="snap-brand-subtitle block">Solusi Untuk Foto</span>
            </span>
          </button>

          <nav className="snap-menu">
            <button
              type="button"
              onClick={() => setStep("template")}
              className={step === "template" ? "active" : ""}
            >
              Template
            </button>

            <button
              type="button"
              onClick={() => setStep("gallery")}
              className={step === "gallery" ? "active" : ""}
            >
              Galeri
            </button>
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}

function StatCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

export default function Home() {
  const [step, setStepState] = useState<Step>("welcome");

const setStep = (nextStep: Step) => {
  setStepState(nextStep);

  if (typeof window !== "undefined") {
    const currentHash = window.location.hash.replace("#", "");

    if (currentHash !== nextStep) {
      window.history.pushState({ step: nextStep }, "", `#${nextStep}`);
    }
  }
};
  const [selectedTemplate, setSelectedTemplate] = useState<BoothTemplate>(templates[0]);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [finalImage, setFinalImage] = useState("");
  const [filter, setFilter] = useState("normal");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [overlayText, setOverlayText] = useState("SnapBooth Moment");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const finalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const templateTopRef = useRef<HTMLDivElement | null>(null);
  
useEffect(() => {
  const validSteps: Step[] = [
    "welcome",
    "template",
    "camera",
    "preview",
    "edit",
    "final",
    "email",
    "success",
    "gallery"
  ];

  const hashStep = window.location.hash.replace("#", "") as Step;
  const initialStep = validSteps.includes(hashStep) ? hashStep : "welcome";

  setStepState(initialStep);
  window.history.replaceState({ step: initialStep }, "", `#${initialStep}`);
  
  const handleBackButton = (event: PopStateEvent) => {
    const nextStep = event.state?.step as Step | undefined;

    if (nextStep && validSteps.includes(nextStep)) {
      setStepState(nextStep);
      return;
    }

    const hashStep = window.location.hash.replace("#", "") as Step;
    setStepState(validSteps.includes(hashStep) ? hashStep : "welcome");
  };

  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, []);

  const progressText = useMemo(() => {
    if (isShooting) return `Foto ${currentPhotoIndex + 1} dari ${selectedTemplate.count}`;
    return `${capturedPhotos.length} dari ${selectedTemplate.count} foto`;
  }, [capturedPhotos.length, currentPhotoIndex, isShooting, selectedTemplate.count]);

  useEffect(() => {
    const raw = localStorage.getItem("snapbooth-gallery");
    if (raw) {
      try {
        setGallery(JSON.parse(raw));
      } catch {
        setGallery([]);
      }
    }
  }, []);

  useEffect(() => {
    if (step !== "camera") {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function openCamera() {
      setCameraError("");
      setCameraReady(false);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Browser belum mendukung akses kamera.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: false
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (error) {
        setCameraError(
          error instanceof Error
            ? error.message
            : "Kamera gagal diaktifkan. Pastikan izin kamera diberikan dan gunakan localhost/HTTPS."
        );
      }
    }

    openCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [step]);

  useEffect(() => {
  if (step === "edit" && capturedPhotos.length > 0) {
    setFinalImage("");

    generateFinalImage()
      .then((image) => setFinalImage(image))
      .catch((error) => {
        console.error(error);
        alert("Preview gagal dibuat. Cek nama file frame dan folder public/frames.");
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, filter, brightness, contrast, overlayText, selectedTemplate.id]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }

  function resetSession() {
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    setCountdown(null);
    setIsShooting(false);
    setFinalImage("");
    setEmailStatus("");
  }

  async function runCountdown() {
    for (let number = 3; number >= 1; number--) {
      setCountdown(number);
      await wait(800);
    }
    setCountdown(0);
    await wait(250);
    setCountdown(null);
  }

  function capturePhotoFromCamera() {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return "";

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.92);
  }

  function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("File tidak bisa dibaca"));
      }
    };

    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

async function handleUploadPhotos(event: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(event.target.files ?? []).filter((file) =>
    file.type.startsWith("image/")
  );

  if (files.length === 0) return;

  const maxPhoto = selectedTemplate.count;
  const availableSlot = maxPhoto - capturedPhotos.length;

  if (availableSlot <= 0) {
    alert("Slot foto sudah penuh. Klik Retake jika ingin mengganti foto.");
    event.target.value = "";
    return;
  }

  const selectedFiles = files.slice(0, availableSlot);

  try {
    const uploadedPhotos = await Promise.all(
      selectedFiles.map((file) => fileToDataUrl(file))
    );

    const newPhotos = [...capturedPhotos, ...uploadedPhotos].slice(0, maxPhoto);

    setCapturedPhotos(newPhotos);

    if (newPhotos.length >= maxPhoto) {
      setStep("preview");
    }
  } catch (error) {
    console.error(error);
    alert("Gagal upload foto. Pastikan file yang dipilih adalah gambar.");
  } finally {
    event.target.value = "";
  }
}

  async function startPhotoSession() {
    if (!cameraReady) {
      setCameraError("Kamera belum siap. Tunggu sebentar atau izinkan akses kamera.");
      return;
    }

    setIsShooting(true);
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    const results: string[] = [];

    for (let index = 0; index < selectedTemplate.count; index++) {
      setCurrentPhotoIndex(index);
      await runCountdown();
      const image = capturePhotoFromCamera();
      if (image) {
        results.push(image);
        setCapturedPhotos([...results]);
      }
      await wait(650);
    }

    setIsShooting(false);
    setCountdown(null);
    setStep("preview");
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error(`Gagal memuat gambar: ${src}`));
    };

    image.src = src;
  });
}

  function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawImageCover(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 26
  ) {
    const imageRatio = image.width / image.height;
    const boxRatio = width / height;
    let sourceWidth = image.width;
    let sourceHeight = image.height;
    let sourceX = 0;
    let sourceY = 0;

    if (imageRatio > boxRatio) {
      sourceWidth = image.height * boxRatio;
      sourceX = (image.width - sourceWidth) / 2;
    } else {
      sourceHeight = image.width / boxRatio;
      sourceY = (image.height - sourceHeight) / 2;
    }

    ctx.save();
    roundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
    ctx.restore();

    ctx.save();
    roundedRect(ctx, x, y, width, height, radius);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.stroke();
    ctx.restore();
  }

  function getSlots(templateId: string) {
  const template = templates.find((item) => item.id === templateId);
  return template?.slots ?? templates[0].slots;
}

  function getCanvasFilter() {
    const base = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (filter === "bw") return `${base} grayscale(1)`;
    if (filter === "warm") return `${base} sepia(0.35) saturate(1.25)`;
    if (filter === "cool") return `${base} hue-rotate(180deg) saturate(1.1)`;
    if (filter === "vintage") return `${base} sepia(0.65) contrast(1.1)`;
    return base;
  }

  function drawTemplateDecoration(ctx: CanvasRenderingContext2D, template: BoothTemplate) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    roundedRect(ctx, 80, 80, 920, 1460, 48);
    ctx.fill();

    const topGradient = ctx.createLinearGradient(100, 100, 980, 160);
    topGradient.addColorStop(0, "#7C3AED");
    topGradient.addColorStop(1, "#EC4899");
    ctx.fillStyle = topGradient;
    roundedRect(ctx, 125, 120, 830, 95, 30);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${template.emoji} ${template.name}`, 540, 180);

    ctx.fillStyle = "rgba(17, 24, 39, 0.72)";
    ctx.font = "bold 34px Arial";
    ctx.fillText(overlayText || "SnapBooth Moment", 540, 1300);

    ctx.fillStyle = "rgba(124, 58, 237, 0.14)";
    ctx.beginPath();
    ctx.arc(120, 1420, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(236, 72, 153, 0.18)";
    ctx.beginPath();
    ctx.arc(950, 1425, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(17, 24, 39, 0.38)";
    ctx.font = "24px Arial";
    ctx.fillText(new Date().toLocaleDateString("id-ID"), 540, 1450);
    ctx.restore();
  }

  async function generateFinalImage() {
  const canvas = finalCanvasRef.current || document.createElement("canvas");
  canvas.width = selectedTemplate.canvasWidth;
  canvas.height = selectedTemplate.canvasHeight;

  function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
  ) {
  const imageRatio = image.width / image.height;
  const slotRatio = w / h;

  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imageRatio > slotRatio) {
    // Foto terlalu lebar, crop kiri-kanan
    sw = image.height * slotRatio;
    sx = (image.width - sw) / 2;
  } else {
    // Foto terlalu tinggi, crop atas-bawah
    sh = image.width / slotRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, "#F5F3FF");
  bg.addColorStop(0.48, "#FDF2F8");
  bg.addColorStop(1, "#F0F2FE");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!selectedTemplate.frameOverlay) {
    drawTemplateDecoration(ctx, selectedTemplate);
  }

  const slots = selectedTemplate.slots;

  // gambar foto ke slots
  for (let i = 0; i < Math.min(capturedPhotos.length, slots.length); i++) {
    const photo = capturedPhotos[i];
    const slot = slots[i];

    const image = await loadImage(photo);
    ctx.save();
    
    ctx.filter = getCanvasFilter();
    drawImageCover(ctx, image, slot.x, slot.y, slot.w, slot.h);
    ctx.restore();
  }

  if (selectedTemplate.frameOverlay) {
    const frameImage = await loadImage(selectedTemplate.frameOverlay);
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  }

  return canvas.toDataURL("image/png");
}

 function compressGalleryImage(
  dataUrl: string,
  maxWidth = 520,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const ratio = Math.min(1, maxWidth / image.width);

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas tidak tersedia"));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    image.onerror = () => reject(new Error("Gagal memuat gambar untuk galeri"));
    image.src = dataUrl;
  });
}

async function saveToLocalGallery(image: string) {
  try {
    const compressedImage = await compressGalleryImage(image);

    const item: GalleryItem = {
      id: crypto.randomUUID(),
      image: compressedImage,
      templateName: selectedTemplate.name,
      createdAt: new Date().toISOString()
    };

    const updated = [item, ...gallery].slice(0, 6);

    setGallery(updated);

    try {
      localStorage.setItem("snapbooth-gallery", JSON.stringify(updated));
    } catch (error) {
      console.error(error);

      const reduced = [item, ...gallery].slice(0, 3);
      setGallery(reduced);

      try {
        localStorage.setItem("snapbooth-gallery", JSON.stringify(reduced));
      } catch {
        localStorage.removeItem("snapbooth-gallery");
        setGallery([item]);
        localStorage.setItem("snapbooth-gallery", JSON.stringify([item]));
      }
    }
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan foto ke galeri.");
  }
}

  function deleteGalleryItem(id: string) {
  const confirmDelete = window.confirm("Yakin ingin menghapus foto ini dari galeri?");

  if (!confirmDelete) return;

  const updated = gallery.filter((item) => item.id !== id);

  setGallery(updated);
  localStorage.setItem("snapbooth-gallery", JSON.stringify(updated));
}

  async function useFinalResult(nextStep: Step = "final") {
    if (capturedPhotos.length === 0) return;
    const image = await generateFinalImage();
    setFinalImage(image);
    saveToLocalGallery(image);
    setStep(nextStep);
  }

  function downloadFinalImage(image = finalImage) {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `snapbooth-${Date.now()}.jpg`;
    link.click();
  }

  function printFinalImage() {
    if (!finalImage) return;
    const printWindow = window.open("", "_blank", "width=900,height=900");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print SnapBooth</title>
          <style>
            body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: white; }
            img { max-width: 95vw; max-height: 95vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${finalImage}" alt="SnapBooth Result" />
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 400); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  async function sendEmail() {
    setEmailStatus("");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setEmailStatus("Format email tidak valid.");
      return;
    }
    if (!finalImage) {
      setEmailStatus("Foto final belum tersedia.");
      return;
    }

    setEmailLoading(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, imageData: finalImage })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim email.");
      }
      setEmailStatus("Foto berhasil dikirim ke email.");
      setStep("success");
    } catch (error) {
      setEmailStatus(error instanceof Error ? error.message : "Gagal mengirim email.");
    } finally {
      setEmailLoading(false);
    }
  }

  function handleSelectTemplate(template: BoothTemplate) {
  setSelectedTemplate(template);

  setTimeout(() => {
    templateTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
  }

  return (
    <AppShell step={step} setStep={setStep}>
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUploadPhotos}
      />
      {step === "welcome" && (
        <div>
          <section className="snap-hero">
            <div>
              <span className="snap-badge">✨ Photobooth Web App</span>

              <h1 className="snap-title">
                Capture Your <span>Sweet Moment</span>
              </h1>

              <p className="snap-subtitle">
                Buat momen foto yang lucu, aesthetic, dan siap dibagikan. Pilih template favorit,
                ambil foto dari kamera atau upload dari galeri, lalu download, print, atau kirim ke email.
              </p>

              <div className="snap-actions">
                <button
                  type="button"
                  onClick={() => setStep("template")}
                  className="snap-primary-btn"
                >
                  Mulai Foto
                </button>

                <button
                  type="button"
                  onClick={() => setStep("gallery")}
                  className="snap-secondary-btn"
                >
                  Lihat Galeri
                </button>
              </div>

              <div className="snap-stats">
                <div className="snap-stat-card">
                  <p className="snap-stat-label">Template</p>
                  <p className="snap-stat-value">{templates.length}+</p>
                  <p className="text-sm text-slate-500">Pilihan frame</p>
                </div>

                <div className="snap-stat-card">
                  <p className="snap-stat-label">Output</p>
                  <p className="snap-stat-value">PNG</p>
                  <p className="text-sm text-slate-500">Siap download</p>
                </div>

                <div className="snap-stat-card">
                  <p className="snap-stat-label">Share</p>
                  <p className="snap-stat-value">Email</p>
                  <p className="text-sm text-slate-500">Kirim hasil foto</p>
                </div>
              </div>
            </div>

            <div className="snap-hero-preview">
              <div className="snap-preview-phone">
                <div className="snap-preview-inner">
                  {templates.find((item) => item.previewImage)?.previewImage ? (
                    <img
                      src="/template-previews/preview.png"
                      alt="Preview template SnapBooth"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-7xl">
                      📸
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {step === "template" && (
        <div>
           <div ref={templateTopRef} className="snap-section-head">
            <div>
              <p className="snap-section-kicker">Step 1 · Choose Template</p>
              <h2 className="snap-section-title">Pilih Template Favoritmu</h2>
              <p className="snap-section-desc">
                Pilih frame sesuai konsep foto kamu. Template bisa berupa strip 540 x 1620
                atau grid 1080 x 1620 untuk 6 foto.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetSession();
                setStep("camera");
              }}
              className="snap-primary-btn"
            >
              Lanjutkan
            </button>
          </div>

          <div className="template-grid">
            {templates.map((template) => {
              const selected = selectedTemplate.id === template.id;

              return (
                <article
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`template-card ${selected ? "selected" : ""}`}
                >
                  <div className="template-preview">
                    {template.previewImage ? (
                      <img src={template.previewImage} alt={template.name} />
                    ) : (
                      <div className={`template-fallback bg-gradient-to-br ${template.accent}`}>
                        {template.emoji}
                      </div>
                    )}
                  </div>

                  <div className="template-info">
                    <div className="template-top">
                      <h3 className="template-title">{template.name}</h3>
                      <span className="template-count">{template.count} Foto</span>
                    </div>

                    <p className="template-description">{template.description}</p>

                    <div className="template-footer">
                      <span className="template-status">
                        {selected ? "Template dipilih" : "Klik untuk pilih"}
                      </span>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSelectTemplate(template);
                        }}
                        className="template-select-btn"
                      >
                        Pilih
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {step === "camera" && (
        <div className="snap-workspace">
          <section className="snap-panel">
            <p className="snap-section-kicker">Step 2 · Camera</p>
            <h2 className="snap-panel-title">Ambil Foto</h2>
            <p className="snap-panel-desc">
              Gunakan kamera untuk mengambil foto otomatis dengan countdown, atau upload foto dari galeri.
            </p>

            <div className="camera-box">
              <video
                ref={videoRef}
                className="camera-mirror"
                playsInline
                muted
              />

              {!cameraReady && !cameraError && (
                <div className="camera-overlay">
                  <div>
                    <p className="text-5xl">📷</p>
                    <p className="mt-4 text-xl font-black">Mengaktifkan kamera...</p>
                    <p className="mt-2 text-sm text-slate-200">
                      Pastikan izin kamera sudah diberikan di browser.
                    </p>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="camera-overlay">
                  <div>
                    <p className="text-5xl">⚠️</p>
                    <p className="mt-4 text-xl font-black">Kamera gagal aktif</p>
                    <p className="mt-2 max-w-lg text-sm text-slate-200">{cameraError}</p>
                  </div>
                </div>
              )}

              {countdown !== null && (
                <div className="camera-overlay">
                  <div className="countdown-number">
                    {countdown === 0 ? "📸" : countdown}
                  </div>
                </div>
              )}
            </div>

            <div className="camera-footer">
              <div className="snap-progress">
                <span>✨</span>
                <span>{progressText}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={startPhotoSession}
                  disabled={!cameraReady || isShooting}
                >
                  {isShooting ? "Sedang Foto..." : "Mulai Foto"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => uploadInputRef.current?.click()}
                  disabled={isShooting}
                >
                  Upload Galeri
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    resetSession();
                    setStep("template");
                  }}
                  disabled={isShooting}
                >
                  Kembali
                </Button>
              </div>
            </div>

            <canvas ref={captureCanvasRef} className="hidden" />
          </section>

          <aside className="snap-panel">
            <p className="snap-section-kicker">Template Aktif</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              {selectedTemplate.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {selectedTemplate.description}
            </p>

            <div className="side-template-preview">
              {selectedTemplate.previewImage ? (
                <img src={selectedTemplate.previewImage} alt={selectedTemplate.name} />
              ) : (
                <div className={`side-template-fallback bg-gradient-to-br ${selectedTemplate.accent}`}>
                  {selectedTemplate.emoji}
                </div>
              )}
            </div>

            <div className={`photo-slot-grid ${selectedTemplate.count === 6 ? "six" : "four"}`}>
              {Array.from({ length: selectedTemplate.count }).map((_, index) => (
                <div
                  key={index}
                  className={`photo-slot-item ${capturedPhotos[index] ? "done" : ""}`}
                >
                  {capturedPhotos[index] ? "✓" : index + 1}
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {step === "preview" && (
        <div className="snap-workspace">
          <section className="snap-panel">
            <p className="snap-section-kicker">Step 3 · Preview</p>
            <h2 className="snap-panel-title">Preview Foto</h2>
            <p className="snap-panel-desc">
              Cek dulu hasil fotonya. Kalau sudah cocok, lanjut ke halaman edit.
            </p>

            <div className="preview-grid">
              {capturedPhotos.map((photo, index) => (
                <div key={photo} className="preview-card">
                  <img src={photo} alt={`Foto ${index + 1}`} />
                  <div className="preview-card-footer">Foto {index + 1}</div>
                </div>
              ))}
            </div>
          </section>

          <aside className="snap-panel">
            <p className="snap-section-kicker">Next Action</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              Gunakan hasil ini?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kamu bisa ulangi foto, tambah foto dari galeri, edit, atau langsung generate hasil final.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => {
                  resetSession();
                  setStep("camera");
                }}
                className="snap-secondary-btn"
              >
                Retake Foto
              </Button>

              <Button 
                type="button" 
                onClick={() => setStep("edit")}
                className="snap-edit-btn"
              >
                Edit Foto
              </Button>

              <Button 
                type="button" 
                onClick={() => useFinalResult("final")}
                className="snap-primary-btn"
              >
                Gunakan Hasil Ini
              </Button>
            </div>
          </aside>
        </div>
      )}

      {step === "edit" && (
        <div className="snap-workspace">
          <section className="snap-panel">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="snap-section-kicker">Step 4 · Edit</p>
                <h2 className="snap-panel-title">Edit Foto</h2>
                <p className="snap-panel-desc">
                  Atur filter, brightness, contrast, teks, dan ganti frame sebelum hasil final.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter("normal");
                    setBrightness(100);
                    setContrast(100);
                    setOverlayText("SnapBooth Moment");
                  }}
                >
                  Reset
                </Button>

                <Button onClick={() => useFinalResult("final")}>
                  Simpan Edit
                </Button>
              </div>
            </div>

            <div className="edit-preview-box">
              <div className="edit-preview-frame">
                {finalImage ? (
                  <img src={finalImage} alt="Preview Final" />
                ) : (
                  <div className="edit-loading">
                    Membuat preview...
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="snap-panel">
            <p className="snap-section-kicker">Editor Panel</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              Pengaturan Foto
            </h3>

            <div className="editor-group">
              <label className="editor-label">Filter</label>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="editor-select"
              >
                <option value="normal">Normal</option>
                <option value="bw">Black & White</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="vintage">Vintage</option>
              </select>
            </div>

            <div className="editor-group">
              <label className="editor-label">Brightness: {brightness}%</label>
              <input
                type="range"
                min="60"
                max="140"
                value={brightness}
                onChange={(event) => setBrightness(Number(event.target.value))}
                className="editor-range"
              />
            </div>

            <div className="editor-group">
              <label className="editor-label">Contrast: {contrast}%</label>
              <input
                type="range"
                min="60"
                max="160"
                value={contrast}
                onChange={(event) => setContrast(Number(event.target.value))}
                className="editor-range"
              />
            </div>

            <div className="editor-group">
              <label className="editor-label">Teks Foto</label>
              <input
                value={overlayText}
                onChange={(event) => setOverlayText(event.target.value)}
                placeholder="Contoh: Happy Graduation"
                className="editor-input"
              />
            </div>

            <div className="editor-group">
              <label className="editor-label">Ganti Frame</label>

              <div className="editor-template-grid">
                {templates.map((template) => {
                  const active = selectedTemplate.id === template.id;
                  const disabled = template.count > capturedPhotos.length;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedTemplate(template)}
                      className={`editor-template-card ${active ? "active" : ""} ${
                        disabled ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      {template.previewImage ? (
                        <img src={template.previewImage} alt={template.name} />
                      ) : (
                        <div className={`side-template-fallback h-[92px] rounded-2xl bg-gradient-to-br ${template.accent}`}>
                          {template.emoji}
                        </div>
                      )}

                      <p className="editor-template-name">{template.name}</p>
                      <p className="text-xs text-slate-400">{template.count} Foto</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <canvas ref={finalCanvasRef} className="hidden" />
          </aside>
        </div>
      )}

      {step === "final" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">Final Result</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Foto kamu sudah siap!</h2>
            <p className="mt-2 text-slate-600">Pilih output: download, print, atau kirim ke email.</p>
            <div className="mt-8 flex justify-center">
              <div className="print-area rounded-[2rem] bg-white p-4 shadow-2xl">
                {finalImage && <img src={finalImage} alt="Final Result" className="max-h-[760px] rounded-[1.5rem] object-contain" />}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur">
            <h3 className="text-2xl font-black text-slate-950">Output Foto</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Hasil foto final sudah dibuat dalam format JPG.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={() => downloadFinalImage()}>Download Foto</Button>
              <Button variant="secondary" onClick={printFinalImage}>Print Foto</Button>
              <Button variant="outline" onClick={() => setStep("email")}>Kirim ke Email</Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetSession();
                  setStep("template");
                }}
              >
                Ambil Foto Lagi
              </Button>
            </div>
          </aside>
        </div>
      )}

      {step === "email" && (
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur">
            {finalImage && <img src={finalImage} alt="Final Result" className="rounded-[1.5rem] shadow-lg" />}
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-600">Send Email</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Kirim Foto ke Email</h2>
            <p className="mt-2 text-slate-600">Masukkan email tujuan, lalu sistem akan mengirim foto sebagai lampiran.</p>
            <label className="mt-8 block">
              <span className="text-sm font-bold text-slate-700">Email Tujuan</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            {emailStatus && (
              <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{emailStatus}</div>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={sendEmail} disabled={emailLoading}>
                {emailLoading ? "Mengirim..." : "Kirim Foto"}
              </Button>
              <Button variant="outline" onClick={() => setStep("final")}>Kembali</Button>
            </div>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/90 p-10 text-center shadow-soft backdrop-blur">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-green-100 text-5xl">✓</div>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950">Foto berhasil dikirim!</h2>
          <p className="mt-3 text-slate-600">Hasil photobooth kamu sudah dikirim ke email tujuan.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => setStep("welcome")}>Kembali ke Home</Button>
            <Button
              variant="outline"
              onClick={() => {
                resetSession();
                setStep("template");
              }}
            >
              Ambil Foto Lagi
            </Button>
          </div>
        </div>
      )}

      {step === "gallery" && (
        <div>
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-600">Local Gallery</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Galeri Foto</h2>
              <p className="mt-2 text-slate-600">Riwayat foto disimpan sementara di browser kamu.</p>
            </div>
            <Button onClick={() => setStep("template")}>Buat Foto Baru</Button>
          </div>

          {gallery.length === 0 ? (
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-12 text-center shadow-soft backdrop-blur">
              <p className="text-5xl">🖼️</p>
              <h3 className="mt-4 text-2xl font-black text-slate-950">Belum ada foto</h3>
              <p className="mt-2 text-slate-500">Mulai sesi photobooth untuk menambahkan foto ke galeri.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gallery.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft">
                  <img src={item.image} alt={item.templateName} className="aspect-[3/4] w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-black text-slate-950">{item.templateName}</h3>
                    <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("id-ID")}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button className="px-3 py-2 text-xs" onClick={() => downloadFinalImage(item.image)}>
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        className="px-3 py-2 text-xs"
                        onClick={() => {
                          setFinalImage(item.image);
                          setStep("email");
                        }}
                      >
                        Email
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-2 text-xs"
                        onClick={() => deleteGalleryItem(item.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
