"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const SmoothScroll = () => {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      prevPathnameRef.current !== null &&
      prevPathnameRef.current !== pathname
    ) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      });
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
};
