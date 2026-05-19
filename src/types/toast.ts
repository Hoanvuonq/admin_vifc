import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastOptions {
  duration?: number;
  description?: string;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface ToastConfigItem {
  icon: any;
  bg: string;
  border: string;
  text: string;
  iconColor: string;
  accent: string;
  lightBg: string;
  label?: string;
}

export const toastConfig: Record<ToastType, ToastConfigItem> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-emerald-500/20",
    text: "text-gray-900",
    iconColor: "text-emerald-500",
    accent: "bg-emerald-500",
    lightBg: "bg-emerald-50",
  },
  error: {
    icon: XCircle,
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-rose-500/20",
    text: "text-gray-900",
    iconColor: "text-rose-500",
    accent: "bg-rose-500",
    lightBg: "bg-rose-50",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-amber-500/20",
    text: "text-gray-900",
    iconColor: "text-amber-500",
    accent: "bg-amber-500",
    lightBg: "bg-amber-50",
  },
  info: {
    icon: Info,
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-indigo-500/20",
    text: "text-gray-900",
    iconColor: "text-indigo-500",
    accent: "bg-indigo-500",
    lightBg: "bg-indigo-50",
  },
  loading: {
    icon: Info,
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-blue-500/20",
    text: "text-gray-900",
    iconColor: "text-blue-500",
    accent: "bg-blue-500",
    lightBg: "bg-blue-50",
  },
};