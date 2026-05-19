"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface CloseButtonProps {
    onClick: () => void;
    className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative size-10 flex items-center justify-center rounded-2xl transition-all duration-300",
                "bg-white/50 backdrop-blur-md border border-orange-100/50 shadow-sm",
                "hover:bg-orange-500 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]",
                "active:scale-90",
                className
            )}
            aria-label="Close"
        >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-tr from-orange-400/20 to-white/20 blur-md" />

            <X
                size={18}
                strokeWidth={3}
                className="relative z-10 text-gray-600 group-hover:text-white group-hover:rotate-90 transition-all duration-500 ease-out"
            />
        </button>
    );
};