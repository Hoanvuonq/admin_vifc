"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Briefcase, Building2, Coffee, Crown, GraduationCap, Layers, Sparkles, Users } from "lucide-react";
import React from "react";

export type BookingType = "course" | "workshop" | "meeting-room" | "lounge" | "consulting" | string;

interface TypeConfig {
  label: string;
  symbol: string;
  className: string;
  iconBg: string;
  iconColor: string;
  icon: any;
  glowColor: string;
}

const TYPE_CONFIGS: Record<string, TypeConfig> = {
  COURSE: {
    label: "Khóa học chuyên sâu",
    symbol: "COURSE",
    className: "bg-orange-50/80 text-orange-700 border-orange-200/70 shadow-[0_0_10px_rgba(249,115,22,0.12)] hover:bg-orange-100/80",
    iconBg: "bg-orange-100/80 border-orange-200/60",
    iconColor: "text-orange-600",
    icon: GraduationCap,
    glowColor: "rgba(249, 115, 22, 0.25)",
  },
  WORKSHOP: {
    label: "Workshop & Seminar",
    symbol: "WORKSHOP",
    className: "bg-purple-50/80 text-purple-700 border-purple-200/70 shadow-[0_0_10px_rgba(168,85,247,0.12)] hover:bg-purple-100/80",
    iconBg: "bg-purple-100/80 border-purple-200/60",
    iconColor: "text-purple-600",
    icon: Sparkles,
    glowColor: "rgba(168, 85, 247, 0.25)",
  },
  "MEETING-ROOM": {
    label: "Phòng họp Hub",
    symbol: "MEETING",
    className: "bg-sky-50/80 text-sky-700 border-sky-200/70 shadow-[0_0_10px_rgba(14,165,233,0.12)] hover:bg-sky-100/80",
    iconBg: "bg-sky-100/80 border-sky-200/60",
    iconColor: "text-sky-600",
    icon: Building2,
    glowColor: "rgba(14, 165, 233, 0.25)",
  },
  LOUNGE: {
    label: "Lounge & Không gian VIP",
    symbol: "LOUNGE",
    className: "bg-amber-50/80 text-amber-700 border-amber-300/70 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:bg-amber-100/80",
    iconBg: "bg-amber-100/80 border-amber-300/60",
    iconColor: "text-amber-600",
    icon: Coffee,
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
  CONSULTING: {
    label: "Tư vấn 1-1",
    symbol: "ADVISORY",
    className: "bg-emerald-50/80 text-emerald-700 border-emerald-200/70 shadow-[0_0_10px_rgba(16,185,129,0.12)] hover:bg-emerald-100/80",
    iconBg: "bg-emerald-100/80 border-emerald-200/60",
    iconColor: "text-emerald-600",
    icon: Briefcase,
    glowColor: "rgba(16, 185, 129, 0.25)",
  },
};

export const BookingTypeBadge: React.FC<{
  type?: BookingType;
  className?: string;
}> = ({ type = "course", className }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const normalizedKey = (type || "course").trim().toUpperCase();

  const config = TYPE_CONFIGS[normalizedKey] || {
    label: normalizedKey,
    symbol: normalizedKey.length > 8 ? normalizedKey.substring(0, 7) : normalizedKey,
    className: "bg-slate-50/80 text-slate-700 border-slate-200/70 shadow-[0_0_10px_rgba(107,114,128,0.1)] hover:bg-slate-100/80",
    iconBg: "bg-slate-100/80 border-slate-200/50",
    iconColor: "text-slate-600",
    icon: BookOpen,
    glowColor: "rgba(107, 114, 128, 0.2)",
  };

  const Icon = config.icon;

  return (
    <div className="relative inline-block select-none" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85, x: "-50%" }}
            animate={{ opacity: 1, y: -4, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 4, scale: 0.85, x: "-50%" }}
            className="absolute bottom-full left-1/2 z-50 mb-2 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold whitespace-nowrap shadow-md border border-slate-100 bg-white text-slate-800 pointer-events-none transition-colors tracking-wide"
          >
            {config.label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-slate-100 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 2 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{
          scale: 1.04,
          y: -1,
          boxShadow: `0 0 15px ${config.glowColor}`,
        }}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-extrabold transition-all duration-300 relative overflow-hidden group cursor-help",
          config.className,
          className,
        )}
      >
        {/* Soft shimmer sweep inside the badge on hover */}
        <motion.div
          animate={{
            left: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/40 to-transparent -skew-x-25 pointer-events-none z-10"
        />

        {/* Circular mini icon symbol */}
        <motion.span
          animate={isHovered ? { rotate: 360 } : {}}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={cn("shrink-0 relative z-20 flex items-center justify-center p-0.5 rounded-full border shadow-xs", config.iconBg)}
        >
          <Icon size={9} strokeWidth={2.8} className={config.iconColor} />
        </motion.span>

        <span className="leading-none relative z-20 font-extrabold uppercase text-[9px]">{config.symbol}</span>
      </motion.div>
    </div>
  );
};
