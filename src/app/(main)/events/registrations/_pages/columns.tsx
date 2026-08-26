"use client";

import { ActionTooltipBtn, Column, ItemImage, StatusBadge } from "@/components";
import { EventRegistrationItem } from "@/types/event";
import { Building2, Calendar, Check, CheckCircle2, Mail, MapPin, Phone, Trash2, X } from "lucide-react";
import dayjs from "dayjs";

export const getEventRegistrationColumns = (
  onUpdateStatus: (id: string, status: EventRegistrationItem["status"]) => void,
  onDelete: (id: string) => void,
): Column<EventRegistrationItem>[] => [
  {
    header: "Khách mời & Email",
    accessor: "full_name" as keyof EventRegistrationItem,
    render: (item: EventRegistrationItem) => (
      <div className="flex items-center gap-3 py-1">
        <ItemImage
          path={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.email || item.full_name || "guest")}`}
          productName={item.full_name || item.email}
          className="w-10 h-10 rounded-xl shrink-0 border border-gray-100 shadow-2xs"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors truncate max-w-[180px]">
            {item.full_name || "Khách mời"}
          </span>
          <span className="text-xs text-gray-500 font-normal truncate max-w-[200px] select-text">{item.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Sự Kiện Đăng Ký",
    accessor: "event_title" as keyof EventRegistrationItem,
    render: (item: EventRegistrationItem) => (
      <div className="flex flex-col gap-1 max-w-sm">
        <span className="font-bold text-gray-900 text-[12.5px] line-clamp-1">{item.event_title}</span>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-orange-500 shrink-0" />
              <span className="truncate max-w-[140px]">{item.location}</span>
            </span>
          )}
          {item.event_date && <span className=" text-gray-700 font-mono text-[11px]">• {item.event_date}</span>}
        </div>
      </div>
    ),
  },
  {
    header: "Số điện thoại",
    accessor: "phone" as keyof EventRegistrationItem,
    render: (item: EventRegistrationItem) => (
      <div className="flex items-center gap-1.5 text-gray-600 text-xs font-mono">
        <Phone size={12} className=" text-gray-700 shrink-0" />
        <span>{item.phone || "—"}</span>
      </div>
    ),
  },
  {
    header: "Ngày Đăng Ký",
    accessor: "created_at" as keyof EventRegistrationItem,
    render: (item: EventRegistrationItem) => {
      const formatted = dayjs(item.created_at).isValid() ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm") : item.created_at;
      return (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono">
          <Calendar size={12} className=" text-gray-700 shrink-0" />
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof EventRegistrationItem,
    align: "center",
    render: (item: EventRegistrationItem) => (
      <StatusBadge
        status={item.status === "confirmed" ? "ACTIVE" : item.status === "pending" ? "PENDING" : item.status === "attended" ? "COMPLETED" : "BANNED"}
        label={item.status === "confirmed" ? "ĐÃ XÁC NHẬN" : item.status === "pending" ? "CHỜ DUYỆT" : item.status === "attended" ? "ĐÃ THAM GIA" : "ĐÃ HỦY"}
        variant="premium"
      />
    ),
  },
  {
    header: "Thao tác",
    align: "center",
    render: (item: EventRegistrationItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {item.status !== "confirmed" && (
          <ActionTooltipBtn
            onClick={() => onUpdateStatus(item.id, "confirmed")}
            icon={<Check size={14} className="text-emerald-600" />}
            color="emerald"
            tooltip="Xác nhận tham gia"
          />
        )}
        {item.status !== "cancelled" && (
          <ActionTooltipBtn
            onClick={() => onUpdateStatus(item.id, "cancelled")}
            icon={<X size={14} className="text-amber-600" />}
            color="orange"
            tooltip="Từ chối / Hủy đơn"
          />
        )}
        <ActionTooltipBtn onClick={() => onDelete(item.id)} icon={<Trash2 size={14} className="text-rose-500" />} color="rose" tooltip="Xóa đơn đăng ký" />
      </div>
    ),
  },
];
