"use client";

import { SectionHeader } from "@/components";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import { Activity, ShoppingBag, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import _ from "lodash";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueLineChartProps {
  revenueData?: (string | number)[];
  orderData?: number[];
  secondaryData?: (string | number)[];
  secondaryOrderData?: number[];
  primaryLabel?: string;
  secondaryLabel?: string;
  period?: 'today' | '7d' | '30d' | 'all';
  title?: string;
  subTitle?: string;
  loading?: boolean;
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const RevenueLineChart = ({
  revenueData,
  orderData,
  secondaryData,
  secondaryOrderData,
  primaryLabel,
  secondaryLabel,
  period = 'today',
  title,
  subTitle,
  loading
}: RevenueLineChartProps) => {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");

  const hasComparison = useMemo(() => {
    if (metric === "revenue") return !_.isEmpty(secondaryData);
    return !_.isEmpty(secondaryOrderData);
  }, [secondaryData, secondaryOrderData, metric]);

  const chartData = useMemo(() => {
    const targetSource = metric === "revenue" ? revenueData : orderData;
    if (_.isEmpty(targetSource)) return [];

    const isHourly = _.get(targetSource, 'length') === 24 || period === 'today';

    return targetSource!.map((val, idx) => {
      const revVal = _.get(revenueData, idx);
      const rev = typeof revVal === 'string'
        ? parseFloat(revVal) || 0
        : (revVal as number || 0);
      const ord = _.get(orderData, idx) || 0;

      let sec = 0;
      if (metric === "revenue") {
        const secVal = _.get(secondaryData, idx);
        sec = typeof secVal === 'string'
          ? parseFloat(secVal) || 0
          : (secVal as number || 0);
      } else {
        sec = _.get(secondaryOrderData, idx) || 0;
      }

      let label = '';
      if (isHourly) {
        label = `${String(idx).padStart(2, '0')}:00`;
      } else {
        const date = dayjs().subtract(targetSource!.length - 1 - idx, 'day');
        label = date.format('MM/DD');
      }

      return {
        label,
        value: metric === "revenue" ? rev : ord,
        revenue: rev,
        orders: ord,
        secondary: sec,
        isHourly
      };
    });
  }, [revenueData, orderData, secondaryData, secondaryOrderData, metric, period]);

  const peak = useMemo(() => {
    if (_.isEmpty(chartData)) return { label: "N/A", value: 0 };
    return _.maxBy(chartData, 'value') || { label: "N/A", value: 0 };
  }, [chartData]);

  const formatYAxis = (value: number) => {
    if (metric === "orders") return value.toLocaleString();
    let formatted = '';
    if (value >= 1000000000) formatted = `${(value / 1000000000).toFixed(1)}B`;
    else if (value >= 1000000) {
      const millionValue = value / 1000000;
      formatted = `${millionValue >= 10 ? millionValue.toFixed(0) : millionValue.toFixed(1)}M`;
    }
    else if (value >= 1000) formatted = `${(value / 1000).toFixed(0)}k`;
    else formatted = value.toLocaleString();
    return `$${formatted}`;
  };

  return (
    <div className="h-full bg-white rounded-[2.5rem] p-4 shadow-custom flex flex-col justify-between border-none animate-in fade-in duration-700">
      <style jsx global>{`
        .recharts-sector, .recharts-surface, .recharts-layer, .recharts-dot {
            outline: none !important;
            -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <SectionHeader
          icon={metric === "revenue" ? Activity : ShoppingBag}
          title={metric === "revenue" ? (title || "Revenue Analysis") : "Order Frequency"}
          description={subTitle || "Overview report of store revenue and sales activity"}
        />

        <div className="flex items-center gap-3">
          {hasComparison && (
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner mr-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{primaryLabel || "Current Period"}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{secondaryLabel || "Previous Period"}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner shrink-0">
            <button
              onClick={() => setMetric("revenue")}
              className={cn(
                "px-4 py-2 rounded-xl cursor-pointer text-[10px] font-bold uppercase transition-all",
                metric === "revenue" ? "bg-white text-orange-600 shadow-sm border border-orange-100" : "text-gray-600 hover:text-gray-600"
              )}
            >
              Revenue
            </button>
            <button
              onClick={() => setMetric("orders")}
              className={cn(
                "px-4 py-2 rounded-xl cursor-pointer text-[10px] font-bold uppercase transition-all",
                metric === "orders" ? "bg-white text-indigo-600 shadow-sm border border-indigo-100" : "text-gray-600 hover:text-gray-600"
              )}
            >
              Orders
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full relative group/line">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 0, right: 10, top: 10, bottom: 10 }} style={{ outline: 'none' }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric === "revenue" ? "#f97316" : "#6366f1"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={metric === "revenue" ? "#f97316" : "#6366f1"} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
              dy={15}
              interval={Math.max(0, Math.floor(chartData.length / 8))}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
              tickFormatter={formatYAxis}
              width={60}
              domain={['auto', 'auto']}
            />
            <Tooltip
              cursor={{ stroke: metric === "revenue" ? "#f97316" : "#6366f1", strokeWidth: 2, strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-5 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 min-w-56">
                      <div className="text-[10px] font-bold uppercase text-gray-600 mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
                        <span>{dataPoint.isHourly ? "Time" : "Date"}</span>
                        <span className="italic text-gray-400">{dataPoint.label}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-orange-600 uppercase tracking-tighter mb-1">{metric === "revenue" ? "Revenue" : "Orders"}</span>
                          <span className="text-lg font-bold text-orange-600 italic tracking-tighter">
                            {metric === "revenue" ? formatPrice(dataPoint.revenue || 0) : `${dataPoint.orders} ${dataPoint.orders === 1 ? 'Order' : 'Orders'}`}
                          </span>
                        </div>
                        {hasComparison && (
                          <div className="flex flex-col pt-2 border-t border-gray-50">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{secondaryLabel || "Previous Period"}</span>
                            <span className="text-base font-bold text-gray-500 italic tracking-tighter">
                              {metric === "revenue" ? formatPrice(dataPoint.secondary || 0) : `${dataPoint.secondary} ${dataPoint.secondary === 1 ? 'Order' : 'Orders'}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {hasComparison && (
              <Area
                type="monotone"
                dataKey="secondary"
                stroke="#cbd5e1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSecondary)"
                dot={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={metric === "revenue" ? "#f97316" : "#6366f1"}
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorMetric)"
              dot={{ r: 0 }}
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: "#fff",
                fill: metric === "revenue" ? "#f97316" : "#6366f1",
                style: { outline: 'none' },
                tabIndex: -1
              }}
              animationDuration={1500}
              style={{ outline: 'none' }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-[2.5rem] animate-in fade-in duration-300">
            <div className="w-10 h-10 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin shadow-lg" />
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-600 uppercase mb-1">
              Peak {metric === "revenue" ? "Revenue" : "Orders"}
            </span>
            <span className={cn(
              "text-xs font-bold uppercase italic px-3 py-1 rounded-lg border shadow-xs transition-colors",
              metric === "revenue" ? "text-orange-900 bg-orange-50 border-orange-100" : "text-indigo-900 bg-indigo-50 border-indigo-100"
            )}>
              {peak.label} <span className="mx-1 opacity-20">•</span> {formatYAxis(peak.value)}
            </span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[9px] font-bold text-gray-600 uppercase mb-1">Data Source</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Dashboard Service</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl italic shadow-inner">
            <TrendingUp size={12} className="text-orange-500" />
            <span className="text-[10px] font-bold text-gray-500">BI Analytics v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
