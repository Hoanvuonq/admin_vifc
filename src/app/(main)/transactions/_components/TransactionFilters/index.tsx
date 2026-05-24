"use client";

import { StatusTabs } from "@/app/(main)/(dashboard)/_components";
import { SearchComponent } from "@/components";
import { CheckCircle2, AlertCircle, Clock, Filter, Receipt } from "lucide-react";
import React, { useMemo } from "react";

export interface TransactionFiltersProps {
  searchText: string;
  setSearchText: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  counts: {
    total: number;
    success: number;
    pending: number;
    failed: number;
  };
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchText,
  setSearchText,
  selectedStatus,
  setSelectedStatus,
  counts,
}) => {
  const tabs = useMemo(() => [
    { key: "ALL", label: "All Transactions", icon: Receipt, count: counts.total },
    { key: "SUCCESS", label: "Completed", icon: CheckCircle2, count: counts.success },
    { key: "PENDING", label: "Pending", icon: Clock, count: counts.pending },
    { key: "FAILED", label: "Failed", icon: AlertCircle, count: counts.failed },
  ], [counts]);

  return (
    <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-[2.5rem] border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          <StatusTabs
            tabs={tabs as any}
            current={selectedStatus}
            onChange={setSelectedStatus}
            layoutId="trx-status-pill"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              setSearchText("");
              setSelectedStatus("ALL");
            }}
            className="h-10 px-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200 text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
            title="Clear Filters"
          >
            <Filter size={12} /> Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        <div className="lg:col-span-3">
          <SearchComponent
            placeholder="Search by ID, User Name, Email..."
            value={searchText}
            onChange={setSearchText}
            size="md"
            className="shadow-none border-slate-100"
            inputClassName="bg-white/80 focus:ring-4 focus:ring-orange-500/5 h-12"
          />
        </div>
      </div>
    </div>
  );
};
