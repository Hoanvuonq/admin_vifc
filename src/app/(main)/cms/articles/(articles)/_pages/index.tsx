"use client";

import { AdminPageHeader } from "@/components";
import { DataTable } from "@/components/DataTable";
import { BookOpen, Flame, MessageSquare, Newspaper, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CMSFilters } from "../_components";
import { useCMSArticles } from "../_hooks/useCMSArticles";
import { useArticleListStore } from "../_store/useArticleListStore";
import { getColumns } from "./columns";
import { NewsItem } from "./types";

export const ManagerCMSScreen = () => {
  const router = useRouter();
  const { articles: newsList, isLoading, saveArticle, deleteArticle } = useCMSArticles();

  const {
    searchText, selectedCategory, selectedStatus, startDate, endDate,
    currentPage, pageSize, toast, setCurrentPage, showToast
  } = useArticleListStore();

  const stats = useMemo(() => {
    const total = newsList.length;
    const published = newsList.filter((n) => n.status === "PUBLISHED").length;
    const draft = newsList.filter((n) => n.status === "DRAFT").length;
    const pendingReview = newsList.filter((n) => n.status === "PENDING_REVIEW").length;
    const archived = newsList.filter((n) => n.status === "ARCHIVED").length;
    return { total, published, draft, pendingReview, archived };
  }, [newsList]);

  const filteredNews = useMemo(() => {
    return newsList.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchText.toLowerCase()) ||
        n.description.toLowerCase().includes(searchText.toLowerCase()) ||
        n.id.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory = selectedCategory === "ALL" || (Array.isArray(n.category) ? n.category.includes(selectedCategory) : n.category === selectedCategory);
      const matchesStatus = selectedStatus === "ALL" || n.status === selectedStatus;

      if (startDate || endDate) {
        try {
          const itemDateStr = n.createdDate.split(" ")[0];
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
          console.error("Error converting article creation date", e);
        }
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [newsList, searchText, selectedCategory, selectedStatus, startDate, endDate]);

  const paginatedNews = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredNews.slice(start, end);
  }, [filteredNews, currentPage, pageSize]);

  const handleEditNews = (news: NewsItem) => {
    router.push(`/cms/articles/${news.id}`);
  };

  const handleEditNewsBlockNote = (news: NewsItem) => {
    router.push(`/cms/articles/create?id=${news.id}`);
  };

  const handleDeleteNews = async (id: string) => {
    const itemToDelete = newsList.find((n) => n.id === id);
    if (itemToDelete) {
      if (confirm(`Are you sure you want to delete the article "${itemToDelete.title}"?`)) {
        await deleteArticle(id);
        showToast(`Article deleted successfully`, "warning");
      }
    }
  };

  const columns = useMemo(() => getColumns(handleEditNews, handleDeleteNews, handleEditNewsBlockNote), [newsList]);



  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-100000 px-5 py-3 rounded-2xl shadow-lg border text-xs font-bold transition-all duration-300 animate-in slide-in-from-top-5 ${toast.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          toast.type === "warning" ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        icon={Newspaper}
        title="Manage"
        highlightTitle="News & CMS"
        subtitle="Draft, manage categories, optimize SEO, and configure article publishing settings"
        metrics={[
          {
            label: "Total Articles",
            value: stats.total,
            icon: <BookOpen size={14} />,
            color: "blue"
          },
          {
            label: "Published",
            value: stats.published,
            icon: <Sparkles size={14} />,
            color: "emerald"
          },
          {
            label: "Drafts",
            value: stats.draft,
            icon: <Flame size={14} />,
            color: "orange"
          },
          {
            label: "Pending Review",
            value: stats.pendingReview,
            icon: <MessageSquare size={14} />,
            color: "rose"
          }
        ]}
      />

      <DataTable
        data={paginatedNews}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        emptyMessage="No articles found matching the current filters."
        page={currentPage}
        headerContent={
          <CMSFilters counts={stats} />
        }
        size={pageSize}
        totalElements={filteredNews.length}
        onPageChange={(p) => setCurrentPage(p)}
      />

    </div>
  );
};
