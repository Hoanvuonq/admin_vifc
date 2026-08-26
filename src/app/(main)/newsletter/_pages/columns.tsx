"use client";

import React from "react";
import { ActionTooltipBtn, Column, StatusBadge } from "@/components";
import { NewsletterItem } from "@/types/newsletter";
import { Calendar, MapPin, Pencil, Power, Trash2 } from "lucide-react";
import dayjs from "dayjs";

export const getNewsletterColumns = (
  onEdit: (item: NewsletterItem) => void,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void,
): Column<NewsletterItem>[] => [
  {
    header: "Ấn Phẩm Bản Tin",
    accessor: "title" as keyof NewsletterItem,
    render: (item: NewsletterItem) => (
      <div className="flex items-center gap-3 py-1 max-w-sm">
        <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-stone-900 border border-amber-100/80 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <img
            src={item.banner || item.image || "/admin/card-event-01.png"}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </div>
        <div className="flex flex-col min-w-0 max-w-[220px] sm:max-w-[280px]">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-amber-700 transition-colors truncate" title={item.title}>
            {item.title}
          </span>
          <span className="text-[11.5px] text-gray-500 font-medium truncate" title={item.description || item.subtitle || ""}>
            {item.description || item.subtitle || "Chưa có mô tả"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Thời Gian",
    accessor: "date" as keyof NewsletterItem,
    render: (item: NewsletterItem) => (
      <div className="flex items-center gap-1.5 text-gray-600 font-mono text-xs">
        <Calendar size={12} className="text-amber-600 shrink-0" />
        <span>
          {item.date ? (dayjs(item.date).isValid() ? dayjs(item.date).format("DD/MM/YYYY") : item.date) : new Date(item.created_at).toLocaleDateString("vi-VN")}
        </span>
      </div>
    ),
  },
  {
    header: "Địa Điểm",
    accessor: "location" as keyof NewsletterItem,
    render: (item: NewsletterItem) => (
      <div className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
        <MapPin size={12} className="text-orange-500 shrink-0" />
        <span className="truncate max-w-45">{item.location || "HCMC, Viet Nam"}</span>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof NewsletterItem,
    align: "center",
    render: (item: NewsletterItem) => (
      <StatusBadge
        status={item.status === "active" ? "ACTIVE" : item.status === "draft" ? "PENDING" : "INACTIVE"}
        label={item.status === "active" ? "ĐANG PHÁT HÀNH" : item.status === "draft" ? "BẢN NHÁP" : "TẠM ẨN"}
        variant="premium"
      />
    ),
  },
  {
    header: "Thao tác",
    align: "center",
    render: (item: NewsletterItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <ActionTooltipBtn onClick={() => onEdit(item)} icon={<Pencil size={14} />} color="blue" tooltip="Chỉnh sửa bản tin" />
        <ActionTooltipBtn
          onClick={() => onToggleStatus(item.id)}
          icon={<Power size={14} className={item.status === "active" ? "text-amber-500" : "text-emerald-500"} />}
          color="orange"
          tooltip={item.status === "active" ? "Tạm ẩn bản tin" : "Mở phát hành bản tin"}
        />
        <ActionTooltipBtn onClick={() => onDelete(item.id)} icon={<Trash2 size={14} />} color="rose" tooltip="Xóa bản tin" />
      </div>
    ),
  },
];
