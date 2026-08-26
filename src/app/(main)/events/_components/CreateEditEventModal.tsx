"use client";

import React, { useState, useEffect, useRef } from "react";
import { PortalModal, PremiumButton, SectionHeader, FormInput, SelectComponent, StatusBadge } from "@/components";
import { Sparkles, MapPin, Calendar, ExternalLink, Save, Plus, FileText, ShieldCheck, Camera, X } from "lucide-react";
import { EventItem, CreateEventPayload } from "@/types/event";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "@/providers/ToastProvider";

interface CreateEditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventPayload) => Promise<void> | void;
  initialData?: EventItem | null;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Đang mở (Active)", color: "text-emerald-500" },
  { value: "upcoming", label: "Sắp diễn ra (Upcoming)", color: "text-amber-500" },
  { value: "completed", label: "Đã kết thúc (Completed)", color: "text-slate-500" },
  { value: "inactive", label: "Tạm ẩn (Inactive)", color: "text-rose-500" },
];

export const CreateEditEventModal: React.FC<CreateEditEventModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { uploadFile } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("/admin/card-event-01.png");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [badge, setBadge] = useState("Private Club Exclusive");
  const [lumaUrl, setLumaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const [errors, setErrors] = useState<{ title?: string; location?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setSubtitle(initialData.subtitle || "");
        setLocation(initialData.location || "");
        setDate(initialData.date || "");
        setImage(initialData.image || "/admin/card-event-01.png");
        setImageFile(null);
        setBadge(initialData.badge || "Private Club Exclusive");
        setLumaUrl(initialData.luma_url || "");
        setDescription(initialData.description || "");
        setStatus(initialData.status || "active");
      } else {
        setTitle("");
        setSubtitle("");
        setLocation("");
        setDate("");
        setImage("/admin/card-event-01.png");
        setImageFile(null);
        setBadge("Private Club Exclusive");
        setLumaUrl("");
        setDescription("");
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
      toast.success("Đã chọn ảnh poster sự kiện!");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage("/admin/card-event-01.png");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors: { title?: string; location?: string } = {};
    if (!title.trim()) newErrors.title = "Vui lòng nhập tên sự kiện";
    if (!location.trim()) newErrors.location = "Vui lòng nhập địa điểm tổ chức";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

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
        subtitle: subtitle.trim(),
        location: location.trim(),
        date: date.trim(),
        image: finalImageUrl || "/admin/card-event-01.png",
        badge: badge.trim(),
        luma_url: lumaUrl.trim(),
        description: description.trim(),
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
      title={isEditMode ? "Cập nhật Sự Kiện Private Club" : "Khởi tạo Sự Kiện Mới"}
      description={
        isEditMode
          ? "Chỉnh sửa nội dung, thời gian tổ chức và cấu hình cổng đăng ký Luma."
          : "Đăng tải sự kiện hội nghị, private gala hoặc roundtable dành cho hội viên On-Chainpass."
      }
      icon={Sparkles}
      width="max-w-5xl"
      className="max-h-[92vh] h-[92vh] flex flex-col"
      footer={
        <div className="flex items-center justify-between w-full gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11.5px] font-medium text-gray-500 min-w-0">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="truncate">Sự kiện tự động đồng bộ hóa trên cổng On-Chainpass Member Portal</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto shrink-0">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />
            <PremiumButton
              label={isEditMode ? "Lưu thay đổi" : "Tạo sự kiện"}
              icon={isEditMode ? Save : Plus}
              onClick={handleSubmit}
              size="md"
              isLoading={isSubmitting}
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
          {/* Left Column: Sticky Live Preview */}
          <div className="lg:col-span-4 lg:sticky lg:top-0 h-full flex flex-col">
            <div className="bg-linear-to-b from-white via-orange-50/20 to-white rounded-2xl p-4 border border-gray-100/90 shadow-custom flex flex-col justify-between h-full relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              <input type="file" ref={fileInputRef} onChange={handleImageFileChange} accept="image/png, image/jpeg, image/webp, image/gif" className="hidden" />

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-orange-600 flex items-center gap-1.5 tracking-wider">
                    <Sparkles size={12} /> Live Preview
                  </span>
                  <StatusBadge
                    status={status === "active" ? "ACTIVE" : status === "upcoming" ? "PENDING" : "INACTIVE"}
                    label={status === "active" ? "ĐANG MỞ" : status === "upcoming" ? "SẮP DIỄN RA" : "TẠM ẨN"}
                    variant="premium"
                  />
                </div>

                {/* Banner preview card with UserProfilePreviewCard upload style */}
                <div
                  onClick={handleImageClick}
                  className="relative rounded-2xl overflow-hidden border-2 border-orange-200/60 shadow-md bg-slate-950 aspect-video group cursor-pointer flex items-center justify-center transition-all duration-300 isolate hover:ring-4 hover:ring-orange-500/20"
                  title="Nhấn để thêm hoặc đổi ảnh poster"
                >
                  <img
                    src={image || "/admin/card-event-01.png"}
                    alt="Preview banner"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Hover Overlay with Glass Plus Icon */}
                  <div className="absolute inset-0 rounded-2xl bg-slate-950/65 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
                      <Plus size={22} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-white drop-shadow-sm">
                      {image && image !== "/admin/card-event-01.png" ? "Đổi ảnh" : "Thêm ảnh"}
                    </span>
                  </div>

                  {/* Camera Icon on Bottom-Right */}
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-0 transition-transform duration-200 z-10">
                    <Camera size={13} className="text-orange-600" />
                  </div>

                  {/* Badge top-left */}
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-xs text-[9.5px] font-bold text-white shadow-xs">
                      {badge || "VIP Exclusive"}
                    </span>
                  </div>

                  {/* Delete / Remove image button top-right */}
                  {image && image !== "/admin/card-event-01.png" && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110 pointer-events-auto cursor-pointer"
                      title="Xóa ảnh poster"
                    >
                      <X size={13} strokeWidth={3} />
                    </button>
                  )}

                  {/* Title & Subtitle bottom-left */}
                  <div className="absolute bottom-2 left-2 right-10 text-white z-10 pointer-events-none text-left">
                    <h5 className="font-bold text-xs leading-tight drop-shadow-sm line-clamp-1">{title || "Tên sự kiện mẫu..."}</h5>
                    <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5 font-medium">{subtitle || "Mô tả ngắn gọn..."}</p>
                  </div>
                </div>

                {/* Details summary */}
                <div className="space-y-2.5 p-3 rounded-xl bg-white/80 border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-orange-500 shrink-0" />
                    <span className="font-medium text-gray-800 truncate">{location || "Chưa nhập địa điểm"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-orange-500 shrink-0" />
                    <span className="font-mono text-gray-700">{date || "Chưa có ngày giờ"}</span>
                  </div>
                  {lumaUrl && (
                    <div className="flex items-center gap-2 text-[11px] text-orange-600 font-bold truncate">
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{lumaUrl}</span>
                    </div>
                  )}
                </div>

                {description && (
                  <div className="p-3 rounded-xl bg-orange-50/40 border border-orange-100/50 text-[11.5px] text-gray-600 leading-relaxed line-clamp-4 italic">
                    "{description}"
                  </div>
                )}
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-2 text-left">
                <Sparkles size={14} className="text-orange-600 shrink-0" />
                <p className="text-[10px] text-orange-950/80 leading-snug font-medium">
                  Sự kiện sẽ được hiển thị với giao diện thẻ vàng đen sang trọng trên App On-Chainpass.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Form Inputs */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full overflow-y-auto max-h-[calc(92vh-150px)] pr-2 custom-scrollbar space-y-6">
            <div className="space-y-5">
              {/* Section 1: Thông tin sự kiện */}
              <div className="space-y-3">
                <SectionHeader
                  icon={Sparkles}
                  title="Thông tin sự kiện & Danh mục"
                  description="Tên sự kiện, tiêu đề phụ và phân loại huy hiệu đặc quyền"
                  size="sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Tên sự kiện chính"
                      placeholder="Ví dụ: On-Chain RWA Summit 2026 — Gala Dinner & Investor Meetup"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={errors.title}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormInput
                      label="Tiêu đề phụ / Chủ đề thảo luận (Subtitle)"
                      placeholder="Ví dụ: Tương lai số hóa tài sản thực và cơ hội tiếp cận dòng vốn quốc tế"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FormInput
                      label="Huy hiệu đặc quyền (Badge)"
                      placeholder="Ví dụ: VIP Exclusive, Private Roundtable"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1">Trạng thái hiển thị</label>
                    <SelectComponent value={status} onChange={(val) => setStatus(val as string)} options={STATUS_OPTIONS} />
                  </div>
                </div>
              </div>

              {/* Section 2: Địa điểm & Thời gian */}
              <div className="space-y-3">
                <SectionHeader
                  icon={MapPin}
                  title="Địa điểm & Thời gian tổ chức"
                  description="Địa chỉ diễn ra sự kiện, ngày giờ và hướng dẫn check-in"
                  size="sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <FormInput
                    label="Địa điểm tổ chức"
                    placeholder="Ví dụ: GEM Center, TP. Hồ Chí Minh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    error={errors.location}
                    required
                  />

                  <FormInput
                    label="Thời gian diễn ra (Date & Time)"
                    placeholder="Ví dụ: 14 - 15 August 2026 / 18:30 - 21:30"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 3: Cổng Lu.ma & Giới thiệu chi tiết */}
              <div className="space-y-3">
                <SectionHeader
                  icon={FileText}
                  title="Cổng Lu.ma & Giới thiệu chi tiết"
                  description="Liên kết đặt vé / tham dự qua Lu.ma và thông điệp dành cho khách VIP"
                  size="sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Liên kết đăng ký Lu.ma (Luma Event URL)"
                      placeholder="https://lu.ma/your-event-slug"
                      type="url"
                      value={lumaUrl}
                      onChange={(e) => setLumaUrl(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormInput
                      isTextArea
                      label="Nội dung giới thiệu chi tiết"
                      placeholder="Mục tiêu hội nghị, diễn giả nổi bật, quyền lợi VIP, tiệc Private Dinner dành cho thành viên On-Chainpass..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={1000}
                      showCount
                    />
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
