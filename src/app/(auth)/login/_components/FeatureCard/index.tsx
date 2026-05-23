"use client";

import { cn } from "@/utils/cn";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";
import { FeatureCardProps } from "./type";

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  imageIcon,
  iconColor,
  gradientFrom,
  gradientTo,
  title,
  description,
  index = 0,
  className = "",
  isMobile = false,
}) => {
  const isTall = !isMobile && (index === 1 || index === 2);
  const isCard0 = index === 0;
  const isCard3 = index === 3;

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative group overflow-hidden rounded-[2.5rem] h-full transition-all duration-500 cursor-pointer shadow-md",
        className
      )}
    >
      <div className={cn(
        "absolute inset-0 transition-all rounded-[2.5rem] duration-700 opacity-30 group-hover:opacity-60 bg-linear-to-br ",
        gradientFrom, gradientTo
      )} />

      <div className={cn(
        "relative h-full w-full backdrop-blur-xl rounded-[2.5rem] shadow- border border-white/20 py-4 px-5 sm:px-6 overflow-hidden flex flex-col transition-all duration-700",
        "bg-linear-to-br", gradientFrom, gradientTo, "bg-opacity-[0.12] group-hover:bg-opacity-[0.25]",
        (isTall || isMobile) ? "items-center justify-between text-center" : "justify-center",
        !isTall && !isMobile && isCard0 ? "flex-row text-left items-center gap-4 sm:gap-5" : "",
        !isTall && !isMobile && isCard3 ? "flex-row-reverse text-right items-center gap-4 sm:gap-5" : ""
      )}>

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-PX bg-linear-to-r from-transparent via-white/30 to-transparent" />
          <div className={cn("absolute bottom-0 left-0 w-full h-32 blur-3xl opacity-20 bg-linear-to-t", gradientTo, "to-transparent")} />

          <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-700 text-white">
            <path
              d="M0 40 H50 L70 20 M110 20 V60 L130 80 H200 M180 200 V160 L160 140 H100 M0 180 H40 L60 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />

            <motion.path
              d="M0 40 H50 L70 20 M110 20 V60 L130 80 H200 M180 200 V160 L160 140 H100 M0 180 H40 L60 200"
              fill="none"
              stroke="white"
              strokeWidth="1.2"
              strokeDasharray="20 180"
              initial={{ strokeDashoffset: 200 }}
              animate={{ strokeDashoffset: -200 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5
              }}
              style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
            />

            <circle cx="50" cy="40" r="2" fill="currentColor">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="80" r="2" fill="currentColor">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="160" cy="140" r="2" fill="currentColor">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className={cn(
          "relative z-20 space-y-1.5 sm:space-y-2.5 itim-regular",
          isTall ? "w-full pt-2" : "flex-1"
        )}>
          <motion.h3
            className={cn(
              "font-bold text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]",
              isTall ? "text-lg sm:text-xl" : "text-base sm:text-lg leading-[1.1]"
            )}
            whileHover={{ scale: 1.02 }}
          >
            {title}
          </motion.h3>
          <p className={cn(
            "text-white font-semibold leading-relaxed drop-shadow-md",
            isTall ? "text-xs sm:text-sm max-w-60 mx-auto lg:mx-0" : "text-[10px] sm:text-xs opacity-90 mt-1"
          )}>
            {description}
          </p>
        </div>

        <div className={cn(
          "relative z-20 flex items-center justify-center",
          isTall ? "w-full grow py-4 sm:py-8" : "shrink-0"
        )}>
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformStyle: "preserve-3d" }}
            className={cn(
              "relative flex items-center justify-center",
              isTall ? "w-36 h-36 sm:w-44 sm:h-44" : "w-24 h-24 sm:w-28 sm:h-28"
            )}
          >
            <div className={cn(
              "absolute inset-0 blur-2xl sm:blur-3xl opacity-60 scale-100 bg-linear-to-br",
              gradientFrom, gradientTo
            )} />

            <div className={cn(
              "relative rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/40 overflow-hidden transition-all duration-500",
              "bg-white/20 backdrop-blur-2xl group-hover:scale-110 group-hover:border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
              isTall ? "w-28 h-28 sm:w-36 sm:h-36" : "w-20 h-20 sm:w-24 sm:h-24"
            )}>
              <div className="absolute inset-0 bg-linear-to-tr from-white/30 via-transparent to-white/10 z-20" />

              {Icon ? (
                <Icon className={cn(
                  iconColor,
                  isTall ? "text-6xl sm:text-7xl" : "text-4xl sm:text-5xl",
                  "relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] group-hover:rotate-6 transition-transform duration-500"
                )} />
              ) : imageIcon && (
                <div className="relative w-[80%] h-[80%] z-10 flex items-center justify-center">
                  <Image
                    src={imageIcon}
                    alt={title}
                    fill
                    className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] sm:drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-500 p-1"
                    sizes="(max-width: 640px) 80px, 150px"
                  />
                </div>
              )}

              <motion.div
                initial={{ x: "-150%", opacity: 0 }}
                whileHover={{ x: "150%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent skew-x-12 z-30"
              />
            </div>
          </motion.div>
        </div>

        {isTall && (
          <div className="relative z-20 mt-auto pt-2 sm:pt-4 w-full">
            <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent mb-2 sm:mb-4" />
            <div className="flex justify-between items-center px-4">
              <span className="text-[9px] sm:text-[11px] font-bold text-white uppercase tracking-tight">
                TECH CORE
              </span>
              <div className="flex gap-1.5 sm:gap-2">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/80" />
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/80" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "absolute inset-0 rounded-[2.5rem] border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none z-30"
      )} />
    </motion.div>
  );
};