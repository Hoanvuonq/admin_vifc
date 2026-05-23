"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Globe,
  Layout,
  Lock,
  Plus,
  Trash2,
  Video as VideoIcon,
  File
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MediaLightbox } from "../MediaLightbox";
import { CustomFile, MediaUploadFieldProps } from "./type";

export const MediaUploadField: React.FC<
  MediaUploadFieldProps & {
    onUploadApi?: (file: File, onProgress: (p: number) => void) => Promise<any>;
    mode?: "public" | "private";
    isBanner?: boolean;
    isVideo?: boolean;
    isPost?: boolean;
  }
> = ({
  value = [],
  onChange,
  maxCount = 1,
  size = "md",
  allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/quicktime"],
  maxSizeMB = 50,
  className,
  classNameSizeUpload,
  onUploadApi,
  mode = "public",
  isBanner = false,
  isVideo = false,
  isPost = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const valueRef = useRef(value);

    useEffect(() => { valueRef.current = value; }, [value]);

    const COMMON_TRANSITION = "transition-all duration-300 ease-out";
    const SIZE_MAP = isVideo
      ? { sm: "w-52 h-32 rounded-2xl", md: "w-full h-48 aspect-video rounded-3xl", lg: "w-full aspect-video rounded-4xl" }
      : isBanner
        ? { sm: "w-64 h-24 rounded-xl", md: "w-full h-40 rounded-2xl", lg: "w-full h-60 rounded-3xl" }
        : { sm: "w-28 h-28 rounded-2xl", md: "w-40 h-40 rounded-3xl", lg: "w-56 h-56 rounded-[2.5rem]" };

    const GLASS_PANEL = "bg-white/70 backdrop-blur-md border border-white/50 shadow-sm";
    const ACTION_BTN = cn("w-10 h-10 flex items-center justify-center rounded-xl shadow-xl active:scale-90", COMMON_TRANSITION);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      let currentList = [...valueRef.current].filter((f) => f.uid);

      for (const file of Array.from(files)) {
        if (currentList.length >= maxCount || file.size / 1024 / 1024 > maxSizeMB) continue;

        const uid = Math.random().toString(36).substring(7);
        const objectUrl = URL.createObjectURL(file);
        const newFile: CustomFile = {
          uid, name: file.name, status: onUploadApi ? "uploading" : "done",
          originFileObj: file, url: objectUrl, type: file.type,
          percent: 0, isPublic: mode === "public", isPrivate: mode === "private",
        };

        currentList = [...currentList, newFile];
        onChange(currentList);

        if (onUploadApi) {
          try {
            const result = await onUploadApi(file, (p) => {
              onChange(valueRef.current.map((f) => f.uid === uid ? { ...f, percent: p } : f));
            });
            onChange(valueRef.current.map((f) => f.uid === uid ? {
              ...f, status: "done", percent: 100,
              url: result?.url || result?.data?.url || objectUrl,
              assetId: result?.id || result?.data?.id,
            } : f));
          } catch { onChange(valueRef.current.filter((f) => f.uid !== uid)); }
        }
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
      <div className={cn("flex items-center justify-start flex-wrap gap-5", className)}>
        <AnimatePresence mode="popLayout">
          {value.filter((f) => f.uid).map((file, index) => (
            <motion.div
              key={file.uid} layout
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "flex flex-col gap-2",
                isBanner
                  ? "w-full"
                  : isPost
                    ? (size === "md" ? "w-40" : size === "lg" ? "w-full" : "w-28")
                    : (size === "lg" ? "w-full" : "w-fit")
              )}
            >
              <div className={cn("relative group overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-orange-500/10 hover:shadow-2xl", SIZE_MAP[size as keyof typeof SIZE_MAP], classNameSizeUpload, COMMON_TRANSITION)}>
                <div className="relative w-full h-full">
                  {file.url && (
                    <div className="w-full h-full overflow-hidden">
                      {file.type?.includes("video") || file.url?.toLowerCase().endsWith(".mp4") || file.url?.toLowerCase().endsWith(".mov")
                        ? <video src={file.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                        : file.type?.includes("pdf") || file.url?.toLowerCase().endsWith(".pdf")
                        ? <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-rose-500"><File size={32} /><span className="text-[10px] mt-2 font-bold uppercase text-slate-500">{file.name || "PDF Document"}</span></div>
                        : <img src={file.url} alt="preview" className={cn("w-full h-full object-cover group-hover:scale-105", COMMON_TRANSITION)} />
                      }
                      <div className="absolute inset-0 bg-linear-to-t from-orange-950/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-10">
                    <div className={cn("p-1.5 rounded-lg text-gray-700", GLASS_PANEL)}>
                      {mode === "public" ? <Globe size={12} /> : <Lock size={12} />}
                    </div>
                  </div>
                  {file.status === "done" && (
                    <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white p-1 rounded-lg shadow-lg border border-orange-400">
                      <CheckCircle2 size={10} strokeWidth={4} />
                    </div>
                  )}
                </div>

                {file.status === "uploading" && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-2 border-orange-100 border-t-orange-500 animate-spin" />
                      <span className="text-[10px] font-bold text-orange-600 tracking-tighter">{Math.round(file.percent || 0)}%</span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 z-30 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button type="button" onClick={() => setPreviewIndex(index)} className={cn(ACTION_BTN, "bg-white text-gray-900 hover:bg-orange-50")}>
                    <Eye size={18} />
                  </button>
                  <button type="button" onClick={() => onChange(value.filter((f) => f.uid !== file.uid))} className={cn(ACTION_BTN, "bg-orange-500 text-white hover:bg-orange-600")}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {isPost && (
                <motion.input
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="text"
                  placeholder="Tiêu đề..."
                  className="w-full py-2 px-3 text-[10px] font-bold text-gray-600 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all italic"
                  value={file.title || ""}
                  onChange={(e) => {
                    onChange(value.map((f) => f.uid === file.uid ? { ...f, title: e.target.value } : f));
                  }}
                />
              )}
            </motion.div>
          ))}

          {value.filter((f) => f.uid).length < maxCount && (
            <motion.label
              layout
              className={cn(
                "group relative flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-500/40 transition-all duration-500 overflow-hidden",
                SIZE_MAP[size as keyof typeof SIZE_MAP],
                classNameSizeUpload
              )}
            >
              <input type="file" className="hidden" multiple={maxCount > 1} accept={allowedTypes.join(",")} onChange={handleFileChange} ref={fileInputRef} />

              <div className="relative z-10 flex flex-col items-center p-2 text-center">
                <div className={cn("w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-gray-600 group-hover:text-orange-600 group-hover:shadow-xl group-hover:shadow-orange-500/20 group-hover:-rotate-12", COMMON_TRANSITION)}>
                  {isVideo ? <VideoIcon size={24} /> : isBanner ? <Layout size={24} /> : <Plus size={24} />}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors flex items-center justify-center gap-1">
                    {isVideo ? "Post Video" : isBanner ? "Add Banner" : "Add Image"}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                  </p>
                  <p className="mt-1 text-[9px] font-medium text-gray-600 uppercase leading-none">Up to {maxSizeMB}MB</p>
                </div>
              </div>
            </motion.label>
          )}
        </AnimatePresence>

        <MediaLightbox
          mediaList={value as any}
          currentIndex={previewIndex}
          onChangeIndex={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      </div>
    );
  };