"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ExternalLink, MapPin, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/utils/cn";

export type RegistrationModalType = "course" | "event" | "newsletter" | "general";

export interface UnifiedRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: RegistrationModalType;
  title: string;
  subtitle?: string;
  banner?: string;
  description?: string;
  luma_url?: string;
  badge?: string;
  location?: string;
  date?: string;
  actionText?: string;
  actionSubtext?: string;
}

export const UnifiedRegistrationModal: React.FC<UnifiedRegistrationModalProps> = ({
  isOpen,
  onClose,
  type = "event",
  title,
  subtitle,
  banner,
  description,
  luma_url,
  badge,
  location,
  date,
  actionText,
  actionSubtext,
}) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const displayBadge = badge || (type === "course" ? "ON-CHAINPASS ACADEMY" : type === "newsletter" ? "WEEKLY ALPHA NEWSLETTER" : "PRIVATE CLUB EXCLUSIVE");

  const displayBanner =
    banner ||
    (type === "course"
      ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
      : type === "newsletter"
        ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
        : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80");

  const displayLocation = location || "HCMC, Viet Nam";
  const displayDate = date || "14 - 15 August 2026";

  const displayActionText = actionText || (type === "course" ? "ĐĂNG KÝ HỌC" : type === "newsletter" ? "ĐĂNG KÝ NHẬN TIN" : "MỞ TRANG SỰ KIỆN");

  const displayActionSubtext = actionSubtext || "Mở trang sự kiện chính thức để giữ chỗ ngay";

  const handleOpenLuma = () => {
    if (luma_url) {
      window.open(luma_url, "_blank", "noopener,noreferrer");
    } else {
      alert("Chưa cấu hình đường link Lu.ma cho mục này!");
    }
  };

  const handleCopyLink = () => {
    if (luma_url) {
      navigator.clipboard.writeText(luma_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-3 sm:p-5 font-sans">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full max-w-xl bg-[#F6F1EB] text-stone-900 rounded-[28px] shadow-2xl border border-[#E9E2D5] overflow-hidden z-10 flex flex-col max-h-[94vh]",
            )}
          >
            {/* Scrollable Body */}
            <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              {/* Header: Badge + Close button */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#EADCCB] text-[#785E42] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                    {displayBadge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-normal text-stone-900 leading-snug tracking-tight text-left">{title || "Tiêu đề chưa cập nhật"}</h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-[#EADCCB]/70 hover:bg-[#EADCCB] text-stone-700 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="Đóng popup"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* Banner Card */}
              <div className="relative w-full aspect-[2.35/1] rounded-2xl overflow-hidden shadow-md border border-amber-900/10 bg-stone-950 group isolate">
                <img
                  src={displayBanner}
                  alt={title}
                  className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Bottom Tags: Location & Date */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                  {displayLocation && (
                    <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-medium text-stone-100 flex items-center gap-1.5 shadow-sm truncate max-w-[50%]">
                      <MapPin size={12} className="text-amber-400 shrink-0" />
                      <span className="truncate">{displayLocation}</span>
                    </div>
                  )}

                  {displayDate && (
                    <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-medium text-stone-100 flex items-center gap-1.5 shadow-sm shrink-0 ml-auto">
                      <Calendar size={12} className="text-amber-400 shrink-0" />
                      <span className="font-mono">{displayDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}

              {description ? (
                <div className="text-stone-700 text-xs sm:text-[13px] leading-relaxed text-left space-y-2 whitespace-pre-line font-normal">{description}</div>
              ) : (
                <p className="text-stone-500 text-xs italic text-left">Chưa có thông tin mô tả chi tiết cho nội dung này.</p>
              )}

              {/* Registration Action Box */}
              <div className="bg-white rounded-2xl p-4 border border-[#E7E0D2] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F1EB] border border-[#E7E0D2] text-stone-700 flex items-center justify-center shrink-0">
                    <ExternalLink size={18} strokeWidth={2.2} />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="font-bold text-xs sm:text-[13px] text-stone-900 truncate">Đăng ký trực tiếp qua Luma</h4>
                    <p className="text-[11px] text-stone-500 truncate">{displayActionSubtext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {luma_url ? (
                    <button
                      type="button"
                      onClick={handleOpenLuma}
                      className="h-10 px-5 rounded-xl bg-[#D7942B] hover:bg-[#C28220] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>{displayActionText}</span>
                      <ExternalLink size={13} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="h-10 px-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 text-xs font-semibold cursor-not-allowed"
                    >
                      Chưa gắn link Lu.ma
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="px-5 py-3.5 bg-[#EFE8DE] border-t border-[#DFD5C6] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleOpenLuma}
                className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Mở trang sự kiện</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 rounded-xl bg-[#E4DACD] hover:bg-[#DACFBF] text-stone-800 text-xs font-bold transition-all cursor-pointer"
                >
                  ĐÓNG
                </button>
                <button
                  type="button"
                  onClick={handleOpenLuma}
                  className="h-9 px-5 rounded-xl bg-[#987554] hover:bg-[#856445] text-white text-xs font-bold uppercase tracking-wide transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>THAM GIA NGAY</span>
                  <ExternalLink size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
