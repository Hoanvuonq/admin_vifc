"use client";

import React, { useState, useMemo } from "react";
import { AdminPageHeader, PremiumButton, DataTable, SelectComponent } from "@/components";
import { useNewsletters } from "@/hooks/useNewsletters";
import { NewsletterItem, CreateNewsletterPayload } from "@/types/newsletter";
import { Mail, Plus, Search, CheckCircle2, BookOpen, Calendar, Users, MapPin, Newspaper } from "lucide-react";
import Link from "next/link";
import { getNewsletterColumns } from "./columns";
import { CreateEditNewsletterModal } from "../_components/CreateEditNewsletterModal";
import dayjs from "dayjs";

const NEWSLETTER_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang phát hành (Active)", color: "text-emerald-500" },
  { value: "draft", label: "Bản nháp (Draft)", color: "text-amber-500" },
  { value: "inactive", label: "Tạm ẩn (Inactive)", color: "text-rose-500" },
];

export const NewsletterListScreen: React.FC = () => {
  const { newsletters, isLoading, createNewsletter, updateNewsletter, deleteNewsletter, toggleNewsletterStatus, stats } = useNewsletters();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<NewsletterItem | null>(null);

  const filteredNewsletters = useMemo(() => {
    return newsletters.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (item.title || "").toLowerCase().includes(q);
        const matchDesc = (item.description || "").toLowerCase().includes(q);
        const matchLoc = (item.location || "").toLowerCase().includes(q);
        return matchTitle || matchDesc || matchLoc;
      }
      return true;
    });
  }, [newsletters, selectedStatus, searchQuery]);

  const handleOpenCreate = () => {
    setEditingNewsletter(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsletterItem) => {
    setEditingNewsletter(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ấn phẩm bản tin này khỏi danh sách?")) {
      deleteNewsletter(id);
    }
  };

  const handleSubmitModal = async (data: CreateNewsletterPayload) => {
    if (editingNewsletter) {
      await updateNewsletter(editingNewsletter.id, data);
    } else {
      await createNewsletter(data);
    }
  };

  const renderExpandedRow = (item: NewsletterItem) => (
    <div className="px-8 py-5 bg-linear-to-r from-amber-50/40 via-stone-50/60 to-white rounded-2xl border border-amber-100/80 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/15 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
          <Newspaper size={22} className="text-amber-600" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-amber-600 shrink-0" />
              {item.date
                ? dayjs(item.date).isValid()
                  ? dayjs(item.date).format("DD/MM/YYYY")
                  : item.date
                : new Date(item.created_at).toLocaleDateString("vi-VN")}
            </span>
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-orange-500 shrink-0" />
                {item.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-2">
        {item.description ? (
          <div className="text-gray-600">
            <span className="font-semibold block text-[11px] text-gray-700 mb-0.5">Nội dung chi tiết:</span>
            <p className="italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/50 leading-relaxed text-[11.5px]">{item.description}</p>
          </div>
        ) : (
          <p className="text-gray-400 italic">Chưa có mô tả chi tiết</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-center lg:self-start">
        <button
          onClick={() => handleOpenEdit(item)}
          className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 text-[11px] font-bold uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          Chỉnh Sửa
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Header */}
      <AdminPageHeader
        title="Quản Lý"
        highlightTitle="Newsletter"
        subtitle="Quản lý các ấn phẩm bản tin, ngày diễn ra, địa điểm và danh sách người đăng ký"
        icon={Mail}
        metrics={[
          {
            label: "Tổng Bản Tin",
            value: stats.total,
            icon: <BookOpen size={16} />,
            color: "blue",
          },
          {
            label: "Đang Phát Hành",
            value: stats.active,
            icon: <CheckCircle2 size={16} />,
            color: "emerald",
          },
        ]}
      >
        <div className="flex items-center gap-2.5">
          <Link href="/newsletter/subscribers">
            <PremiumButton label="Danh Sách Subscriber" icon={Users} variant="gray" size="md" />
          </Link>
          <PremiumButton
            label="Thêm Bản Tin Mới"
            icon={Plus}
            onClick={handleOpenCreate}
            size="md"
            variant="orange"
            className="shadow-lg shadow-orange-500/20"
          />
        </div>
      </AdminPageHeader>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, mô tả, địa điểm..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-amber-500 outline-none transition bg-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <SelectComponent value={selectedStatus} onChange={(val) => setSelectedStatus(val as string)} options={NEWSLETTER_STATUS_OPTIONS} />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getNewsletterColumns(handleOpenEdit, handleDelete, toggleNewsletterStatus)}
        data={filteredNewsletters}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy bản tin nào phù hợp với bộ lọc"
      />

      {/* Create / Edit Modal */}
      <CreateEditNewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitModal} initialData={editingNewsletter} />
    </div>
  );
};
