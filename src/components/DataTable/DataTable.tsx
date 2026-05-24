"use client";

import { EmptyState, SectionLoading } from "@/components";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import React, { useRef } from "react";
import { DataTableProps } from "./type";
import Skeleton from "react-loading-skeleton";

export const DataTable = <T,>({
  data,
  columns,
  loading,
  rowKey,
  emptyMessage = "Không có dữ liệu",
  page = 0,
  size = 10,
  totalElements = 0,
  onPageChange,
  headerContent,
  emptyState,
  className,
  renderDropdown,
  isDropdown,
  onRowClick,
  expandedRowId: propsExpandedRowId,
  onRowExpand,
}: DataTableProps<T>) => {
  const [internalExpandedRowId, setInternalExpandedRowId] = React.useState<string | number | null>(null);

  const expandedRowId = propsExpandedRowId !== undefined ? propsExpandedRowId : internalExpandedRowId;

  const setExpandedRowId = (id: string | number | null) => {
    if (onRowExpand) {
      onRowExpand(id);
    } else {
      setInternalExpandedRowId(id);
    }
  };
  const totalPages = Math.ceil(totalElements / size);
  const fromItem = totalElements > 0 ? page * size + 1 : 0;
  const toItem = Math.min((page + 1) * size, totalElements);
  const showPagination = onPageChange !== undefined && totalElements > 0;

  const containerRef = useRef<HTMLDivElement>(null);

  const getRowKey = (item: T, index: number) => {
    if (typeof rowKey === "function") return rowKey(item, index);
    if (
      rowKey &&
      typeof rowKey === "string" &&
      item &&
      typeof item === "object" &&
      rowKey in item
    ) {
      return (item[rowKey as keyof T] as unknown as string) || index;
    }
    return index;
  };

  const toggleRow = (id: string | number) => {
    const newValue = expandedRowId === id ? null : id;
    setExpandedRowId(newValue);
  };

  return (
    <div className={cn("w-full h-full flex flex-col space-y-4", className)}>
      {headerContent && (
        <div className="flex-none flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-2 duration-500">
          {headerContent}
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden bg-white border border-gray-200 rounded-4xl shadow-custom">
        <div className="overflow-x-auto flex-1 custom-scrollbar relative scroll-smooth overscroll-x-contain" ref={containerRef}>
          <table className="min-w-full border-separate border-spacing-0 table-fixed sm:table-auto">
            <thead className="sticky top-0 z-20">
              <tr className="bg-gray-50/80 backdrop-blur-md rounded-t-4xl">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      "px-6 py-4 text-[11px] font-bold uppercase cherry-bomb-one-regular text-gray-500 tracking-wide border-b border-gray-200",
                      col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                      col.headerClassName
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: size || 5 }).map((_, rowIdx) => (
                  <motion.tr
                    key={`loading-${rowIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-50/50"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-4">
                        <div className={col.align === "center" ? "flex justify-center" : col.align === "right" ? "flex justify-end" : "flex justify-start"}>
                          <Skeleton
                            height={28}
                            width={colIdx === 0 ? 240 : 80}
                            borderRadius="0.5rem"
                          />
                        </div>
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : data.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={columns.length} className="px-3">
                    {emptyState ? emptyState : <EmptyState isTable message={emptyMessage} />}
                  </td>
                </motion.tr>
              ) : (
                data.map((item, rowIdx) => {
                  const id = getRowKey(item, rowIdx);
                  const isExpanded = expandedRowId === id;

                  return (
                    <React.Fragment key={id}>
                      <motion.tr
                        id={`row-${id}`}
                        layout="position"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 26,
                        }}
                        onClick={() => {
                          if (onRowClick) {
                            onRowClick(item, rowIdx);
                          }
                          if (renderDropdown || isDropdown) {
                            toggleRow(id);
                            setTimeout(() => {
                              const element = document.getElementById(`row-${id}`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }, 50);
                          }
                        }}
                        className={cn(
                          "group transition-all duration-300 select-none scroll-mt-20",
                          (renderDropdown || isDropdown || onRowClick) ? "cursor-pointer hover:bg-orange-50/50" : "hover:bg-gray-50/50",
                          isExpanded && "bg-orange-50/80 shadow-[inset_0_4px_20px_rgba(249,115,22,0.08)] border-l-4 border-l-orange-500"
                        )}
                      >
                        {columns.map((col, colIdx) => {
                          const rendered = col.render ? col.render(item, rowIdx) : null;
                          let cellContent: React.ReactNode = null;

                          if (rendered && typeof rendered === "object" && "content" in rendered) {
                            cellContent = (rendered as any).content;
                          } else if (col.render) {
                            cellContent = rendered as React.ReactNode;
                          } else if (col.accessor) {
                            cellContent = item[col.accessor] as React.ReactNode;
                          }

                          return (
                            <td
                              key={colIdx}
                              className={cn(
                                "px-4 py-2 whitespace-nowrap text-[13px] text-gray-600 font-medium border-b border-gray-50/50 transition-colors",
                                col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                                col.className,
                                isExpanded && "text-orange-950 font-bold"
                              )}
                            >
                              {cellContent}
                            </td>
                          );
                        })}
                      </motion.tr>

                      <AnimatePresence initial={false}>
                        {isExpanded && renderDropdown && (
                          <tr className="bg-gray-50/5 border-none">
                            <td colSpan={columns.length} className="p-0 border-b border-gray-100 overflow-hidden">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                  transition: {
                                    height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                                    opacity: { duration: 0.2, ease: "linear" }
                                  }
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                  transition: {
                                    height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                                    opacity: { duration: 0.15, ease: "linear" }
                                  }
                                }}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -8, scale: 0.99 }}
                                  animate={{ y: 0, scale: 1 }}
                                  exit={{ y: -8, scale: 0.99 }}
                                  transition={{ duration: 0.25, ease: "easeOut" }}
                                  className="py-1"
                                >
                                  {renderDropdown(item)}
                                </motion.div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {showPagination && (
          <div className="flex-none flex flex-col items-center justify-between gap-4 bg-gray-50/50 px-8 py-3 border-t border-gray-100 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase text-gray-600 tracking-tighter italic">Thống kê tài sản</span>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
                <span className="text-[11px] font-bold text-orange-600">{fromItem}-{toItem}</span>
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-[11px] font-bold text-gray-500 uppercase">{totalElements} mục</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(page - 1)}
                disabled={page === 0 || loading}
                className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-orange-500 hover:border-orange-200 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => {
                  const isSelected = page === pageNum;
                  if (totalPages > 5 && Math.abs(pageNum - page) > 1 && pageNum !== 0 && pageNum !== totalPages - 1) {
                    if (pageNum === 1 || pageNum === totalPages - 2) return <span key={pageNum} className="px-1 text-gray-500">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={cn(
                        "h-8 min-w-8 rounded-xl text-[11px] font-bold transition-all border",
                        isSelected
                          ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-orange-50"
                      )}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange?.(page + 1)}
                disabled={page >= totalPages - 1 || loading}
                className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-orange-500 hover:border-orange-200 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};