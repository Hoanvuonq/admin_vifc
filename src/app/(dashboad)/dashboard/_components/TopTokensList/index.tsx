"use client";

import { cn } from "@/utils/cn";
import { Coins, Medal, ScrollText, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { CardBox } from "..";
import { TopTokensListProps, Web3TokenData } from "./types";
import { useMemo, useState, useEffect } from "react";

const MOCK_TOKENS: Web3TokenData[] = [
    {
        tokenId: "btc",
        tokenName: "Bitcoin",
        symbol: "BTC",
        tradeVolume: "28.4B",
        price: 67250.50,
        priceChange24h: 3.42,
    },
    {
        tokenId: "eth",
        tokenName: "Ethereum",
        symbol: "ETH",
        tradeVolume: "14.2B",
        price: 3512.20,
        priceChange24h: 1.85,
    },
    {
        tokenId: "sol",
        tokenName: "Solana",
        symbol: "SOL",
        tradeVolume: "4.8B",
        price: 178.60,
        priceChange24h: 8.74,
    },
];

export const TopTokensList = ({ tokens = MOCK_TOKENS, onRefresh, loading }: TopTokensListProps) => {
    const activeTokens = useMemo(() => tokens && tokens.length > 0 ? tokens : MOCK_TOKENS, [tokens]);
    const [timeStr, setTimeStr] = useState<string>("");

    useEffect(() => {
        setTimeStr(new Date().toLocaleTimeString("en-US"));
    }, [loading]);

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(val);
    };

    return (
        <CardBox
            title="Top Performing Tokens"
            description="Leading assets by trade volume and market performance"
            icon={Trophy}
            onRefresh={onRefresh}
            loading={loading}
            footer={
                <>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                        <ScrollText size={12} className="text-orange-500" />
                        <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                            High Yield Assets
                        </span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        Updated: {timeStr || "--:--:--"}
                    </span>
                </>
            }
        >
            <div className="grid grid-cols-1 gap-4">
                {activeTokens.map((item, idx) => {
                    const isTop3 = idx < 3;
                    const medalColors = ["text-yellow-500", "text-slate-400", "text-orange-400"];
                    const isPositive = item.priceChange24h >= 0;

                    // Creative inline representation of coins
                    const tokenBadgeColors: Record<string, string> = {
                        BTC: "from-amber-400 to-orange-500 text-white shadow-orange-100",
                        ETH: "from-indigo-400 via-purple-500 to-indigo-600 text-white shadow-indigo-100",
                        SOL: "from-teal-400 via-emerald-500 to-cyan-500 text-white shadow-teal-100",
                    };

                    const badgeStyle = tokenBadgeColors[item.symbol.toUpperCase()] || "from-slate-400 to-slate-600 text-white";

                    return (
                        <div
                            key={item.tokenId}
                            className="group/item relative bg-white rounded-4xl border border-slate-100 p-4 transition-all duration-500 hover:border-orange-200 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.12)] hover:-translate-y-1 flex items-center gap-5 overflow-hidden"
                        >
                            {/* Medal rank */}
                            <div className={cn(
                                "absolute top-0 left-0 w-12 h-12 flex items-center justify-center transition-all duration-500",
                                isTop3 ? "bg-orange-50/80 rounded-br-4xl" : "bg-slate-50/50 rounded-br-3xl"
                            )}>
                                {isTop3 ? (
                                    <Medal size={20} className={medalColors[idx]} strokeWidth={2.5} />
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-500 tabular-nums">#{idx + 1}</span>
                                )}
                            </div>

                            {/* Token visual emblem instead of product image */}
                            <div className={cn(
                                "relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-linear-to-br font-extrabold shadow-md shrink-0 border border-white ml-4 select-none",
                                badgeStyle
                            )}>
                                <span className="text-xs tracking-wider font-extrabold italic leading-none mb-0.5">{item.symbol}</span>
                                <Coins size={14} className="opacity-70" />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <h4 className="font-bold text-gray-950 text-[13px] leading-tight line-clamp-1 uppercase italic tracking-tight group-hover/item:text-orange-600 transition-colors">
                                    {item.tokenName}
                                </h4>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">24h Vol</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {isPositive ? (
                                                <TrendingUp size={12} className="text-emerald-500 animate-pulse" />
                                            ) : (
                                                <TrendingDown size={12} className="text-rose-500 animate-pulse" />
                                            )}
                                            <span className="text-xs font-bold text-gray-800 tabular-nums">${item.tradeVolume}</span>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded-sm",
                                                isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                            )}>
                                                {isPositive ? "+" : ""}{item.priceChange24h.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-bold text-gray-500 uppercase">Token Price</span>
                                        <span className="text-base font-bold text-orange-600 italic tabular-nums leading-none mt-0.5">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-linear-to-tr from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    );
                })}
            </div>
        </CardBox>
    );
};