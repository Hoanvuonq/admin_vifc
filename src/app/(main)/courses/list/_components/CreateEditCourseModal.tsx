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
  GraduationCap,
  Sparkles,
  User,
  Clock,
  Calendar,
  DollarSign,
  Save,
  Plus,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { CourseItem, CreateCourseItemPayload } from "@/types/course";

interface CreateEditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseItemPayload) => Promise<void> | void;
  initialData?: CourseItem | null;
}

const BOOKING_TYPE_OPTIONS = [
  { value: "course", label: "Khóa học (Course)", color: "text-orange-500" },
  { value: "workshop", label: "Hội thảo (Workshop)", color: "text-purple-500" },
  { value: "meeting-room", label: "Phòng họp (Meeting Room)", color: "text-blue-500" },
  { value: "lounge", label: "VIP Lounge", color: "text-amber-500" },
  { value: "consulting", label: "Tư vấn 1-1 (Consulting)", color: "text-emerald-500" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Đang mở (Active)", color: "text-emerald-500" },
  { value: "inactive", label: "Tạm ẩn (Inactive)", color: "text-rose-500" },
  { value: "draft", label: "Bản nháp (Draft)", color: "text-amber-500" },
];

export const CreateEditCourseModal: React.FC<CreateEditCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [bookingType, setBookingType] = useState("course");
  const [bookingTitle, setBookingTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/admin/card-banner-01.png");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [schedule, setSchedule] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [status, setStatus] = useState("active");

  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setBookingType(initialData.booking_type || "course");
        setBookingTitle(initialData.booking_title || initialData.title || "");
        setDescription(initialData.description || "");
        setImage(initialData.image || "/admin/card-banner-01.png");
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
        setInstructor("Chuyên Gia On-Chainpass");
        setDuration("4 tuần (8 buổi)");
        setSchedule("Thứ 3 & Thứ 5 (19:30 - 21:30)");
        setTuitionFee("15000000");
        setStatus("active");
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) newErrors.title = "Vui lòng nhập tên khóa học / dịch vụ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const parsedFee = Number(tuitionFee.replace(/\D/g, "")) || 0;
      await onSubmit({
        title: title.trim(),
        booking_type: bookingType,
        booking_title: (bookingTitle.trim() || title.trim()),
        description: description.trim(),
        image: image.trim() || "/admin/card-banner-01.png",
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
      className="max-h-[96vh] h-[96vh]"
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
                    status={status === "active" ? "ACTIVE" : status === "draft" ? "PENDING" : "INACTIVE"}
                    label={status === "active" ? "ĐANG MỞ" : status === "draft" ? "BẢN NHÁP" : "TẠM ẨN"}
                    variant="premium"
                  />
                </div>

                {/* Banner preview card */}
                <div className="relative rounded-2xl overflow-hidden border border-orange-200/60 shadow-lg bg-slate-950 aspect-video group">
                  <img
                    src={image || "/admin/card-banner-01.png"}
                    alt="Course Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-xs text-[9.5px] font-bold text-white uppercase tracking-wider shadow-xs">
                      {bookingType}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h5 className="font-bold text-xs leading-tight drop-shadow-sm line-clamp-1">
                      {title || "Tên khóa học / dịch vụ..."}
                    </h5>
                    <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5 font-medium">
                      {instructor || "Chuyên gia On-Chainpass"}
                    </p>
                  </div>
                </div>

                {/* Details summary */}
                <div className="space-y-2 p-3 rounded-xl bg-white/80 border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">Học phí / Giá:</span>
                    <span className="font-bold text-orange-600 font-mono">
                      {Number(tuitionFee.replace(/\D/g, "")) > 0
                        ? `${Number(tuitionFee.replace(/\D/g, "")).toLocaleString("vi-VN")} đ`
                        : "Đặc quyền miễn phí"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate">{duration || "Chưa nhập thời lượng"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate">{schedule || "Chưa nhập lịch trình"}</span>
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

          {/* Right Column: Form Inputs */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-5">
              {/* Section 1: Thông tin cơ bản */}
              <div className="space-y-3">
                <SectionHeader
                  icon={GraduationCap}
                  title="Thông tin khóa học & Loại hình"
                  description="Tên khóa học, tên dịch vụ hiển thị và phân loại booking"
                  size="sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Tên khóa học / Dịch vụ"
                      placeholder="Ví dụ: Chương Trình Đào Tạo Chiến Lược & Đầu Tư On-Chain"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      error={errors.title}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1">
                      Loại hình dịch vụ (Booking Type)
                    </label>
                    <SelectComponent
                      value={bookingType}
                      onChange={(val) => setBookingType(val as string)}
                      options={BOOKING_TYPE_OPTIONS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 ml-1 flex items-center gap-1">
                      Trạng thái hoạt động
                    </label>
                    <SelectComponent
                      value={status}
                      onChange={(val) => setStatus(val as string)}
                      options={STATUS_OPTIONS}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormInput
                      label="Tên ngắn gọn hiển thị (Short Title / Tagline)"
                      placeholder="Ví dụ: Khóa Học Chuyên Sâu On-Chainpass"
                      value={bookingTitle}
                      onChange={(e) => setBookingTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Giảng viên & Học phí */}
              <div className="space-y-3">
                <SectionHeader
                  icon={User}
                  title="Giảng viên, Học phí & Chi phí"
                  description="Đơn vị phụ trách chuyên môn và chính sách học phí"
                  size="sm"
                />

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

              {/* Section 3: Lịch trình & Hình ảnh */}
              <div className="space-y-3">
                <SectionHeader
                  icon={Calendar}
                  title="Thời lượng, Lịch trình & Banner"
                  description="Lịch học chi tiết, thời lượng và đường dẫn poster"
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
                      label="Đường dẫn ảnh Banner / Poster (Image URL)"
                      placeholder="/admin/card-banner-01.png hoặc đường dẫn ảnh..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>

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
        </div>
      </form>
    </PortalModal>
  );
};
