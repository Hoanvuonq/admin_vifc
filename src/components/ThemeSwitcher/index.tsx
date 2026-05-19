"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

export const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className={cn(
        "relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 outline-hidden select-none cursor-pointer",
        isDark ? "bg-slate-800" : "bg-slate-100"
      )}
      aria-label="Toggle Theme"
    >

      <span
        className={cn(
          "absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out flex items-center justify-center",
          isDark ? "translate-x-6" : "translate-x-0"
        )}
      >
        {isDark ? (
          <Moon size={12} className="text-indigo-600 animate-pulse" />
        ) : (
          <Sun size={12} className="text-amber-500 animate-spin-slow" />
        )}
      </span>


      <span className="flex-1 flex justify-center text-amber-500 opacity-60">
        {!isDark && <Sun size={12} />}
      </span>


      <span className="flex-1 flex justify-center text-indigo-400 opacity-60">
        {isDark && <Moon size={12} />}
      </span>
    </button>
  );
};