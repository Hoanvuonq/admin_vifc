"use client";

import { ActionTooltipBtn, Column, StatusBadge } from "@/components";
import { CourseItem } from "@/types/course";
import { Calendar, Clock, DollarSign, Edit3, Pencil, Power, Sparkles, Trash2, User } from "lucide-react";

export const getCourseColumns = (
  onEdit: (course: CourseItem) => void,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void
): Column<CourseItem>[] => [
  {
    header: "Khóa Học / Dịch Vụ",
    accessor: "title" as keyof CourseItem,
    render: (item: CourseItem) => (
      <div className="flex items-center gap-3 py-1 min-w-[260px]">
        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-100 border border-orange-100/80 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <img
            src={item.image || "/admin/card-banner-01.png"}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                item.fallback_image ||
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
            {item.title}
          </span>
          <span className="text-xs text-gray-500 font-medium line-clamp-1">
            {item.booking_title || item.title}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Loại Hình",
    accessor: "booking_type" as keyof CourseItem,
    render: (item: CourseItem) => {
      const type = (item.booking_type || "course").toLowerCase();
      const badgeStyle =
        type === "lounge"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : type === "workshop"
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : type === "meeting-room"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-orange-50 text-orange-700 border-orange-200";

      const label =
        type === "lounge"
          ? "VIP LOUNGE"
          : type === "workshop"
          ? "WORKSHOP"
          : type === "meeting-room"
          ? "PHÒNG HỌP"
          : "KHÓA HỌC";

      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border tracking-wider uppercase shadow-2xs ${badgeStyle}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    header: "Giảng viên / Phụ trách",
    accessor: "instructor" as keyof CourseItem,
    render: (item: CourseItem) => (
      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
        <User size={13} className="text-orange-500 shrink-0" />
        <span className="truncate max-w-[150px]">{item.instructor || "Chuyên gia On-Chainpass"}</span>
      </div>
    ),
  },
  {
    header: "Học Phí (VNĐ)",
    accessor: "tuition_fee" as keyof CourseItem,
    render: (item: CourseItem) => {
      if (item.tuition_fee && item.tuition_fee > 0) {
        return (
          <div className="flex items-center gap-1 font-bold text-gray-900 text-xs font-mono">
            <DollarSign size={12} className="text-orange-600 shrink-0" />
            <span>{item.tuition_fee.toLocaleString("vi-VN")} đ</span>
          </div>
        );
      }
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/60">
          Đặc Quyền Hội Viên
        </span>
      );
    },
  },
  {
    header: "Thời lượng & Lịch học",
    accessor: "schedule" as keyof CourseItem,
    render: (item: CourseItem) => (
      <div className="flex flex-col gap-0.5 text-xs">
        {item.duration && (
          <div className="flex items-center gap-1 text-gray-700 font-medium">
            <Clock size={11} className="text-orange-500 shrink-0" />
            <span>{item.duration}</span>
          </div>
        )}
        {item.schedule && (
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <Calendar size={11} className="text-gray-400 shrink-0" />
            <span className="truncate max-w-[150px]">{item.schedule}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof CourseItem,
    align: "center",
    render: (item: CourseItem) => (
      <StatusBadge
        status={item.status === "active" ? "ACTIVE" : item.status === "draft" ? "PENDING" : "INACTIVE"}
        label={item.status === "active" ? "ĐANG MỞ" : item.status === "draft" ? "BẢN NHÁP" : "TẠM ẨN"}
        variant="premium"
      />
    ),
  },
  {
    header: "Thao tác",
    align: "center",
    render: (item: CourseItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <ActionTooltipBtn
          onClick={() => onEdit(item)}
          icon={<Pencil size={14} />}
          color="gray"
          tooltip="Chỉnh sửa khóa học"
        />
        <ActionTooltipBtn
          onClick={() => onToggleStatus(item.id)}
          icon={<Power size={14} className={item.status === "active" ? "text-emerald-600" : "text-gray-400"} />}
          color={item.status === "active" ? "emerald" : "gray"}
          tooltip={item.status === "active" ? "Tạm ẩn khóa học" : "Kích hoạt mở khóa học"}
        />
        <ActionTooltipBtn
          onClick={() => onDelete(item.id)}
          icon={<Trash2 size={14} className="text-rose-500" />}
          color="rose"
          tooltip="Xóa khóa học"
        />
      </div>
    ),
  },
];
