"use client";

import { Activity, CheckCircle2, Clock, XCircle, Zap } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CardBox } from "@/app/(main)/(dashboard)/_components";
import { DonutChartStatusProps } from "./type";


export const DonutChartStatus = ({ data, onRefresh, loading }: DonutChartStatusProps) => {

  const successCount = useMemo(() => {
    if (!data) return 0;
    const completed = data.statusCounts?.COMPLETED ?? data.completedCount ?? 0;
    const shipped = data.statusCounts?.SHIPPED ?? data.shippedCount ?? 0;
    const paid = data.statusCounts?.PAID ?? data.paidCount ?? 0;
    return completed + shipped + paid;
  }, [data]);

  const pendingCount = useMemo(() => {
    if (!data) return 0;
    const pending = data.statusCounts?.PENDING ?? data.pendingCount ?? 0;
    const created = data.statusCounts?.CREATED ?? 0;
    return pending + created;
  }, [data]);

  const cancelledCount = useMemo(() => {
    if (!data) return 0;
    const cancelled = data.statusCounts?.CANCELLED ?? data.cancelledCount ?? 0;
    return cancelled;
  }, [data]);

  const chartData = useMemo(() => {
    return [
      { name: "Success", value: successCount, color: "#f97316" },
      { name: "Pending", value: pendingCount, color: "#fb923c" },
      { name: "Cancelled", value: cancelledCount, color: "#f43f5e" }
    ].filter(item => item.value > 0);
  }, [successCount, pendingCount, cancelledCount]);

  const successRate = useMemo(() => {
    if (!data || !data.totalOrders) return 0;
    return Math.round((successCount / data.totalOrders) * 100);
  }, [data, successCount]);

  const pendingRate = useMemo(() => {
    if (!data || !data.totalOrders) return 0;
    return Math.round((pendingCount / data.totalOrders) * 100);
  }, [data, pendingCount]);

  const cancelledRate = useMemo(() => {
    if (!data || !data.totalOrders) return 0;
    return Math.round((cancelledCount / data.totalOrders) * 100);
  }, [data, cancelledCount]);

  const sparklineSuccess = useMemo(() => [
    { value: 12 }, { value: 16 }, { value: 14 }, { value: 20 }, { value: 18 }, { value: 24 }, { value: 22 }
  ], []);

  const sparklinePending = useMemo(() => [
    { value: 6 }, { value: 8 }, { value: 5 }, { value: 9 }, { value: 7 }, { value: 8 }, { value: 6 }
  ], []);

  const sparklineCancelled = useMemo(() => [
    { value: 2 }, { value: 4 }, { value: 1 }, { value: 3 }, { value: 2 }, { value: 1 }, { value: 2 }
  ], []);

  return (
    <CardBox
      title="Status Analysis"
      description="Analysis of order structure and status"
      icon={Activity}
      onRefresh={onRefresh}
      loading={loading}
    >
      <style jsx global>{`
        .recharts-sector, .recharts-surface, .recharts-layer {
            outline: none !important;
            -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div className="relative group/chart">
        <div className="h-64 mt-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: 'none' }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                cornerRadius={4}
                stroke="#fff"
                strokeWidth={2}
                animationBegin={0}
                animationDuration={1500}
                style={{ outline: 'none', border: 'none' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-85 transition-opacity outline-none"
                    style={{
                      filter: `drop-shadow(0px 8px 12px ${entry.color}25)`,
                      outline: 'none',
                      border: 'none'
                    }}
                    tabIndex={-1}
                  />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-3xl shadow-xl shadow-orange-500/10 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                          <span className="text-[10px] font-bold uppercase text-gray-600 tracking-wider">{payload[0].name}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 tabular-nums">
                          {payload[0].value}
                          <span className="text-xs ml-1.5 text-gray-600 font-bold uppercase">orders</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
            <div className="relative flex flex-col gap-3 items-center justify-center w-40 h-40 rounded-full border-4 border-slate-50 bg-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.3)] backdrop-blur-sm transition-transform duration-500 group-hover/chart:scale-105">
              <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full mb-1 shadow-custom">
                <Zap size={10} fill="currentColor" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Statistics</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tighter tabular-nums leading-none">
                  {data?.successRate || 0}
                </span>
                <span className="text-lg font-bold text-orange-500 ml-0.5">%</span>
              </div>
              <span className="text-[10px] font-bold text-green-600 uppercase mt-1 tracking-widest italic text-center">Success Rate</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-3 gap-2 mt-8">
        <div className="relative group/metric overflow-hidden p-3 pb-3.5 rounded-3xl bg-white border border-slate-100 transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg hover:border-orange-200/80">
          <div className="flex justify-between items-start mb-2.5 relative z-20">
            <div className="p-1.5 rounded-xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100/50 group-hover/metric:scale-105 transition-transform duration-300">
              <CheckCircle2 size={14} />
            </div>
            <div className="text-[8.5px] font-extrabold text-orange-600 bg-orange-50/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-orange-100/50">
              {successRate}%
            </div>
          </div>
          <div className="relative z-20">
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">Success</span>
            <div className="text-lg font-extrabold text-gray-900 tracking-tight tabular-nums transition-colors duration-300 group-hover/metric:text-orange-600">{successCount}</div>
          </div>

          <div className="absolute -bottom-1 left-0 right-0 h-10 pointer-events-none opacity-50 group-hover/metric:opacity-100 transition-opacity duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineSuccess} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#gradientOrange)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative group/metric overflow-hidden p-3 pb-3.5 rounded-3xl bg-white border border-slate-100 transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg hover:border-amber-200/80">
          <div className="flex justify-between items-start mb-2.5 relative z-20">
            <div className="p-1.5 rounded-xl bg-orange-50/20 text-orange-500 shadow-sm border border-orange-100/30 group-hover/metric:scale-105 transition-transform duration-300">
              <Clock size={14} />
            </div>
            <div className="text-[8.5px] font-extrabold text-orange-500 bg-orange-50/30 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-orange-100/30">
              {pendingRate}%
            </div>
          </div>
          <div className="relative z-20">
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">Pending</span>
            <div className="text-lg font-extrabold text-gray-900 tracking-tight tabular-nums transition-colors duration-300 group-hover/metric:text-orange-500">{pendingCount}</div>
          </div>

          <div className="absolute -bottom-1 left-0 right-0 h-10 pointer-events-none opacity-50 group-hover/metric:opacity-100 transition-opacity duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklinePending} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#fb923c"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#gradientAmber)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative group/metric overflow-hidden p-3 pb-3.5 rounded-3xl bg-white border border-slate-100 transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg hover:border-rose-200/80">
          <div className="flex justify-between items-start mb-2.5 relative z-20">
            <div className="p-1.5 rounded-xl bg-rose-50 text-rose-500 shadow-sm border border-rose-100/50 group-hover/metric:scale-105 transition-transform duration-300">
              <XCircle size={14} />
            </div>
            <div className="text-[8.5px] font-extrabold text-rose-500 bg-rose-50/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-rose-100/50">
              {cancelledRate}%
            </div>
          </div>
          <div className="relative z-20">
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">Cancelled</span>
            <div className="text-lg font-extrabold text-rose-500 tracking-tight tabular-nums transition-colors duration-300 group-hover/metric:text-rose-600">{cancelledCount}</div>
          </div>

          <div className="absolute -bottom-1 left-0 right-0 h-10 pointer-events-none opacity-50 group-hover/metric:opacity-100 transition-opacity duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineCancelled} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientRose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#gradientRose)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CardBox>
  );
};
