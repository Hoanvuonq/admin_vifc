"use client";

import { ActionTooltipBtn, Column, StatusBadge } from "@/components";
import { EventItem } from "@/types/event";
import { Calendar, ExternalLink, Eye, MapPin, Pencil, Power, Sparkles, Trash2 } from "lucide-react";

export const getEventColumns = (
  onEdit: (event: EventItem) => void,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void,
  onPreview?: (event: EventItem) => void,
): Column<EventItem>[] => [
  {
    header: "Sự Kiện & Private Club",
    accessor: "title" as keyof EventItem,
    render: (item: EventItem) => (
      <div className="flex items-center gap-3 py-3 max-w-sm">
        <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-stone-900 border border-orange-100/80 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <img
            src={item.image || "/admin/card-event-01.png"}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";
            }}
          />
          {item.badge && (
            <span className="absolute bottom-0.5 left-0.5 right-0.5 px-1 py-0.2 rounded bg-black/70 backdrop-blur-xs text-[8.5px] font-bold text-amber-300 text-center truncate">
              {item.badge}
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0 max-w-[220px] sm:max-w-[280px]">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors truncate" title={item.title}>
            {item.title}
          </span>
          <span className="text-[11.5px] text-gray-500 font-medium truncate" title={item.description || item.subtitle || ""}>
            {item.description || item.subtitle || "Sự kiện kết nối đối tác chiến lược"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Cổng Đăng Ký Lu.ma",
    accessor: "luma_url" as keyof EventItem,
    render: (item: EventItem) => {
      if (!item.luma_url) {
        return <span className="text-xs text-gray-400 font-medium italic">Chưa gắn link</span>;
      }
      return (
        <a
          href={item.luma_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50/90 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200/80 shadow-2xs hover:shadow-xs transition-all active:scale-95 group/luma"
        >
          <Sparkles size={12} className="text-orange-500 group-hover/luma:rotate-12 transition-transform" />
          <span>Mở Lu.ma</span>
          <ExternalLink size={11} className="text-orange-400" />
        </a>
      );
    },
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof EventItem,
    align: "center",
    render: (item: EventItem) => (
      <StatusBadge
        status={item.status === "active" ? "ACTIVE" : item.status === "upcoming" ? "PENDING" : item.status === "completed" ? "COMPLETED" : "INACTIVE"}
        label={item.status === "active" ? "ĐANG MỞ" : item.status === "upcoming" ? "SẮP DIỄN RA" : item.status === "completed" ? "KẾT THÚC" : "TẠM ẨN"}
        variant="premium"
      />
    ),
  },
  {
    header: "Thao tác",
    align: "center",
    render: (item: EventItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {onPreview && (
          <ActionTooltipBtn
            onClick={() => onPreview(item)}
            icon={<Eye size={14} className="text-orange-600" />}
            color="orange"
            tooltip="Xem trước popup Lu.ma"
          />
        )}
        <ActionTooltipBtn onClick={() => onEdit(item)} icon={<Pencil size={14} />} color="gray" tooltip="Chỉnh sửa sự kiện" />
        <ActionTooltipBtn
          onClick={() => onToggleStatus(item.id)}
          icon={<Power size={14} className={item.status === "active" ? "text-emerald-600" : "text-gray-400"} />}
          color={item.status === "active" ? "emerald" : "gray"}
          tooltip={item.status === "active" ? "Tạm ẩn sự kiện" : "Kích hoạt mở sự kiện"}
        />
        <ActionTooltipBtn onClick={() => onDelete(item.id)} icon={<Trash2 size={14} className="text-rose-500" />} color="rose" tooltip="Xóa sự kiện" />
      </div>
    ),
  },
];
