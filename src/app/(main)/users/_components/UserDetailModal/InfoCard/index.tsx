"use client"

import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

export const InfoCard = ({ label, value, icon: Icon, color = "orange", className = "", suggestion }: any) => {
    const themes: any = {
        orange: "bg-orange-500",
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        purple: "bg-purple-500",
        rose: "bg-rose-500",
        slate: "bg-slate-500",
    };

    const hasData = value && value !== "Trống" && value !== "N/A" && value !== "Chưa cập nhật" && value !== "-";

    return (
        <div className={cn(
            "group relative p-4 rounded-[1.8rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-500 overflow-hidden",
            !hasData && "bg-slate-50/50 border-dashed border-slate-200",
            className
        )}>
            <div className={cn("absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-5 transition-all group-hover:opacity-20", "bg-" + color + "-500")} />

            <div className="flex items-center gap-4 relative z-10">
                <div className={cn("p-2.5 rounded-xl text-white shadow-lg transition-all duration-300 group-hover:scale-110",
                    !hasData ? "bg-slate-300" : (themes[color] || themes.orange))}>
                    <Icon size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-gray-600 mb-0.5 whitespace-nowrap">
                        {label}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-bold truncate", hasData ? "text-gray-800" : "text-gray-500 italic font-medium")}>
                            {hasData ? value : "Trống"}
                        </span>
                        {!hasData && suggestion && (
                            <div className="group/hint relative">
                                <AlertCircle size={12} className="text-orange-400 animate-pulse cursor-help" />
                                <div className="absolute bottom-full mb-2 left-0 px-3 py-2 bg-slate-900 text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/hint:opacity-100 transition-all shadow-2xl z-50 whitespace-nowrap pointer-events-none border border-white/10">
                                    Suggestion: {suggestion}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};