"use client";

import { cn } from "@/utils/cn";
import { Check } from "lucide-react";
import React, { useId } from "react";
import { CheckboxProps } from "./type";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      className,
      containerClassName,
      sizeClassName,
      id,
      checked = false,
      onChange,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const checkboxId = id || reactId;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center gap-2 group cursor-pointer select-none w-fit p-2 rounded-xl transition-colors hover:bg-gray-50",
          containerClassName,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={!!checked}
            readOnly={!onChange || disabled}
            onChange={disabled ? undefined : onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          <div
            className={cn(
              "rounded-md border-2 transition-all duration-300 flex items-center justify-center relative",
              "size-4",
              sizeClassName,
              checked
                ? "bg-orange-500 border-orange-500 shadow-[0_2px_10px_rgba(249,115,22,0.4)] scale-110"
                : "bg-white border-gray-300",
              disabled ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50" : "group-hover:border-orange-400 cursor-pointer",
              className,
            )}
          >
            <Check
              size={10}
              strokeWidth={4.5}
              className={cn(
                "text-white transition-all duration-300 transform",
                checked
                  ? "scale-100 opacity-100 rotate-0"
                  : "scale-0 opacity-0 -rotate-45",
              )}
            />
          </div>
        </div>

        {label && (
          <span
            className={cn(
              "text-[12px] font-medium transition-all duration-200 leading-relaxed",
              checked ? "text-gray-900" : "text-gray-500",
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
