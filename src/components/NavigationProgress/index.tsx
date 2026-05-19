"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export const NavigationProgress = () => {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsNavigating(true);
    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  return (
    <div
      suppressHydrationWarning={true}
      className={`fixed top-0 left-0 right-0 z-9999 h-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out ${isNavigating ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
      style={{
        transformOrigin: "left",
        willChange: "transform, opacity",
      }}
    />
  );
}
