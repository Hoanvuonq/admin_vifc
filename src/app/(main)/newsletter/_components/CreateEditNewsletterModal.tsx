"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { PortalModal, PremiumButton, SectionHeader, FormInput, SelectComponent, StatusBadge, DateTimeInput } from "@/components";
import { Mail, Sparkles, Save, Plus, ShieldCheck, Camera, X, MapPin, Calendar } from "lucide-react";
import { NewsletterItem, CreateNewsletterPayload } from "@/types/newsletter";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "@/providers/ToastProvider";
import dayjs from "dayjs";

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
  const { uploadFile } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("HCMC, Viet Nam");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    const hasImageChanged =
      Boolean(imageFile) ||
      (image !== (initialData.banner || initialData.image || "") &&
        image !== "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80");
    const hasStatusChanged = status !== (initialData.status || "active");

    return hasTitleChanged || hasDescChanged || hasDateChanged || hasLocationChanged || hasImageChanged || hasStatusChanged;
  }, [isFormValid, isEditMode, initialData, title, description, date, location, image, imageFile, status]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setDate(initialData.date || "");
        setLocation(initialData.location || "HCMC, Viet Nam");
        setImage(initialData.banner || initialData.image || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80");
        setImageFile(null);
        setStatus(initialData.status || "active");
      } else {
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("HCMC, Viet Nam");
        setImage("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80");
        setImageFile(null);
        setStatus("active");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Dung lượng ảnh tối đa 10MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setImageFile(file);
      toast.success("Đã chọn ảnh banner bản tin!");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      let finalImageUrl = image;

      if (imageFile) {
        try {
          const uploadResult = await uploadFile(imageFile);
          if (uploadResult?.url) {
            finalImageUrl = uploadResult.url;
          }
        } catch (uploadErr) {
          console.warn("Upload failed, fallback to local URL", uploadErr);
        }
      }

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        date: date.trim(),
        location: location.trim() || "HCMC, Viet Nam",
        banner: finalImageUrl,
        image: finalImageUrl,
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
          ? "Chỉnh sửa tiêu đề, mô tả, ngày diễn ra, địa điểm và banner bản tin."
          : "Đăng tải bản tin chuyên sâu, ấn phẩm phân tích thị trường cho hội viên và độc giả."
      }
      icon={Mail}
      width="max-w-5xl"
      footer={
        <div className="flex items-center justify-between w-full gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11.5px] font-medium text-gray-500 min-w-0">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="truncate">Bản tin tự động đồng bộ hóa trên cổng On-Chainpass Member Portal</span>
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
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 lg:sticky lg:top-0 h-full flex flex-col">
            <div className="bg-linear-to-b from-white via-amber-50/20 to-white rounded-2xl p-4 border border-gray-100/90 shadow-custom flex flex-col justify-between h-full relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <input type="file" ref={fileInputRef} onChange={handleImageFileChange} accept="image/png, image/jpeg, image/webp, image/gif" className="hidden" />

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-amber-600 tracking-wider flex items-center gap-1.5">
                    <Sparkles size={12} /> Live Preview
                  </span>
                  <StatusBadge
                    status={status === "active" ? "ACTIVE" : status === "draft" ? "PENDING" : "INACTIVE"}
                    label={status === "active" ? "ĐANG PHÁT HÀNH" : status === "draft" ? "BẢN NHÁP" : "TẠM ẨN"}
                    variant="premium"
                  />
                </div>

                {/* Banner Upload Box */}
                <div
                  onClick={handleImageClick}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-amber-200/90 hover:border-amber-500 bg-stone-900 cursor-pointer group transition-all duration-300 shadow-sm"
                  title="Click để tải ảnh banner mới từ máy tính"
                >
                  <img
                    src={image}
                    alt="Preview banner"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white z-20">
                    <div className="w-11 h-11 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Plus size={22} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-white drop-shadow-sm">{image ? "Đổi ảnh banner" : "Thêm ảnh banner"}</span>
                  </div>

                  {/* Camera Icon */}
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-0 transition-transform duration-200 z-10">
                    <Camera size={13} className="text-amber-600" />
                  </div>

                  {/* Badge top-left */}
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-xs text-[9.5px] font-bold text-white shadow-xs">Newsletter</span>
                  </div>

                  {/* Remove button */}
                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110 pointer-events-auto cursor-pointer"
                      title="Xóa ảnh banner"
                    >
                      <X size={13} strokeWidth={3} />
                    </button>
                  )}

                  {/* Title & Info bottom-left */}
                  <div className="absolute bottom-2 left-2 right-10 text-white z-10 pointer-events-none text-left">
                    <h5 className="font-bold text-xs leading-tight drop-shadow-sm line-clamp-1">{title || "Tiêu đề bản tin mẫu..."}</h5>
                    {(location || date) && (
                      <p className="text-[9.5px] text-amber-200 truncate mt-0.5 font-medium">
                        {location} {date ? `• ${dayjs(date).isValid() ? dayjs(date).format("DD/MM/YYYY") : date}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details summary */}
                <div className="space-y-2 p-3 rounded-xl bg-white/80 border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-amber-500 shrink-0" />
                    <span className="text-gray-700 font-mono text-[11.5px]">
                      {date ? (dayjs(date).isValid() ? dayjs(date).format("DD/MM/YYYY") : date) : "Chưa chọn ngày"}
                    </span>
                  </div>
                  {location && (
                    <div className="flex items-center gap-2 text-gray-600 text-[11.5px]">
                      <MapPin size={13} className="text-orange-500 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  )}
                </div>

                {description && (
                  <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100/50 text-[11.5px] text-gray-600 leading-relaxed line-clamp-4 italic">
                    "{description}"
                  </div>
                )}
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-2 text-left">
                <Sparkles size={14} className="text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-950/80 leading-snug font-medium">
                  Bản tin hiển thị với cấu trúc gồm Tiêu đề, Banner, Thời gian, Địa điểm và Mô tả.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <SectionHeader
                  icon={Mail}
                  title="Thông tin ấn phẩm bản tin"
                  description="Cung cấp tiêu đề, ngày diễn ra, địa điểm và nội dung mô tả bản tin"
                  size="sm"
                />

                <div className="space-y-3.5">
                  {/* 1. Title */}
                  <FormInput
                    label="1. Tiêu đề bản tin (Title)"
                    placeholder="Ví dụ: Recap các hoạt động tại SURF Đà Nẵng"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    required
                  />

                  {/* 2. Date & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
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
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[12px] font-bold text-gray-700 ml-1">Trạng thái hiển thị</label>
                    <SelectComponent value={status} onChange={(val) => setStatus(val as string)} options={STATUS_OPTIONS} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </PortalModal>
  );
};
