"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { PortalModal, PremiumButton, SectionHeader, FormInput, SelectComponent, StatusBadge } from "@/components";
import { GraduationCap, Sparkles, User, Clock, Calendar, Save, Plus, ShieldCheck, Camera, X } from "lucide-react";
import { CourseItem, CreateCourseItemPayload } from "@/types/course";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "@/providers/ToastProvider";

interface CreateEditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseItemPayload) => Promise<void> | void;
  initialData?: CourseItem | null;
}

const BOOKING_TYPE_OPTIONS = [
  { value: "course", label: "Khóa học (Course)", color: "text-orange-500" },
  { value: "workshop", label: "Hội thảo (Workshop)", color: "text-purple-500" },
  {
    value: "meeting-room",
    label: "Phòng họp (Meeting Room)",
    color: "text-blue-500",
  },
  { value: "lounge", label: "VIP Lounge", color: "text-amber-500" },
  {
    value: "consulting",
    label: "Tư vấn 1-1 (Consulting)",
    color: "text-emerald-500",
  },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Đang mở (Active)", color: "text-emerald-500" },
  { value: "inactive", label: "Tạm ẩn (Inactive)", color: "text-rose-500" },
  { value: "draft", label: "Bản nháp (Draft)", color: "text-amber-500" },
];

export const CreateEditCourseModal: React.FC<CreateEditCourseModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { uploadFile } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [bookingType, setBookingType] = useState("course");
  const [bookingTitle, setBookingTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/admin/card-banner-01.png");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [schedule, setSchedule] = useState("");
  const [tuitionFee, setTuitionFee] = useState("0");
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
    const hasBookingTypeChanged = bookingType !== (initialData.booking_type || "course");
    const hasBookingTitleChanged = bookingTitle.trim() !== (initialData.booking_title || initialData.title || "").trim();
    const hasDescChanged = description.trim() !== (initialData.description || "").trim();
    const hasImageChanged = Boolean(imageFile) || (image !== (initialData.image || "/admin/card-banner-01.png") && image !== "/admin/card-banner-01.png");
    const hasInstructorChanged = instructor.trim() !== (initialData.instructor || "").trim();
    const hasDurationChanged = duration.trim() !== (initialData.duration || "").trim();
    const hasScheduleChanged = schedule.trim() !== (initialData.schedule || "").trim();
    const hasFeeChanged = (Number(tuitionFee.replace(/\D/g, "")) || 0) !== (initialData.tuition_fee || 0);
    const hasStatusChanged = status !== (initialData.status || "active");

    return (
      hasTitleChanged ||
      hasBookingTypeChanged ||
      hasBookingTitleChanged ||
      hasDescChanged ||
      hasImageChanged ||
      hasInstructorChanged ||
      hasDurationChanged ||
      hasScheduleChanged ||
      hasFeeChanged ||
      hasStatusChanged
    );
  }, [
    isFormValid,
    isEditMode,
    initialData,
    title,
    bookingType,
    bookingTitle,
    description,
    image,
    imageFile,
    instructor,
    duration,
    schedule,
    tuitionFee,
    status,
  ]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setBookingType(initialData.booking_type || "course");
        setBookingTitle(initialData.booking_title || initialData.title || "");
        setDescription(initialData.description || "");
        setImage(initialData.image || "/admin/card-banner-01.png");
        setImageFile(null);
        setInstructor(initialData.instructor || "");
        setDuration(initialData.duration || "");
        setSchedule(initialData.schedule || "");
        setTuitionFee(initialData.tuition_fee ? initialData.tuition_fee.toString() : "0");
        setStatus(initialData.status || "active");
      } else {
        setTitle("");
        setBookingType("course");
        setBookingTitle("");
        setDescription("");
        setImage("/admin/card-banner-01.png");
        setImageFile(null);
        setInstructor("Chuyên Gia On-Chainpass");
        setDuration("4 tuần (8 buổi)");
        setSchedule("Thứ 3 & Thứ 5 (19:30 - 21:30)");
        setTuitionFee("15000000");
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
      toast.success("Đã chọn ảnh banner!");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage("/admin/card-banner-01.png");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) newErrors.title = "Vui lòng nhập tên khóa học / dịch vụ";
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

      const parsedFee = Number(tuitionFee.replace(/\D/g, "")) || 0;
      await onSubmit({
        title: title.trim(),
        booking_type: bookingType,
        booking_title: bookingTitle.trim() || title.trim(),
        description: description.trim(),
        image: finalImageUrl || "/admin/card-banner-01.png",
        instructor: instructor.trim(),
        duration: duration.trim(),
        schedule: schedule.trim(),
        tuition_fee: parsedFee,
        status: status,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const numericTuitionFee = Number(tuitionFee.replace(/\D/g, "")) || 0;

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Cập nhật Khóa Học / Dịch Vụ" : "Thêm Khóa Học / Dịch Vụ Mới"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin đào tạo, học phí và lịch trình hiển thị trên hệ thống."
          : "Khởi tạo khóa học, chuyên đề workshop hoặc tiện ích phòng họp VIP cho thành viên."
      }
      icon={GraduationCap}
      width="max-w-5xl"
      className="max-h-[92vh] h-[92vh] flex flex-col"
      footer={
        <div className="flex items-center justify-between w-full gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11.5px] font-medium text-gray-500 min-w-0">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="truncate">Đồng bộ tự động ra cổng đăng ký trực tuyến On-Chainpass</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto shrink-0">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />
            <PremiumButton
              label={isEditMode ? "Lưu thay đổi" : "Tạo khóa học"}
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
                    status={status === "active" ? "ACTIVE" : status === "draft" ? "PENDING" : "INACTIVE"}
                    label={status === "active" ? "ĐANG MỞ" : status === "draft" ? "BẢN NHÁP" : "TẠM ẨN"}
                    variant="premium"
                  />
                </div>

                {/* Banner preview card */}
                <div
                  onClick={handleImageClick}
                  className="relative rounded-2xl overflow-hidden border-2 border-orange-200/60 shadow-md bg-slate-950 aspect-video group cursor-pointer flex items-center justify-center transition-all duration-300 isolate hover:ring-4 hover:ring-orange-500/20"
                  title="Nhấn để thêm hoặc đổi ảnh banner"
                >
                  <img
                    src={image || "/admin/card-banner-01.png"}
                    alt="Course Preview"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80";
                    }}
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Hover Overlay with Glass Plus Icon */}
                  <div className="absolute inset-0 rounded-2xl bg-slate-950/65 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
                      <Plus size={22} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-white drop-shadow-sm">
                      {image && image !== "/admin/card-banner-01.png" ? "Đổi ảnh" : "Thêm ảnh"}
                    </span>
                  </div>

                  {/* Camera Icon on Bottom-Right */}
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-0 transition-transform duration-200 z-10">
                    <Camera size={13} className="text-orange-600" />
                  </div>

                  {/* Badge top-left */}
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-xs text-[9.5px] font-bold text-white uppercase shadow-xs">
                      {bookingType}
                    </span>
                  </div>

                  {/* Delete / Remove image button top-right */}
                  {image && image !== "/admin/card-banner-01.png" && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110 pointer-events-auto cursor-pointer"
                      title="Xóa ảnh banner"
                    >
                      <X size={13} strokeWidth={3} />
                    </button>
                  )}

                  {/* Title & Instructor bottom-left */}
                  <div className="absolute bottom-2 left-2 right-10 text-white z-10 pointer-events-none text-left">
                    <h5 className="font-bold text-xs leading-tight drop-shadow-sm line-clamp-1">{title || "Tên khóa học / dịch vụ..."}</h5>
                    <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5 font-medium">{instructor || "Chuyên gia On-Chainpass"}</p>
                  </div>
                </div>

                {/* Details summary */}
                <div className="space-y-2 p-3 rounded-xl bg-white/80 border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500 font-medium">Học phí niêm yết:</span>
                    <span className="font-bold text-orange-600 font-mono text-[13px]">
                      {numericTuitionFee > 0 ? `${numericTuitionFee.toLocaleString("vi-VN")} đ` : "Đặc quyền miễn phí"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate font-medium">{duration || "Chưa nhập thời lượng"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate font-medium">{schedule || "Chưa nhập lịch trình"}</span>
                  </div>
                </div>

                {description && (
                  <div className="p-3 rounded-xl bg-orange-50/40 border border-orange-100/50 text-[11.5px] text-gray-600 leading-relaxed line-clamp-3 italic">
                    "{description}"
                  </div>
                )}
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-2 text-left">
                <GraduationCap size={14} className="text-orange-600 shrink-0" />
                <p className="text-[10px] text-orange-950/80 leading-snug font-medium">
                  Khóa học được hiển thị đồng bộ trong danh mục On-Chainpass Academy & Booking Hub.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form Inputs with Custom Scrollbar */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full overflow-y-auto max-h-[calc(92vh-150px)] pr-2 custom-scrollbar space-y-6">
            {/* Section 1: Thông tin cơ bản */}
            <div className="space-y-4">
              <SectionHeader
                icon={Sparkles}
                title="Thông tin định danh & Phân loại"
                description="Tên chương trình đào tạo, phân loại hình thức và trạng thái hiển thị"
                size="sm"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="md:col-span-2">
                  <FormInput
                    label="Tên khóa học / Tiêu đề dịch vụ"
                    placeholder="Ví dụ: KHÓA HỌC CHUYÊN SÂU — NGÀNH HÀNG HÓA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    required
                  />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-gray-700 ml-1 mb-1 block">Hình thức phân loại</label>
                  <SelectComponent value={bookingType} onChange={(val) => setBookingType(val as string)} options={BOOKING_TYPE_OPTIONS} />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-gray-700 ml-1 mb-1 block">Trạng thái hiển thị</label>
                  <SelectComponent value={status} onChange={(val) => setStatus(val as string)} options={STATUS_OPTIONS} />
                </div>

                <div className="md:col-span-2">
                  <FormInput
                    label="Tiêu đề rút gọn (Booking Title)"
                    placeholder="Ví dụ: Khóa học chuyên sâu — Ngành hàng hóa"
                    value={bookingTitle}
                    onChange={(e) => setBookingTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Giảng viên & Học phí */}
            <div className="space-y-3">
              <SectionHeader icon={User} title="Giảng viên, Học phí & Chi phí" description="Đơn vị phụ trách chuyên môn và chính sách học phí" size="sm" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <FormInput
                  label="Giảng viên / Đơn vị phụ trách"
                  placeholder="Ví dụ: Chuyên Gia On-Chainpass & Các Quỹ Đối Tác"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                />

                <FormInput
                  label="Học phí / Chi phí (VNĐ) — 0 = Miễn phí"
                  type="number"
                  placeholder="Ví dụ: 15000000"
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: Lịch trình & Mô tả */}
            <div className="space-y-3">
              <SectionHeader
                icon={Calendar}
                title="Thời lượng, Lịch trình & Mô tả đào tạo"
                description="Thời lượng khóa học, lịch học chi tiết và mục tiêu đào tạo"
                size="sm"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <FormInput
                  label="Thời lượng khóa học"
                  placeholder="Ví dụ: 4 tuần (8 buổi) / 24/7 Priority Booking"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />

                <FormInput
                  label="Lịch học / Thời gian mở cửa"
                  placeholder="Ví dụ: Thứ 3 & Thứ 5 (19:30 - 21:30)"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />

                <div className="md:col-span-2">
                  <FormInput
                    isTextArea
                    label="Mô tả khóa học & Quyền lợi học viên"
                    placeholder="Mục tiêu đào tạo, đối tượng học viên phù hợp, giáo trình và tài liệu đính kèm..."
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
      </form>
    </PortalModal>
  );
};
