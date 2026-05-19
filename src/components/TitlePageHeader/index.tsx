"use client";

import { cn } from "@/utils/cn";
import { TitlePageHeaderProps } from "./type";

export const TitlePageHeader = ({
  icon: Icon,
  title,
  highlightTitle,
  subtitle,
  className,
  isWhite,
  size = "md",
  isTitleHighlight = false,
}: TitlePageHeaderProps) => {
  const isXs = size === "xs";
  const isSm = size === "sm";

  return (
    <div
      className={cn(
        "flex items-center select-none animate-in fade-in slide-in-from-left-4 duration-700",
        isXs ? "gap-3" : isSm ? "gap-4" : "gap-5",
        className,
      )}
    >
      {Icon && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-orange-500/20 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div
            className={cn(
              "relative cursor-pointer shrink-0 transition-transform group-hover:scale-105",
              "border border-orange-200 bg-linear-to-br from-orange-50 to-orange-100 text-orange-600 shadow-[0_8px_30px_rgb(234,88,12,0.12)]",
              isXs ? "p-2 rounded-2xl" : isSm ? "p-3 rounded-3xl" : "p-3.5 rounded-3xl"
            )}
          >
            <Icon size={isXs ? 20 : isSm ? 24 : 28} strokeWidth={isXs ? 3 : isSm ? 3 : 2.5} />
          </div>
        </div>
      )}

      <div className={isXs ? "space-y-0.5" : isSm ? "space-y-0.5" : "space-y-1.5"}>
        <h1 className={cn(
          "font-bold text-gray-900 tracking-tighter italic leading-none flex flex-wrap",
          isXs ? "text-lg md:text-2xl gap-x-1.5" : isSm ? "text-xl md:text-3xl gap-x-2" : "text-3xl md:text-4xl gap-x-3"
        )}>
          <span className={cn("drop-shadow-sm", isTitleHighlight && "text-orange-500" || isWhite && "text-white")}>
            {title}
          </span>
          {highlightTitle && (
            <span className={cn(
              "drop-shadow-[0_2px_2px_rgba(234,88,12,0.15)]",
              !isTitleHighlight && "text-orange-500 "
            )}>
              {highlightTitle}
            </span>
          )}
        </h1>

        <div className={cn("flex items-center gap-2", !isXs && !isSm && "mt-2")}>
          <div className={cn("bg-orange-500 rounded-full", isXs ? "w-2 h-0.5" : isSm ? "w-2 h-0.5" : "w-4 h-0.5")} />
          <div className={cn(
            "font-bold italic text-gray-600 leading-none",
            isXs ? "text-[9px] md:text-[11px]" : isSm ? "text-[10px] md:text-[12px]" : "text-[12px] md:text-[12px]",
            isWhite && "text-white"
          )}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};