"use client";

import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

export interface StatusTabItem<T extends string> {
  key: T;
  label: string;
  icon: LucideIcon;
  count?: number;
  isImportant?: boolean;
}
interface StatusTabsProps<T extends string> {
  tabs: StatusTabItem<T>[];
  current: T;
  onChange: (key: T) => void;
  className?: string;
  layoutId?: string;
  disabled?: boolean;
}

export const StatusTabs = <T extends string>({
  tabs,
  current,
  onChange,
  className,
  layoutId = "ultimate-pill",
  disabled = false,
}: StatusTabsProps<T>) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const left = scrollLeft > 5;
      const right = scrollLeft < scrollWidth - clientWidth - 5;

      setShowLeftArrow(prev => prev !== left ? left : prev);
      setShowRightArrow(prev => prev !== right ? right : prev);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const initialCheck = setTimeout(() => {
      checkScroll();
      const activeTab = container.querySelector('[data-active="true"]');
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, 150);

    const handleScroll = () => {
      requestAnimationFrame(checkScroll);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(initialCheck);
    };
  }, [tabs.length, checkScroll]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const activeTab = container.querySelector('[data-active="true"]');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [current]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.6;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group w-full itim-regular">
      <AnimatePresence>
        {showLeftArrow && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex items-center pr-12  pointer-events-none bg-linear-to-r from-white via-white/80 to-transparent rounded-l-2xl"
          >
            <button
              type="button"
              onClick={() => scroll("left")}
              className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg border border-gray-100 text-gray-500 hover:text-orange-500 hover:scale-110 active:scale-95 transition-all ml-1"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightArrow && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-0 top-0 bottom-0 z-20 hidden md:flex  items-center pl-12 pointer-events-none bg-linear-to-l from-white via-white/80 to-transparent rounded-r-2xl"
          >
            <button
              type="button"
              onClick={() => scroll("right")}
              className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg border border-gray-100 text-gray-500 hover:text-orange-500 hover:scale-110 active:scale-95 transition-all mr-1"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={scrollContainerRef}
        className={cn("w-full overflow-x-auto scrollbar-none py-1 md:py-2 px-0.5 md:px-1", className)}
      >
        <nav className="relative inline-flex bg-gray-50 backdrop-blur-md p-1.5 rounded-2xl gap-1 border border-gray-200/50 shadow-custom min-w-max">
          {tabs.map((tab) => {
            const isActive = current === tab.key;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.key}
                type="button"
                data-active={isActive}
                onClick={() => !disabled && onChange(tab.key)}
                whileTap={disabled ? {} : { scale: 0.97 }}
                className={cn(
                  "relative flex items-center cursor-pointer gap-2 md:gap-2.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap outline-none select-none",
                  isActive ? "text-zinc-900" : tab.isImportant ? "text-orange-600" : "text-zinc-500 hover:text-zinc-700",
                  disabled && "opacity-50 cursor-not-allowed",
                  tab.isImportant && !isActive && "bg-white shadow-[0_8px_25px_-4px_rgba(249,115,22,0.3)] border border-orange-200"
                )}
                disabled={disabled}
              >
                {tab.isImportant && !isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-orange-500/5 ring-1 ring-orange-500/30"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.03, 1],
                      boxShadow: [
                        "0 0 0 0px rgba(249, 115, 22, 0)",
                        "0 0 0 4px rgba(249, 115, 22, 0.1)",
                        "0 0 0 0px rgba(249, 115, 22, 0)"
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId={layoutId}
                    className="absolute inset-0 bg-white rounded-2xl shadow-custom border border-gray-200/40"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

                <motion.div className="absolute inset-0 rounded-2xl bg-gray-200/0 hover:bg-gray-200/50 transition-colors z-0" />

                <div className="relative z-10 flex items-center gap-2">
                  <motion.div
                    animate={isActive || tab.isImportant ? { scale: 1.1, rotate: [0, -10, 10, 0] } : { scale: 1 }}
                    transition={tab.isImportant && !isActive ? { duration: 2, repeat: Infinity } : { duration: 0.4 }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={cn(
                        "transition-colors duration-300",
                        isActive || tab.isImportant ? "text-orange-500" : "text-gray-600"
                      )}
                    />
                  </motion.div>

                  <span className="tracking-tight uppercase text-[9px] md:text-[11px] font-extrabold">
                    {tab.label}
                  </span>

                  <AnimatePresence mode="popLayout">
                    {tab.count !== undefined && (
                      <motion.span
                        key={tab.count}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "ml-1 flex items-center justify-center min-w-4 md:min-w-5 h-4 md:h-5 px-1 md:px-1.5 rounded-full text-[8px] md:text-[10px] font-bold tabular-nums transition-all duration-300",
                          isActive || tab.isImportant
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                            : "bg-gray-200 text-gray-500"
                        )}
                      >
                        {tab.count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};