import { LucideIcon } from "lucide-react";

export const variantStyles = {
  emerald: {
    border: "border-emerald-100",
    text: "text-emerald-700 hover:text-emerald-600",
    hoverBorder: "hover:border-emerald-500",
    bg: "bg-emerald-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-emerald-100",
    iconBg:
      "bg-emerald-50 text-emerald-600 group-hover/btn:bg-emerald-500 group-hover/btn:text-white",
  },
  indigo: {
    border: "border-indigo-100",
    text: "text-indigo-700 hover:text-indigo-600",
    hoverBorder: "hover:border-indigo-500",
    bg: "bg-indigo-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-indigo-100",
    iconBg:
      "bg-indigo-50 text-indigo-600 group-hover/btn:bg-indigo-500 group-hover/btn:text-white",
  },
  rose: {
    border: "border-rose-100",
    text: "text-rose-700 hover:text-rose-600",
    hoverBorder: "hover:border-rose-500",
    bg: "bg-rose-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-rose-100",
    iconBg:
      "bg-rose-50 text-rose-600 group-hover/btn:bg-rose-500 group-hover/btn:text-white",
  },
  blue: {
    border: "border-blue-100",
    text: "text-blue-700 hover:text-blue-600",
    hoverBorder: "hover:border-blue-500",
    bg: "bg-blue-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-blue-100",
    iconBg:
      "bg-blue-50 text-blue-600 group-hover/btn:bg-blue-500 group-hover/btn:text-white",
  },
  orange: {
    border: "border-orange-100",
    text: "text-orange-700 hover:text-orange-600",
    hoverBorder: "hover:border-orange-500",
    bg: "bg-orange-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-orange-100",
    iconBg:
      "bg-orange-50 text-orange-600 group-hover/btn:bg-orange-500 group-hover/btn:text-white",
  },
  gray: {
    border: "border-slate-100",
    text: "text-gray-700 hover:text-gray-900",
    hoverBorder: "hover:border-slate-300",
    bg: "bg-slate-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-slate-100",
    iconBg:
      "bg-slate-100 text-gray-600 group-hover/btn:bg-slate-500 group-hover/btn:text-white",
  },
  white: {
    border: "border-white",
    text: "text-orange-600 hover:text-orange-700",
    hoverBorder: "hover:border-white",
    bg: "bg-orange-100/50",
    initialBg: "bg-white  font-bold",
    shadow: "hover:shadow-orange-900/20 shadow-sm",
    iconBg:
      "bg-orange-50 text-orange-600 group-hover/btn:bg-orange-500 group-hover/btn:text-white shadow-inner",
  },
  glass: {
    border: "border-white/20",
    text: "text-white hover:text-white/100",
    hoverBorder: "hover:border-white/60",
    bg: "bg-white/20 shadow-inner",
    initialBg: "bg-white/10 backdrop-blur-md",
    shadow: "hover:shadow-black/20",
    iconBg:
      "bg-white/10 text-white group-hover/btn:bg-white group-hover/btn:text-orange-600",
  },
  isLogin: {
    border: "border-0",
    text: "text-white",
    hoverBorder: "",
    bg: "bg-white/10",
    initialBg:
      "bg-linear-to-r from-pink-600 via-orange-500 to-pink-600 bg-[length:200%_auto] transition-all duration-500 ease-in-out hover:bg-right",
    shadow: "shadow-lg shadow-pink-500/30",
    iconBg:
      "bg-white/20 text-white group-hover/btn:bg-white group-hover/btn:text-pink-600",
  },
};

export interface PremiumButtonProps {
  label?: string;
  icon?: LucideIcon;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?:
    | "emerald"
    | "indigo"
    | "rose"
    | "blue"
    | "orange"
    | "gray"
    | "white"
    | "glass"
    | "isLogin";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  form?: string;
  children?: React.ReactNode;
  block?: boolean;
}

export const sizeStyles = {
  lg: "h-12 px-6 gap-2.5 text-[11px]",
  md: "h-10 px-5 gap-2 text-[10.5px]",
  sm: "h-9 px-4 gap-2 text-[10px]",
};

export const iconSizes = {
  lg: 14,
  md: 13,
  sm: 12,
};
