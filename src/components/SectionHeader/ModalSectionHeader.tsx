"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeaderModalProps {
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  colorClass?: string;
  bgClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeaderModal = ({
  icon: Icon,
  title,
  description,
  colorClass = "text-orange-500",
  bgClass = "bg-orange-500",
  className,
  children,
}: SectionHeaderModalProps) => {
  if (!Icon && !title && !children) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex items-center gap-4 relative group/modal-header w-full py-1", className)}
    >

      {Icon && (
        <div className="absolute left-[18px] top-[-30%] bottom-[-30%] w-[2px] hidden lg:block pointer-events-none">
          <div className="absolute inset-0 bg-slate-100/50 rounded-full" />
          <motion.div
            className="relative w-full h-full overflow-hidden rounded-full"
          >
            <motion.div
              animate={{
                y: ["-100%", "200%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={cn("w-full h-1/3 bg-linear-to-b from-transparent via-current to-transparent", colorClass)}
            />
          </motion.div>
        </div>
      )}

      {Icon && (
        <motion.div className="relative shrink-0 z-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden",
              "bg-white border border-slate-200 shadow-sm transition-colors duration-500",
              "group-hover/modal-header:border-orange-300 group-hover/modal-header:shadow-orange-200/50"
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-transparent to-transparent pointer-events-none" />

            <Icon
              size={20}
              className={cn("relative z-10 drop-shadow-sm", colorClass)}
              strokeWidth={2.5}
            />

            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 bg-white/60 skew-x-[-20deg] blur-md pointer-events-none"
            />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute -inset-1 blur-lg pointer-events-none rounded-full -z-10", bgClass)}
          />
        </motion.div>
      )}

      <div className="flex flex-col min-w-0 py-1 relative z-10 shrink-0">
        <motion.div className="flex items-center gap-2">
          <h2 className="text-[14px] md:text-[15px] font-extrabold text-gray-800 tracking-tight uppercase italic leading-none">
            {title}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "1.5rem" }}
            whileHover={{ width: "3rem" }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className={cn("h-[3px] rounded-full opacity-40 group-hover/modal-header:opacity-100 transition-all duration-300", bgClass)}
          />
        </motion.div>

        {description && (
          <motion.div className="flex items-center gap-1.5 mt-1.5 ">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn("w-1.5 h-1.5 rounded-full shrink-0", bgClass)}
            />
            <div className="text-[10px] font-semibold text-gray-600 uppercase italic leading-tight line-clamp-1 max-w-[250px]">
              {description}
            </div>
          </motion.div>
        )}
      </div>

      {/* Children slot (Extra Content + Close Button) */}
      <div className="flex-1 flex items-center justify-end">
        {children && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-30"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};