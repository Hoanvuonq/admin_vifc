"use client";

import { StatusTabs } from "@/app/(main)/(dashboard)/_components";
import { DateTimeInput, PremiumButton, SearchComponent, SelectComponent } from "@/components";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  RefreshCw
} from "lucide-react";
import React, { useMemo } from "react";
import { CATEGORY_OPTIONS } from "../../_constants/cms.constants";
import { CMSFiltersProps } from "./type";


export const CMSFilters: React.FC<CMSFiltersProps> = ({
  searchText,
  setSearchText,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  counts,
  onReset,
  onAddClick,
}) => {
  const tabs = useMemo(() => [
    { key: "ALL", label: "All", icon: BookOpen, count: counts.total },
    { key: "PUBLISHED", label: "Published", icon: CheckCircle2, count: counts.published },
    { key: "DRAFT", label: "Drafts", icon: FileText, count: counts.draft },
    { key: "PENDING_REVIEW", label: "Pending Review", icon: Clock, count: counts.pendingReview },
    { key: "ARCHIVED", label: "Archived", icon: Archive, count: counts.archived },
  ], [counts]);

  const categoryOptions = useMemo(() => [
    { label: "All Categories", value: "ALL" },
    ...CATEGORY_OPTIONS
  ], []);

  const statusOptions = useMemo(() => [
    { label: "All Statuses", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
    { label: "Pending Review", value: "PENDING_REVIEW" },
    { label: "Archived", value: "ARCHIVED" }
  ], []);

  return (
    <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-[2.5rem] border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="w-full lg:w-auto">
          <StatusTabs
            tabs={tabs}
            current={selectedStatus}
            onChange={setSelectedStatus}
            layoutId="cms-status-pill"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={onReset}
            className="h-10 px-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200 text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
            title="Clear Filters"
          >
            <Filter size={12} /> Filters
          </button>

          <button
            onClick={() => alert("Exporting to Excel...")}
            className="h-10 px-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200 text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download size={12} /> Export Excel
          </button>

          <PremiumButton
            label="Add Article"
            variant="orange"
            icon={Plus}
            onClick={onAddClick}
            className="rounded-2xl px-5 h-10 text-[11px] font-extrabold uppercase tracking-wider"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        <div className="lg:col-span-2">
          <SearchComponent
            placeholder="Search title, description..."
            value={searchText}
            onChange={setSearchText}
            size="md"
            className="shadow-none border-slate-100"
            inputClassName="bg-white/80 focus:ring-4 focus:ring-orange-500/5 h-12"
          />
        </div>

        <div className="lg:col-span-1">
          <SelectComponent
            placeholder="Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
          />
        </div>

        <div className="lg:col-span-1">
          <SelectComponent
            placeholder="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-2">
          <div className="flex-1">
            <DateTimeInput
              label=""
              value={startDate}
              onChange={setStartDate}
              isDate={true}
              placeholder="From Date"
            />
          </div>
          <span className="text-gray-400 text-xs font-bold shrink-0">to</span>
          <div className="flex-1">
            <DateTimeInput
              label=""
              value={endDate}
              onChange={setEndDate}
              isDate={true}
              placeholder="To Date"
            />
          </div>
          <button
            onClick={onReset}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-all shadow-xs shrink-0"
            title="Clear filters"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
