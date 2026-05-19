"use client";

import { AccountDropdown, LanguageSwitcher, MetricItem, SearchComponent, ThemeSwitcher, TitlePageHeader } from "@/components";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, ChevronRight, LayoutGrid, Menu, Search as SearchIcon, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MOCK_SIDEBAR_ITEMS } from "../sidebar/mockItems";
import { BaseHeaderProps } from "../types";

const getSearchableText = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};


export const Header = ({
  collapsed = false,
  onToggleSidebar = () => { },
  isMobile = false,
  scrollY = 0,
  headerInfo,
  notificationDropdown = (
    <div className="relative cursor-pointer group select-none">
      <div className="p-2 md:p-2.5 rounded-full hover:bg-slate-50 border border-slate-100 shadow-xs transition-all duration-300">
        <Bell className="text-gray-600 group-hover:text-orange-500 transition-colors" size={18} />
      </div>
      <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-rose-500 text-[9px] text-white font-bold shadow-xs">
          4
        </span>
      </span>
    </div>
  ),
  accountDropdown = <AccountDropdown />,
  searchPlaceholder = "Tìm kiếm chức năng quản lý...",
  defaultTitle = "Dashboard",
  defaultHighlightTitle = "Management",
}: BaseHeaderProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const showPageHeader = scrollY > 100 && headerInfo;

  const sidebarItems = MOCK_SIDEBAR_ITEMS;
  const searchRef = useRef<HTMLDivElement>(null);

  const searchableItems = useMemo(() => {
    const items: any[] = [];
    sidebarItems.forEach(item => {
      if (item.href) {
        items.push({ label: item.label, icon: item.icon, href: item.href, parent: null });
      }
      if (item.children) {
        item.children.forEach(child => {
          items.push({
            label: child.label,
            icon: child.icon || item.icon,
            href: child.href,
            parent: item.label
          });
        });
      }
    });
    return items;
  }, [sidebarItems]);

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const searchKey = getSearchableText(searchValue);
    return searchableItems.filter(item => {
      const itemKey = getSearchableText(item.label);
      const parentKey = item.parent ? getSearchableText(item.parent) : "";
      return itemKey.includes(searchKey) || parentKey.includes(searchKey);
    }).slice(0, 8);
  }, [searchValue, searchableItems]);

  const handleSelect = (href: string) => {
    router.push(href);
    setSearchValue("");
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-16 md:h-20 px-4 md:px-8",
        "flex items-center justify-between transition-all duration-500",
        showPageHeader ? "bg-white/90 backdrop-blur-2xl shadow-custom" : "bg-white/60 backdrop-blur-2xl shadow-sm"
      )}
    >
      <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="group relative p-2 md:p-2.5 rounded-2xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 active:scale-90 border border-transparent hover:border-orange-100 shadow-sm hover:shadow-orange-200/20 shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu
            className={cn(
              "w-5 h-5 md:w-6 md:h-6 transition-all duration-500",
              collapsed ? "rotate-180 scale-110" : ""
            )}
          />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {showPageHeader ? (
              <motion.div
                key="page-header"
                initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-4 md:gap-8"
              >
                <TitlePageHeader
                  icon={headerInfo.icon}
                  title={headerInfo.title}
                  highlightTitle={headerInfo.highlightTitle}
                  subtitle={headerInfo.subtitle}
                  size="xs"
                  className="px-1 shrink-0"
                />

                {headerInfo.metrics && headerInfo.metrics.length > 0 && (
                  <div className="hidden xl:flex items-center gap-1 p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-[inset_0_2px_12px_rgba(0,0,0,0.03)]">
                    {headerInfo.metrics.map((metric: any, index: number) => (
                      <Fragment key={index}>
                        <MetricItem
                          label={metric.label}
                          value={metric.value}
                          icon={metric.icon}
                          color={metric.color}
                          isMoney={metric.isMoney}
                          suffix={metric.suffix}
                          compact
                        />
                        {index < headerInfo.metrics!.length - 1 && (
                          <div className="w-px h-6 bg-gray-200/50 mx-1" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="default-header"
                initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-4 md:gap-8"
              >
                <TitlePageHeader
                  icon={LayoutGrid}
                  title={defaultTitle}
                  highlightTitle={defaultHighlightTitle}
                  subtitle="Welcome backs"
                  size="xs"
                />

                <div className="hidden lg:flex flex-1 max-w-lg ml-20 relative" ref={searchRef}>
                  <SearchComponent
                    value={searchValue}
                    onChange={(val) => {
                      setSearchValue(val);
                      setIsFocused(true);
                    }}
                    placeholder={searchPlaceholder}
                  />

                  <AnimatePresence>
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-2"
                      >
                        {searchValue.trim().length > 0 ? (
                          suggestions.length > 0 ? (
                            <div className="space-y-1">
                              <div className="px-4 py-2 flex items-center gap-2">
                                <Zap size={14} className="text-orange-500 fill-orange-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suggestion</span>
                              </div>
                              {suggestions.map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSelect(item.href)}
                                  className="w-full flex items-center justify-between p-3 hover:bg-orange-50 rounded-2xl group transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-sm transition-all">
                                      {item.icon}
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600">{item.label}</span>
                                      {item.parent && (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{item.parent}</span>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transform group-hover:translate-x-1 transition-all" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <SearchIcon size={24} className="text-gray-300" />
                              </div>
                              <p className="text-sm font-bold text-gray-500">Không tìm thấy chức năng nào</p>
                              <p className="text-xs text-gray-400 mt-1">Vui lòng thử từ khóa khác (ví dụ: "Sản phẩm", "Ví", "Flash sale")</p>
                            </div>
                          )
                        ) : (
                          <div className="space-y-1">
                            <div className="px-4 py-2 flex items-center gap-2">
                              <LayoutGrid size={14} className="text-orange-500" />
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Truy cập nhanh</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {sidebarItems.slice(0, 8).map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSelect(item.href || (item.children?.[0]?.href || ""))}
                                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl group transition-all"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-sm transition-all">
                                    {item.icon}
                                  </div>
                                  <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        <AnimatePresence mode="wait">
          {showPageHeader ? (
            <motion.div
              key="page-actions"
              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-3 mr-2"
            >
              {headerInfo.actions}
            </motion.div>
          ) : (
            <motion.div
              key="default-settings"
              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-1.5 md:gap-4"
            >
              {notificationDropdown}
              <div className="hidden xs:block h-8 w-px bg-slate-100 mx-1 md:mx-2" />
              <div className="hidden lg:flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-3xl border border-slate-100 shadow-sm">
                <LanguageSwitcher />
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <ThemeSwitcher />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pl-2 md:pl-4 border-l border-slate-100 h-10 flex items-center">
          {accountDropdown}
        </div>
      </div>
    </header>
  );
};
