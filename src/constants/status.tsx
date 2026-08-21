import {
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutTemplate,
  Loader2,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import React from "react";

export type StatusConfig = {
  label: string;
  styles: string;
  premiumStyles?: string;
  icon: React.ReactNode;
  iconColor: string;
};

export const statusConfig: Record<string, StatusConfig> = {
  LAYOUT: {
    label: "Layout",
    styles: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
    premiumStyles: "bg-indigo-50/90 text-indigo-600 border-indigo-200 shadow-2xs",
    icon: <LayoutTemplate size={13} />,
    iconColor: "text-indigo-600",
  },
  PENDING: {
    label: "Đang chờ",
    styles: "bg-amber-50/90 text-amber-600 border-amber-200",
    premiumStyles: "bg-amber-50/90 text-amber-600 border-amber-200/90 shadow-2xs",
    icon: <Clock size={13} />,
    iconColor: "text-amber-600",
  },
  SUCCESS: {
    label: "Hoàn thành",
    styles: "bg-emerald-50/90 text-emerald-600 border-emerald-200",
    premiumStyles: "bg-emerald-50/90 text-emerald-600 border-emerald-200/90 shadow-2xs",
    icon: <CheckCircle2 size={13} />,
    iconColor: "text-emerald-600",
  },
  APPROVED: {
    label: "Đã xác nhận",
    styles: "bg-emerald-50/90 text-emerald-600 border-emerald-200",
    premiumStyles: "bg-emerald-50/90 text-emerald-600 border-emerald-200/90 shadow-2xs",
    icon: <CheckCircle2 size={13} />,
    iconColor: "text-emerald-600",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    styles: "bg-emerald-50/90 text-emerald-600 border-emerald-200",
    premiumStyles: "bg-emerald-50/90 text-emerald-600 border-emerald-200/90 shadow-2xs",
    icon: <CheckCircle2 size={13} />,
    iconColor: "text-emerald-600",
  },
  PROCESSING: {
    label: "Đang xử lý",
    styles: "bg-sky-50/90 text-sky-600 border-sky-200",
    premiumStyles: "bg-sky-50/90 text-sky-600 border-sky-200/90 shadow-2xs",
    icon: <Loader2 size={13} />,
    iconColor: "text-sky-600",
  },
  CANCELLED: {
    label: "Đã hủy",
    styles: "bg-rose-50/90 text-rose-600 border-rose-200",
    premiumStyles: "bg-rose-50/90 text-rose-600 border-rose-200/90 shadow-2xs",
    icon: <XCircle size={13} />,
    iconColor: "text-rose-600",
  },
  FAILED: {
    label: "Thất bại",
    styles: "bg-rose-50/90 text-rose-600 border-rose-200",
    premiumStyles: "bg-rose-50/90 text-rose-600 border-rose-200/90 shadow-2xs",
    icon: <AlertCircle size={13} />,
    iconColor: "text-rose-600",
  },
  REJECTED: {
    label: "Đã hủy",
    styles: "bg-rose-50/90 text-rose-600 border-rose-200",
    premiumStyles: "bg-rose-50/90 text-rose-600 border-rose-200/90 shadow-2xs",
    icon: <XCircle size={13} />,
    iconColor: "text-rose-600",
  },
  PUBLISHED: {
    label: "Xuất bản",
    styles: "bg-emerald-50/90 text-emerald-700 border-emerald-200",
    premiumStyles: "bg-emerald-50/90 text-emerald-700 border-emerald-200/90 shadow-2xs",
    icon: <CheckCircle2 size={13} />,
    iconColor: "text-emerald-600",
  },
  DRAFT: {
    label: "Bản nháp",
    styles: "bg-blue-50/90 text-blue-700 border-blue-200",
    premiumStyles: "bg-blue-50/90 text-blue-700 border-blue-200/90 shadow-2xs",
    icon: <Clock size={13} />,
    iconColor: "text-blue-600",
  },
  PENDING_REVIEW: {
    label: "Chờ duyệt",
    styles: "bg-amber-50/90 text-amber-700 border-amber-200",
    premiumStyles: "bg-amber-50/90 text-amber-700 border-amber-200/90 shadow-2xs",
    icon: <Clock size={13} />,
    iconColor: "text-amber-600",
  },
  ARCHIVED: {
    label: "Đã xóa",
    styles: "bg-zinc-100 text-zinc-600 border-zinc-200",
    premiumStyles: "bg-zinc-100 text-zinc-600 border-zinc-200 shadow-2xs",
    icon: <Trash2 size={13} />,
    iconColor: "text-zinc-500",
  },
};

export const statusMap: Record<string, string> = {
  COMPLETED: "SUCCESS",
  "HOÀN THÀNH": "SUCCESS",
  ACTIVE: "SUCCESS",
  INACTIVE: "PENDING",
  BANNED: "FAILED",
  ERROR: "FAILED",
  PENDING: "PENDING",
  "ĐANG CHỜ": "PENDING",
  "CHỜ DUYỆT": "PENDING",
  "CHỜ XÁC NHẬN": "PENDING",
  PROCESSING: "PROCESSING",
  "ĐANG XỬ LÝ": "PROCESSING",
  CANCELLED: "CANCELLED",
  "ĐÃ HỦY": "CANCELLED",
  FAILED: "FAILED",
  "THẤT BẠI": "FAILED",
  APPROVED: "APPROVED",
  "ĐÃ DUYỆT": "APPROVED",
  CONFIRMED: "CONFIRMED",
  "ĐÃ XÁC NHẬN": "CONFIRMED",
  REJECTED: "REJECTED",
  "TỪ CHỐI": "REJECTED",
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  ARCHIVED: "ARCHIVED",
};

export const getStatusConfig = (status: string) => {
  const normalized = status.trim().toUpperCase();
  const finalKey = statusMap[normalized] || normalized;
  return (
    statusConfig[finalKey] || {
      label: status,
      styles: "bg-slate-50 text-slate-600 border-slate-200",
      premiumStyles: "bg-slate-50 text-slate-600 border-slate-200 shadow-2xs",
      icon: <Clock size={13} />,
      iconColor: "text-slate-500",
    }
  );
};
