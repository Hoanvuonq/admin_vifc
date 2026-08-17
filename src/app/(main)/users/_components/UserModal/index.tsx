"use client";

import { FormInput, PortalModal, PremiumButton, SelectComponent, StatusBadge } from "@/components";
import { getAvatarFallback } from "@/hooks/avatar.utils";
import { copyToClipboard, generateSecurePassword, validatePasswordStrength } from "@/hooks/passwordGenerator";
import { toast } from "@/providers/ToastProvider";
import { SubscriptionPlan } from "@/types/user";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  UserPlus,
  Verified,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { RoleBadge } from "../RoleBadge";
import { UserItem } from "../../_pages/types";
import { UserModalProps } from "./type";
import { UserFormData, useUserForm } from "./userSchema";

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit, onSave }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(userToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useUserForm();

  const formValues = watch();

  // Load subscription plans from API
  useEffect(() => {
    if (!isOpen) return;

    const loadPlans = async () => {
      try {
        const response = await fetch("/api/db/subscription_plans?active=true");
        if (!response.ok) return;
        const json = await response.json();
        setSubscriptionPlans(json.data || []);
      } catch (err) {
        console.warn("Failed to load subscription plans", err);
      }
    };

    loadPlans();
  }, [isOpen]);

  // Sync form values when opening or switching mode
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          name: userToEdit.name || "",
          email: userToEdit.email || "",
          phone: userToEdit.phone !== "—" ? userToEdit.phone : "",
          password: "",
          confirmPassword: "",
          status: userToEdit.status || "ACTIVE",
          avatarUrl: userToEdit.avatar || "",
          avatarFile: null,
          subscriptionPlanId: userToEdit.subscription?.plan?.id || "",
          company: userToEdit.company || "",
          country: userToEdit.country || "Việt Nam",
        });
      } else {
        reset({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          status: "ACTIVE",
          avatarUrl: "",
          avatarFile: null,
          subscriptionPlanId: "",
          company: "",
          country: "Việt Nam",
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen, userToEdit, reset]);

  const currentSubscriptionPlanId = userToEdit?.subscription?.plan?.id || "";
  const hasActiveSubscription = Boolean(userToEdit?.subscription?.plan?.id);
  const shouldDisableFields = isEditMode && hasActiveSubscription;

  const handleAvatarClick = () => {
    if (shouldDisableFields) return;
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Dung lượng ảnh tối đa 10MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setValue("avatarUrl", previewUrl, { shouldValidate: true });
      setValue("avatarFile", file, { shouldValidate: true });
      toast.success("Đã chọn ảnh đại diện!");
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("avatarUrl", "", { shouldValidate: true });
    setValue("avatarFile", null, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGeneratePassword = () => {
    const newPass = generateSecurePassword({ length: 14 });
    setValue("password", newPass, { shouldValidate: true });
    setValue("confirmPassword", newPass, { shouldValidate: true });
    toast.success("Đã tạo mật khẩu ngẫu nhiên bảo mật cao!");
  };

  const handleCopyPassword = async () => {
    if (!formValues.password) return;
    const success = await copyToClipboard(formValues.password);
    if (success) {
      setCopiedPass(true);
      toast.success("Đã sao chép mật khẩu vào bộ nhớ tạm!");
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const passwordStrength = useMemo(() => {
    if (!formValues.password) return null;
    return validatePasswordStrength(formValues.password);
  }, [formValues.password]);

  const selectedPlan = useMemo(() => {
    return subscriptionPlans.find((p) => p.id === formValues.subscriptionPlanId);
  }, [subscriptionPlans, formValues.subscriptionPlanId]);

  const avatarFallback = useMemo(() => {
    return getAvatarFallback(formValues.name?.trim() || formValues.email?.trim() || "User");
  }, [formValues.name, formValues.email]);

  const onSubmit = (data: UserFormData) => {
    onSave({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || "",
      password: data.password || undefined,
      status: data.status,
      avatarFile: data.avatarFile || null,
      avatarUrl: data.avatarUrl || "",
      subscriptionPlanId: data.subscriptionPlanId || undefined,
      company: data.company?.trim() || undefined,
      country: data.country?.trim() || undefined,
    });
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Cập nhật Hồ sơ Người dùng" : "Tạo mới Tài khoản Thành viên"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin cá nhân, gói đăng ký và quyền hạn của thành viên."
          : "Đăng ký tài khoản thành viên mới và khởi tạo phương thức xác thực."
      }
      icon={isEditMode ? User : UserPlus}
      width="max-w-5xl"
      className="h-[88vh] max-h-[88vh]"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Tài khoản tự động áp dụng chính sách bảo mật hệ thống VIFC</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-12 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[12px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <PremiumButton
              label={isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}
              icon={isEditMode ? Save : UserPlus}
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              className="px-7 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-wider shadow-lg shadow-orange-500/20"
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-300 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-stretch">
          {/* LEFT COLUMN: LIVE PROFILE CARD PREVIEW */}
          <div className="lg:col-span-4 relative flex flex-col">
            <div className="bg-linear-to-b from-white via-orange-50/20 to-white rounded-4xl p-6 border border-gray-100/90 shadow-custom flex flex-col items-center text-center h-full justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Avatar Upload & Status Badge */}
              <div className="w-full flex flex-col items-center">
                <div className="relative mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                    disabled={shouldDisableFields}
                  />

                  {/* AVATAR BOX WITH HOVER PLUS OVERLAY */}
                  <div
                    onClick={handleAvatarClick}
                    className={cn(
                      "w-32 h-32 relative overflow-hidden rounded-4xl border-4 border-white shadow-xl bg-linear-to-br from-gray-100 to-orange-100/40 mb-4 group flex items-center justify-center ring-4 ring-orange-500/10 transition-all duration-300 isolate",
                      shouldDisableFields ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:ring-orange-500/30 hover:scale-[1.02]",
                    )}
                    title={shouldDisableFields ? "Không thể đổi ảnh khi có gói hoạt động" : "Nhấn để thêm hoặc đổi ảnh đại diện"}
                  >
                    {/* Display Uploaded Image or Fallback Letter Avatar */}
                    {formValues.avatarUrl && !formValues.avatarUrl.includes("api.dicebear.com") ? (
                      <img
                        src={formValues.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-4xl transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-full h-full rounded-4xl flex items-center justify-center font-extrabold text-5xl transition-transform duration-500 group-hover:scale-105 select-none",
                          avatarFallback.bg,
                          avatarFallback.text,
                        )}
                      >
                        {avatarFallback.char}
                      </div>
                    )}

                    {!shouldDisableFields && (
                      <div className="absolute inset-0 rounded-4xl bg-slate-950/65 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
                          <Plus size={22} strokeWidth={3} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-sm">
                          {formValues.avatarUrl ? "Đổi ảnh" : "Thêm ảnh"}
                        </span>
                      </div>
                    )}

                    {/* Mini Camera Badge at corner when idle */}
                    {!shouldDisableFields && (
                      <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-0 transition-transform duration-200 z-10">
                        <Camera size={13} className="text-orange-600" />
                      </div>
                    )}

                    {/* Remove image button */}
                    {formValues.avatarUrl && !shouldDisableFields && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110 pointer-events-auto"
                        title="Xóa ảnh đại diện"
                      >
                        <X size={13} strokeWidth={3} />
                      </button>
                    )}
                  </div>

                  <StatusBadge
                    status={formValues.status || "ACTIVE"}
                    label={formValues.status === "ACTIVE" ? "HOẠT ĐỘNG" : formValues.status === "INACTIVE" ? "TẠM KHÓA" : "BỊ CẤM"}
                    variant="premium"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 shadow-lg border-2 border-white h-7 px-3 text-[10px] font-bold"
                  />
                </div>

                {/* User Name & Role Header */}
                <div className="mt-4 mb-2 w-full px-2">
                  <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase italic drop-shadow-xs flex items-center justify-center gap-1.5 truncate">
                    {formValues.name?.trim() || (isEditMode ? "USER" : "NEW MEMBER")}
                    <Verified size={18} className="text-orange-500 fill-orange-50 shrink-0" />
                  </h3>
                  <div className="mt-2 flex items-center justify-center">
                    <RoleBadge role={selectedPlan?.name || userToEdit?.role || "FREE TIER"} className="shadow-sm border px-3 py-1 text-[11px] font-bold" />
                  </div>
                </div>
              </div>

              {/* Information Snapshot */}
              <div className="w-full mt-4 space-y-3 rounded-3xl p-4 border border-gray-100 bg-white/80 backdrop-blur-md shadow-xs text-left">
                <div className="flex items-center justify-between gap-3 text-gray-600">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail size={14} className="text-orange-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 truncate max-w-[130px]" title={formValues.email}>
                    {formValues.email || "Chưa nhập..."}
                  </span>
                </div>

                <div className="w-full h-px bg-gray-100" />

                <div className="flex items-center justify-between gap-3 text-gray-600">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone size={14} className="text-orange-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Điện thoại</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 truncate">{formValues.phone || "—"}</span>
                </div>

                <div className="w-full h-px bg-gray-100" />

                <div className="flex items-center justify-between gap-3 text-gray-600">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 size={14} className="text-orange-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Công ty</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 truncate max-w-[130px]" title={formValues.company}>
                    {formValues.company || "—"}
                  </span>
                </div>

                {!isEditMode && (
                  <>
                    <div className="w-full h-px bg-gray-100" />
                    <div className="flex items-center justify-between gap-3 text-gray-600">
                      <div className="flex items-center gap-2 min-w-0">
                        <KeyRound size={14} className="text-orange-500 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Mật khẩu</span>
                      </div>
                      <span className="text-[10px] font-bold italic text-emerald-600 flex items-center gap-1">
                        {formValues.password ? <Check size={12} strokeWidth={3} /> : null}
                        {formValues.password ? "ĐÃ THIẾT LẬP" : "CHƯA ĐẶT"}
                      </span>
                    </div>
                  </>
                )}

                <div className="w-full h-px bg-gray-100" />

                <div className="flex items-center justify-between gap-3 text-gray-600">
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{isEditMode ? "Ngày tham gia" : "Ngày tạo"}</span>
                  </div>
                  <span className="text-[10.5px] font-bold text-gray-700">
                    {isEditMode ? userToEdit?.joinedDate || dayjs().format("DD.MM.YYYY") : dayjs().format("DD.MM.YYYY")}
                  </span>
                </div>
              </div>

              {/* Security Hint */}
              <div className="w-full mt-3 p-2.5 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-2 text-left">
                <Shield size={14} className="text-orange-600 shrink-0" />
                <p className="text-[9.5px] text-orange-950/80 leading-snug font-medium">
                  {isEditMode
                    ? "Thông tin được cập nhật theo chính sách phân quyền quản trị VIFC."
                    : "Tài khoản lưu trữ an toàn và đồng bộ cơ sở dữ liệu VIFC."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM INPUTS */}
          <div className="lg:col-span-8 space-y-4 flex flex-col justify-between h-full overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-5">
              {hasActiveSubscription && (
                <div className="rounded-3xl bg-orange-50 border border-orange-200 p-4 text-orange-700 text-sm">
                  Người dùng này hiện đang có gói hội viên trả phí đang hoạt động. Bạn chỉ có thể chuyển đổi gói hội viên hoặc kích hoạt/khóa tài khoản.
                </div>
              )}

              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Thông tin cá nhân & Liên hệ</h4>
                      <p className="text-[11px] text-gray-500">Họ tên, email và số điện thoại liên lạc</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Họ và tên đầy đủ"
                      placeholder="Ví dụ: Nguyễn Văn An"
                      {...register("name")}
                      error={errors.name?.message}
                      disabled={shouldDisableFields}
                      required
                    />
                  </div>

                  <FormInput
                    label="Địa chỉ Email"
                    placeholder="Ví dụ: an.nguyen@vifc.io"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    disabled={shouldDisableFields}
                    required
                  />

                  <FormInput
                    label="Số điện thoại"
                    placeholder="Ví dụ: 0912 345 678"
                    type="tel"
                    {...register("phone")}
                    error={errors.phone?.message}
                    disabled={shouldDisableFields}
                  />

                  <FormInput
                    label="Công ty / Đơn vị"
                    placeholder="Ví dụ: VIFC Technology"
                    {...register("company")}
                    error={errors.company?.message}
                    disabled={shouldDisableFields}
                  />

                  <FormInput
                    label="Quốc gia"
                    placeholder="Ví dụ: Việt Nam"
                    {...register("country")}
                    error={errors.country?.message}
                    disabled={shouldDisableFields}
                  />
                </div>
              </div>

              {/* SECTION 2: PASSWORD (ONLY FOR CREATE OR OPTIONAL EDIT) */}
              {!isEditMode && (
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">2</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Mật khẩu khởi tạo</h4>
                        <p className="text-[11px] text-gray-500">Mật khẩu đăng nhập ban đầu cho tài khoản</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 transition-all cursor-pointer border border-orange-500/20 active:scale-95"
                    >
                      <Sparkles size={13} className="text-orange-600 group-hover:rotate-12 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Gợi ý mật khẩu mạnh</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <FormInput
                        label="Mật khẩu ban đầu"
                        placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)..."
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        error={errors.password?.message}
                      />
                      <div className="absolute right-3 top-[34px] flex items-center gap-1 text-gray-400">
                        {formValues.password && (
                          <button type="button" onClick={handleCopyPassword} className="p-1 hover:text-orange-500 transition-colors" title="Sao chép mật khẩu">
                            {copiedPass ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 hover:text-orange-500 transition-colors"
                          title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <FormInput
                      label="Xác nhận mật khẩu"
                      placeholder="Nhập lại mật khẩu..."
                      type={showPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      error={errors.confirmPassword?.message}
                    />
                  </div>

                  {passwordStrength && (
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-600">Độ mạnh mật khẩu:</span>
                        <span
                          className={cn(
                            "font-bold uppercase tracking-wider",
                            passwordStrength.strength === "strong"
                              ? "text-emerald-600"
                              : passwordStrength.strength === "medium"
                                ? "text-amber-600"
                                : "text-rose-600",
                          )}
                        >
                          {passwordStrength.strength === "strong"
                            ? "Rất mạnh (Strong)"
                            : passwordStrength.strength === "medium"
                              ? "Trung bình (Medium)"
                              : "Yếu (Weak)"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-1">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            passwordStrength.strength === "strong"
                              ? "w-full bg-emerald-500"
                              : passwordStrength.strength === "medium"
                                ? "w-2/3 bg-amber-500"
                                : "w-1/3 bg-rose-500",
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: SUBSCRIPTION PLAN & STATUS */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                      {isEditMode ? "2" : "3"}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Gói Hội Viên & Trạng Thái Tài Khoản</h4>
                      <p className="text-[11px] text-gray-500">Cấu hình gói dịch vụ và trạng thái hoạt động</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectComponent
                    label="Gói hội viên (Subscription Plan)"
                    value={formValues.subscriptionPlanId || ""}
                    onChange={(val: string | string[]) => setValue("subscriptionPlanId", val as string, { shouldValidate: true })}
                    options={[
                      {
                        label: "Free Tier (Mặc định)",
                        value: "",
                        icon: User,
                        color: "text-slate-500",
                        disabled: isEditMode && !currentSubscriptionPlanId,
                      },
                      ...subscriptionPlans.map((plan) => ({
                        label: plan.name,
                        value: plan.id,
                        disabled: isEditMode && plan.id === currentSubscriptionPlanId,
                        icon: plan.name.includes("Annual") || plan.name.includes("Premium") ? Crown : plan.name.includes("Pro") ? Crown : Star,
                        color:
                          plan.name.includes("Annual") || plan.name.includes("Premium")
                            ? "text-amber-500"
                            : plan.name.includes("Pro")
                              ? "text-violet-500"
                              : "text-sky-500",
                      })),
                    ]}
                  />

                  <SelectComponent
                    label="Trạng thái tài khoản"
                    value={formValues.status}
                    onChange={(val: string | string[]) => setValue("status", val as UserItem["status"], { shouldValidate: true })}
                    options={[
                      {
                        label: "Active (Hoạt động)",
                        value: "ACTIVE",
                        icon: CheckCircle2,
                        color: "text-emerald-500",
                      },
                      {
                        label: "Inactive (Tạm khóa)",
                        value: "INACTIVE",
                        icon: Clock,
                        color: "text-amber-500",
                      },
                      {
                        label: "Banned (Bị cấm)",
                        value: "BANNED",
                        icon: XCircle,
                        color: "text-rose-500",
                      },
                    ]}
                    disabled={shouldDisableFields}
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
