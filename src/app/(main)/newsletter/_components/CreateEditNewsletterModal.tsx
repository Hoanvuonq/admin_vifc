"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PortalModal, PremiumButton, SectionHeader, FormInput, SelectComponent, DateTimeInput } from "@/components";
import { Mail, Save, Plus, ShieldCheck } from "lucide-react";
import { NewsletterItem, CreateNewsletterPayload } from "@/types/newsletter";

interface CreateEditNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNewsletterPayload) => Promise<void> | void;
  initialData?: NewsletterItem | null;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Đang phát hành (Active)", color: "text-emerald-500" },
  { value: "draft", label: "Bản nháp (Draft)", color: "text-amber-500" },
  { value: "inactive", label: "Tạm ẩn (Inactive)", color: "text-rose-500" },
];

export const CreateEditNewsletterModal: React.FC<CreateEditNewsletterModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("HCMC, Viet Nam");
  const [status, setStatus] = useState("active");

  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  // Validation & Dirty check
  const isFormValid = title.trim().length > 0;

  const isSaveEnabled = useMemo(() => {
    if (!isFormValid) return false;
    if (!isEditMode) return true; // Khi tạo mới: Có title là active
    if (!initialData) return false;

    const hasTitleChanged = title.trim() !== (initialData.title || "").trim();
    const hasDescChanged = description.trim() !== (initialData.description || "").trim();
    const hasDateChanged = date.trim() !== (initialData.date || "").trim();
    const hasLocationChanged = location.trim() !== (initialData.location || "HCMC, Viet Nam").trim();
    const hasStatusChanged = status !== (initialData.status || "active");

    return hasTitleChanged || hasDescChanged || hasDateChanged || hasLocationChanged || hasStatusChanged;
  }, [isFormValid, isEditMode, initialData, title, description, date, location, status]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setDate(initialData.date || "");
        setLocation(initialData.location || "HCMC, Viet Nam");
        setStatus(initialData.status || "active");
      } else {
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("HCMC, Viet Nam");
        setStatus("active");
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) newErrors.title = "Vui lòng nhập tiêu đề bản tin";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate() || !isSaveEnabled) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        date: date.trim(),
        location: location.trim() || "HCMC, Viet Nam",
        status: status as any,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Cập nhật Bản Tin" : "Khởi Tạo Bản Tin Mới"}
      description={
        isEditMode
          ? "Chỉnh sửa tiêu đề, mô tả, ngày diễn ra và địa điểm bản tin."
          : "Đăng tải bản tin chuyên sâu, ấn phẩm phân tích thị trường cho hội viên và độc giả."
      }
      icon={Mail}
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11.5px] font-medium text-gray-500 min-w-0">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="truncate">Bản tin tự động đồng bộ hóa trên hệ thống</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto shrink-0">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />
            <PremiumButton
              label={isEditMode ? "Lưu thay đổi" : "Tạo bản tin"}
              icon={isEditMode ? Save : Plus}
              onClick={handleSubmit}
              size="md"
              isLoading={isSubmitting}
              disabled={!isSaveEnabled || isSubmitting}
              variant="orange"
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="p-3 space-y-6">
        <div className="space-y-4">
          <SectionHeader
            icon={Mail}
            title="Thông tin ấn phẩm bản tin"
            description="Cung cấp tiêu đề, ngày diễn ra, địa điểm và nội dung mô tả bản tin"
            size="sm"
          />

          <div className="space-y-4">
            {/* 1. Title */}
            <FormInput
              label="1. Tiêu đề bản tin (Title)"
              placeholder="Ví dụ: Recap các hoạt động tại SURF Đà Nẵng"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              error={errors.title}
              required
            />

            {/* 2. Date & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <DateTimeInput
                label="Thời gian diễn ra (Date)"
                value={date}
                onChange={(val) => setDate(val)}
                placeholder="Chọn ngày diễn ra..."
                isDate={true}
                isTime={false}
              />
              <FormInput
                label="Địa điểm (Location)"
                placeholder="Ví dụ: Da Nang Innovation Hub"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* 3. Description */}
            <FormInput
              isTextArea
              label="2. Mô tả nội dung bản tin (Description)"
              placeholder="Tóm tắt nội dung bản tin, các điểm nổi bật và thông điệp dành cho độc giả..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              showCount
            />

            {/* Status selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[12px] font-bold text-gray-700 ml-1">Trạng thái hiển thị</label>
              <SelectComponent value={status} onChange={(val) => setStatus(val as string)} options={STATUS_OPTIONS} />
            </div>
          </div>
        </div>
      </form>
    </PortalModal>
  );
};
