"use client";

import { CloseButton, PortalModal } from "@/components";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/url";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, MonitorPlay } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { MediaLightboxProps } from "./type";

export const MediaLightbox = ({
  mediaList,
  currentIndex,
  onChangeIndex,
  onClose,
}: MediaLightboxProps) => {
  const isOpen = currentIndex !== null && mediaList.length > 0;
  const currentMedia = currentIndex !== null ? mediaList[currentIndex] : null;

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onChangeIndex((currentIndex + 1) % mediaList.length);
  }, [currentIndex, mediaList, onChangeIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onChangeIndex((currentIndex - 1 + mediaList.length) % mediaList.length);
  }, [currentIndex, mediaList, onChangeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!currentMedia || currentIndex === null) return null;

  const rawPath = currentMedia.imagePath || currentMedia.url || (currentMedia as any).finalUrl;
  const getFullUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return toPublicUrl(path.replace("*", "orig"));
  };
  const fullUrl = getFullUrl(rawPath);

  const isVideo =
    currentMedia.type?.toUpperCase().includes("VIDEO") ||
    rawPath?.toLowerCase().endsWith(".mp4") ||
    rawPath?.toLowerCase().endsWith(".mov");

  const isPdf =
    currentMedia.type?.toLowerCase().includes("pdf") ||
    rawPath?.toLowerCase().endsWith(".pdf") ||
    rawPath?.toLowerCase().includes(".pdf?");

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[80vw] h-screen"
      className="bg-black/40 backdrop-blur-xl border-none p-0 flex items-center justify-center overflow-hidden z-9999"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center group/container overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-black/80 to-transparent z-50 flex items-start justify-between px-6 pt-6 opacity-0 group-hover/container:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-orange-500 rounded-full" />
            <div>
              <h3 className="text-white text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
                {isVideo && <MonitorPlay size={14} className="text-orange-500" />}
                {isPdf && <MonitorPlay size={14} className="text-orange-500" />}
                {currentMedia.title || currentMedia.name || "Hình ảnh sản phẩm"}
              </h3>
              <p className="text-white/40 text-xs mt-0.5 font-medium tracking-tighter">
                {currentIndex + 1} / {mediaList.length} • {isVideo ? "Video Format" : isPdf ? "PDF Document" : "Chất lượng cao"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(fullUrl, '_blank')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/10"
            >
              <Download size={18} />
            </button>
            <CloseButton onClick={onClose} />
          </div>
        </div>

        {mediaList.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-6 z-60 p-4 text-white/30 hover:text-white bg-white/0 hover:bg-white/5 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/container:opacity-100 -translate-x-4 group-hover/container:translate-x-0"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-6 z-60 p-4 text-white/30 hover:text-white bg-white/0 hover:bg-white/5 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/container:opacity-100 translate-x-4 group-hover/container:translate-x-0"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 cursor-zoom-out"
          onClick={onClose}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(3px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(5px)" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-h-full flex items-center justify-center cursor-default"
            >
              {isVideo ? (
                <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                  <video src={fullUrl} controls autoPlay className="w-full h-full object-contain" />
                </div>
              ) : isPdf ? (
                <div className="w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden bg-white shadow-2xl">
                   <iframe src={fullUrl} className="w-full h-full border-none" title="PDF Viewer" />
                </div>
              ) : (
                <div className="relative group cursor-default">
                  <Image
                    src={fullUrl}
                    alt="Lightbox View"
                    width={1920}
                    height={1080}
                    unoptimized
                    className="relative z-10 max-w-full max-h-[85vh] object-contain rounded-sm"
                    priority
                  />

                  {(currentMedia.thumbnailUrl || currentMedia.previewUrl) && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={currentMedia.thumbnailUrl || currentMedia.previewUrl}
                        alt="Loading placeholder"
                        fill
                        unoptimized
                        className="object-contain rounded-sm blur-md scale-105 opacity-50"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 -z-10 bg-orange-500/10 blur-[100px] opacity-50" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-10 inset-x-0 z-60 px-4 flex justify-center pointer-events-none">
          {mediaList.length > 1 && (
            <div className="pointer-events-auto flex items-center gap-2.5 p-2 bg-black/30 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar max-w-[90vw] transition-all duration-500 hover:bg-black/40">
              {mediaList.map((media, i) => {
                const isActive = i === currentIndex;
                const path = media.thumbUrl || media.thumbnailUrl || media.previewUrl || media.url || media.imagePath;
                const isVideoThumb = media.type?.toUpperCase().includes("VIDEO") ||
                  path?.toLowerCase().includes(".mp4") ||
                  path?.toLowerCase().includes(".webm") ||
                  path?.toLowerCase().includes(".mov");

                const thumbUrl = (path?.startsWith("http") || path?.startsWith("/") ? path : toPublicUrl((path || "").replace("*", "thumb"))) || "/placeholder-product.png";

                return (
                  <button
                    key={i}
                    onClick={() => onChangeIndex(i)}
                    className={cn(
                      "relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shrink-0 transition-all duration-500 border-2",
                      isActive
                        ? "border-orange-500 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        : "border-transparent opacity-50 hover:opacity-100 hover:border-white/20"
                    )}
                  >
                    {isVideoThumb ? (
                      <video
                        src={thumbUrl}
                        muted
                        playsInline
                        autoPlay
                        loop
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-700",
                          isActive ? "scale-100" : "scale-110 hover:scale-100"
                        )}
                      />
                    ) : (
                      <Image
                        src={thumbUrl}
                        alt={`Thumb ${i}`}
                        fill
                        unoptimized
                        className={cn(
                          "object-cover transition-transform duration-700",
                          isActive ? "scale-100" : "scale-110 hover:scale-100"
                        )}
                      />
                    )}
                    {isVideoThumb && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <MonitorPlay size={16} className="text-white drop-shadow-md opacity-80" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PortalModal>
  );
};