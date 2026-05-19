"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const TopLoadingBar = () => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const completeTimeout = useRef<NodeJS.Timeout | null>(null);
    const resetTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        if (completeTimeout.current) clearTimeout(completeTimeout.current);
        if (resetTimeout.current) clearTimeout(resetTimeout.current);

        setVisible(true);
        setProgress(0);

        setTimeout(() => {
            setProgress(30);
        }, 10);

        progressInterval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    if (progressInterval.current) clearInterval(progressInterval.current);
                    return prev;
                }
                const increment = Math.max(1, (90 - prev) / 10);
                return prev + increment;
            });
        }, 100);

        completeTimeout.current = setTimeout(() => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            setProgress(100);

            resetTimeout.current = setTimeout(() => {
                setVisible(false);
                setTimeout(() => setProgress(0), 300);
            }, 400);
        }, 500);

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (completeTimeout.current) clearTimeout(completeTimeout.current);
            if (resetTimeout.current) clearTimeout(resetTimeout.current);
        };
    }, [pathname, searchParams]);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-99999 pointer-events-none"
            suppressHydrationWarning
        >
            <div
                className="h-[3px] transition-all ease-out relative"
                style={{
                    width: `${progress}%`,
                    opacity: visible ? 1 : 0,
                    transitionDuration: visible && progress > 0 ? "200ms" : "0ms",
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #d946ef, #f43f5e)",
                    boxShadow: "0 0 10px rgba(139, 92, 246, 0.6), 0 0 5px rgba(236, 72, 153, 0.4)",
                    willChange: "width, opacity",
                }}
            >
                {visible && progress > 0 && (
                    <div
                        className="absolute right-0 top-0 h-full w-24 opacity-60 mix-blend-overlay"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
                            transform: "translateX(50%)",
                            filter: "blur(2px)",
                        }}
                    />
                )}
            </div>
        </div>
    );
};
