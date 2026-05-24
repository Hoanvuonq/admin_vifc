"use client";

import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SidebarItemProps } from "../types";

export const SidebarItem = ({
  item,
  collapsed,
  activeKey,
  openKeys,
  onToggle,
  isParentOfActive,
}: SidebarItemProps) => {
  const [isClickLoading, setIsClickLoading] = useState(false);
  const isActive = activeKey === item.key;
  const isOpen = openKeys.includes(item.key);
  const hasChildren = item.children && item.children.length > 0;
  const highlightParent = isParentOfActive && !collapsed;

  const totalCount = useMemo(() => {
    if (hasChildren) {
      return item.children?.reduce((acc, child) => acc + (child.count || 0), 0) || 0;
    }
    return item.count || 0;
  }, [item.count, item.children, hasChildren]);

  if (item.type === "divider") {
    return <div className="h-px bg-gray-100/50 my-2 mx-6" />;
  }

  const iconWithTooltip = (
    <span
      className={cn(
        "shrink-0 transition-all duration-300 relative flex items-center justify-center w-10 h-10 rounded-2xl",
        isActive
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 rotate-3 scale-110"
          : highlightParent
            ? "text-orange-500 bg-orange-50"
            : "text-gray-600 group-hover:text-orange-500 group-hover:bg-orange-50 group-hover:rotate-3 group-hover:scale-110"
      )}
    >
      {item.icon}

      {collapsed && totalCount > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex items-center justify-center h-4 w-4 rounded-full bg-orange-600 text-[7px] text-white font-bold ring-2 ring-white shadow-xl">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        </span>
      ) : null}

      {collapsed && (
        <div
          className={cn(
            "absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2",
            "rounded-xl bg-orange-600 text-white text-[10px] font-bold uppercase opacity-0",
            "group-hover:opacity-100 group-hover:translate-x-1 pointer-events-none",
            "whitespace-nowrap z-100 transition-all duration-300 shadow-2xl shadow-black/20 backdrop-blur-md"
          )}
        >
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-orange-600" />
          {item.label}
        </div>
      )}
    </span>
  );

  const content = (
    <div
      data-active={isActive}
      className={cn(
        "flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 cursor-pointer group select-none relative mb-1",
        item.disabled && "opacity-40 pointer-events-none grayscale",
        !item.disabled && isActive
          ? "bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100"
          : !item.disabled && highlightParent
            ? "bg-orange-50/20"
            : !item.disabled && "hover:bg-orange-50/50 text-gray-600",
        isClickLoading && "animate-pulse opacity-70 scale-95",
        item.className
      )}
      onClick={(e) => {
        if (item.disabled) {
          e.preventDefault();
          return;
        }
        if (hasChildren) {
          onToggle(item.key);
        } else {
          setIsClickLoading(true);
          setTimeout(() => setIsClickLoading(false), 800);
        }
      }}
    >
      {iconWithTooltip}

      {!collapsed && (
        <span className={cn(
          "flex-1 text-[13px] tracking-tight transition-all duration-300 group-hover:translate-x-1 flex items-center justify-between",
          isActive || highlightParent ? "font-bold text-orange-600" : "font-bold text-gray-500 group-hover:text-orange-600"
        )}>
          {item.label}
          {totalCount > 0 ? (
            <span className="ml-2 relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-600 text-[9px] text-white font-bold ring-1 ring-white shadow-sm">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            </span>
          ) : null}
        </span>
      )}

      {!collapsed && hasChildren && (
        <span
          className={cn(
            "transition-all duration-300 p-1 rounded-lg mr-1",
            isOpen ? "rotate-90 bg-orange-100 text-orange-600" : "text-gray-500 group-hover:text-gray-600"
          )}
        >
          <ChevronRight size={14} strokeWidth={3} />
        </span>
      )}

      {isActive && !collapsed && (
        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
      )}
    </div>
  );

  return (
    <div className="px-2">
      {item.href && !hasChildren ? (
        <Link href={item.href}>{content}</Link>
      ) : (
        content
      )}

      {!collapsed && hasChildren && isOpen && (
        <div className="mt-1 ml-5 pl-2 border-l-2 border-slate-100 space-y-1 animate-in fade-in slide-in-from-left-2 duration-500">
          {item.children?.map((child) => {
            const isChildActive = activeKey === child.key;
            return (
              <Link
                key={child.key}
                href={child.href || "#"}
                data-active={isChildActive}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] transition-all group-hover:text-orange-600 duration-300 group/sub hover:translate-x-1",
                  isChildActive
                    ? "text-orange-600 font-bold bg-orange-100 shadow-sm"
                    : "text-gray-600 font-bold hover:text-orange-600 hover:bg-orange-50",
                  isClickLoading && "animate-pulse"
                )}
                onClick={() => {
                  setIsClickLoading(true);
                  setTimeout(() => setIsClickLoading(false), 800);
                }}
              >
                {child.icon && (
                  <span className={cn(
                    "transition-transform duration-300 group-hover/sub:scale-110 group-hover/sub:rotate-3 hover:text-orange-600",
                    isChildActive ? "text-orange-600" : "text-gray-600"
                  )}>
                    {child.icon}
                  </span>
                )}
                <span className="tracking-wide font-bold text-[10px] flex-1">
                  {child.label}
                </span>
                {child.count && child.count > 0 ? (
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center h-4 w-4 rounded-full bg-orange-600 text-[7px] text-white font-bold ring-1 ring-white shadow-sm">
                      {child.count > 99 ? "99+" : child.count}
                    </span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
