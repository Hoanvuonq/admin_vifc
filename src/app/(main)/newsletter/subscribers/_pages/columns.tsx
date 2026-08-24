"use client";

import { ActionTooltipBtn, Column, ItemImage, StatusBadge } from "@/components";
import { NewsletterSubscriberItem } from "@/types/newsletter";
import { Calendar, Globe, Power, Trash2 } from "lucide-react";
import dayjs from "dayjs";

export const getNewsletterColumns = (
  onToggleStatus: (id: string) => void,
  onDelete: (id: string) => void
): Column<NewsletterSubscriberItem>[] => [
  {
    header: "Người nhận & Email",
    accessor: "email" as keyof NewsletterSubscriberItem,
    render: (item: NewsletterSubscriberItem) => (
      <div className="flex items-center gap-3 py-1">
        <ItemImage
          path={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.email || item.full_name || "subscriber")}`}
          productName={item.full_name || item.email}
          className="w-10 h-10 rounded-xl shrink-0 border border-gray-100 shadow-2xs"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors truncate max-w-[200px]">
            {item.full_name || item.email.split("@")[0]}
          </span>
          <span className="text-xs text-gray-500 font-normal truncate max-w-[220px] select-text">
            {item.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Nguồn Thu Thập",
    accessor: "source" as keyof NewsletterSubscriberItem,
    render: (item: NewsletterSubscriberItem) => (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50/70 border border-orange-100 text-orange-800 text-xs font-semibold shadow-2xs">
        <Globe size={12} className="text-orange-500 shrink-0" />
        <span className="truncate max-w-[160px]">{item.source || "Landing Page"}</span>
      </div>
    ),
  },
  {
    header: "Ngày Đăng Ký",
    accessor: "created_at" as keyof NewsletterSubscriberItem,
    render: (item: NewsletterSubscriberItem) => {
      const formatted = dayjs(item.created_at).isValid()
        ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm")
        : item.created_at;
      return (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono">
          <Calendar size={12} className="text-gray-400 shrink-0" />
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof NewsletterSubscriberItem,
    align: "center",
    render: (item: NewsletterSubscriberItem) => (
      <StatusBadge
        status={item.status === "subscribed" ? "ACTIVE" : "INACTIVE"}
        label={item.status === "subscribed" ? "ĐANG NHẬN TIN" : "ĐÃ HỦY"}
        variant="premium"
      />
    ),
  },
  {
    header: "Thao tác",
    align: "center",
    render: (item: NewsletterSubscriberItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <ActionTooltipBtn
          onClick={() => onToggleStatus(item.id)}
          icon={<Power size={14} className={item.status === "subscribed" ? "text-emerald-600" : "text-gray-400"} />}
          color={item.status === "subscribed" ? "emerald" : "gray"}
          tooltip={item.status === "subscribed" ? "Tạm hủy nhận tin" : "Kích hoạt nhận tin lại"}
        />
        <ActionTooltipBtn
          onClick={() => onDelete(item.id)}
          icon={<Trash2 size={14} className="text-rose-500" />}
          color="rose"
          tooltip="Xóa email này"
        />
      </div>
    ),
  },
];
