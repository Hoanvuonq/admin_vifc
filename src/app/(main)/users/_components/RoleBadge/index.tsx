"use client";

import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Crown, ShieldCheck, Star, Store, User, Truck, Tag } from "lucide-react";
import React from "react";

export type UserRole = "ADMIN" | "SHOP" | "BUYER" | "BUSINESS" | "EMPLOYEE" | "LOGISTICS" | "SALE" | string;

interface RoleConfig {
  label: string;
  symbol: string;
  className: string;
  iconBg: string;
  iconColor: string;
  icon: any;
  glowColor: string;
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  ADMIN: {
    label: "Administrator",
    symbol: "ADM",
    className: "bg-purple-50/80 text-purple-700 border-purple-200/60 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:bg-purple-100/80",
    iconBg: "bg-purple-100/80 border-purple-200/50",
    iconColor: "text-purple-600",
    icon: ShieldCheck,
    glowColor: "rgba(168, 85, 247, 0.2)",
  },
  PREMIUM: {
    label: "Premium",
    symbol: "PRM",
    className: "bg-amber-50/80 text-amber-700 border-amber-300/60 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:bg-amber-100/80",
    iconBg: "bg-amber-100/80 border-amber-300/50",
    iconColor: "text-amber-600",
    icon: Star,
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
  "MONTHLY BASIC": {
    label: "Monthly Basic",
    symbol: "BSC",
    className: "bg-sky-50/80 text-sky-700 border-sky-200/60 shadow-[0_0_10px_rgba(56,189,248,0.1)] hover:bg-sky-100/80",
    iconBg: "bg-sky-100/80 border-sky-200/50",
    iconColor: "text-sky-600",
    icon: Star,
    glowColor: "rgba(56, 189, 248, 0.2)",
  },
  "QUARTERLY PRO": {
    label: "Quarterly Pro",
    symbol: "QPR",
    className: "bg-violet-50/80 text-violet-700 border-violet-200/60 shadow-[0_0_10px_rgba(139,92,246,0.1)] hover:bg-violet-100/80",
    iconBg: "bg-violet-100/80 border-violet-200/50",
    iconColor: "text-violet-600",
    icon: Crown,
    glowColor: "rgba(139, 92, 246, 0.2)",
  },
  "ANNUAL PREMIUM": {
    label: "Annual Premium",
    symbol: "PRO",
    className: "bg-amber-50/80 text-amber-700 border-amber-300/60 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:bg-amber-100/80",
    iconBg: "bg-amber-100/80 border-amber-300/50",
    iconColor: "text-amber-600",
    icon: Crown,
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
};

export const RoleBadge: React.FC<{
  role: UserRole;
  className?: string;
}> = ({ role, className }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const roleKey = role?.toUpperCase() || "BUYER";

  const config = ROLE_CONFIGS[roleKey] || {
    label: roleKey,
    symbol: roleKey.substring(0, 3),
    className: "bg-slate-50/80 text-slate-700 border-slate-200/60 shadow-[0_0_10px_rgba(107,114,128,0.1)] hover:bg-slate-100/80",
    iconBg: "bg-slate-100/80 border-slate-200/50",
    iconColor: "text-slate-600",
    icon: User,
    glowColor: "rgba(107,114,128,0.2)",
  };

  const Icon = config.icon;

  return (
    <div
      className="relative inline-block select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
            animate={{ opacity: 1, y: -4, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 5, scale: 0.8, x: "-50%" }}
            className="absolute bottom-full left-1/2 z-50 mb-2 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold whitespace-nowrap shadow-md border border-slate-100 bg-white text-slate-800 pointer-events-none transition-colors tracking-wide"
          >
            {config.label} ({config.symbol})
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-slate-100 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{
          scale: 1.05,
          y: -1,
          boxShadow: `0 0 15px ${config.glowColor}`,
        }}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-extrabold transition-all duration-300 relative overflow-hidden group cursor-help",
          config.className,
          className
        )}
      >
        {/* Soft, beautiful shimmer sweep inside the badge on hover */}
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

        {/* Circular mini coin symbol with spin animation on hover */}
        <motion.span
          animate={isHovered ? { rotate: 360 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={cn("shrink-0 relative z-20 flex items-center justify-center p-0.5 rounded-full border shadow-xs", config.iconBg)}
        >
          <Icon size={9} strokeWidth={3} className={config.iconColor} />
        </motion.span>

        <span className="leading-none relative z-20 font-extrabold uppercase tracking-wider text-[9px]">
          {config.symbol}
        </span>
      </motion.div>
    </div>
  );
};
