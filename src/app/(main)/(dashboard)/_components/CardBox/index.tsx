"use client";

import { SectionHeader, SectionLoading } from "@/components";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import React, { ReactNode } from "react";

interface CardBoxProps {
    title: string;
    description: string;
    icon: any;
    onRefresh?: () => void;
    loading?: boolean;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
    contentClassName?: string;
    height?: string;
}

export const CardBox = ({
    title,
    description,
    icon,
    onRefresh,
    loading,
    children,
    footer,
    className,
    contentClassName,
    height = "h-[550px]"
}: CardBoxProps) => {
    const [showLoading, setShowLoading] = React.useState(false);
    const loadingStartTime = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (loading) {
            setShowLoading(true);
            loadingStartTime.current = Date.now();
        } else {
            const currentTime = Date.now();
            const elapsed = loadingStartTime.current ? currentTime - loadingStartTime.current : 0;
            const remaining = Math.max(1000 - elapsed, 0);

            const timer = setTimeout(() => {
                setShowLoading(false);
                loadingStartTime.current = null;
            }, remaining);

            return () => clearTimeout(timer);
        }
    }, [loading]);

    return (
        <div className={cn(
            "bg-white rounded-4xl border border-slate-100 shadow-custom flex flex-col h-[650px] overflow-hidden group/list relative transition-all duration-500",
            height,
            className
        )}>
            <div className="flex items-center justify-between p-4 border-b border-orange-50 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <SectionHeader title={title} description={description} icon={icon} size="sm" />
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={loading || showLoading}
                        className="p-3 rounded-2xl cursor-pointer bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all active:scale-90 group/btn shadow-sm border border-orange-100"
                    >
                        <RefreshCcw size={18} className={cn((loading || showLoading) ? "animate-spin" : "group-hover/btn:rotate-180 duration-500")} />
                    </button>
                )}
            </div>

            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {showLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-40"
                        >
                            <SectionLoading
                                isOverlay
                                message="Loading..."
                                size="sm"
                                className="h-full"
                            />
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <motion.div
                    animate={{
                        filter: showLoading ? "blur(4px)" : "blur(0px)",
                        opacity: showLoading ? 0.3 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "h-full overflow-y-auto p-6 custom-scrollbar bg-linear-to-b from-white to-orange-50/10",
                        contentClassName
                    )}
                >
                    {children}
                </motion.div>
            </div>

            {footer && (
                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-orange-50 flex items-center justify-center gap-3 z-20">
                    {footer}
                </div>
            )}
        </div>
    );
};
