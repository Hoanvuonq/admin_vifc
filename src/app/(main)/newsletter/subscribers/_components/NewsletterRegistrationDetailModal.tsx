"use client";

import React, { useState, useEffect } from "react";
import { PortalModal, PremiumButton, SectionHeader, SelectComponent, StatusBadge, FormInput } from "@/components";
import { Mail, Calendar, MapPin, User, CheckCircle2, XCircle, Clock, ShieldCheck, Save, Hash } from "lucide-react";
import { NewsletterRegistrationItem } from "@/types/newsletter";
import dayjs from "dayjs";

interface NewsletterRegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: NewsletterRegistrationItem | null;
  onUpdateStatus: (id: string, status: string, note?: string) => Promise<void> | void;
}

const STATUS_OPTIONS = [
  { value: "approved", label: "Đã duyệt (Approved)", color: "text-emerald-500" },
  { value: "pending", label: "Chờ xử lý (Pending)", color: "text-amber-500" },
  { value: "rejected", label: "Từ chối (Rejected)", color: "text-rose-500" },
];

export const NewsletterRegistrationDetailModal: React.FC<NewsletterRegistrationDetailModalProps> = ({
  isOpen,
  onClose,
  registration,
  onUpdateStatus,
}) => {
  const [status, setStatus] = useState("approved");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (registration) {
      setStatus(registration.status || "approved");
      setNote(registration.note || "");
    }
  }, [registration, isOpen]);

  if (!registration) return null;

  const hasChanges = status !== registration.status || note !== (registration.note || "");

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(registration.id, status, note.trim());
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickApprove = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(registration.id, "approved", note.trim());
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickReject = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(registration.id, "rejected", note.trim());
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedCreatedAt = dayjs(registration.created_at).isValid()
    ? dayjs(registration.created_at).format("DD/MM/YYYY HH:mm:ss")
    : registration.created_at;

  const formattedUpdatedAt = dayjs(registration.updated_at).isValid()
    ? dayjs(registration.updated_at).format("DD/MM/YYYY HH:mm:ss")
    : registration.updated_at;

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Đơn Đăng Ký"
      description="Xem thông tin chi tiết người đăng ký nhận bản tin, ấn phẩm và xử lý trạng thái duyệt đơn"
      icon={Mail}
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Đơn đăng ký được lưu trữ an toàn trên hệ thống Database</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <PremiumButton type="button" label="Đóng" onClick={onClose} variant="gray" size="md" />
            <PremiumButton
              label="Lưu Cập Nhật"
              icon={Save}
              onClick={handleSave}
              size="md"
              isLoading={isSubmitting}
              disabled={!hasChanges || isSubmitting}
              variant="orange"
            />
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-5">
        {/* Section 1: Thông tin người đăng ký */}
        <div className="bg-linear-to-br from-amber-50/40 via-stone-50/60 to-white rounded-2xl p-4 border border-amber-100/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200/80 flex items-center justify-center text-amber-700 font-bold text-base shadow-2xs">
                {(registration.full_name || registration.email)[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{registration.full_name || "Chưa cung cấp họ tên"}</h4>
                <p className="text-xs text-gray-500 font-mono select-all flex items-center gap-1">
                  <Mail size={11} className="text-orange-500 shrink-0" />
                  {registration.email}
                </p>
              </div>
            </div>

            <StatusBadge
              status={
                registration.status === "approved"
                  ? "ACTIVE"
                  : registration.status === "rejected"
                  ? "INACTIVE"
                  : "PENDING"
              }
              label={
                registration.status === "approved"
                  ? "ĐÃ DUYỆT"
                  : registration.status === "rejected"
                  ? "TỪ CHỐI"
                  : "CHỜ XỬ LÝ"
              }
              variant="premium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                <Hash size={11} /> Mã Đơn Đăng Ký (ID):
              </span>
              <p className="font-mono text-[11px] text-gray-800 bg-white/90 px-2.5 py-1.5 rounded-lg border border-gray-200/80 break-all select-all">
                {registration.id}
              </p>
            </div>

            {registration.user_id && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                  <User size={11} /> User ID tài khoản:
                </span>
                <p className="font-mono text-[11px] text-gray-800 bg-white/90 px-2.5 py-1.5 rounded-lg border border-gray-200/80 break-all select-all">
                  {registration.user_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Thông tin Ấn phẩm bản tin */}
        <div className="space-y-3">
          <SectionHeader
            icon={Mail}
            title="Ấn phẩm bản tin đã đăng ký"
            description="Chi tiết tiêu đề, ngày diễn ra và địa điểm của bản tin"
            size="sm"
          />

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-2.5">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Tiêu đề bản tin</span>
              <h5 className="font-bold text-gray-900 text-sm leading-snug mt-0.5">{registration.newsletter_title}</h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2 text-gray-700 font-mono">
                <Calendar size={13} className="text-amber-600 shrink-0" />
                <span>Thời gian: <strong>{registration.newsletter_date || "Chưa ấn định"}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={13} className="text-orange-500 shrink-0" />
                <span className="truncate">Địa điểm: <strong>{registration.location || "HCMC, Viet Nam"}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quản lý Trạng thái & Ghi chú */}
        <div className="space-y-3">
          <SectionHeader
            icon={Clock}
            title="Xử lý trạng thái & Ghi chú"
            description="Thay đổi trạng thái duyệt đơn hoặc bổ sung ghi chú quản trị viên"
            size="sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-700 ml-1">Trạng thái duyệt đơn</label>
              <SelectComponent value={status} onChange={(val) => setStatus(val as string)} options={STATUS_OPTIONS} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-700 ml-1">Thời gian gửi đăng ký</label>
              <div className="h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center text-xs font-mono text-gray-600">
                {formattedCreatedAt}
              </div>
            </div>
          </div>

          <FormInput
            isTextArea
            label="Ghi chú quản trị (Note)"
            placeholder="Nhập ghi chú cho đơn đăng ký này (nếu có)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            showCount
          />

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-mono">Cập nhật: {formattedUpdatedAt}</span>
            <div className="flex items-center gap-2">
              {registration.status !== "approved" && (
                <button
                  type="button"
                  onClick={handleQuickApprove}
                  disabled={isSubmitting}
                  className="h-8 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 size={13} />
                  <span>Duyệt Ngay</span>
                </button>
              )}
              {registration.status !== "rejected" && (
                <button
                  type="button"
                  onClick={handleQuickReject}
                  disabled={isSubmitting}
                  className="h-8 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <XCircle size={13} />
                  <span>Từ Chối</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
