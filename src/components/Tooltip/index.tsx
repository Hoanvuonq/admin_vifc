"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

interface TooltipProps {
  children?: React.ReactNode;
  content?: string | React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({
  children,
  content,
  position = "top",
  active,
  payload,
  label,
}: TooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    if (isHovered) {
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isHovered, updateCoords]);

  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-orange-100 shadow-[0_10px_30px_rgba(255,107,0,0.1)] z-10000 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-[10px] font-bold uppercase text-gray-600 mb-2 border-b border-gray-50 pb-1.5">
          {label || payload[0].name}
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-sm shadow-orange-200"
            style={{
              backgroundColor: payload[0].color || payload[0].payload.fill || "#FF6B00",
            }}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight leading-none mb-1">
              {payload[0].name}
            </span>
            <span className="text-xs font-bold text-[#FF6B00] leading-none tabular-nums italic">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!children) return null;

  const getTooltipPosition = () => {
    const spacing = 10;
    if (position === "top") {
      return {
        top: coords.top - spacing,
        left: coords.left + coords.width / 2,
        transform: "translate(-50%, -100%)",
      };
    }
    if (position === "bottom") {
      return {
        top: coords.top + coords.height + spacing,
        left: coords.left + coords.width / 2,
        transform: "translateX(-50%)",
      };
    }
    if (position === "left") {
      return {
        top: coords.top + coords.height / 2,
        left: coords.left - spacing,
        transform: "translate(-100%, -50%)",
      };
    }
    return {
      top: coords.top + coords.height / 2,
      left: coords.left + coords.width + spacing,
      transform: "translateY(-50%)",
    };
  };

  const handleMouseEnter = () => {
    updateCoords();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isHovered && coords.top !== 0 && content && typeof document !== "undefined" && createPortal(
        <div
          style={{
            position: "absolute",
            zIndex: 10001,
            ...getTooltipPosition(),
          }}
          className={cn(
            "px-2 py-1.5 text-[10px] font-bold uppercase italic text-[#FF6B00]",
            "bg-white border border-orange-100 rounded-xl shadow-xl shadow-orange-500/10",
            "whitespace-nowrap animate-in fade-in zoom-in duration-200 pointer-events-none"
          )}
        >
          <div className={cn(
            "absolute w-2 h-2 bg-white border-orange-100 rotate-45",
            position === "top" && "bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r",
            position === "bottom" && "top-[-5px] left-1/2 -translate-x-1/2 border-t border-l",
            position === "left" && "right-[-5px] top-1/2 -translate-y-1/2 border-t border-r",
            position === "right" && "left-[-5px] top-1/2 -translate-y-1/2 border-b border-l"
          )} />
          <span className="relative z-10">{content}</span>
        </div>,
        document.body
      )}
    </>
  );
};