"use client";

import { ActionTooltipBtn, Column, StatusBadge } from "@/components";
import { CourseItem } from "@/types/course";
import { Calendar, Clock, DollarSign, Eye, Pencil, Power, Trash2, User } from "lucide-react";

export const getCourseColumns = (
  onEdit: (course: CourseItem) => void,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void,
): Column<CourseItem>[] => [
  {
    header: "Khóa Học / Dịch Vụ",
    accessor: "title" as keyof CourseItem,
    render: (item: CourseItem) => (
      <div className="flex items-center gap-3 py-2 max-w-sm">
        <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-gray-100 border border-orange-100/80 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <img
            src={item.image || "/admin/card-banner-01.png"}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                item.fallback_image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </div>
        <div className="flex flex-col min-w-0 max-w-55 sm:max-w-70">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors truncate" title={item.title}>
            {item.title}
          </span>
          <span className="text-xs text-gray-500 font-medium truncate" title={item.booking_title || item.title}>
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

      const label = type === "lounge" ? "VIP LOUNGE" : type === "workshop" ? "WORKSHOP" : type === "meeting-room" ? "PHÒNG HỌP" : "KHÓA HỌC";

      return <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase shadow-2xs ${badgeStyle}`}>{label}</span>;
    },
  },
  {
    header: "Giảng viên & Học Phí",
    accessor: "instructor" as keyof CourseItem,
    render: (item: CourseItem) => (
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
          <User size={12} className="text-orange-500 shrink-0" />
          <span className="truncate max-w-35">{item.instructor || "Chuyên gia On-Chainpass"}</span>
        </div>
        {item.tuition_fee && item.tuition_fee > 0 ? (
          <div className="flex items-center gap-1 font-bold text-orange-600 font-mono text-[11.5px]">
            <DollarSign size={11} className="shrink-0" />
            <span>{item.tuition_fee.toLocaleString("vi-VN")} đ</span>
          </div>
        ) : (
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50 w-fit">
            Đặc quyền hội viên
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Thời Lượng & Lịch Học",
    accessor: "duration" as keyof CourseItem,
    render: (item: CourseItem) => (
      <div className="flex flex-col gap-1 text-xs text-gray-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock size={12} className="text-orange-500 shrink-0" />
          <span className="truncate max-w-35">{item.duration || "Chưa ấn định"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
          <Calendar size={11} className="text-gray-400 shrink-0" />
          <span className="truncate max-w-35">{item.schedule || "Lịch học linh hoạt"}</span>
        </div>
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
        <ActionTooltipBtn onClick={() => onEdit(item)} icon={<Pencil size={14} />} color="blue" tooltip="Chỉnh sửa khóa học" />
        <ActionTooltipBtn
          onClick={() => onToggleStatus(item.id)}
          icon={<Power size={14} className={item.status === "active" ? "text-amber-500" : "text-emerald-500"} />}
          color="orange"
          tooltip={item.status === "active" ? "Tạm ẩn khóa học" : "Kích hoạt mở khóa học"}
        />
        <ActionTooltipBtn onClick={() => onDelete(item.id)} icon={<Trash2 size={14} />} color="rose" tooltip="Xóa khóa học" />
      </div>
    ),
  },
];
