"use client";

import { PremiumButton, SearchComponent, SelectComponent } from "@/components";
import { CourseRegistrationStats } from "@/types/course";
import { FileSpreadsheet, Plus, RotateCw } from "lucide-react";
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
  onCreateRegistration?: () => void;
  onExportExcel?: () => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchText,
  setSearchText,
  selectedStatus,
  setSelectedStatus,
  selectedType = "ALL",
  setSelectedType,
  onSearch,
  onRefresh,
  isLoading = false,
  onCreateRegistration,
  onExportExcel,
}) => {
  const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái (All Status)" },
    { value: "pending", label: "⏳ Chờ xác nhận (Pending)" },
    { value: "confirmed", label: "✅ Đã xác nhận (Confirmed)" },
    { value: "approved", label: "🎓 Đã duyệt (Approved)" },
    { value: "completed", label: "🏆 Hoàn thành (Completed)" },
    { value: "rejected", label: "❌ Từ chối (Rejected)" },
    { value: "cancelled", label: "🚫 Đã hủy (Cancelled)" },
  ];

  const bookingTypeOptions = [
    { value: "ALL", label: "Tất cả loại hình (All Types)" },
    { value: "lounge", label: "🛋️ VIP Lounge" },
    { value: "course", label: "🎓 Khóa học (Course)" },
    { value: "workshop", label: "✨ Workshop & Seminar" },
    { value: "meeting-room", label: "🏢 Phòng họp (Meeting Room)" },
    { value: "consulting", label: "💼 Tư vấn 1-1 (Consulting)" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-2xl border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="flex-1">
          <SearchComponent
            placeholder="Tìm kiếm theo tên, email, SĐT, mã đơn hoặc dịch vụ..."
            value={searchText}
            onChange={setSearchText}
            onEnter={onSearch}
            size="md"
            className="shadow-none border-slate-100"
            inputClassName="bg-white/80 focus:ring-4 focus:ring-orange-500/5 h-12"
          />
        </div>

        {setSelectedType && (
          <div className="w-full sm:w-56 shrink-0">
            <SelectComponent placeholder="Tất cả loại hình" value={selectedType} onChange={setSelectedType} options={bookingTypeOptions} />
          </div>
        )}

        <div className="w-full sm:w-56 shrink-0">
          <SelectComponent placeholder="Tất cả trạng thái" value={selectedStatus} onChange={setSelectedStatus} options={statusOptions} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Làm mới danh sách"
              className="h-11 w-11 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/50 flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RotateCw size={16} className={isLoading ? "animate-spin text-orange-500" : ""} />
            </button>
          )}

          {onExportExcel && (
            <button
              type="button"
              onClick={onExportExcel}
              title="Xuất danh sách sang Excel"
              className="h-11 px-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80 font-bold text-[11.5px] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap"
            >
              <FileSpreadsheet size={16} className="text-emerald-600" />
              <span>Xuất Excel</span>
            </button>
          )}

          {onCreateRegistration && <PremiumButton label="Tạo đơn mới" icon={Plus} variant="gray" size="md" onClick={onCreateRegistration} />}
        </div>
      </div>
    </div>
  );
};
