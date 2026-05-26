"use client";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import { iconSizes, PremiumButtonProps, sizeStyles, variantStyles } from "./type";
import { FC } from "react";

const LoadingSpinner: FC = () => (
  <span className="w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin" />
);

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
        style.initialBg, style.border, style.text, style.hoverBorder, style.shadow,
        sizeStyle,
        className
      )}
    >
      {variant !== "isLogin" && (
        <div className={cn(
          "absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 z-0",
          style.bg
        )} />
      )}

      <div className="relative z-10 flex items-center gap-2">
        {isLoading && !Icon && (
          <LoadingSpinner />
        )}
        {Icon && (
          <div className={cn(
            "p-1.5 rounded-full transition-all duration-500 flex items-center justify-center shadow-inner",
            style.iconBg,
            "group-hover/btn:scale-110 group-hover/btn:rotate-12 group-hover/btn:shadow-md"
          )}>
            {isLoading ? (
              <LoadingSpinner />
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
