"use client";

import { SearchComponent, SelectComponent } from "@/components";
import { CourseRegistrationStats } from "@/types/course";
import React from "react";

export interface CourseFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedType?: string;
  setSelectedType?: (type: string) => void;
  counts?: CourseRegistrationStats;
  onSearch?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchText,
  setSearchText,
  selectedStatus,
  setSelectedStatus,
  onSearch,
}) => {
  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "approved", label: "Đã duyệt" },
    { value: "completed", label: "Hoàn thành" },
    { value: "rejected", label: "Từ chối" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-[2.5rem] border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="flex-1">
          <SearchComponent
            placeholder="Search by name, email, phone or ID.."
            value={searchText}
            onChange={setSearchText}
            onEnter={onSearch}
            size="md"
            className="shadow-none border-slate-100"
            inputClassName="bg-white/80 focus:ring-4 focus:ring-orange-500/5 h-12"
          />
        </div>

        {/* Status select dropdown */}
        <div className="w-full md:w-56 shrink-0">
          <SelectComponent
            placeholder="All Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
          />
        </div>
      </div>
    </div>
  );
};
