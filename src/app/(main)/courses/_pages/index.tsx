"use client";

import Link from "next/link";
import { AdminPageHeader, ItemImage } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useCourseRegistrations } from "@/hooks/useCourseRegistrations";
import { toast } from "@/providers/ToastProvider";
import { BookingRequestItem, CreateBookingPayload, ReviewBookingPayload } from "@/types/course";
import { BookOpen, BookOpenCheck, Building, Calendar, CheckCircle2, Clock, Edit, GraduationCap, Mail, Phone, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CourseFilters, CreateRegistrationModal, RegistrationDetailModal, ExportExcelModal } from "../_components";
import { getColumns } from "./columns";

export const CourseRegistrationsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const [selectedRegistration, setSelectedRegistration] = useState<BookingRequestItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page to 0 when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, selectedStatus, selectedType]);

  // Fetch full records from API (high limit) so FE can filter accurately
  const { registrations, stats, isLoading, refetch, confirmBooking, rejectBooking, reviewBooking, deleteRegistration, createRegistration, isCreating } =
    useCourseRegistrations({
      page: 1,
      limit: 500,
    });

  // FRONTEND FILTERING: status, booking_type (lounge, course, etc.), and search query
  const filteredRegistrations = useMemo(() => {
    return (registrations || []).filter((item) => {
      // 1. Status Filter
      if (selectedStatus && selectedStatus !== "ALL") {
        const itemStatus = (item.status || "").toLowerCase().trim();
        const filterStatus = selectedStatus.toLowerCase().trim();

        if (filterStatus === "approved") {
          if (!["approved", "confirmed"].includes(itemStatus)) return false;
        } else if (filterStatus === "confirmed") {
          if (!["confirmed", "approved"].includes(itemStatus)) return false;
        } else if (filterStatus === "rejected") {
          if (!["rejected", "cancelled"].includes(itemStatus)) return false;
        } else if (filterStatus === "cancelled") {
          if (!["cancelled", "rejected"].includes(itemStatus)) return false;
        } else if (filterStatus === "completed") {
          if (!["completed", "success"].includes(itemStatus)) return false;
        } else if (itemStatus !== filterStatus) {
          return false;
        }
      }

      // 2. Booking Type Filter (e.g. "lounge", "course", "workshop", "meeting-room", "consulting")
      if (selectedType && selectedType !== "ALL") {
        const itemType = (item.booking_type || "").toLowerCase().replace(/_/g, "-").trim();
        const filterType = selectedType.toLowerCase().replace(/_/g, "-").trim();

        if (itemType !== filterType && !itemType.includes(filterType) && !filterType.includes(itemType)) {
          return false;
        }
      }

      // 3. Search query filter (matches name, email, phone, company, title, id, note)
      if (debouncedSearch && debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const matchName = (item.full_name || "").toLowerCase().includes(q);
        const matchEmail = (item.email || "").toLowerCase().includes(q);
        const matchPhone = (item.phone || "").toLowerCase().includes(q);
        const matchTitle = (item.booking_title || "").toLowerCase().includes(q);
        const matchCompany = (item.company || "").toLowerCase().includes(q);
        const matchId = (item.id || "").toLowerCase().includes(q);
        const matchNote = (item.note || "").toLowerCase().includes(q);

        if (!matchName && !matchEmail && !matchPhone && !matchTitle && !matchCompany && !matchId && !matchNote) {
          return false;
        }
      }

      return true;
    });
  }, [registrations, selectedStatus, selectedType, debouncedSearch]);

  // Client-side pagination
  const paginatedRegistrations = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredRegistrations.slice(startIndex, startIndex + pageSize);
  }, [filteredRegistrations, currentPage, pageSize]);

  const computedStats = useMemo(() => {
    const list = registrations || [];
    return {
      total: list.length,
      pending: list.filter((i) => (i.status || "").toLowerCase() === "pending").length,
      approved: list.filter((i) => ["confirmed", "approved"].includes((i.status || "").toLowerCase())).length,
      rejected: list.filter((i) => ["rejected", "cancelled"].includes((i.status || "").toLowerCase())).length,
      completed: list.filter((i) => ["completed", "success"].includes((i.status || "").toLowerCase())).length,
    };
  }, [registrations]);

  const handleViewDetails = (item: BookingRequestItem) => {
    setSelectedRegistration(item);
    setIsDetailModalOpen(true);
  };

  const handleQuickApprove = async (item: BookingRequestItem) => {
    try {
      await confirmBooking({ id: item.id });
      toast.success(`Đã xác nhận đơn của ${item.full_name || item.email}!`);
    } catch (error: any) {
      toast.warning(error?.message || "Không thể xác nhận đơn.");
    }
  };

  const handleQuickReject = async (item: BookingRequestItem) => {
    try {
      await rejectBooking({ id: item.id });
      toast.info(`Đã từ chối đơn của ${item.full_name || item.email}.`);
    } catch (error: any) {
      toast.warning(error?.message || "Không thể từ chối đơn.");
    }
  };

  const handleReview = async (id: string, payload: ReviewBookingPayload) => {
    try {
      await reviewBooking({ id, payload });
      toast.success("Cập nhật trạng thái thành công!");
      setIsDetailModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Cập nhật thất bại.");
    }
  };

  const handleDelete = async (item: BookingRequestItem) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn đăng ký của "${item.full_name || item.email}" không?`)) {
      try {
        await deleteRegistration(item.id);
        toast.success("Đã xóa đơn đăng ký thành công!");
      } catch (error: any) {
        toast.error(error?.message || "Không thể xóa đơn đăng ký.");
      }
    }
  };

  const handleCreate = async (data: Partial<CreateBookingPayload>) => {
    try {
      await createRegistration(data);
    } catch (error: any) {
      throw error;
    }
  };

  const renderExpandedRow = (item: BookingRequestItem) => {
    const orderCode = `REG-${item.id.slice(0, 8).toUpperCase()}`;
    const avatarUrl =
      item.users?.avatar_url ||
      item.avatar_url ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.email || item.full_name || "guest")}`;

    return (
      <div className="px-8 py-5 bg-linear-to-r from-orange-50/40 via-slate-50/60 to-white rounded-2xl border border-orange-100/80 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ItemImage path={avatarUrl} productName={item.full_name || item.email} className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              {item.full_name || "Chưa đặt tên"}
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-mono font-bold">{orderCode}</span>
            </h4>
            <p className="text-xs text-gray-600 flex items-center gap-1.5 select-all">
              <Mail size={12} className="text-gray-400 shrink-0" /> {item.email}
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1.5 select-all">
              <Phone size={12} className="text-gray-400 shrink-0" /> {item.phone || "Chưa có SĐT"}
            </p>
            {item.company && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Building size={12} className="text-gray-400 shrink-0" /> {item.company}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-xl bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1.5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1 font-medium">
            <span className="text-gray-500">Dịch vụ đăng ký:</span>
            <span className="text-orange-600 font-semibold">{item.booking_title}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-500">Nguồn đăng ký:</span>
            <span className="capitalize">{item.source}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-500">Ngày tạo:</span>
            <span>{new Date(item.created_at).toLocaleString("vi-VN")}</span>
          </div>
          {item.note && (
            <div className="pt-1 text-gray-500">
              <span className="font-semibold block text-[11px] text-gray-700">Ghi chú từ khách:</span>
              <p className="italic bg-orange-50/50 p-2 rounded-lg border border-orange-100/50 mt-1">{item.note}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      <AdminPageHeader
        icon={GraduationCap}
        title="Course & Training"
        highlightTitle="Booking Requests"
        subtitle="Quản lý danh sách học viên đăng ký khóa học, đặt phòng meeting và phê duyệt tư vấn"
        metrics={[
          {
            label: "Tổng lượt yêu cầu",
            value: computedStats.total || stats.total,
            icon: <BookOpenCheck size={14} />,
            color: "blue",
          },
          {
            label: "Chờ duyệt (Pending)",
            value: computedStats.pending,
            icon: <Clock size={14} />,
            color: "orange",
          },
          {
            label: "Đã xác nhận (Confirmed)",
            value: computedStats.approved,
            icon: <ShieldCheck size={14} />,
            color: "emerald",
          },
          {
            label: "Từ chối / Hủy",
            value: computedStats.rejected,
            icon: <XCircle size={14} />,
            color: "rose",
          },
        ]}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <Link
          href="/courses/list"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-2"
        >
          <BookOpen size={16} />
          <span>Danh Sách Khóa Học</span>
        </Link>
        <Link
          href="/courses"
          className="px-4 py-2 text-sm font-semibold text-orange-600 border-b-2 border-orange-600 flex items-center gap-2"
        >
          <GraduationCap size={16} />
          <span>Đơn Đăng Ký Học Viên</span>
        </Link>
      </div>

      <DataTable
        columns={getColumns(handleViewDetails, handleQuickApprove, handleQuickReject, handleDelete)}
        data={paginatedRegistrations}
        loading={isLoading}
        rowKey="id"
        page={currentPage}
        size={pageSize}
        totalElements={filteredRegistrations.length}
        onPageChange={(p) => setCurrentPage(p)}
        renderDropdown={renderExpandedRow}
        headerContent={
          <CourseFilters
            searchText={searchQuery}
            setSearchText={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            onCreateRegistration={() => setIsCreateModalOpen(true)}
            onExportExcel={() => setIsExportModalOpen(true)}
            onRefresh={refetch}
            isLoading={isLoading}
          />
        }
      />

      {/* Registration Details Modal */}
      <RegistrationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        registration={selectedRegistration}
        onReview={handleReview}
      />

      {/* Manual Registration Creation Modal */}
      <CreateRegistrationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      {/* Export to Excel Modal */}
      <ExportExcelModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredRegistrations}
      />
    </div>
  );
};
