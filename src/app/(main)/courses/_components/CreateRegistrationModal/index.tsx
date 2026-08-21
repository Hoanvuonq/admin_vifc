"use client";

import { FormInput, PortalModal, PremiumButton, SectionHeader, SelectComponent } from "@/components";
import { toast } from "@/providers/ToastProvider";
import { BookingRequestItem, CreateBookingPayload } from "@/types/course";
import { FileText, GraduationCap, Plus, ShieldCheck, User } from "lucide-react";
import React, { useState } from "react";
export * from "./registrationSchema";

export interface CreateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<CreateBookingPayload>) => Promise<void>;
  isLoading?: boolean;
}

const BOOKING_TYPE_OPTIONS = [
  { value: "course", label: "Khóa học (Course)" },
  { value: "workshop", label: "Hội thảo (Workshop)" },
  { value: "meeting-room", label: "Phòng họp (Meeting Room)" },
  { value: "lounge", label: "VIP Lounge" },
];

export const CreateRegistrationModal: React.FC<CreateRegistrationModalProps> = ({ isOpen, onClose, onCreate, isLoading = false }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingType, setBookingType] = useState("course");
  const [tuitionFee, setTuitionFee] = useState("");
  const [deposit, setDeposit] = useState("");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<{ fullName?: string; email?: string; bookingTitle?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { fullName?: string; email?: string; bookingTitle?: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên học viên";
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email liên hệ";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ";
    }
    if (!bookingTitle.trim()) newErrors.bookingTitle = "Vui lòng nhập tên khóa học / dịch vụ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim(),
        booking_title: bookingTitle.trim(),
        booking_type: bookingType,
        tuitionFee: Number(tuitionFee.replace(/\D/g, "")) || 0,
        deposit: Number(deposit.replace(/\D/g, "")) || 0,
        source: "admin-manual",
        note: note.trim(),
        status: "pending",
      });

      toast.success(`Đã tạo phiếu đăng ký cho ${fullName.trim()} thành công!`);
      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setBookingTitle("");
      setBookingType("course");
      setTuitionFee("");
      setDeposit("");
      setNote("");
      setErrors({});
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi tạo phiếu đăng ký");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Phiếu Đăng Ký Khóa Học & Booking"
      description="Khởi tạo hồ sơ học viên, thông tin khóa học / đặt phòng và quản lý học phí."
      icon={GraduationCap}
      width="max-w-2xl"
      className="max-h-[90vh]"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-gray-500">
            <ShieldCheck size={15} className="text-emerald-500" />
            <span>Phiếu đăng ký được tự động lưu trữ và đồng bộ an toàn trên VIFC</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="px-5 h-11 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[12px] uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <PremiumButton
              label="Tạo đăng ký"
              icon={Plus}
              variant="orange"
              onClick={handleSubmit}
              isLoading={isSubmitting || isLoading}
              className="px-6 h-11 rounded-2xl font-bold text-[12px] uppercase tracking-wider shadow-lg shadow-orange-500/20"
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
        {/* Section 1: Customer Personal Info */}
        <div className="space-y-3.5">
          <SectionHeader icon={User} title="Thông tin học viên & Khách hàng" description="Họ tên, email và số điện thoại liên hệ" size="sm" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="md:col-span-2">
              <FormInput
                label="Họ và tên học viên / Khách hàng"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                required
              />
            </div>

            <FormInput
              label="Địa chỉ Email"
              placeholder="Ví dụ: an.nguyen@vifc.io"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <FormInput label="Số điện thoại liên hệ" placeholder="Ví dụ: 0912 345 678" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <div className="md:col-span-2">
              <FormInput
                label="Công ty / Đơn vị công tác"
                placeholder="Ví dụ: VIFC Global Lab / Tech Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Course & Booking Details */}
        <div className="space-y-3.5">
          <SectionHeader icon={GraduationCap} title="Thông tin Khóa học & Dịch vụ" description="Tên khóa học, loại hình và thông tin học phí" size="sm" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="md:col-span-2">
              <FormInput
                label="Tên khóa học / Dịch vụ đăng ký"
                placeholder="Ví dụ: Solidity & Smart Contract Security Masterclass"
                value={bookingTitle}
                onChange={(e) => setBookingTitle(e.target.value)}
                error={errors.bookingTitle}
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1">Loại hình dịch vụ</label>
              <SelectComponent value={bookingType} onChange={setBookingType} options={BOOKING_TYPE_OPTIONS} />
            </div>

            <FormInput
              label="Học phí / Giá dịch vụ (VNĐ)"
              type="number"
              placeholder="Ví dụ: 15.000.000"
              value={tuitionFee}
              onChange={(e) => setTuitionFee(e.target.value)}
            />

            <FormInput
              label="Tiền đặt cọc trước (VNĐ)"
              type="number"
              placeholder="Ví dụ: 5.000.000"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Notes */}
        <div className="space-y-3.5">
          <SectionHeader icon={FileText} title="Ghi chú & Yêu cầu bổ sung" description="Lưu ý lịch học, xuất hóa đơn VAT hoặc yêu cầu từ học viên" size="sm" />

          <FormInput
            isTextArea
            label="Ghi chú"
            placeholder="Nhập ghi chú yêu cầu xuất hóa đơn, lịch học mong muốn..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            showCount
          />
        </div>
      </form>
    </PortalModal>
  );
};
