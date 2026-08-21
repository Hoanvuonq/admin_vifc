"use client";

import {
  FormInput,
  ItemImage,
  PortalModal,
  PremiumButton,
  SectionHeader,
  SelectComponent,
  StatusBadge,
} from "@/components";
import { toast } from "@/providers/ToastProvider";
import { BookingRequestItem, ReviewBookingPayload } from "@/types/course";
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MessageSquare,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export interface RegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: BookingRequestItem | null;
  onReview: (
    id: string,
    payload: ReviewBookingPayload
  ) => Promise<void>;
  isLoading?: boolean;
}

const REVIEW_STATUS_OPTIONS = [
  { value: "pending", label: "⏳ Đang chờ duyệt (Pending)" },
  { value: "confirmed", label: "✅ Xác nhận yêu cầu (Confirmed)" },
  { value: "approved", label: "🎓 Đã duyệt khóa học (Approved)" },
  { value: "rejected", label: "❌ Từ chối yêu cầu (Rejected)" },
  { value: "cancelled", label: "🚫 Hủy bỏ yêu cầu (Cancelled)" },
];

export const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
  isOpen,
  onClose,
  registration,
  onReview,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingRequestItem["status"]>("pending");
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (registration) {
      setSelectedStatus(registration.status || "pending");
      setAdminNote(registration.note || "");
    }
  }, [registration]);

  if (!registration) return null;

  const orderCode = `#${registration.id.slice(0, 8).toUpperCase()}`;

  const formatDate = (val?: string) => {
    if (!val) return "--";
    const d = new Date(val);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onReview(registration.id, {
        status: selectedStatus,
        note: adminNote.trim(),
      });
      toast.success("Cập nhật phê duyệt đơn booking thành công!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi cập nhật trạng thái");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickApprove = async () => {
    setIsSubmitting(true);
    try {
      await onReview(registration.id, {
        status: "confirmed",
        note: adminNote.trim() || "Admin đã duyệt xác nhận đơn thành công",
      });
      toast.success("Đã xác nhận (Confirm) đơn booking thành công!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi xác nhận đơn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickReject = async () => {
    setIsSubmitting(true);
    try {
      await onReview(registration.id, {
        status: "rejected",
        note: adminNote.trim() || "Admin đã từ chối yêu cầu đăng ký",
      });
      toast.info("Đã từ chối (Reject) đơn booking.");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi từ chối đơn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = (registration.status || "").toLowerCase() === "pending";

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Duyệt & Xử Lý Yêu Cầu Booking"
      description={`Mã đơn: ${orderCode} • Nhận lúc: ${formatDate(registration.created_at)}`}
      icon={GraduationCap}
      width="max-w-2xl"
      className="max-h-[90vh]"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Quick Action Buttons for Pending requests */}
          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <button
                  type="button"
                  disabled={isSubmitting || isLoading}
                  onClick={handleQuickApprove}
                  className="px-4 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 size={15} /> Xác nhận (Confirm)
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || isLoading}
                  onClick={handleQuickReject}
                  className="px-4 h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle size={15} /> Từ chối (Reject)
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="px-5 h-11 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[12px] uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              Đóng
            </button>
            <PremiumButton
              label="Lưu phê duyệt"
              icon={Save}
              variant="orange"
              onClick={handleSave}
              isLoading={isSubmitting || isLoading}
              className="px-6 h-11 rounded-2xl font-bold text-[12px] uppercase tracking-wider shadow-lg shadow-orange-500/20"
            />
          </div>
        </div>
      }
    >
      <div className="space-y-5 animate-in fade-in duration-300">
        {/* SECTION 1: Customer Profile Header Card */}
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <ItemImage
              path={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                registration.email || registration.full_name || "guest"
              )}`}
              productName={registration.full_name || registration.email}
              className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900 truncate">
                  {registration.full_name || "Học viên chưa đặt tên"}
                </h3>
                <span className="text-[10px] bg-orange-100 text-orange-700 font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                  {orderCode}
                </span>
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1.5 select-all truncate">
                <Mail size={12} className="text-gray-400 shrink-0" /> {registration.email}
              </p>
              {registration.phone && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5 select-all truncate">
                  <Phone size={12} className="text-gray-400 shrink-0" /> {registration.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-xs shrink-0">
            <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Trạng thái hiện tại:</span>
            <StatusBadge
              status={registration.status}
            />
            <span className="text-[11px] text-gray-500 mt-0.5">
              Nguồn: <b className="text-gray-700 font-semibold">{registration.source || "web-dashboard"}</b>
            </span>
          </div>
        </div>

        {/* SECTION 2: Service / Course Details */}
        <div className="space-y-3">
          <SectionHeader
            icon={GraduationCap}
            title="Dịch vụ & Khóa học đăng ký"
            description="Thông tin chi tiết khóa học, loại hình và thời gian yêu cầu"
            size="sm"
          />

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-gray-400 block text-[10.5px] font-bold uppercase tracking-wider">
                  Tên khóa học / Dịch vụ
                </span>
                <span className="font-extrabold text-gray-900 text-sm mt-0.5 block">
                  {registration.booking_title}
                </span>
              </div>
              <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 font-bold px-2.5 py-1 rounded-lg uppercase shrink-0">
                {registration.booking_type || "course"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2.5 border-t border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block text-[10.5px] font-bold uppercase tracking-wider">
                  Mã đơn booking
                </span>
                <span className="font-mono font-bold text-gray-800 mt-0.5 block">{orderCode}</span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10.5px] font-bold uppercase tracking-wider">
                  Công ty / Đơn vị
                </span>
                <span className="font-semibold text-gray-700 mt-0.5 block">
                  {registration.company || "Cá nhân"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10.5px] font-bold uppercase tracking-wider">
                  Thời gian gửi
                </span>
                <span className="font-semibold text-gray-700 mt-0.5 flex items-center gap-1">
                  <Calendar size={12} className="text-orange-500" />
                  {formatDate(registration.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Customer's Note */}
        {registration.note && (
          <div className="space-y-2">
            <SectionHeader
              icon={MessageSquare}
              title="Ghi chú từ Khách hàng"
              description="Yêu cầu riêng hoặc lưu ý từ người đăng ký"
              size="sm"
            />
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 italic leading-relaxed">
              "{registration.note}"
            </div>
          </div>
        )}

        {/* SECTION 4: Admin Review & Decision */}
        <div className="space-y-3.5 pt-2 border-t border-gray-100">
          <SectionHeader
            icon={ShieldAlert}
            title="Quyết định Phê duyệt (Admin Action)"
            description="Cập nhật trạng thái duyệt đơn và nhập phản hồi ghi chú cho học viên"
            size="sm"
          />

          <div className="space-y-3.5">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1">
                Chọn trạng thái phê duyệt
              </label>
              <SelectComponent
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val as BookingRequestItem["status"])}
                options={REVIEW_STATUS_OPTIONS}
              />
            </div>

            <FormInput
              isTextArea
              label="Ghi chú nội bộ / Lý do phê duyệt hoặc từ chối"
              placeholder="Nhập ghi chú (Ví dụ: Đã gọi điện xác nhận lịch học, Khách yêu cầu chuyển đợt sau...)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              maxLength={500}
              showCount
            />
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
