"use client";

import { ActionTooltipBtn, Column, StatusBadge } from "@/components";
import { EventItem } from "@/types/event";
import { Calendar, ExternalLink, MapPin, Pencil, Power, Sparkles, Trash2 } from "lucide-react";

export const getEventColumns = (
  onEdit: (event: EventItem) => void,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void,
): Column<EventItem>[] => [
  {
    header: "Sự Kiện & Private Club",
    accessor: "title" as keyof EventItem,
    render: (item: EventItem) => (
      <div className="flex items-center gap-3.5 py-1 min-w-[280px]">
        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-stone-900 border border-orange-100/80 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
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
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">{item.title}</span>
          <span className="text-[11.5px] text-gray-500 font-medium line-clamp-1">{item.subtitle || "Sự kiện kết nối đối tác chiến lược"}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Địa điểm & Thời gian",
    accessor: "location" as keyof EventItem,
    render: (item: EventItem) => (
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
          <MapPin size={13} className="text-orange-500 shrink-0" />
          <span className="truncate max-w-[170px]">{item.location || "Online / TBD"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
          <Calendar size={12} className=" text-gray-700 shrink-0" />
          <span>{item.date || "Chưa ấn định"}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Cổng Đăng Ký Luma",
    accessor: "luma_url" as keyof EventItem,
    render: (item: EventItem) => {
      if (!item.luma_url) {
        return <span className="text-xs  text-gray-700 font-medium italic">Chưa gắn link</span>;
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
        <ActionTooltipBtn onClick={() => onEdit(item)} icon={<Pencil size={14} />} color="gray" tooltip="Chỉnh sửa sự kiện" />
        <ActionTooltipBtn
          onClick={() => onToggleStatus(item.id)}
          icon={<Power size={14} className={item.status === "active" ? "text-emerald-600" : " text-gray-700"} />}
          color={item.status === "active" ? "emerald" : "gray"}
          tooltip={item.status === "active" ? "Tạm ẩn sự kiện" : "Kích hoạt mở sự kiện"}
        />
        <ActionTooltipBtn onClick={() => onDelete(item.id)} icon={<Trash2 size={14} className="text-rose-500" />} color="rose" tooltip="Xóa sự kiện" />
      </div>
    ),
  },
];
