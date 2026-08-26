"use client";

import { AdminPageHeader, PremiumButton, SelectComponent, UnifiedRegistrationModal } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useEvents } from "@/hooks/useEvents";
import { CreateEventPayload, EventItem } from "@/types/event";
import { Calendar, CheckCircle2, Edit, ExternalLink, Eye, MapPin, Plus, Search, Sparkles } from "lucide-react";
import React, { useMemo, useState } from "react";
import { CreateEditEventModal } from "../_components/CreateEditEventModal";
import { getEventColumns } from "./columns";

const EVENT_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang mở (Active)", color: "text-emerald-500" },
  { value: "upcoming", label: "Sắp diễn ra", color: "text-amber-500" },
  { value: "completed", label: "Đã kết thúc", color: "text-slate-500" },
  { value: "inactive", label: "Tạm ẩn", color: "text-rose-500" },
];

export const EventListScreen: React.FC = () => {
  const { events, isLoading, createEvent, updateEvent, deleteEvent, toggleEventStatus, stats } = useEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Preview Modal state
  const [previewItem, setPreviewItem] = useState<EventItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handleOpenPreview = (event: EventItem) => {
    setPreviewItem(event);
    setIsPreviewOpen(true);
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
          <p className="text-xs text-gray-500 line-clamp-2">{item.description || item.subtitle}</p>
          {item.location && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <MapPin size={12} className="text-orange-500 shrink-0" /> {item.location}
            </p>
          )}
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
            <span className="italic text-gray-400">Chưa thiết lập</span>
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
          onClick={() => handleOpenPreview(item)}
          className="h-9 px-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100 text-[11px] font-bold uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Eye size={12} /> Xem Popup Lu.ma
        </button>
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
        highlightTitle="Sự Kiện"
        subtitle="Quản lý danh sách sự kiện, cấu hình link đăng ký Lu.ma và thông tin chi tiết"
        icon={Sparkles}
        metrics={[
          { label: "Tổng Sự Kiện", value: stats.total, icon: <Calendar size={16} />, color: "blue" },
          { label: "Đang Mở", value: stats.active, icon: <CheckCircle2 size={16} />, color: "emerald" },
          { label: "Có Link Luma", value: stats.hasLuma, icon: <ExternalLink size={16} />, color: "orange" },
        ]}
      >
        <PremiumButton label="Thêm Sự Kiện Mới" icon={Plus} onClick={handleOpenCreate} size="md" variant="orange" className="shadow-lg shadow-orange-500/20" />
      </AdminPageHeader>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên sự kiện, mô tả, link Luma..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none transition bg-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <SelectComponent value={selectedStatus} onChange={(val) => setSelectedStatus(val as string)} options={EVENT_STATUS_FILTER_OPTIONS} />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getEventColumns(handleOpenEdit, handleDelete, toggleEventStatus, handleOpenPreview)}
        data={filteredEvents}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy sự kiện nào phù hợp với bộ lọc"
      />

      {/* Create / Edit Modal */}
      <CreateEditEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitModal} initialData={editingEvent} />

      {/* Unified Registration Live Preview Modal */}
      {previewItem && (
        <UnifiedRegistrationModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          type="event"
          title={previewItem.title}
          subtitle={previewItem.subtitle}
          banner={previewItem.image}
          description={previewItem.description}
          luma_url={previewItem.luma_url}
          badge={previewItem.badge}
          location={previewItem.location}
          date={previewItem.date}
        />
      )}
    </div>
  );
};
