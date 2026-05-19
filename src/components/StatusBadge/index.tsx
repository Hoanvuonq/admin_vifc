"use client";

import { getStatusConfig } from "@/constants/status";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import React from "react";

export const StatusBadge: React.FC<{
  status?: string | null;
  label?: string;
  variant?: "premium" | "minimal";
  className?: string;
}> = ({ status, label: propLabel, variant = "premium", className }) => {
  if (!status) return null;

  const current = getStatusConfig(status);
  const isPremium = variant === "premium";

  const displayStyles = isPremium ? (current.premiumStyles || current.styles) : current.styles;
  const statusKey = status.toUpperCase();

  const renderIcon = () => {
    if (!React.isValidElement(current.icon)) return current.icon;

    const iconBaseClass = cn(
      (current.icon.props as any).className,
      isPremium && current.premiumStyles ? "text-white" : current.iconColor,
      "w-3 h-3"
    );

    let animationProps = {};
    if (isPremium) {
      if (statusKey === "PROCESSING" || statusKey === "REVIEWING") {
        animationProps = { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: "linear" } };
      } else if (statusKey === "PENDING") {
        animationProps = { animate: { opacity: [0.4, 1, 0.4] }, transition: { duration: 1.5, repeat: Infinity } };
      } else if (statusKey === "FAILED" || statusKey === "CANCELLED") {
        animationProps = { animate: { x: [-1, 1, -1] }, transition: { duration: 0.2, repeat: 3 } };
      }
    }

    return (
      <motion.span {...animationProps} className="flex items-center justify-center">
        {React.cloneElement(current.icon as React.ReactElement<any>, { className: iconBaseClass })}
      </motion.span>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        backgroundPosition: isPremium ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 0%",
      }}
      whileHover={{
        scale: 1.05,
        filter: "brightness(1.1)",
        boxShadow: isPremium
          ? "0 10px 20px -5px rgba(0,0,0,0.2), 0 0 15px rgba(255,255,255,0.1)"
          : "0 4px 12px -2px rgba(0,0,0,0.05)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        backgroundPosition: {
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        },
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-1 rounded-full border select-none w-fit whitespace-nowrap overflow-hidden group/badge itim-regular",
        "text-[9px] font-bold uppercase tracking-widest transition-all duration-500",
        isPremium
          ? "bg-size-[200%_auto] text-white border-white/40 shadow-lg backdrop-blur-md px-4 py-1.5"
          : "bg-white/60 backdrop-blur-sm border-slate-200 text-gray-600",
        displayStyles,
        className
      )}
    >
      {isPremium && (
        <>
          <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
          <motion.div
            animate={{
              left: ["-100%", "200%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
            className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-25 pointer-events-none z-10"
          />
        </>
      )}

      {isPremium && (statusKey === "PROCESSING" || statusKey === "PENDING") && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full pointer-events-none"
        />
      )}

      <span className="shrink-0 relative z-20 flex items-center">
        {renderIcon()}
      </span>

      <span className="leading-none relative z-20 font-bold">
        {propLabel || current.label}
      </span>

      <div className="absolute top-0 left-0 right-0 h-1/2 bg-linear-to-b from-white/10 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
};