"use client";

import { Checkbox, FormInput, SearchComponent } from "@/components";
import { cn } from "@/utils/cn";
import { useIsomorphicLayoutEffect } from "framer-motion";
import { Check, ChevronDown, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SelectProps } from "./type";

export interface AttributeOption {
  label: string;
  value: string;
  disabled?: boolean;
  image?: string;
  icon?: any;
  color?: string;
}
interface ExtendedSelectProps extends SelectProps {
  label?: string;
  required?: boolean;
  error?: string;
}

export const SelectComponent = ({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = "Chọn ...",
  disabled = false,
  loading = false,
  className,
  isMulti = false,
  error,
  onSearchChange,
  isCategory,
  onAddNew,
}: ExtendedSelectProps & { isCategory?: boolean; onAddNew?: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [customOptions, setCustomOptions] = useState<AttributeOption[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] =
    useState<React.CSSProperties | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);


  const getDisplayLabel = () => {
    let combinedOptions = [...options, ...customOptions];
    if (isCategory) {
      combinedOptions = [{ label: "Đang cập nhật", value: "Đang cập nhật" }, ...combinedOptions];
    }

    if (isMulti) {
      const vals = Array.isArray(value) ? value : [];
      if (vals.length === 0) return placeholder;
      if (vals.length <= 2) {
        return combinedOptions
          .filter((opt) => vals.includes(opt.value))
          .map((opt) => opt.label)
          .join(", ");
      }
      return `Selected ${vals.length} items`;
    } else {
      const selectedOpt = combinedOptions.find((opt) => opt.value === value);
      return selectedOpt ? selectedOpt.label : placeholder;
    }
  };

  const updatePosition = useCallback(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 280;
      const gap = 8;

      const spaceBelow = viewportHeight - rect.bottom;
      const showAtTop =
        spaceBelow < dropdownMaxHeight && rect.top > dropdownMaxHeight;

      const style: React.CSSProperties = {
        position: "fixed",
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      };

      if (showAtTop) {
        style.bottom = viewportHeight - rect.top + gap;
        style.transformOrigin = "bottom";
      } else {
        style.top = rect.bottom + gap;
        style.transformOrigin = "top";
      }

      setDropdownStyle(style);
    }
  }, [isOpen]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !document.getElementById("select-dropdown-portal")?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    const option = options.find((opt) => opt.value === val);
    if (option?.disabled) return;

    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(val)
        ? currentValues.filter((v) => v !== val)
        : [...currentValues, val];
      onChange(newValue);
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const handleRemoveValue = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter((v) => v !== val));
    }
  };

  const onSearchValueChange = (val: string) => {
    setSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleAddNewConfirm = () => {
    if (newValue.trim()) {
      const val = newValue.trim();
      setCustomOptions(prev => [...prev, { label: val, value: val }]);
      onAddNew?.(val);
      setNewValue("");
      setIsAddingNew(false);
    }
  };

  const allOptions = [...options, ...customOptions];

  const filteredOptions = allOptions.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  let finalOptions = onSearchChange ? allOptions : filteredOptions;

  if (isCategory) {
    const updatingOpt = { label: "Đang cập nhật", value: "Đang cập nhật" };
    if (!finalOptions.some((opt) => opt.value === updatingOpt.value)) {
      finalOptions = [updatingOpt, ...finalOptions];
    }
  }

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      {label && (
        <div className="text-[12px] font-bold  text-gray-600 ml-1 ">
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </div>
      )}

      <div ref={wrapperRef} className="relative w-full">
        <div
          className={cn(
            "w-full h-12 px-5 rounded-[1.25rem] flex items-center justify-between cursor-pointer transition-all duration-300 select-none shadow-sm border",
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-100 text-gray-600"
              : "border-slate-100 bg-white/80 backdrop-blur-md hover:border-orange-200 hover:shadow-md hover:bg-white",
            isOpen && "border-orange-300 ring-4 ring-orange-500/10 bg-white scale-[0.99] shadow-inner",
            error &&
            "border-red-400 bg-red-50/30 animate-shake focus:border-red-500",
          )}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        >
          <div className="flex-1 flex items-center gap-1.5 overflow-hidden py-1">
            {isMulti && Array.isArray(value) && value.length > 0 ? (
              value.length <= 2 ? (
                <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                  {value.map((val) => {
                    const opt = allOptions.find((o) => o.value === val);
                    return (
                      <div
                        key={val}
                        className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl text-[10px] font-bold text-gray-700 border border-gray-200 animate-in zoom-in duration-200 shadow-sm shrink-0 max-w-[120px]"
                      >
                        <span className="truncate">{opt?.label || val}</span>
                        <button
                          onClick={(e) => handleRemoveValue(e, val)}
                          className="text-gray-600 hover:text-red-500 transition-colors p-0.5"
                        >
                          <X size={8} strokeWidth={3} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    {getDisplayLabel()}
                  </span>
                  <div className="flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-in zoom-in duration-300 shrink-0">
                    {value.length}
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                {(() => {
                  const selectedOpt = !Array.isArray(value) ? allOptions.find((opt) => opt.value === value) : null;
                  return selectedOpt ? (
                    <>
                      {selectedOpt.icon && (
                        <selectedOpt.icon className={cn("shrink-0", selectedOpt.color ? selectedOpt.color : "text-gray-700")} size={14} />
                      )}
                      <span
                        className={cn(
                          "truncate text-xs font-bold",
                          selectedOpt.color ? selectedOpt.color : "text-gray-900",
                          error && "text-red-600",
                        )}
                      >
                        {selectedOpt.label}
                      </span>
                    </>
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-bold truncate transition-colors text-gray-600",
                        error && "text-red-600",
                      )}
                    >
                      {getDisplayLabel()}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="animate-spin text-orange-500" size={14} />
            ) : (
              <ChevronDown
                className={cn(
                  "text-[10px] text-gray-600 transition-transform duration-300",
                  isOpen && "rotate-180 text-orange-500",
                  error && "text-red-500",
                )}
                size={12}
                strokeWidth={3}
              />
            )}
          </div>
        </div>

        {error && (
          <p className="text-[10px] font-medium text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 italic">
            * {error}
          </p>
        )}
      </div>

      {isOpen &&
        dropdownStyle &&
        createPortal(
          <div
            id="select-dropdown-portal"
            className={cn(
              "bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden",
              "animate-in fade-in slide-in-from-top-2 duration-300 ease-out",
            )}
            style={dropdownStyle}
          >
            <div className="p-3 border-b border-slate-100/50 bg-slate-50/20">
              <SearchComponent
                value={search}
                onChange={onSearchValueChange}
                placeholder="Tìm kiếm..."
                className="shadow-none"
                inputClassName="bg-white border-slate-200 focus:ring-4 focus:ring-orange-500/5"
              />
            </div>

            <div className="overflow-y-auto max-h-55 p-2 custom-scrollbar">
              {finalOptions.length > 0 ? (
                finalOptions.map((opt) => {
                  const isSelected = isMulti
                    ? Array.isArray(value) && value.includes(opt.value)
                    : value === opt.value;

                  return (
                    <div
                      key={opt.value}
                      className={cn(
                        "px-4 py-3 text-sm rounded-xl transition-all duration-200 flex items-center mb-2 group",
                        isSelected
                          ? "bg-orange-50 font-bold text-orange-600 shadow-sm border border-orange-100/50"
                          : opt.disabled
                            ? "bg-slate-50 text-gray-500 cursor-not-allowed opacity-60"
                            : "px-4 py-3 cursor-pointer hover:bg-slate-50 text-gray-600 hover:text-orange-500 hover:pl-5",
                      )}
                      onClick={() => !opt.disabled && handleSelect(opt.value)}
                    >
                      {isMulti ? (
                        <div className="flex items-center gap-3 px-1 w-full overflow-hidden">
                          <Checkbox
                            checked={isSelected}
                            containerClassName="w-auto p-0 pointer-events-none"
                            sizeClassName="w-4 h-4"
                            disabled={opt.disabled}
                          />
                          {opt.image && (
                            <div className="w-8 h-8 relative rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-sm">
                              <Image
                                src={opt.image}
                                alt={opt.label}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span
                            className={cn(
                              "truncate text-sm transition-colors",
                              isSelected
                                ? "text-orange-600 font-bold"
                                : opt.disabled ? "text-gray-500 pointer-events-none" : "text-gray-600 group-hover:text-orange-500",
                            )}
                          >
                            {opt.label}
                            {opt.disabled && <span className="ml-2 text-[10px] font-bold text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-full">(Đã có)</span>}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full gap-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            {opt.image && (
                              <div className="w-8 h-8 relative rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-sm">
                                <Image
                                  src={opt.image}
                                  alt={opt.label}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                              {opt.icon && (
                                <opt.icon className={cn("shrink-0 transition-colors", opt.color ? opt.color : "text-gray-600 group-hover:text-orange-500")} size={14} />
                              )}
                              <span
                                className={cn(
                                  "truncate transition-colors text-xs font-bold",
                                  isSelected
                                    ? "text-orange-600 "
                                    : opt.disabled ? "text-gray-500 font-bold pointer-events-none" : cn("text-gray-600 group-hover:font-bold", opt.color ? `group-hover:${opt.color}` : "group-hover:text-orange-500"),
                                )}
                              >
                                {opt.label}
                                {opt.disabled && <span className="ml-2 text-[10px] font-bold text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-full">(Đã tồn tại)</span>}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check
                              className="text-orange-500 animate-in zoom-in duration-200 shrink-0"
                              size={11}
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    Không tìm thấy kết quả
                  </span>
                </div>
              )}
            </div>

            {isCategory && (
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                {isAddingNew ? (
                  <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                    <FormInput
                      autoFocus
                      placeholder="Nhập giá trị mới..."
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNewConfirm();
                        }
                        if (e.key === "Escape") setIsAddingNew(false);
                      }}
                      className="h-10 text-xs font-bold border-orange-200 focus:border-orange-500 shadow-sm"
                      containerClassName="flex-1 space-y-0"
                    />
                    <button
                      onClick={handleAddNewConfirm}
                      className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 active:scale-95"
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingNew(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold text-orange-600 hover:bg-orange-50 transition-all group"
                  >
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                    Thêm thuộc tính mới
                  </button>
                )}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};  
