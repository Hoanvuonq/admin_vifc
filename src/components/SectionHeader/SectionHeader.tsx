"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { SectionHeaderProps } from "./type";

export const SectionHeader = ({
    icon: Icon,
    title,
    description,
    colorClass = "text-orange-500",
    bgClass = "bg-orange-50",
    className,
    children,
    size = "md",
}: SectionHeaderProps) => {
    if (!Icon && !title && !children) return null;

    const sizeConfig = {
        sm: {
            gap: "gap-3",
            iconSize: 14,
            iconPadding: "p-2",
            iconRadius: "rounded-xl",
            titleSize: "text-[13px]",
            descSize: "text-[9px] mt-0.5",
        },
        md: {
            gap: "gap-4",
            iconSize: 18,
            iconPadding: "p-2.5",
            iconRadius: "rounded-2xl",
            titleSize: "text-[15px]",
            descSize: "text-[10px] mt-1",
        },
        lg: {
            gap: "gap-5",
            iconSize: 22,
            iconPadding: "p-3.5",
            iconRadius: "rounded-[22px]",
            titleSize: "text-[18px]",
            descSize: "text-[11px] mt-1.5",
        },
    };

    const config = sizeConfig[size];

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "flex items-center px-1 group/header relative cherry-bomb-one-regular",
                config.gap,
                className,
            )}
        >
            {Icon && (
                <div className="relative shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "relative z-10 transition-all duration-500 flex items-center justify-center overflow-hidden border border-white/40 shadow-sm",
                            "group-hover/header:shadow-orange-200/50 group-hover/header:shadow-xl group-hover/header:border-white/80",
                            config.iconPadding,
                            config.iconRadius,
                            bgClass,
                            colorClass,
                        )}
                    >
                        <div className="absolute inset-0 bg-linear-to-tr from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />

                        <motion.div
                            animate={{
                                x: ["100%", "-100%"],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 2
                            }}
                            className="absolute inset-0 w-1/2 bg-white/30 skew-x-[-20deg] blur-xl pointer-events-none"
                        />

                        <Icon size={config.iconSize} strokeWidth={2.5} className="relative z-10 drop-shadow-sm" />
                    </motion.div>

                    <div className={cn(
                        "absolute -inset-2 blur-2xl opacity-0 group-hover/header:opacity-40 transition-opacity duration-700 pointer-events-none",
                        colorClass.replace("text", "bg")
                    )} />
                </div>
            )}

            {(title || description) && (
                <div className="flex flex-col min-w-0 py-1">
                    {title && (
                        <motion.h3
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={cn(
                                "font-bold text-gray-700 uppercase leading-none tracking-tight flex items-center gap-2 italic",
                                config.titleSize,
                            )}
                        >
                            {title}
                            <div className="h-1 w-8 bg-linear-to-r from-orange-400 to-transparent rounded-full opacity-30 group-hover/header:w-16 transition-all duration-700" />
                        </motion.h3>
                    )}

                    {description && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={cn(
                                "font-semibold text-gray-600 uppercase italic leading-none flex items-center gap-2",
                                config.descSize,
                            )}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/header:bg-orange-400 transition-colors duration-500" />
                            {description}
                        </motion.div>
                    )}
                </div>
            )}

            <div className="flex-1 relative h-6 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-slate-200 via-slate-100 to-transparent" />
                <motion.div
                    animate={{
                        x: ["0%", "100%"],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-0 left-0 w-1/4 h-[1.5px] bg-linear-to-r from-transparent via-orange-400/40 to-transparent"
                />
            </div>

            {children && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center"
                >
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
};
