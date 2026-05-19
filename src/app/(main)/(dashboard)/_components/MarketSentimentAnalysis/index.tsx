"use client";

import { PremiumButton } from "@/components";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Award, MessageSquare, Sparkles, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { CardBox } from "..";

export interface MarketSentimentData {
    sentimentIndex: number; // e.g. 78
    sentimentLabel: string; // e.g., "Greed"
    sentimentChange24h: number; // e.g., 4.2
    positiveRate: number; // e.g., 64
    neutralRate: number; // e.g., 26
    negativeRate: number; // e.g., 10
    totalMentions: number; // e.g., 14250
}

const MOCK_SENTIMENT: MarketSentimentData = {
    sentimentIndex: 78,
    sentimentLabel: "Greed",
    sentimentChange24h: 4.8,
    positiveRate: 64,
    neutralRate: 26,
    negativeRate: 10,
    totalMentions: 14250,
};

interface MarketSentimentAnalysisProps {
    data?: MarketSentimentData;
    onRefresh?: () => void;
    loading?: boolean;
}

export const MarketSentimentAnalysis = ({ data = MOCK_SENTIMENT, onRefresh, loading }: MarketSentimentAnalysisProps) => {
    const activeData = useMemo(() => data || MOCK_SENTIMENT, [data]);

    return (
        <CardBox
            title="Market Sentiment Analysis"
            description="On-chain and social sentiment signals for trading pairs"
            icon={Award}
            onRefresh={onRefresh}
            loading={loading}
            footer={
                <>
                    <PremiumButton
                        label="Analyze Mentions"
                        variant="orange"
                        onClick={() => { }}
                        size="sm"
                        className="px-6 py-2 rounded-4xl font-bold uppercase text-[9px] tracking-widest"
                    />
                    <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[8px] uppercase">
                        <MessageSquare size={12} />
                        Social Mentions: {activeData.totalMentions.toLocaleString()}
                    </div>
                </>
            }
        >
            <div className="space-y-4">
                {/* Big main index container */}
                <div className="bg-orange-50/40 rounded-3xl border border-orange-100/50 p-5 flex justify-between items-center relative shadow-sm">
                    <div className="relative z-10 flex flex-col justify-center">
                        <span className="text-xs font-bold text-gray-700 uppercase mb-2">Fear & Greed Index</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-7xl font-bold bg-linear-to-b from-orange-300 to-orange-500 bg-clip-text text-transparent leading-none tabular-nums">
                                {activeData.sentimentIndex}
                            </span>
                            <span className="text-xl font-bold text-orange-500 uppercase italic">/100</span>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-xs border border-slate-50 w-fit">
                            <TrendingUp size={12} className="text-orange-500" />
                            <span className="text-[10px] font-extrabold text-orange-600 uppercase tabular-nums">
                                {activeData.sentimentLabel} (+{activeData.sentimentChange24h}% 24h)
                            </span>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-100 flex items-center justify-end pr-2">
                        <div className="relative w-full h-[140px] animate-in fade-in zoom-in duration-1000">
                            <Image
                                src="/icons/icon-reviews.png"
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-contain object-right"
                                alt="Analytics Illustration"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Sentiment card breakdown grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        {
                            label: "Positive",
                            value: activeData.positiveRate,
                            color: "text-emerald-500",
                            bg: "bg-emerald-50/50",
                            border: "emerald",
                            icon: Sparkles,
                            path: "M 0 30 Q 20 20, 40 35 T 80 25 T 100 15"
                        },
                        {
                            label: "Neutral",
                            value: activeData.neutralRate,
                            color: "text-amber-500",
                            bg: "bg-amber-50/50",
                            border: "amber",
                            icon: Star,
                            path: "M 0 35 Q 20 30, 40 35 T 80 30 T 100 35"
                        },
                        {
                            label: "Negative",
                            value: activeData.negativeRate,
                            color: "text-rose-500",
                            bg: "bg-rose-50/50",
                            border: "rose",
                            icon: TrendingUp,
                            path: "M 0 15 Q 20 25, 40 15 T 80 35 T 100 40"
                        }
                    ].map((s) => (
                        <motion.div
                            key={s.label}
                            whileHover={{ y: -2 }}
                            className={cn(
                                "relative p-3 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col min-h-[130px] group transition-all hover:shadow-sm",
                                "border-t-2",
                                s.border === "emerald" ? "border-t-emerald-500" :
                                    s.border === "amber" ? "border-t-amber-500" : "border-t-rose-500"
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-5 shrink-0", s.bg)}>
                                <s.icon size={18} className={s.color} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 leading-none">{s.label}</span>
                            <div className="flex items-baseline gap-0.5">
                                <span className={cn("text-2xl font-bold tabular-nums tracking-tighter leading-none", s.color)}>
                                    {s.value}
                                </span>
                                <span className={cn("text-[10px] font-bold leading-none", s.color)}>%</span>
                            </div>

                            <div className="absolute bottom-3 right-3 w-12 h-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                                <svg viewBox="0 0 100 40" className={cn("w-full h-full fill-none stroke-3", s.color)}>
                                    <path
                                        d={s.path}
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </CardBox>
    );
};