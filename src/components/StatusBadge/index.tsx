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
  const statusKey = status.toUpperCase();

  const renderIcon = () => {
    if (!React.isValidElement(current.icon)) return current.icon;

    const iconBaseClass = cn(
      (current.icon.props as any)?.className,
      current.iconColor,
      "w-3 h-3 shrink-0"
    );

    let animationProps = {};
    if (statusKey === "PROCESSING" || statusKey === "ĐANG XỬ LÝ") {
      animationProps = {
        animate: { rotate: 360 },
        transition: { duration: 2, repeat: Infinity, ease: "linear" },
      };
    } else if (statusKey === "PENDING" || statusKey === "ĐANG CHỜ" || statusKey === "CHỜ DUYỆT") {
      animationProps = {
        animate: { opacity: [0.6, 1, 0.6] },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      };
    }

    return (
      <motion.span {...animationProps} className="flex items-center justify-center shrink-0">
        {React.cloneElement(current.icon as React.ReactElement<any>, {
          className: iconBaseClass,
        })}
      </motion.span>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={cn(
        "relative inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full border select-none w-fit whitespace-nowrap",
        "text-[9px] font-bold uppercase transition-colors duration-300",
        current.styles,
        className
      )}
    >
      <span className="shrink-0 flex items-center">
        {renderIcon()}
      </span>

      <span className="leading-none font-bold">
        {propLabel || current.label}
      </span>
    </motion.div>
  );
};