import { cn } from "@/utils/cn";
import { Loader2, HelpCircle } from "lucide-react";
import { CustomTooltip } from "@/components";
import { ActionBtnProps } from "./type";
import React from "react";

export const ActionTooltipBtn: React.FC<ActionBtnProps> = ({
  onClick,
  icon,
  color,
  label,
  loading,
  disabled,
  isIcon,
  tooltip,
  className,
}) => {
  const colorPresets: Record<string, string> = {
    red: " text-rose-500 border-rose-100 hover:bg-rose-50",
    green: " text-emerald-500 border-emerald-100 hover:bg-emerald-50",
    yellow: " text-yellow-500 border-yellow-100 hover:bg-yellow-50",
    blue: " text-blue-500 border-blue-100 hover:bg-blue-50",
    orange: " text-orange-500 border-orange-100 hover:bg-orange-50",
    purple: " text-purple-500 border-purple-100 hover:bg-purple-50",
    pink: " text-pink-500 border-pink-100 hover:bg-pink-50",
    cyan: " text-cyan-500 border-cyan-100 hover:bg-cyan-50",
    lime: " text-lime-500 border-lime-100 hover:bg-lime-50",
    indigo: "50 text-indigo-500 border-indigo-100 hover:bg-indigo-50",
    fuchsia: "-50 text-fuchsia-500 border-fuchsia-100 hover:bg-fuchsia-50",
    teal: " text-teal-500 border-teal-100 hover:bg-teal-50",
    violet: "50 text-violet-500 border-violet-100 hover:bg-violet-50",
    rose: " text-rose-500 border-rose-100 hover:bg-rose-50",
  };

  const selectedColor = color && colorPresets[color] ? colorPresets[color] : (color || "bg-white text-gray-600 hover:bg-gray-50");

  const buttonContent = (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        "flex items-center cursor-pointer hover-button relative z-10 gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        label
          ? "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow-md"
          : "p-2 rounded-xl border border-gray-100 shadow-sm",
        selectedColor,
        className
      )}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {icon}
          {isIcon && <HelpCircle size={14} className="text-blue-500" />}
        </>
      )}
      {label && <span>{label}</span>}
    </button>
  );

  return tooltip ? (
    <CustomTooltip content={tooltip} position="top">
      {buttonContent}
    </CustomTooltip>
  ) : (
    buttonContent
  );
};
