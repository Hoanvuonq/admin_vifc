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
    styles: "bg-indigo-50 text-indigo-600 border-indigo-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-indigo-500 to-purple-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(99,102,241,0.3)] backdrop-blur-sm",
    icon: <LayoutTemplate size={12} />,
    iconColor: "text-indigo-500",
  },
  PENDING: {
    label: "Pending",
    styles: "bg-amber-50/50 text-amber-600 border-amber-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-amber-500 to-orange-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(245,158,11,0.3)] backdrop-blur-sm",
    icon: <Clock size={12} />,
    iconColor: "text-amber-500",
  },
  SUCCESS: {
    label: "Success",
    styles: "bg-emerald-50/50 text-emerald-600 border-emerald-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-emerald-500 to-teal-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(16,185,129,0.3)] backdrop-blur-sm",
    icon: <CheckCircle2 size={12} />,
    iconColor: "text-emerald-500",
  },
  PROCESSING: {
    label: "Processing",
    styles: "bg-sky-50/50 text-sky-600 border-sky-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-sky-500 to-indigo-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(14,165,233,0.3)] backdrop-blur-sm",
    icon: <Loader2 size={12} />,
    iconColor: "text-sky-500",
  },
  CANCELLED: {
    label: "Cancelled",
    styles: "bg-rose-50 text-rose-500 border-rose-100 shadow-none",
    premiumStyles: "bg-linear-to-br from-rose-400 to-rose-300 text-white border-white/20 shadow-[0_4px_10px_-3px_rgba(251,113,133,0.3)] backdrop-blur-sm",
    icon: <XCircle size={12} />,
    iconColor: "text-rose-400",
  },
  FAILED: {
    label: "Failed",
    styles: "bg-rose-50/50 text-rose-600 border-rose-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-rose-500 to-red-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(244,63,94,0.3)] backdrop-blur-sm",
    icon: <AlertCircle size={12} />,
    iconColor: "text-rose-500",
  },
  APPROVED: {
    label: "Approved",
    styles: "bg-emerald-50/50 text-emerald-600 border-emerald-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-emerald-500 to-teal-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(16,185,129,0.3)] backdrop-blur-sm",
    icon: <ShieldCheck size={12} />,
    iconColor: "text-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    styles: "bg-rose-50/50 text-rose-600 border-rose-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-rose-500 to-red-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(244,63,94,0.3)] backdrop-blur-sm",
    icon: <AlertCircle size={12} />,
    iconColor: "text-rose-500",
  },
  PUBLISHED: {
    label: "Published",
    styles: "bg-emerald-50/50 text-emerald-600 border-emerald-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-emerald-500 to-teal-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(16,185,129,0.3)] backdrop-blur-sm",
    icon: <CheckCircle2 size={12} />,
    iconColor: "text-emerald-500",
  },
  DRAFT: {
    label: "Draft",
    styles: "bg-blue-50 text-blue-600 border-blue-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-blue-500 to-blue-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(59,130,246,0.3)] backdrop-blur-sm",
    icon: <Clock size={12} />,
    iconColor: "text-blue-500",
  },
  PENDING_REVIEW: {
    label: "Pending Review",
    styles: "bg-amber-50/50 text-amber-600 border-amber-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-amber-500 to-orange-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(245,158,11,0.3)] backdrop-blur-sm",
    icon: <Clock size={12} />,
    iconColor: "text-amber-500",
  },
  ARCHIVED: {
    label: "Deleted",
    styles: "bg-zinc-100 text-zinc-600 border-zinc-200/60 shadow-none",
    premiumStyles: "bg-linear-to-br from-zinc-500 to-zinc-400 text-white border-white/30 shadow-[0_4px_10px_-3px_rgba(115,115,115,0.3)] backdrop-blur-sm",
    icon: <Trash2 size={12} />,
    iconColor: "text-zinc-500",
  },
};

export const statusMap: Record<string, string> = {
  COMPLETED: "SUCCESS",
  ACTIVE: "SUCCESS",
  INACTIVE: "PENDING",
  BANNED: "FAILED",
  ERROR: "FAILED",
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  ARCHIVED: "ARCHIVED",
};

export const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  SUCCESS: "bg-green-50 text-green-800 border-green-200",
  FAILED: "bg-red-50 text-red-800 border-red-200",
  CANCELLED: "bg-gray-50 text-gray-800 border-gray-200",
};

export const getStatusStyle = (status: string): string => {
  const key = (statusMap[status.toUpperCase()] || status.toUpperCase());
  return STATUS_STYLES[key] || statusConfig[key]?.styles || "bg-gray-100 text-gray-800";
};

export const getStatusConfig = (status: string) => {
  const key = status.toUpperCase();
  const finalKey = statusMap[key] || key;
  return statusConfig[finalKey] || {
    label: status,
    styles: "bg-slate-50 text-gray-500 border-slate-200",
    icon: <Clock size={12} />,
    iconColor: "text-gray-600",
  };
};
