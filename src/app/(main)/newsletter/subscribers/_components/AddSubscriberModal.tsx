"use client";

import React, { useState } from "react";
import {
  PortalModal,
  PremiumButton,
  SectionHeader,
  FormInput,
} from "@/components";
import { Mail, User, Globe, Plus, ShieldCheck } from "lucide-react";
import { toast } from "@/providers/ToastProvider";

interface AddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string, fullName?: string, source?: string) => Promise<void> | void;
}

export const AddSubscriberModal: React.FC<AddSubscriberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [source, setSource] = useState("Admin Manual");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Địa chỉ email không đúng định dạng");
      return;
    }

    setSubmitting(true);
    try {
      await onAdd(email.trim().toLowerCase(), fullName.trim(), source.trim() || "Admin Manual");
      setEmail("");
      setFullName("");
      setSource("Admin Manual");
      setError("");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi thêm email subscriber");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Email Nhận Bản Tin"
      description="Thêm địa chỉ email khách hàng vào danh sách nhận báo cáo thị trường On-Chain hàng tuần."
      icon={Mail}
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between w-full gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Tự động tuân thủ chính sách chống thư rác</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />
            <PremiumButton
              label="Thêm Email"
              icon={Plus}
              onClick={handleSubmit}
              size="md"
              isLoading={submitting}
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
        <SectionHeader
          icon={Mail}
          title="Thông tin người nhận"
          description="Nhập email và tên người nhận để gửi bản tin định kỳ"
          size="sm"
        />

        <div className="space-y-3.5">
          <FormInput
            label="Địa chỉ Email"
            placeholder="Ví dụ: partner@venture-capital.io"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            error={error}
            required
          />

          <FormInput
            label="Họ và tên người nhận (Tùy chọn)"
            placeholder="Ví dụ: Alexander Chen"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <FormInput
            label="Nguồn đăng ký (Source)"
            placeholder="Ví dụ: Admin Manual / Private Gala VIP..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
      </form>
    </PortalModal>
  );
};
