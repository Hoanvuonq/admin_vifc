"use client";

import { AlertTriangle, CheckCircle2, Coins, HelpCircle, RefreshCw, ScrollText } from "lucide-react";
import { CardBox } from "..";
import { useMemo } from "react";
import { cn } from "@/utils/cn";

export interface LiquidityAlertData {
    poolId: string;
    tokenASymbol: string;
    tokenBSymbol: string;
    currentLiquidity: number;
    threshold: number;
    healthScore: number; // 0 to 100
}

const MOCK_LIQUIDITY_POOLS: LiquidityAlertData[] = [
    {
        poolId: "vifc-usdt",
        tokenASymbol: "VIFC",
        tokenBSymbol: "USDT",
        currentLiquidity: 4250,
        threshold: 25000,
        healthScore: 17,
    },
    {
        poolId: "sol-usdc",
        tokenASymbol: "SOL",
        tokenBSymbol: "USDC",
        currentLiquidity: 12500,
        threshold: 50000,
        healthScore: 25,
    },
    {
        poolId: "eth-usdt",
        tokenASymbol: "ETH",
        tokenBSymbol: "USDT",
        currentLiquidity: 8900,
        threshold: 20000,
        healthScore: 44,
    },
];

interface LowLiquidityListProps {
    pools?: LiquidityAlertData[];
    onRefresh?: () => void;
    loading?: boolean;
}

export const LowLiquidityList = ({ pools = MOCK_LIQUIDITY_POOLS, onRefresh, loading }: LowLiquidityListProps) => {
    const activePools = useMemo(() => pools && pools.length > 0 ? pools : MOCK_LIQUIDITY_POOLS, [pools]);

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const criticalCount = useMemo(() => {
        return activePools.filter(p => p.healthScore <= 20).length;
    }, [activePools]);

    return (
        <CardBox
            title="Low Liquidity Alerts"
            description="Liquidity pools nearing critical reserve safety thresholds"
            icon={AlertTriangle}
            onRefresh={onRefresh}
            loading={loading}
            footer={
                <>
                    <ScrollText size={12} className="text-orange-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase italic">
                        {activePools.length > 0 ? (
                            <>
                                Detected {activePools.length} pools under threshold
                                {criticalCount > 0 && (
                                    <span className="text-rose-600 ml-1 font-bold">
                                        • {criticalCount} CRITICAL
                                    </span>
                                )}
                            </>
                        ) : "System pools are stable"}
                    </span>
                </>
            }
        >
            <div className="grid grid-cols-1 gap-4">
                {activePools.map((item) => {
                    const healthPercentage = Math.min(100, Math.max(0, (item.currentLiquidity / item.threshold) * 100));
                    const isCritical = item.healthScore <= 20;

                    return (
                        <div
                            key={item.poolId}
                            className="group/pool relative bg-white rounded-4xl border border-slate-100 p-4 transition-all duration-500 hover:border-orange-200 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.08)] hover:-translate-y-0.5 flex flex-col gap-3 overflow-hidden"
                        >
                            {/* Pool title and badge */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-[10px] font-extrabold text-white border-2 border-white shadow-sm shadow-orange-100 select-none">
                                            {item.tokenASymbol[0]}
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-[10px] font-extrabold text-white border-2 border-white shadow-sm shadow-indigo-100 select-none">
                                            {item.tokenBSymbol[0]}
                                        </div>
                                    </div>
                                    <h5 className="font-bold text-[12px] text-gray-950 uppercase italic tracking-tight leading-none">
                                        {item.tokenASymbol}/{item.tokenBSymbol}
                                    </h5>
                                </div>

                                <span className={cn(
                                    "text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                    isCritical
                                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                                        : "bg-amber-50 text-amber-600 border border-amber-100"
                                )}>
                                    {isCritical ? "Critical Alert" : "Attention"}
                                </span>
                            </div>

                            {/* Liquidity progress bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">
                                    <span>Pool Health</span>
                                    <span className={isCritical ? "text-rose-600" : "text-amber-600"}>
                                        {item.healthScore}% ({formatPrice(item.currentLiquidity)} / {formatPrice(item.threshold)})
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            isCritical ? "bg-linear-to-r from-rose-400 to-red-500" : "bg-linear-to-r from-amber-400 to-orange-500"
                                        )}
                                        style={{ width: `${healthPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </CardBox>
    );
};