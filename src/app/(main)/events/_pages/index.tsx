"use client";

import React, { useState, useMemo } from "react";
import { AdminPageHeader, PremiumButton, StatusBadge } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useEvents } from "@/hooks/useEvents";
import { EventItem, CreateEventPayload } from "@/types/event";
import { Sparkles, Plus, Search, Calendar, CheckCircle2, ExternalLink, Users, MapPin, Edit, Tag, Info } from "lucide-react";
import Link from "next/link";
import { getEventColumns } from "./columns";
import { CreateEditEventModal } from "../_components/CreateEditEventModal";

export const EventListScreen: React.FC = () => {
  const { events, isLoading, createEvent, updateEvent, deleteEvent, toggleEventStatus, stats } = useEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (item.title || "").toLowerCase().includes(q);
        const matchLoc = (item.location || "").toLowerCase().includes(q);
        const matchBadge = (item.badge || "").toLowerCase().includes(q);
        return matchTitle || matchLoc || matchBadge;
      }
      return true;
    });
  }, [events, selectedStatus, searchQuery]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này khỏi danh sách?")) {
      deleteEvent(id);
    }
  };

  const handleSubmitModal = async (data: CreateEventPayload) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    } else {
      await createEvent(data);
    }
  };

  const renderExpandedRow = (item: EventItem) => (
    <div className="px-8 py-5 bg-linear-to-r from-orange-50/40 via-slate-50/60 to-white rounded-2xl border border-orange-100/80 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-28 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-950">
          <img
            src={item.image || "/admin/card-event-01.png"}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </div>
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-900">{item.title}</span>
            {item.badge && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <MapPin size={12} className="text-orange-500 shrink-0" /> {item.location}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 font-mono">
            <Calendar size={12} className=" text-gray-700 shrink-0" /> {item.date}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-xl bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-2">
        <div className="flex items-center justify-between border-b border-gray-100 pb-1 font-medium">
          <span className="text-gray-500">Cổng Đăng Ký Lu.ma:</span>
          {item.luma_url ? (
            <a href={item.luma_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline flex items-center gap-1">
              <span>{item.luma_url}</span>
              <ExternalLink size={11} />
            </a>
          ) : (
            <span className="italic  text-gray-700">Chưa thiết lập</span>
          )}
        </div>
        {item.description && (
          <div className="pt-1 text-gray-600">
            <span className="font-semibold block text-[11px] text-gray-700 mb-0.5">Giới thiệu sự kiện:</span>
            <p className="italic bg-orange-50/40 p-2 rounded-lg border border-orange-100/50 leading-relaxed text-[11.5px]">{item.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-center lg:self-start">
        <button
          onClick={() => handleOpenEdit(item)}
          className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 text-[11px] font-bold uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Edit size={12} /> Chỉnh sửa
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Header */}
      <AdminPageHeader
        title="Quản Lý"
        highlightTitle="Sự Kiện & Private Club"
        subtitle="Quản lý danh sách sự kiện đặc quyền, cấu hình link Luma và thông tin chi tiết"
        icon={Sparkles}
        metrics={[
          { label: "Tổng Sự Kiện", value: stats.total, icon: <Calendar size={16} />, color: "blue" },
          { label: "Đang Mở", value: stats.active, icon: <CheckCircle2 size={16} />, color: "emerald" },
          { label: "Có Link Luma", value: stats.hasLuma, icon: <ExternalLink size={16} />, color: "orange" },
        ]}
      >
        <PremiumButton label="Thêm Sự Kiện Mới" icon={Plus} onClick={handleOpenCreate} size="md" variant="orange" className="shadow-lg shadow-orange-500/20" />
      </AdminPageHeader>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <Link
          href="/events"
          className="px-4 py-2.5 text-xs font-bold text-orange-600 border-b-2 border-orange-600 flex items-center gap-2 tracking-wide uppercase transition"
        >
          <Sparkles size={14} />
          <span>Danh Sách Sự Kiện</span>
        </Link>
        <Link
          href="/events/registrations"
          className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-2 tracking-wide uppercase"
        >
          <Users size={14} />
          <span>Đơn Đăng Ký Tham Gia</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3  text-gray-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên sự kiện, địa điểm, badge..."
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
            <option value="active">Đang mở (Active)</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="completed">Đã kết thúc</option>
            <option value="inactive">Tạm ẩn</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getEventColumns(handleOpenEdit, handleDelete, toggleEventStatus)}
        data={filteredEvents}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy sự kiện nào phù hợp với bộ lọc"
      />

      {/* Create / Edit Modal */}
      <CreateEditEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitModal} initialData={editingEvent} />
    </div>
  );
};
