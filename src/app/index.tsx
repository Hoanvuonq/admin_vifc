"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BaseSidebarProps } from "../types";
import { SidebarItem } from "./SidebarItem";
import { MOCK_SIDEBAR_ITEMS } from "./mockItems";
import Image from "next/image";

export const Sidebar = ({
  collapsed = false,
  items = MOCK_SIDEBAR_ITEMS,
  activeKey = "dashboard",
  parentKey,
  onToggle = () => { },
  logoFull = "/icon/cano-v7.png",
  logoIcon = "/icon/cano-v5.png",
  dashboardHref = "/dashboard",
  className,
}: BaseSidebarProps) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync open keys with parent key from parent
  useEffect(() => {
    if (parentKey && !collapsed) {
      setOpenKeys((prev) => Array.from(new Set([...prev, parentKey])));
    }
  }, [parentKey, collapsed]);

  useEffect(() => {
    if (!collapsed) {
      const timer = setTimeout(() => {
        const activeElement = scrollContainerRef.current?.querySelector('[data-active="true"]');
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeKey, collapsed]);

  const handleToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
    if (onToggle) onToggle(key);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-white h-screen sticky top-0 transition-all duration-500 z-50 border-r border-blue-50 shadow-sm",
        collapsed ? "w-20 overflow-visible" : "w-64",
        className
      )}
    >
      <div className={cn(
        "h-24 flex items-center transition-all duration-500 ease-in-out",
        collapsed ? "justify-center px-0" : "px-6"
      )}>
        <Link
          href={dashboardHref}
          className="flex items-center group relative w-full h-full justify-center select-none"
        >
          <div className="flex items-center gap-3">
            <div className="relative group/logo">
              <div className="absolute -inset-1.5 bg-linear-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-30 group-hover/logo:opacity-75 transition duration-500 animate-pulse" />

              <div className="relative w-16 h-16 rounded-xl flex items-center justify-center p-2 shadow-[0_4px_20px_rgba(234,88,12,0.08)] group-hover/logo:border-orange-300 transition duration-300">
                <Image
                  src="/icons/icon_sidebar2.png"
                  width={100}
                  height={100}
                  alt="VIFC Web3 Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(234,88,12,0.1)] transform group-hover/logo:scale-110 transition duration-300"
                />
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col items-start leading-none gap-1 select-none animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-base itim-regular font-bold! bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent tracking-widest uppercase filter drop-shadow-sm">
                  VIFC PORTAL
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex-1 custom-scrollbar",
          collapsed ? "overflow-visible" : "overflow-y-auto",
        )}
      >
        <nav className="space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              activeKey={activeKey}
              openKeys={openKeys}
              onToggle={handleToggle}
              isParentOfActive={parentKey === item.key}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};
