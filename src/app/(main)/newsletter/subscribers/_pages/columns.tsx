"use client";

import { ActionTooltipBtn, Column, ItemImage, StatusBadge } from "@/components";
import { NewsletterRegistrationItem } from "@/types/newsletter";
import { Calendar, CheckCircle2, Eye, MapPin, Trash2, XCircle } from "lucide-react";
import dayjs from "dayjs";

export const getRegistrationColumns = (
  onViewDetail: (item: NewsletterRegistrationItem) => void,
  onUpdateStatus: (id: string, status: string) => void,
  onDelete: (id: string) => void
): Column<NewsletterRegistrationItem>[] => [
  {
    header: "Người Đăng Ký & Email",
    accessor: "email" as keyof NewsletterRegistrationItem,
    render: (item: NewsletterRegistrationItem) => (
      <div
        className="flex items-center gap-3 py-1 cursor-pointer group/user"
        onClick={() => onViewDetail(item)}
      >
        <ItemImage
          path={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.email || item.full_name || "subscriber")}`}
          productName={item.full_name || item.email}
          className="w-10 h-10 rounded-xl shrink-0 border border-gray-100 shadow-2xs group-hover/user:scale-105 transition-transform"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover/user:text-amber-700 transition-colors truncate max-w-[200px]">
            {item.full_name || item.email.split("@")[0]}
          </span>
          <span className="text-xs text-gray-500 font-normal truncate max-w-[220px] select-text">{item.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Ấn Phẩm Bản Tin",
    accessor: "newsletter_title" as keyof NewsletterRegistrationItem,
    render: (item: NewsletterRegistrationItem) => (
      <div className="flex flex-col min-w-0 max-w-[260px]">
        <span className="font-semibold text-gray-900 text-xs truncate" title={item.newsletter_title}>
          {item.newsletter_title}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5 font-mono">
          {item.newsletter_date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-amber-600 shrink-0" />
              {item.newsletter_date}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={11} className="text-orange-500 shrink-0" />
              {item.location}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Ngày Đăng Ký",
    accessor: "created_at" as keyof NewsletterRegistrationItem,
    render: (item: NewsletterRegistrationItem) => {
      const formatted = dayjs(item.created_at).isValid()
        ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm")
        : item.created_at;
      return (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono">
          <Calendar size={12} className="text-gray-700 shrink-0" />
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof NewsletterRegistrationItem,
    align: "center",
    render: (item: NewsletterRegistrationItem) => (
      <StatusBadge
        status={
          item.status === "approved"
            ? "ACTIVE"
            : item.status === "rejected"
            ? "INACTIVE"
            : "PENDING"
        }
        label={
          item.status === "approved"
            ? "ĐÃ DUYỆT"
            : item.status === "rejected"
            ? "TỪ CHỐI"
            : "CHỜ XỬ LÝ"
        }
        variant="premium"
      />
    ),
  },
  {
    header: "Thao tác",
    align: "center",
    render: (item: NewsletterRegistrationItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <ActionTooltipBtn
          onClick={() => onViewDetail(item)}
          icon={<Eye size={14} className="text-blue-600" />}
          color="blue"
          tooltip="Xem chi tiết đơn"
        />
        {item.status !== "approved" && (
          <ActionTooltipBtn
            onClick={() => onUpdateStatus(item.id, "approved")}
            icon={<CheckCircle2 size={14} className="text-emerald-600" />}
            color="emerald"
            tooltip="Duyệt đơn đăng ký"
          />
        )}
        {item.status !== "rejected" && (
          <ActionTooltipBtn
            onClick={() => onUpdateStatus(item.id, "rejected")}
            icon={<XCircle size={14} className="text-amber-600" />}
            color="orange"
            tooltip="Từ chối đơn"
          />
        )}
        <ActionTooltipBtn
          onClick={() => onDelete(item.id)}
          icon={<Trash2 size={14} className="text-rose-500" />}
          color="rose"
          tooltip="Xóa đơn đăng ký này"
        />
      </div>
    ),
  },
];
