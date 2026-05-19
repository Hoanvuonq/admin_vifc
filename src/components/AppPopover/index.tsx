"use client";

import { cn } from "@/utils/cn";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppPopoverProps } from "./type";

export const AppPopover = ({
  trigger,
  children,
  className,
  arrowClassName,
  hideScrollbar = false,
  align = "right",
  onOpenChange,
  isMobileFixed = false,
  mobileTop = "top-[70px]",
  contentClassName,
}: AppPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (onOpenChange) onOpenChange(open);
    },
    [onOpenChange],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleOpen(false);
      }
    },
    [toggleOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  if (!isMounted) return <div className="relative inline-block">{trigger}</div>;

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={() => toggleOpen(true)}
      onMouseLeave={() => toggleOpen(false)}
    >
      <div className="cursor-pointer">{trigger}</div>

      <div
        className={cn(
          "z-9999 transition-all duration-300 ease-out transform origin-top-right",
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible",
          isMobileFixed
            ? [
              "fixed left-4 right-4",
              mobileTop,
              "md:absolute md:top-full md:pt-3 md:w-max md:left-auto md:right-auto",
              align === "right"
                ? "md:right-0"
                : align === "left"
                  ? "md:left-0"
                  : "md:left-1/2 md:-translate-x-1/2",
            ]
            : [
              "absolute top-full pt-3 w-max",
              align === "right"
                ? "right-0"
                : align === "left"
                  ? "left-0"
                  : "left-1/2 -translate-x-1/2",
            ],
          className,
        )}
      >
        <div
          className={cn(
            "absolute top-1.25 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100 z-20",
            isMobileFixed ? "hidden md:block" : "block",
            align === "right"
              ? "right-6"
              : align === "left"
                ? "left-6"
                : "left-1/2 -translate-x-1/2",
            arrowClassName,
          )}
        />

        <div className={cn(
          "relative bg-white text-gray-800 shadow-2xl border border-gray-100 z-10",
          !contentClassName?.includes("rounded-") && "rounded-xl",
          !contentClassName?.includes("overflow-") && "overflow-hidden",
          hideScrollbar ? "no-scrollbar" : "",
          contentClassName
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
