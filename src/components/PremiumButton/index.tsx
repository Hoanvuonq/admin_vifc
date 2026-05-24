"use client";
import { cn } from "@/utils/cn";
import { Loader2, LucideIcon } from "lucide-react";

interface PremiumButtonProps {
  label?: string;
  icon?: LucideIcon;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "emerald" | "indigo" | "rose" | "blue" | "orange" | "gray" | "white" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  form?: string;
  children?: React.ReactNode;
  isAddToCart?: boolean;
  block?: boolean;
}

const variantStyles = {
  emerald: {
    border: "border-emerald-100",
    text: "text-emerald-700 hover:text-emerald-600",
    hoverBorder: "hover:border-emerald-500",
    bg: "bg-emerald-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-emerald-100",
    iconBg: "bg-emerald-50 text-emerald-600 group-hover/btn:bg-emerald-500 group-hover/btn:text-white",
  },
  indigo: {
    border: "border-indigo-100",
    text: "text-indigo-700 hover:text-indigo-600",
    hoverBorder: "hover:border-indigo-500",
    bg: "bg-indigo-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-indigo-100",
    iconBg: "bg-indigo-50 text-indigo-600 group-hover/btn:bg-indigo-500 group-hover/btn:text-white",
  },
  rose: {
    border: "border-rose-100",
    text: "text-rose-700 hover:text-rose-600",
    hoverBorder: "hover:border-rose-500",
    bg: "bg-rose-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-rose-100",
    iconBg: "bg-rose-50 text-rose-600 group-hover/btn:bg-rose-500 group-hover/btn:text-white",
  },
  blue: {
    border: "border-blue-100",
    text: "text-blue-700 hover:text-blue-600",
    hoverBorder: "hover:border-blue-500",
    bg: "bg-blue-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-blue-100",
    iconBg: "bg-blue-50 text-blue-600 group-hover/btn:bg-blue-500 group-hover/btn:text-white",
  },
  orange: {
    border: "border-orange-100",
    text: "text-orange-700 hover:text-orange-600",
    hoverBorder: "hover:border-orange-500",
    bg: "bg-orange-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-orange-100",
    iconBg: "bg-orange-50 text-orange-600 group-hover/btn:bg-orange-500 group-hover/btn:text-white",
  },
  gray: {
    border: "border-slate-100",
    text: "text-gray-700 hover:text-gray-900",
    hoverBorder: "hover:border-slate-300",
    bg: "bg-slate-50",
    initialBg: "bg-white",
    shadow: "hover:shadow-slate-100",
    iconBg: "bg-slate-100 text-gray-600 group-hover/btn:bg-slate-500 group-hover/btn:text-white",
  },
  white: {
    border: "border-white",
    text: "text-orange-600 hover:text-orange-700",
    hoverBorder: "hover:border-white",
    bg: "bg-orange-100/50",
    initialBg: "bg-white  font-bold",
    shadow: "hover:shadow-orange-900/20 shadow-sm",
    iconBg: "bg-orange-50 text-orange-600 group-hover/btn:bg-orange-500 group-hover/btn:text-white shadow-inner",
  },
  glass: {
    border: "border-white/20",
    text: "text-white hover:text-white/100",
    hoverBorder: "hover:border-white/60",
    bg: "bg-white/20 shadow-inner",
    initialBg: "bg-white/10 backdrop-blur-md",
    shadow: "hover:shadow-black/20",
    iconBg: "bg-white/10 text-white group-hover/btn:bg-white group-hover/btn:text-orange-600",
  },
};

const sizeStyles = {
  lg: "h-12 px-6 gap-2.5 text-[11px]",
  md: "h-10 px-5 gap-2 text-[10.5px]",
  sm: "h-9 px-4 gap-2 text-[10px]",
};

const iconSizes = {
  lg: 14,
  md: 13,
  sm: 12,
};

export const PremiumButton = ({
  label,
  icon: Icon,
  onClick,
  isLoading = false,
  disabled = false,
  variant = "blue",
  size = "lg",
  className,
  type = "button",
  form,
  children,
  isAddToCart = false,
  block = false,
}: PremiumButtonProps) => {
  const style = variantStyles[variant] || variantStyles.blue;
  const sizeStyle = sizeStyles[size] || sizeStyles.lg;
  const iconSize = iconSizes[size] || iconSizes.lg;

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "group/btn relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 flex items-center justify-center font-bold uppercase tracking-wider shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
        block ? "w-full" : "w-fit",
        isAddToCart
          ? "bg-linear-to-br from-orange-500 to-orange-600 text-white border-orange-400/50 shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          : cn(style.initialBg, style.border, style.text, style.hoverBorder, style.shadow),
        sizeStyle,
        className
      )}
    >
      {!isAddToCart && (
        <div className={cn(
          "absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 z-0",
          style.bg
        )} />
      )}

      {isAddToCart && (
        <>
          <div className="absolute inset-0 bg-linear-to-tr from-orange-700 via-orange-500 to-amber-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-0" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-[-30deg] z-0" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 delay-100 skew-x-[-30deg] z-0" />
        </>
      )}

      <div className="relative z-10 flex items-center gap-2">
        {Icon && (
          <div className={cn(
            "p-1.5 rounded-full transition-all duration-500 flex items-center justify-center shadow-inner",
            isAddToCart
              ? "bg-white/20 text-white group-hover/btn:scale-110 group-hover/btn:rotate-12 group-hover/btn:bg-white group-hover/btn:text-orange-600 group-hover/btn:shadow-lg"
              : cn(style.iconBg, "group-hover/btn:scale-110 group-hover/btn:rotate-12 group-hover/btn:shadow-md")
          )}>
            {isLoading ? (
              <Loader2 size={iconSize} className="animate-spin" />
            ) : (
              <Icon size={iconSize} strokeWidth={2.5} />
            )}
          </div>
        )}
        {label}
        {children}
      </div>
    </button>
  );
};
