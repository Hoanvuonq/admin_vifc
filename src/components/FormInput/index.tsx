"use client";

import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "../Checkbox";
import { BaseProps } from "./type";

const formatNumber = (val: any, isPhone?: boolean) => {
  if (val === null || val === undefined || val === "") return "";
  const str = val.toString().replace(/\D/g, "");

  if (isPhone) {
    if (str.length <= 4) return str;
    if (str.length <= 7) return `${str.slice(0, 4)}.${str.slice(4)}`;
    return `${str.slice(0, 4)}.${str.slice(4, 7)}.${str.slice(7, 10)}`;
  }

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

type FormInputProps = BaseProps &
  (React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export const FormInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(
  (
    {
      label,
      error: externalError,
      required,
      isTextArea,
      className,
      containerClassName,
      id,
      type,
      isCheckbox,
      checkboxChecked,
      onCheckboxChange,
      maxLengthNumber = 12,
      minLengthNumber,
      showCount,
      onChange,
      onBlur,
      value,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isShaking, setIsShaking] = useState(false);
    const [localError, setLocalError] = useState(false);
    const [emptyError, setEmptyError] = useState(false);
    const [lengthError, setLengthError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isDate = type === "date" || type === "datetime-local";
    const isPhone = props.name === "phone" || id?.includes("phone");
    const isPasswordType = type === "password";

    const isControlled = value !== undefined;
    const displayValue =
      type === "number" ? formatNumber(value, isPhone) : (value ?? "");

    const triggerShake = () => {
      if (!isShaking) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleInputChange = (e: React.ChangeEvent<any>) => {
      let val = e.target.value;

      if (val.trim() !== "") {
        setEmptyError(false);
      }

      if (type === "number" || props.inputMode === "numeric") {
        const digitsOnly = val.replace(/\D/g, "");

        if (digitsOnly.length > maxLengthNumber) {
          triggerShake();
          setLocalError(true);
          setTimeout(() => setLocalError(false), 400);
          return;
        }

        e.target.value = digitsOnly;
      }

      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<any>) => {
      const val = e.target.value.trim();

      if (required && val === "") {
        setEmptyError(true);
        triggerShake();
      } else {
        setEmptyError(false);
      }

      if (minLengthNumber && val !== "" && val.length < minLengthNumber) {
        setLengthError(true);
        triggerShake();
      } else {
        setLengthError(false);
      }

      onBlur?.(e);
    };

    const commonStyles = cn(
      "w-full px-5 bg-gray-50/50 border border-gray-200 rounded-2xl",
      "text-sm font-semibold text-gray-700 placeholder:text-gray-500 placeholder:font-normal",
      "transition-all duration-200 shadow-custom",
      "focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white",
      isDate && "cursor-pointer uppercase text-[11px]",
      (externalError || localError || emptyError || lengthError) &&
      "border-red-400 focus:border-red-500 focus:ring-red-500/10 bg-red-50/30",
      isShaking && "animate-shake",
    );

    return (
      <div className={cn("space-y-2 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500 text-sm">*</span>}
          </label>
        )}

        <div className="relative">
          {isTextArea ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              className={cn(
                commonStyles,
                "py-3 min-h-25 resize-none",
                className,
              )}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={isControlled ? (value ?? "") : undefined}
              disabled={disabled}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref as any}
              type={isPasswordType ? (showPassword ? "text" : "password") : (type === "number" ? "text" : type)}
              inputMode={type === "number" ? "numeric" : props.inputMode}
              className={cn(
                commonStyles,
                "h-12 text-ellipsis",
                (isCheckbox || isPasswordType) && "pr-11",
                className,
              )}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={isControlled ? displayValue : undefined}
              disabled={disabled}
              {...props}
            />
          )}

          {isPasswordType && !disabled && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-orange-500 transition-colors z-10 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye size={18} strokeWidth={2.5} />
              ) : (
                <EyeOff size={18} strokeWidth={2.5} />
              )}
            </button>
          )}

          {isCheckbox && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center border-l border-gray-200 pl-2 h-5">
              <Checkbox
                checked={checkboxChecked}
                onChange={(e) => onCheckboxChange?.(e.target.checked)}
                sizeClassName="w-4 h-4"
              />
            </div>
          )}

          {showCount && props.maxLength && (
            <div className={cn(
              "absolute flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white shadow-sm border border-gray-100 select-none pointer-events-none transition-all duration-300",
              isTextArea ? "bottom-4 right-4" : "right-3 top-1/2 -translate-y-1/2"
            )}>
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums transition-colors",
                  (value?.toString().length || 0) >= Number(props.maxLength) ? "text-red-500 animate-pulse" : "text-orange-600",
                )}
              >
                {(value?.toString().length || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">/</span>
              <span className="text-[10px] text-gray-500 font-bold">
                {Number(props.maxLength).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {(externalError || emptyError || lengthError) && (
          <p className="text-[10px] font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {externalError ||
              (emptyError
                ? "Trường này không được để trống"
                : `Vui lòng nhập đủ ${minLengthNumber} ký tự`)}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
