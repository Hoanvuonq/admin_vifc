"use client";

import React, { useState, useMemo } from "react";
import { AdminPageHeader, PremiumButton, SelectComponent } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useNewsletterSubscribers } from "@/hooks/useNewsletterSubscribers";
import { NewsletterSubscriberItem } from "@/types/newsletter";
import { Mail, Plus, Search, CheckCircle2, UserX, FileText, Globe, Calendar, Power } from "lucide-react";
import Link from "next/link";
import { getNewsletterColumns } from "./columns";
import { AddSubscriberModal } from "../_components/AddSubscriberModal";

const SUBSCRIBER_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "subscribed", label: "Đang nhận tin (Subscribed)", color: "text-emerald-500" },
  { value: "unsubscribed", label: "Đã hủy nhận tin", color: "text-rose-500" },
];

export const NewsletterSubscribersScreen: React.FC = () => {
  const { subscribers, isLoading, toggleSubscriberStatus, deleteSubscriber, addSubscriber, stats } = useNewsletterSubscribers();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEmail = (item.email || "").toLowerCase().includes(q);
        const matchName = (item.full_name || "").toLowerCase().includes(q);
        const matchSource = (item.source || "").toLowerCase().includes(q);
        return matchEmail || matchName || matchSource;
      }
      return true;
    });
  }, [subscribers, selectedStatus, searchQuery]);

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa email này khỏi danh sách?")) {
      deleteSubscriber(id);
    }
  };

  const renderExpandedRow = (item: NewsletterSubscriberItem) => (
    <div className="px-8 py-4 bg-linear-to-r from-orange-50/40 via-slate-50/60 to-white rounded-2xl border border-orange-100/80 m-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-inner animate-in fade-in duration-300">
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
          {item.full_name || "Chưa đặt tên"}
          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-mono font-bold">ID: {item.id}</span>
        </h4>
        <p className="text-xs text-gray-600 flex items-center gap-1.5 select-all font-mono">
          <Mail size={12} className="text-orange-500 shrink-0" /> {item.email}
        </p>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Globe size={13} className="text-orange-500 shrink-0" />
          <span>
            Nguồn: <strong>{item.source || "Landing Page"}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
          <Calendar size={12} className=" text-gray-700 shrink-0" />
          <span>Đăng ký lúc: {new Date(item.created_at).toLocaleString("vi-VN")}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => toggleSubscriberStatus(item.id)}
          className={`h-8 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
            item.status === "subscribed"
              ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
          }`}
        >
          <Power size={12} />
          <span>{item.status === "subscribed" ? "Tạm hủy nhận tin" : "Kích hoạt nhận lại"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Header */}
      <AdminPageHeader
        title="Tiếp Thị"
        highlightTitle="Bản Tin Newsletter"
        subtitle="Quản lý danh sách email khách hàng đăng ký nhận thông tin và báo cáo thị trường On-Chain"
        icon={Mail}
        metrics={[
          { label: "Tổng Subscriber", value: stats.total, icon: <Mail size={16} />, color: "blue" },
          { label: "Đang Nhận Tin", value: stats.subscribed, icon: <CheckCircle2 size={16} />, color: "emerald" },
          { label: "Đã Hủy", value: stats.unsubscribed, icon: <UserX size={16} />, color: "gray" },
        ]}
      >
        <PremiumButton
          label="Thêm Email Mới"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          size="md"
          variant="orange"
          className="shadow-lg shadow-orange-500/20"
        />
      </AdminPageHeader>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3  text-gray-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo email, họ tên, nguồn..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none transition bg-white"
          />
        </div>

        <div className="w-full sm:w-60">
          <SelectComponent value={selectedStatus} onChange={(val) => setSelectedStatus(val as string)} options={SUBSCRIBER_STATUS_OPTIONS} />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getNewsletterColumns(toggleSubscriberStatus, handleDelete)}
        data={filteredSubscribers}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy người đăng ký nào phù hợp"
      />

      {/* Add Modal */}
      <AddSubscriberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={async (email, fullName, source) => {
          await addSubscriber(email, fullName, source);
        }}
      />
    </div>
  );
};
