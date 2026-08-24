"use client";

import React, { useState, useMemo } from "react";
import { AdminPageHeader, StatusBadge } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import { EventRegistrationItem } from "@/types/event";
import {
  Sparkles,
  Users,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { getEventRegistrationColumns } from "./columns";

export const EventRegistrationsScreen: React.FC = () => {
  const { registrations, isLoading, updateRegistrationStatus, deleteRegistration, stats } = useEventRegistrations();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (item.full_name || "").toLowerCase().includes(q);
        const matchEmail = (item.email || "").toLowerCase().includes(q);
        const matchEvent = (item.event_title || "").toLowerCase().includes(q);
        const matchPhone = (item.phone || "").toLowerCase().includes(q);
        return matchName || matchEmail || matchEvent || matchPhone;
      }
      return true;
    });
  }, [registrations, selectedStatus, searchQuery]);

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn đăng ký sự kiện này?")) {
      deleteRegistration(id);
    }
  };

  const renderExpandedRow = (item: EventRegistrationItem) => (
    <div className="px-8 py-5 bg-linear-to-r from-orange-50/40 via-slate-50/60 to-white rounded-2xl border border-orange-100/80 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
      <div className="space-y-1.5 min-w-[240px]">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          {item.full_name || "Khách mời"}
          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-mono font-bold">
            ID: {item.id.slice(0, 8).toUpperCase()}
          </span>
        </h4>
        <p className="text-xs text-gray-600 flex items-center gap-1.5">
          <Mail size={12} className="text-gray-400 shrink-0" /> {item.email}
        </p>
        <p className="text-xs text-gray-600 flex items-center gap-1.5 font-mono">
          <Phone size={12} className="text-gray-400 shrink-0" /> {item.phone || "Chưa có số điện thoại"}
        </p>
      </div>

      <div className="flex-1 max-w-xl bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1.5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-1 font-medium">
          <span className="text-gray-500">Sự kiện đăng ký:</span>
          <span className="text-orange-600 font-semibold">{item.event_title}</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Địa điểm & Thời gian:</span>
          <span>{item.location || "TBD"} • {item.event_date || "Chưa ấn định"}</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Ngày gửi đơn:</span>
          <span className="font-mono">{new Date(item.created_at).toLocaleString("vi-VN")}</span>
        </div>
        {item.notes && (
          <div className="pt-1 text-gray-600">
            <span className="font-semibold block text-[11px] text-gray-700">Ghi chú từ khách mời:</span>
            <p className="italic bg-orange-50/50 p-2 rounded-lg border border-orange-100/50 mt-1 text-[11.5px]">
              {item.notes}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {item.status !== "confirmed" && (
          <button
            onClick={() => updateRegistrationStatus(item.id, "confirmed")}
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <UserCheck size={13} /> Duyệt tham gia
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Header */}
      <AdminPageHeader
        title="Quản Lý"
        highlightTitle="Đăng Ký Sự Kiện"
        subtitle="Danh sách khách hàng và thành viên đăng ký tham dự các sự kiện Private Club"
        icon={Users}
        metrics={[
          { label: "Tổng Đăng Ký", value: stats.total, icon: <Users size={16} />, color: "blue" },
          { label: "Chờ Xác Nhận", value: stats.pending, icon: <Clock size={16} />, color: "orange" },
          { label: "Đã Xác Nhận", value: stats.confirmed, icon: <CheckCircle2 size={16} />, color: "emerald" },
        ]}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <Link
          href="/events"
          className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-2 tracking-wide uppercase"
        >
          <Sparkles size={14} />
          <span>Danh Sách Sự Kiện</span>
        </Link>
        <Link
          href="/events/registrations"
          className="px-4 py-2.5 text-xs font-bold text-orange-600 border-b-2 border-orange-600 flex items-center gap-2 tracking-wide uppercase transition"
        >
          <Users size={14} />
          <span>Đơn Đăng Ký Tham Gia</span>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo họ tên, email, sự kiện, SĐT..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none transition bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận (Pending)</option>
            <option value="confirmed">Đã xác nhận (Confirmed)</option>
            <option value="attended">Đã tham gia (Attended)</option>
            <option value="cancelled">Đã hủy (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getEventRegistrationColumns(updateRegistrationStatus, handleDelete)}
        data={filteredRegistrations}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy đơn đăng ký sự kiện nào phù hợp"
      />
    </div>
  );
};
