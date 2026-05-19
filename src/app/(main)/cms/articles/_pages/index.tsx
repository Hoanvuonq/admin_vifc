"use client";

import { AdminPageHeader, PremiumButton } from "@/components";
import { DataTable } from "@/components/DataTable";
import { BookOpen, Newspaper, Plus, Sparkles, MessageSquare, Flame } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CMSFilters, CMSDrawer } from "../_components";
import { getColumns } from "./columns";
import { useCMSArticles } from "../_hooks/useCMSArticles";
import { NewsItem } from "./types";
import _ from "lodash";

export const ManagerCMSScreen = () => {
  const { articles: newsList, saveArticle, deleteArticle } = useCMSArticles();
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);


  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNewsToEdit, setSelectedNewsToEdit] = useState<NewsItem | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = newsList.length;
    const published = newsList.filter((n) => n.status === "PUBLISHED").length;
    const draft = newsList.filter((n) => n.status === "DRAFT").length;
    const pendingReview = newsList.filter((n) => n.status === "PENDING_REVIEW").length;
    const archived = newsList.filter((n) => n.status === "ARCHIVED").length;
    return { total, published, draft, pendingReview, archived };
  }, [newsList]);

  // Apply filters including Date Range
  const filteredNews = useMemo(() => {
    return newsList.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchText.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchText.toLowerCase()) ||
        (n.content && n.content.toLowerCase().includes(searchText.toLowerCase())) ||
        n.id.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory = selectedCategory === "ALL" || n.category === selectedCategory;
      const matchesStatus = selectedStatus === "ALL" || n.status === selectedStatus;

      // Date range filtering
      if (startDate || endDate) {
        try {
          const itemDateStr = n.createdDate.split(" ")[0]; // e.g. "25/05/2024"
          const [day, month, year] = itemDateStr.split("/").map(Number);
          const itemDate = new Date(year, month - 1, day);

          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (itemDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (itemDate > end) return false;
          }
        } catch (e) {
          console.error("Lỗi khi chuyển đổi ngày tạo bài viết", e);
        }
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [newsList, searchText, selectedCategory, selectedStatus, startDate, endDate]);

  // Auto-reset page when filtering changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, selectedCategory, selectedStatus, startDate, endDate]);

  // Paginated data
  const paginatedNews = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredNews.slice(start, end);
  }, [filteredNews, currentPage, pageSize]);

  const handleEditNews = (news: NewsItem) => {
    setSelectedNewsToEdit(news);
    setIsDrawerOpen(true);
  };

  const handleDeleteNews = async (id: string) => {
    const itemToDelete = newsList.find((n) => n.id === id);
    if (itemToDelete) {
      if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${itemToDelete.title}" không?`)) {
        await deleteArticle(id);
        showToast(`Đã xóa bài viết thành công`, "warning");
      }
    }
  };

  const handleSaveNews = async (newsData: Omit<NewsItem, "id" | "createdDate" | "views" | "authorName" | "authorAvatar">) => {
    await saveArticle({
      newsData,
      selectedId: selectedNewsToEdit?.id
    });

    if (selectedNewsToEdit) {
      showToast(`Đã cập nhật bài viết thành công!`, "success");
    } else {
      showToast(`Đã thêm bài viết mới thành công!`, "success");
    }

    setIsDrawerOpen(false);
    setSelectedNewsToEdit(null);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setStartDate("");
    setEndDate("");
    showToast("Đã thiết lập lại bộ lọc", "info");
  };

  const columns = useMemo(() => getColumns(handleEditNews, handleDeleteNews), [newsList]);

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100000] px-5 py-3 rounded-2xl shadow-lg border text-xs font-bold transition-all duration-300 animate-in slide-in-from-top-5 ${toast.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          toast.type === "warning" ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        icon={Newspaper}
        title="Quản lý"
        highlightTitle="Tin tức & CMS"
        subtitle="Soạn thảo, quản lý chuyên mục, tối ưu SEO và cấu hình xuất bản tin bài viết"
        metrics={[
          {
            label: "Tổng bài viết",
            value: stats.total,
            icon: <BookOpen size={14} />,
            color: "blue"
          },
          {
            label: "Đã xuất bản",
            value: stats.published,
            icon: <Sparkles size={14} />,
            color: "emerald"
          },
          {
            label: "Bản nháp",
            value: stats.draft,
            icon: <Flame size={14} />,
            color: "orange"
          },
          {
            label: "Chờ duyệt",
            value: stats.pendingReview,
            icon: <MessageSquare size={14} />,
            color: "rose"
          }
        ]}
      />

      {/* Data Table */}
      <DataTable
        data={paginatedNews}
        columns={columns}
        loading={false}
        rowKey="id"
        emptyMessage="Không tìm thấy bài viết nào phù hợp với bộ lọc."
        page={currentPage}
        headerContent={
          <CMSFilters
            searchText={searchText}
            setSearchText={setSearchText}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            counts={stats}
            onReset={handleResetFilters}
            onAddClick={() => {
              setSelectedNewsToEdit(null);
              setIsDrawerOpen(true);
            }}
          />
        }
        size={pageSize}
        totalElements={filteredNews.length}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Editor Drawer */}
      <CMSDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedNewsToEdit(null);
        }}
        newsToEdit={selectedNewsToEdit}
        onSave={handleSaveNews}
      />
    </div>
  );
};
