"use client";

import React, { useState, useEffect } from "react";
import {
  PortalModal,
  PremiumButton,
  SectionHeader,
  FormInput,
  SelectComponent,
  StatusBadge,
} from "@/components";
import {
  Sparkles,
  MapPin,
  Calendar,
  ExternalLink,
  Save,
  Plus,
  Image as ImageIcon,
  Tag,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { EventItem, CreateEventPayload } from "@/types/event";

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

export const CreateEditEventModal: React.FC<CreateEditEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("/admin/card-event-01.png");
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
        setBadge("Private Club Exclusive");
        setLumaUrl("");
        setDescription("");
        setStatus("active");
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { title?: string; location?: string } = {};
    if (!title.trim()) newErrors.title = "Vui lòng nhập tên sự kiện";
    if (!location.trim()) newErrors.location = "Vui lòng nhập địa điểm tổ chức";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        subtitle: subtitle.trim(),
        location: location.trim(),
        date: date.trim() || "Sắp diễn ra",
        image: image.trim() || "/admin/card-event-01.png",
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
      className="max-h-[96vh] h-[96vh]"
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
      <form onSubmit={handleSubmit} className="animate-in fade-in duration-300 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-stretch">
          {/* Left Column: Live Preview Card */}
          <div className="lg:col-span-4 relative flex flex-col">
            <div className="bg-linear-to-b from-white via-orange-50/20 to-white rounded-2xl p-4 border border-gray-100/90 shadow-custom flex flex-col justify-between h-full relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <Sparkles size={12} /> Live Preview
                  </span>
                  <StatusBadge
                    status={status === "active" ? "ACTIVE" : status === "upcoming" ? "PENDING" : "INACTIVE"}
                    label={status === "active" ? "ĐANG MỞ" : status === "upcoming" ? "SẮP DIỄN RA" : "TẠM ẨN"}
                    variant="premium"
                  />
                </div>

                {/* Banner preview card */}
                <div className="relative rounded-2xl overflow-hidden border border-orange-200/60 shadow-lg bg-slate-950 aspect-video group">
                  <img
                    src={image || "/admin/card-event-01.png"}
                    alt="Preview banner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-xs text-[9.5px] font-bold text-white shadow-xs">
                      {badge || "VIP Exclusive"}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h5 className="font-bold text-xs leading-tight drop-shadow-sm line-clamp-1">
                      {title || "Tên sự kiện mẫu..."}
                    </h5>
                    <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5">{subtitle || "Mô tả ngắn gọn..."}</p>
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

          {/* Right Column: Form Inputs */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full overflow-y-auto pr-1 custom-scrollbar">
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
                      placeholder="Ví dụ: Conviction 2026 — Global Web3 & On-Chain Summit"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={errors.title}
                      required
                    />
                  </div>

                  <FormInput
                    label="Tiêu đề phụ / Tagline"
                    placeholder="Ví dụ: Welcome to Conviction 2026"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />

                  <FormInput
                    label="Huy hiệu đặc quyền (Badge Tag)"
                    placeholder="Ví dụ: Private Club Exclusive / VIP Gala"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 2: Thời gian & Địa điểm */}
              <div className="space-y-3">
                <SectionHeader
                  icon={MapPin}
                  title="Địa điểm, Thời gian & Trạng thái"
                  description="Địa điểm tổ chức, thời gian diễn ra và trạng thái hiển thị"
                  size="sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <FormInput
                    label="Địa điểm tổ chức (Location)"
                    placeholder="Ví dụ: HCMC, Viet Nam / Seoul, Korea"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    error={errors.location}
                    required
                  />

                  <FormInput
                    label="Thời gian tổ chức (Date / Time)"
                    placeholder="Ví dụ: 14 - 15 August 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1">
                      Trạng thái hiển thị
                    </label>
                    <SelectComponent
                      value={status}
                      onChange={(val) => setStatus(val as string)}
                      options={STATUS_OPTIONS}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Cổng Lu.ma & Poster */}
              <div className="space-y-3">
                <SectionHeader
                  icon={FileText}
                  title="Cổng Lu.ma, Poster & Giới thiệu chi tiết"
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
                      label="Đường dẫn ảnh Poster / Banner (Image URL)"
                      placeholder="/admin/card-event-01.png hoặc link URL ảnh..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
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
