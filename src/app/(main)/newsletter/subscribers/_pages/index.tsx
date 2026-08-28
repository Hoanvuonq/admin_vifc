"use client";

import React, { useState, useMemo } from "react";
import { AdminPageHeader, SelectComponent } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useNewsletterRegistrations } from "@/hooks/useNewsletterRegistrations";
import { NewsletterRegistrationItem } from "@/types/newsletter";
import { Mail, Search, CheckCircle2, UserX, Clock, Calendar, MapPin, Check, X, Eye } from "lucide-react";
import { getRegistrationColumns } from "./columns";
import { NewsletterRegistrationDetailModal } from "../_components/NewsletterRegistrationDetailModal";

const REGISTRATION_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "approved", label: "Đã duyệt (Approved)", color: "text-emerald-500" },
  { value: "pending", label: "Chờ xử lý (Pending)", color: "text-amber-500" },
  { value: "rejected", label: "Từ chối (Rejected)", color: "text-rose-500" },
];

export const NewsletterSubscribersScreen: React.FC = () => {
  const { registrations, isLoading, updateRegistrationStatus, deleteRegistration, stats } =
    useNewsletterRegistrations();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRegistration, setSelectedRegistration] = useState<NewsletterRegistrationItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEmail = (item.email || "").toLowerCase().includes(q);
        const matchName = (item.full_name || "").toLowerCase().includes(q);
        const matchTitle = (item.newsletter_title || "").toLowerCase().includes(q);
        const matchLoc = (item.location || "").toLowerCase().includes(q);
        return matchEmail || matchName || matchTitle || matchLoc;
      }
      return true;
    });
  }, [registrations, selectedStatus, searchQuery]);

  const handleOpenDetail = (item: NewsletterRegistrationItem) => {
    setSelectedRegistration(item);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn đăng ký này khỏi danh sách?")) {
      deleteRegistration(id);
    }
  };

  const renderExpandedRow = (item: NewsletterRegistrationItem) => (
    <div className="px-8 py-4 bg-linear-to-r from-amber-50/40 via-slate-50/60 to-white rounded-2xl border border-amber-100/80 m-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-inner animate-in fade-in duration-300">
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
          {item.full_name || "Chưa đặt tên"}
          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">
            ID: {item.id}
          </span>
        </h4>
        <p className="text-xs text-gray-600 flex items-center gap-1.5 select-all font-mono">
          <Mail size={12} className="text-orange-500 shrink-0" /> {item.email}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-gray-600">
        <div className="space-y-1">
          <span className="font-semibold text-gray-800 block text-[11.5px]">
            Ấn phẩm: {item.newsletter_title}
          </span>
          <div className="flex items-center gap-3 text-gray-500 text-[11px] font-mono">
            {item.newsletter_date && (
              <span className="flex items-center gap-1">
                <Calendar size={11} className="text-amber-600" />
                {item.newsletter_date}
              </span>
            )}
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-orange-500" />
                {item.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => handleOpenDetail(item)}
          className="h-8 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs bg-white text-gray-700 hover:text-amber-700 border border-gray-200"
        >
          <Eye size={12} />
          <span>Chi tiết</span>
        </button>
        {item.status !== "approved" && (
          <button
            onClick={() => updateRegistrationStatus(item.id, "approved")}
            className="h-8 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
          >
            <Check size={12} />
            <span>Duyệt đơn</span>
          </button>
        )}
        {item.status !== "rejected" && (
          <button
            onClick={() => updateRegistrationStatus(item.id, "rejected")}
            className="h-8 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
          >
            <X size={12} />
            <span>Từ chối</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Header */}
      <AdminPageHeader
        title="Danh Sách Đăng Ký"
        highlightTitle="Newsletter"
        subtitle="Quản lý danh sách người dùng đăng ký nhận các ấn phẩm bản tin thị trường từ cổng Web Portal"
        icon={Mail}
        metrics={[
          { label: "Tổng Đơn Đăng Ký", value: stats.total, icon: <Mail size={16} />, color: "blue" },
          { label: "Đã Duyệt", value: stats.approved, icon: <CheckCircle2 size={16} />, color: "emerald" },
          { label: "Chờ Xử Lý", value: stats.pending, icon: <Clock size={16} />, color: "orange" },
          { label: "Từ Chối", value: stats.rejected, icon: <UserX size={16} />, color: "gray" },
        ]}
      />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo email, họ tên, ấn phẩm..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-amber-500 outline-none transition bg-white"
          />
        </div>

        <div className="w-full sm:w-60">
          <SelectComponent
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val as string)}
            options={REGISTRATION_STATUS_OPTIONS}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getRegistrationColumns(handleOpenDetail, updateRegistrationStatus, handleDelete)}
        data={filteredRegistrations}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy đơn đăng ký bản tin nào phù hợp"
      />

      {/* Detail Modal */}
      <NewsletterRegistrationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        registration={selectedRegistration}
        onUpdateStatus={updateRegistrationStatus}
      />
    </div>
  );
};
