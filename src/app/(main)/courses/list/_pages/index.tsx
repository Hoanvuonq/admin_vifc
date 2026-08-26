"use client";

import React, { useState, useMemo } from "react";
import { AdminPageHeader, PremiumButton } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useCoursesList } from "@/hooks/useCoursesList";
import { CourseItem, CreateCourseItemPayload } from "@/types/course";
import { GraduationCap, Plus, Search, BookOpen, CheckCircle2, ShieldAlert, Clock, Calendar, DollarSign, User, Edit } from "lucide-react";
import Link from "next/link";
import { getCourseColumns } from "./columns";
import { CreateEditCourseModal } from "../_components/CreateEditCourseModal";

export const CourseListScreen: React.FC = () => {
  const { courses, isLoading, createCourse, updateCourse, deleteCourse, toggleCourseStatus, stats } = useCoursesList();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((item) => {
      if (selectedType !== "ALL" && item.booking_type !== selectedType) return false;
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const instructorMatch = (item.instructor || "").toLowerCase().includes(q);
        const bookingTitleMatch = (item.booking_title || "").toLowerCase().includes(q);
        return titleMatch || instructorMatch || bookingTitleMatch;
      }
      return true;
    });
  }, [courses, selectedType, selectedStatus, searchQuery]);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học / dịch vụ này?")) {
      deleteCourse(id);
    }
  };

  const handleSubmitModal = async (data: CreateCourseItemPayload) => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, data);
    } else {
      await createCourse(data);
    }
  };

  const renderExpandedRow = (item: CourseItem) => (
    <div className="px-8 py-5 bg-linear-to-r from-orange-50/40 via-slate-50/60 to-white rounded-2xl border border-orange-100/80 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-28 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-950">
          <img
            src={item.image || "/admin/card-banner-01.png"}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                item.fallback_image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <User size={12} className="text-orange-500 shrink-0" /> {item.instructor || "Chuyên gia On-Chainpass"}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
            {item.duration && <span>⏱ {item.duration}</span>}
            {item.schedule && <span>• 📅 {item.schedule}</span>}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1.5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-1 font-medium">
          <span className="text-gray-500">Học phí niêm yết:</span>
          <span className="text-orange-600 font-bold font-mono">
            {item.tuition_fee && item.tuition_fee > 0 ? `${item.tuition_fee.toLocaleString("vi-VN")} đ` : "Đặc quyền hội viên (Miễn phí)"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-1">
          <span className="text-gray-500">Loại hình:</span>
          <span className="uppercase font-semibold text-gray-700">{item.booking_type}</span>
        </div>
        {item.description && (
          <div className="pt-1 text-gray-600">
            <span className="font-semibold block text-[11px] text-gray-700 mb-0.5">Mô tả chi tiết:</span>
            <p className="italic bg-orange-50/40 p-2 rounded-lg border border-orange-100/50 leading-relaxed text-[11.5px]">{item.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-center lg:self-start">
        <button
          onClick={() => handleOpenEdit(item)}
          className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 text-[11px] font-bold uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Edit size={12} /> Chỉnh sửa
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      {/* Header */}
      <AdminPageHeader
        title="Quản Lý"
        highlightTitle="Khóa Học & Đào Tạo"
        subtitle="Quản lý danh sách các khóa học chuyên sâu, VIP lounge và dịch vụ đào tạo"
        icon={GraduationCap}
        metrics={[
          { label: "Tổng Khóa Học", value: stats.total, icon: <BookOpen size={16} />, color: "blue" },
          { label: "Đang Hoạt Động", value: stats.active, icon: <CheckCircle2 size={16} />, color: "emerald" },
          { label: "Tạm Ẩn", value: stats.inactive, icon: <ShieldAlert size={16} />, color: "orange" },
        ]}
      >
        <PremiumButton label="Thêm Khóa Học Mới" icon={Plus} onClick={handleOpenCreate} size="md" variant="orange" className="shadow-lg shadow-orange-500/20" />
      </AdminPageHeader>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3  text-gray-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên khóa học, giảng viên..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none transition bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">Tất cả loại hình</option>
            <option value="course">Khóa học (Course)</option>
            <option value="lounge">VIP Lounge</option>
            <option value="meeting-room">Phòng họp</option>
            <option value="workshop">Workshop</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="active">Đang mở (Active)</option>
            <option value="inactive">Tạm ẩn</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getCourseColumns(handleOpenEdit, handleDelete, toggleCourseStatus)}
        data={filteredCourses}
        loading={isLoading}
        renderDropdown={renderExpandedRow}
        emptyMessage="Không tìm thấy khóa học / dịch vụ nào phù hợp"
      />

      {/* Create / Edit Modal */}
      <CreateEditCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitModal} initialData={editingCourse} />
    </div>
  );
};
