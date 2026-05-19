"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

type LoadingSize = "sm" | "md" | "lg";

interface SectionLoadingProps {
    message?: string;
    className?: string;
    isOverlay?: boolean;
    size?: LoadingSize;
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
    message = "Đang xử lý dữ liệu...",
    className = "",
    isOverlay = false,
    size = "sm",
}) => {
    const sizeConfig = {
        sm: {
            container: "w-12 h-12",
            ring1: "border-2",
            ring2: "border-2",
            dot: "w-1.5 h-1.5",
            textSize: "text-[10px]",
            spacing: "space-y-4",
        },
        md: {
            container: "w-20 h-20",
            ring1: "border-2",
            ring2: "border-2",
            dot: "w-2.5 h-2.5",
            textSize: "text-[12px]",
            spacing: "space-y-6",
        },
        lg: {
            container: "w-32 h-32",
            ring1: "border-[3px]",
            ring2: "border-[3px]",
            dot: "w-4 h-4",
            textSize: "text-[15px]",
            spacing: "space-y-8",
        },
    };

    const config = sizeConfig[size];

    return (
        <div
            className={cn(
                "flex items-center justify-center relative overflow-hidden transition-all duration-700",
                isOverlay
                    ? "absolute inset-0 z-50 rounded-2xl bg-white/60 backdrop-blur-md"
                    : "min-h-[400px] w-full bg-linear-to-b from-gray-50/50 to-white/30",
                className
            )}
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500 rounded-full blur-[120px] pointer-events-none"
            />

            <div className={cn("relative z-10 flex flex-col items-center", config.spacing)}>
                <div className={cn("relative flex items-center justify-center", config.container)}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className={cn(
                            "absolute inset-0 rounded-full border-dashed border-orange-200",
                            config.ring1
                        )}
                    />

                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className={cn(
                            "absolute inset-2 rounded-full border-orange-500 border-t-transparent border-l-transparent shadow-[0_0_15px_rgba(249,115,22,0.3)]",
                            config.ring2
                        )}
                    />

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className={cn(
                            "absolute inset-4 rounded-full border-gray-200 border-r-transparent border-b-transparent opacity-40",
                            config.ring2
                        )}
                    />

                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 1, 0.8],
                            boxShadow: [
                                "0 0 0px rgba(249,115,22,0)",
                                "0 0 20px rgba(249,115,22,0.6)",
                                "0 0 0px rgba(249,115,22,0)",
                            ],
                        }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className={cn("bg-orange-500 rounded-full z-20", config.dot)}
                    />
                </div>

                <div className="flex flex-col items-center gap-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <h3
                            className={cn(
                                "font-bold   uppercase text-gray-900 drop-shadow-sm italic",
                                config.textSize
                            )}
                        >
                            {message.replace("...", "")}
                        </h3>

                        <div className="flex gap-1.5 mt-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 1, 0.3],
                                        backgroundColor: ["#9ca3af", "#f97316", "#9ca3af"],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.2,
                                        delay: i * 0.2,
                                        ease: "easeInOut",
                                    }}
                                    className="w-1.5 h-1.5 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>

                    {size === "lg" && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 1 }}
                            className="text-[10px] font-bold text-gray-600 uppercase mt-1"
                        >
                            Hệ thống đang điều phối tài nguyên
                        </motion.p>
                    )}
                </div>
            </div>
        </div>
    );
};