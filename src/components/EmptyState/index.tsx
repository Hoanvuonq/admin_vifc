"use client";

import { PremiumButton } from "@/components";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Lightbulb, LucideIcon, Plus, Search, ShoppingBag, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { EmptyStateProps } from "./type";
import { TableView } from "./_components/TableView";
import { SuggestionsBar } from "./_components/SuggestionsBar";

export const EmptyState = ({
    title,
    message,
    description,
    link,
    onReset,
    onAction,
    isShop = false,
    isFlashSale = false,
    isTable = false,
    icon: Icon,
    subIcon: SubIcon = Search,
    showButton = true,
    buttonText,
    className,
    compact = false,
}: EmptyStateProps & { isTable?: boolean }) => {
    const finalAction = onReset || onAction;
    const finalButtonText = buttonText || (isTable ? "Thêm mới" : "Quay lại");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "relative flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] border border-dashed border-orange-200 shadow-[0_8px_32px_rgba(249,115,22,0.05)] my-4 itim-regular overflow-hidden",
                isFlashSale
                    ? (compact ? "py-8 md:py-10 px-4" : "pt-20 md:pt-32 pb-8 md:pb-10 px-4 md:px-12")
                    : (compact ? "py-8 md:py-10 px-4" : isTable ? "py-10 md:py-14 px-6 md:px-12" : "py-6 md:py-16 px-6 md:px-12"),
                className
            )}>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 md:w-40 h-24 md:h-40 bg-orange-100/30 blur-2xl md:blur-[60px] rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-24 md:w-40 h-24 md:h-40 bg-orange-50/40 blur-2xl md:blur-[60px] rounded-full" />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className={cn("relative", compact ? "mb-2" : isTable ? "mb-6" : "mb-6")}
            >
                <div className={cn("relative z-10 flex items-center justify-center", compact ? "w-28 h-28" : isTable ? "w-48 h-48 md:w-56 md:h-56" : "w-40 h-40 md:w-48 md:h-48")}>
                    <div className="absolute inset-0 bg-orange-200/20 blur-3xl rounded-full scale-110" />


                    <TableView Icon={typeof Icon !== "string" ? (Icon as LucideIcon) : undefined} />


                    {!isFlashSale && !isTable && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 border-2 border-dashed border-orange-200/30 rounded-full"
                        />
                    )}

                    {!compact && !isFlashSale && !isTable && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-2 -right-2 text-orange-400"
                        >
                            <Sparkles size={20} />
                        </motion.div>
                    )}
                </div>

                {!isFlashSale && !isTable && (
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 12 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        className={cn(
                            "absolute -bottom-1 -right-1 z-20 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center border-2 border-white shadow-lg",
                            compact ? "w-7 h-7" : "w-9 h-9"
                        )}
                    >
                        <SubIcon size={compact ? 12 : 16} className="text-white" strokeWidth={3} />
                    </motion.div>
                )}
            </motion.div>

            <div className={cn("relative z-10 text-center", compact ? "max-w-[240px]" : "max-w-[420px]")}>
                <motion.h3
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={cn(
                        "font-bold mb-2 leading-tight tracking-tight uppercase overflow-visible inline-block italic",
                        isFlashSale || isTable ? "text-2xl" : "text-xl text-gray-800",
                    )}
                >
                    {title}
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                        "font-semibold leading-relaxed tracking-wide uppercase text-[10px]",
                        isFlashSale || isTable ? "text-gray-500/80" : "text-gray-500",
                        compact ? "px-2" : "max-w-[300px] mx-auto"
                    )}
                >
                    {message || description}
                </motion.p>
            </div>

            {showButton && (finalAction || link) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={cn(compact ? "mt-4" : "mt-8")}
                >
                    {link ? (
                        <Link href={link}>
                            <PremiumButton
                                variant="orange"
                                label={finalButtonText}
                                icon={isFlashSale ? Zap : isTable ? Plus : ShoppingBag}
                                onClick={finalAction}
                                className={cn(
                                    "rounded-2xl shadow-xl transition-all duration-500",
                                    isFlashSale || isTable ? "h-12 px-10 bg-linear-to-r from-orange-500 to-orange-600 hover:scale-105 shadow-orange-500/40 text-white" : "shadow-orange-500/20",
                                    compact ? "h-10 px-6 text-[10px]" : "h-11 px-8 text-sm"
                                )}
                            />
                        </Link>
                    ) : (
                        <PremiumButton
                            variant="orange"
                            label={finalButtonText}
                            icon={isFlashSale ? Zap : isTable ? Plus : ShoppingBag}
                            onClick={finalAction}
                            className={cn(
                                "rounded-2xl shadow-xl transition-all duration-500",
                                isFlashSale || isTable ? "h-12 px-10 bg-linear-to-r from-orange-500 to-orange-600 hover:scale-105 shadow-orange-500/40 text-white" : "shadow-orange-500/20",
                                compact ? "h-10 px-6 text-[10px]" : "h-11 px-8 text-sm"
                            )}
                        />
                    )}
                </motion.div>
            )}

            {isTable && !compact && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 w-full max-w-[600px] bg-orange-50/30 border border-orange-100/50 rounded-2xl p-4 flex items-center gap-4 relative group overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-500 shrink-0 border border-orange-50">
                        <Lightbulb size={20} className="animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Gợi ý cho bạn</h4>
                        <p className="text-[10px] text-gray-500 leading-tight">Thử thay đổi bộ lọc hoặc thêm mới dữ liệu.</p>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 transition-colors p-1">
                        <Plus size={16} className="rotate-45" />
                    </button>
                    <div className="absolute top-0 right-0 w-24 h-full bg-linear-to-l from-orange-100/10 to-transparent pointer-events-none" />
                </motion.div>
            )}

            {!compact && !isTable && <SuggestionsBar />}

            <div className="absolute bottom-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-orange-200/40 to-transparent" />
        </motion.div>
    );
};

export const CustomEmptyState = EmptyState;
