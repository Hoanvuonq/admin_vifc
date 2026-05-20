/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/utils/cn";
import { toBannerISOString, toLocalISOString } from "@/utils/dateUtils";
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  subMonths
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { PremiumButton } from "../PremiumButton";
import { SmartDateTimeProps } from "./type";

export const DateTimeInput = ({
  label,
  value,
  onChange,
  required,
  error,
  isDate = false,
  isTime = false,
  disabled = false,
  className,
  minDate,
  maxDate,
  rangeMessage,
  placeholder = "Chọn thời điểm...",
  isBanner = false,
}: SmartDateTimeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    isBottom: boolean;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);


  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const hasDate = isDate || (!isDate && !isTime);
      const hasTime = isTime;

      const dropdownHeight = (hasDate && hasTime) ? 500 : (hasTime ? 320 : 420);
      const dropdownWidth = (hasDate && hasTime) ? 580 : (hasDate ? 340 : 220);
      const gap = 8;

      let top: number;
      let isBottom = true;

      if (viewportHeight - rect.bottom < dropdownHeight && rect.top > dropdownHeight) {
        top = rect.top - dropdownHeight - gap;
        isBottom = false;
      } else {
        top = rect.bottom + gap;
        isBottom = true;
      }

      let left = rect.left;
      if (left + dropdownWidth > viewportWidth - gap) {
        left = viewportWidth - dropdownWidth - gap;
      }
      if (left < gap) left = gap;

      setCoords({ top, left, width: rect.width, isBottom });
    }
  }, [isDate, isTime]);

  const handleOpen = () => {
    if (disabled) return;
    if (!value) {
      const defaultValue = new Date(Date.now() + 10 * 60 * 1000);
      onChange(isBanner ? toBannerISOString(defaultValue) : toLocalISOString(defaultValue));
    }
    updatePosition();
    setIsOpen(!isOpen);
  };

  const scrollToActive = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (isDate && !isTime) return;
    const activeHour = hourScrollRef.current?.querySelector(`[data-active="true"]`);
    const activeMinute = minuteScrollRef.current?.querySelector(`[data-active="true"]`);
    if (activeHour) activeHour.scrollIntoView({ block: "center", behavior });
    if (activeMinute) activeMinute.scrollIntoView({ block: "center", behavior });
  }, [isDate, isTime]);

  useEffect(() => {
    if (isOpen && (isTime || (!isDate && !isTime))) {
      setTimeout(() => scrollToActive("auto"), 50);
    }
  }, [isOpen, scrollToActive, isDate, isTime]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (containerRef.current && !containerRef.current.contains(target) && !target.closest(".datetime-portal-content")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? new Date(value) : new Date(Date.now() + 10 * 60 * 1000);

  const handleTimeChange = (type: "h" | "m", val: number) => {
    const newDate = type === "h" ? setHours(selectedDate, val) : setMinutes(selectedDate, val);
    onChange(isBanner ? toBannerISOString(newDate) : toLocalISOString(newDate));
  };

  const isDayOutOfRange = (day: Date) => {
    if (minDate && isBefore(endOfDay(day), startOfDay(new Date(minDate)))) return true;
    if (maxDate && isAfter(startOfDay(day), endOfDay(new Date(maxDate)))) return true;
    return false;
  };

  const renderDisplayValue = () => {
    if (!value) return placeholder;
    if (isTime && !isDate) return format(selectedDate, "HH:mm");
    if (isDate && !isTime) return format(selectedDate, "dd/MM/yyyy");
    return format(selectedDate, "dd/MM/yyyy HH:mm");
  };

  return (
    <div className={cn("space-y-2 w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="text-[12px] font-bold text-gray-600 ml-1 flex items-center gap-1">
          {isTime && !isDate ? <Clock size={14} strokeWidth={2.5} /> : <CalendarDays size={14} strokeWidth={2.5} />}
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={handleOpen}
        className={cn(
          "h-12 px-5 rounded-2xl cursor-pointer shadow-custom border border-transparent text-gray-700 flex items-center justify-between transition-all duration-200 bg-gray-50/50",
          isOpen && "border-orange-500 ring-4 ring-orange-500/10 bg-white",
          disabled && "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-100 shadow-none",
          error && "border-red-400 bg-red-50/30",
        )}
      >
        <div className="flex items-center gap-3">
          {isTime && !isDate ? (
            <Clock size={18} className={cn(value && !disabled ? "text-orange-500" : "text-gray-600")} />
          ) : (
            <CalendarDays size={18} className={cn(value && !disabled ? "text-orange-500" : "text-gray-600")} />
          )}
          <span className={cn("text-sm font-bold italic tabular-nums", !value && "font-normal text-gray-500")}>
            {renderDisplayValue()}
          </span>
        </div>
      </div>

      {rangeMessage && (
        <p className="text-[10px] font-extrabold text-orange-600 uppercase ml-1 animate-pulse italic flex items-center gap-1">
          <AlertCircle size={12} strokeWidth={3} />
          {rangeMessage}
        </p>
      )}

      {isOpen && coords && typeof document !== "undefined" && createPortal(
        <div
          className={cn(
            "fixed z-99999 datetime-portal-content bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 flex flex-col overflow-hidden",
            "animate-in fade-in zoom-in-95 duration-200 ease-out",
            coords.isBottom ? "slide-in-from-top-2" : "slide-in-from-bottom-2",
          )}
          style={{ top: coords.top, left: coords.left }}
        >
          <div className="flex">
            {(!isTime || (isDate && isTime) || isDate) && (
              <div className="w-72 shrink-0">
                <div className="flex items-center justify-between mb-6 px-1">
                  <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-orange-50 text-orange-600 rounded-xl transition-all">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-tight italic">
                    {format(currentMonth, "MMMM yyyy", { locale: vi })}
                  </span>
                  <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-orange-50 text-orange-600 rounded-xl transition-all">
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-6 px-1">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                    <span key={d} className="text-[10px] font-bold text-gray-500 py-1 uppercase">{d}</span>
                  ))}
                  {Array.from({ length: (getDay(startOfMonth(currentMonth)) + 6) % 7 }).map((_, i) => (
                    <div key={`pad-${i}`} />
                  ))}
                  {days.map((day) => {
                    const outOfRange = isDayOutOfRange(day);
                    return (
                      <button
                        key={day.toString()}
                        type="button"
                        disabled={outOfRange}
                        onClick={() => {
                          const newDate = setHours(setMinutes(day, selectedDate.getMinutes()), selectedDate.getHours());
                          onChange(isBanner ? toBannerISOString(newDate) : toLocalISOString(newDate));
                        }}
                        className={cn(
                          "relative h-10 w-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all",
                          isSameDay(day, selectedDate)
                            ? "bg-gray-900 text-white shadow-lg scale-110 z-10"
                            : "hover:bg-orange-50 text-gray-600",
                          isToday(day) && !isSameDay(day, selectedDate) &&
                          "after:absolute after:bottom-1.5 after:w-1 after:h-1 after:bg-orange-500 after:rounded-full",
                          outOfRange && "opacity-20 grayscale pointer-events-none cursor-not-allowed bg-gray-50"
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <PremiumButton
                    variant="orange"
                    className="w-full h-11 text-[10px] font-bold uppercase rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 border-0"
                    onClick={() => setIsOpen(false)}
                  >
                    CONFIRM DATE
                  </PremiumButton>
                </div>
              </div>
            )}

            {(!isDate || (isDate && isTime) || isTime) && (
              <div className={cn("flex gap-6 relative", (!isTime || (isDate && isTime)) && "border-l border-gray-100 ml-10 pl-10")}>
                {["Giờ", "Phút"].map((label, idx) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-gray-600 uppercase mb-4 italic">{label}</span>
                    <div className={cn(
                      "relative h-80 w-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100",
                      isTime && "wh-60"
                    )}>
                      <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

                      <div
                        ref={idx === 0 ? hourScrollRef : minuteScrollRef}
                        className="h-full w-full overflow-y-auto scrollbar-none snap-y snap-mandatory py-24 flex flex-col items-center"
                      >
                        {Array.from({ length: idx === 0 ? 24 : 60 }).map((_, i) => {
                          const isActive = idx === 0 ? selectedDate.getHours() === i : selectedDate.getMinutes() === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              data-active={isActive}
                              onClick={() => handleTimeChange(idx === 0 ? "h" : "m", i)}
                              className={cn(
                                "h-12 w-full shrink-0 flex items-center justify-center rounded-xl text-xl font-bold transition-all snap-center outline-none italic",
                                isActive ? "text-orange-600 scale-125" : "text-gray-600 scale-90 opacity-40"
                              )}
                            >
                              {i.toString().padStart(2, "0")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTime && !isDate && (
                  <div className="absolute -bottom-4 left-0 right-0 z-50">
                    <PremiumButton
                      label="Done"
                      className="w-full h-10 text-[10px] font-bold uppercase rounded-2xl border-0 shadow-lg shadow-orange-500/20"
                      onClick={() => setIsOpen(false)}
                    />

                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};