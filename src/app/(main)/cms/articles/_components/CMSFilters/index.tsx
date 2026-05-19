"use client";

import { StatusTabs } from "@/app/(main)/(dashboard)/_components";
import { SearchComponent, SelectComponent, PremiumButton } from "@/components";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Archive,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Calendar
} from "lucide-react";
import React, { useMemo } from "react";
import { CATEGORY_OPTIONS } from "../../_constants/cms.constants";

interface CMSFiltersProps {
  searchText: string;
  setSearchText: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  counts: {
    total: number;
    published: number;
    draft: number;
    pendingReview: number;
    archived: number;
  };
  onReset: () => void;
  onAddClick: () => void;
}

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
    { key: "ALL", label: "Tất cả", icon: BookOpen, count: counts.total },
    { key: "PUBLISHED", label: "Đã xuất bản", icon: CheckCircle2, count: counts.published },
    { key: "DRAFT", label: "Bản nháp", icon: FileText, count: counts.draft },
    { key: "PENDING_REVIEW", label: "Chờ duyệt", icon: Clock, count: counts.pendingReview },
    { key: "ARCHIVED", label: "Đã lưu trữ", icon: Archive, count: counts.archived },
  ], [counts]);

  const categoryOptions = useMemo(() => [
    { label: "Tất cả danh mục", value: "ALL" },
    ...CATEGORY_OPTIONS
  ], []);

  const statusOptions = useMemo(() => [
    { label: "Tất cả trạng thái", value: "ALL" },
    { label: "Đã xuất bản", value: "PUBLISHED" },
    { label: "Bản nháp", value: "DRAFT" },
    { label: "Chờ duyệt", value: "PENDING_REVIEW" },
    { label: "Đã lưu trữ", value: "ARCHIVED" }
  ], []);

  return (
    <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-[2.5rem] border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500 space-y-4">
      {/* Top row: Status Tabs & Actions */}
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
            title="Làm mới bộ lọc"
          >
            <Filter size={12} /> Bộ lọc
          </button>

          <button
            onClick={() => alert("Xuất dữ liệu Excel...")}
            className="h-10 px-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200 text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download size={12} /> Xuất Excel
          </button>

          <PremiumButton
            label="Thêm bài viết"
            variant="orange"
            icon={Plus}
            onClick={onAddClick}
            className="rounded-2xl px-5 h-10 text-[11px] font-extrabold uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Bottom row: Search & Detailed filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        {/* Search */}
        <div className="lg:col-span-2">
          <SearchComponent
            placeholder="Tìm kiếm tiêu đề, mô tả..."
            value={searchText}
            onChange={setSearchText}
            size="md"
            className="shadow-none border-slate-100"
            inputClassName="bg-white/80 focus:ring-4 focus:ring-orange-500/5 h-12"
          />
        </div>

        {/* Category Dropdown */}
        <div className="lg:col-span-1">
          <SelectComponent
            placeholder="Danh mục"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
          />
        </div>

        {/* Status Dropdown */}
        <div className="lg:col-span-1">
          <SelectComponent
            placeholder="Trạng thái"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
          />
        </div>

        {/* Date picking - Start Date & End Date styled like the image */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-12 px-4 bg-white/80 border border-slate-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all shadow-sm"
              placeholder="Từ ngày"
            />
          </div>
          <span className="text-gray-400 text-xs font-bold">đến</span>
          <div className="relative flex-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-12 px-4 bg-white/80 border border-slate-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all shadow-sm"
              placeholder="Đến ngày"
            />
          </div>
          <button
            onClick={onReset}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-all shadow-xs shrink-0"
            title="Xóa bộ lọc"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
