"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LogoProps } from "./type";

export const Logo: React.FC<LogoProps> = ({
  imgSrc = "/icon/icon_sidebar2.png",
  imgWidth = 180,
  imgHeight = 60,
  href = "/",
  icon,
  gradientClass = "bg-linear-to-br from-blue-500 to-purple-600",
  iconClassName = "text-white text-3xl",
  titleClassName = "text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-tight italic uppercase",
  className,
  title,
  description,
}) => {
  const logoContent = (
    <div className={cn("inline-flex items-center gap-4 transition-transform hover:scale-[1.02] active:scale-[0.98]")}>
      <Image
        src={imgSrc}
        alt="VIFC ADMIN PORTAL Logo"
        width={imgWidth}
        height={imgHeight}
        className="object-contain drop-shadow-sm"
        priority
      />
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {href ? (
        <Link href={href} className="inline-block outline-none w-fit">
          {logoContent}
        </Link>
      ) : (
        logoContent
      )}

      {(title || description) && (
        <div className="space-y-4">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={titleClassName}
            >
              {title}
            </motion.h2>
          )}

          {description && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-5"
            >
              <div className="mt-2.5 h-[3px] w-10 shrink-0 bg-linear-to-r from-orange-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
              <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium max-w-md leading-relaxed">
                {description}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};