"use client"
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

export const MetricItem = ({
    label,
    value,
    icon,
    color,
    isMoney = false,
    suffix = "",
    compact = false,
    trend = { value: 12.5, isUp: true }
}: {
    label: string,
    value: number | string,
    icon: React.ReactNode,
    color: "orange" | "emerald" | "blue" | "purple" | "gray" | "rose",
    isMoney?: boolean,
    suffix?: string,
    compact?: boolean,
    trend?: { value: number; isUp: boolean }
}) => {
    const colorMap = {
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5",
        gray: "text-gray-500 bg-gray-500/10 border-gray-500/20 shadow-gray-500/5",
        rose: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5",
    };

    const trendColors = trend.isUp
        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
        : "text-rose-600 bg-rose-500/10 border-rose-500/20";

    const displayValue = typeof value === "number"
        ? (isMoney ? (value) : formatNumber(value))
        : value;

    const Sparkline = () => {
        const trendId = `trend-${color}-${trend.isUp}`;
        const gradientColor = trend.isUp ? "#10b981" : "#f43f5e";
        const pathData = trend.isUp
            ? "M1 10C5 8 8 2 12 5C16 8 20 10 24 6C28 2 32 4 39 1"
            : "M1 1C5 3 8 10 12 7C16 4 20 2 24 6C28 10 32 8 39 11";

        return (
            <svg width="28" height="10" viewBox="0 0 40 12" fill="none" className="ml-1.5 shrink-0 opacity-40 group-hover/metric:opacity-100 transition-opacity duration-500">
                <defs>
                    <linearGradient id={trendId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`${pathData} L39 12 L1 12 Z`} fill={`url(#${trendId})`} />
                <path d={pathData} stroke={gradientColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    return (
        <div className={cn(
            "itim-regular relative group/metric flex items-center transition-all duration-500 cursor-pointer overflow-hidden",
            "bg-white/40 backdrop-blur-md border border-white/60",
            "hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1",
            compact
                ? "gap-3 px-3 py-2.5 rounded-[20px]"
                : "gap-2 px-2 py-2 rounded-[28px]"
        )}>
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover/metric:opacity-10 transition-opacity duration-700 pointer-events-none",
                color === 'orange' && 'bg-orange-500',
                color === 'emerald' && 'bg-emerald-500',
                color === 'blue' && 'bg-blue-500',
                color === 'purple' && 'bg-purple-500',
                color === 'gray' && 'bg-gray-500',
                color === 'rose' && 'bg-rose-500',
            )} />

            <div className={cn(
                "relative flex items-center justify-center shrink-0 border rounded-2xl transition-all duration-500",
                "group-hover/metric:scale-110 group-hover/metric:rotate-3 shadow-inner",
                compact ? "w-9 h-9" : "w-10 h-10",
                colorMap[color]
            )}>
                <div className="relative z-10 transition-transform duration-500 group-hover/metric:scale-110">
                    {icon}
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-[inherit] blur-[2px] opacity-0 group-hover/metric:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "font-bold text-gray-900 tracking-tighter tabular-nums leading-none",
                        compact ? "text-md" : "text-lg"
                    )}>
                        {displayValue}
                        {suffix && <span className="text-xs font-bold opacity-40 ml-0.5">{suffix}</span>}
                    </span>

                    {trend && (
                        <div className={cn(
                            "flex items-center px-1.5 py-0.5 rounded-full border text-[9px] font-bold tracking-tight transition-all duration-500",
                            trendColors
                        )}>
                            {trend.isUp ? "↑" : "↓"} {trend.value}%
                            {!compact && <Sparkline />}
                        </div>
                    )}
                </div>

                <span className={cn(
                    "font-semibold text-gray-600 uppercase tracking-widest transition-colors duration-300 group-hover/metric:text-gray-600",
                    compact ? "text-[8px] mt-0.5" : "text-[9px] mt-1"
                )}>
                    {label}
                </span>
            </div>

            <div className="absolute inset-0 -translate-x-full group-hover/metric:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none" />
        </div>
    );
};
