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
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  Gem,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Unlock,
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

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit, onSave, onToggleBlock, onDelete }) => {
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
          isVIFCPass: Boolean(userToEdit.isVIFCPass || userToEdit.card),
          so_the: userToEdit.card?.so_the || "",
          loai_the: userToEdit.card?.loai_the || "DEFAULT",
          cardUsername: userToEdit.card?.username || userToEdit.name || "",
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
          isVIFCPass: false,
          so_the: "",
          loai_the: "DEFAULT",
          cardUsername: "",
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

  const cardTierOptions = useMemo(() => {
    const defaultTiers = [
      {
        label: "DEFAULT (Thẻ Mặc Định)",
        value: "DEFAULT",
        icon: CreditCard,
        color: "text-slate-500",
      },
      {
        label: "VIP (Hạng VIP)",
        value: "VIP",
        icon: Crown,
        color: "text-amber-500",
      },
      {
        label: "GOLD (Hạng Vàng)",
        value: "GOLD",
        icon: Star,
        color: "text-yellow-500",
      },
      {
        label: "PLATINUM (Hạng Bạch Kim)",
        value: "PLATINUM",
        icon: Sparkles,
        color: "text-cyan-500",
      },
      {
        label: "DIAMOND (Hạng Kim Cương)",
        value: "DIAMOND",
        icon: Gem,
        color: "text-purple-500",
      },
    ];

    if (formValues.loai_the && !defaultTiers.some((t) => t.value === formValues.loai_the)) {
      return [
        ...defaultTiers,
        {
          label: `${formValues.loai_the} (Hiện tại)`,
          value: formValues.loai_the,
          icon: CreditCard,
          color: "text-orange-500",
        },
      ];
    }
    return defaultTiers;
  }, [formValues.loai_the]);

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
      isVIFCPass: data.isVIFCPass,
      so_the: data.so_the?.trim() || undefined,
      loai_the: data.loai_the?.trim() || undefined,
      cardUsername: data.cardUsername?.trim() || undefined,
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
      className="h-[96vh] max-h-[96vh]"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Left Actions: Lock/Unlock & Delete when in edit mode */}
          <div className="flex items-center gap-2">
            {isEditMode && userToEdit && (
              <>
                {userToEdit.status === "BANNED" ? (
                  <button
                    type="button"
                    onClick={() => onToggleBlock?.(userToEdit.id, "ACTIVE")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all cursor-pointer border border-emerald-200/60 active:scale-95 shadow-2xs"
                  >
                    <Unlock size={14} className="text-emerald-600" />
                    <span>Mở khóa tài khoản</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleBlock?.(userToEdit.id, "BANNED")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all cursor-pointer border border-amber-200/60 active:scale-95 shadow-2xs"
                  >
                    <Lock size={14} className="text-amber-600" />
                    <span>Khóa tài khoản</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDelete?.(userToEdit.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer border border-rose-200/60 active:scale-95 shadow-2xs"
                >
                  <Trash2 size={14} className="text-rose-600" />
                  <span>Xóa tài khoản</span>
                </button>
              </>
            )}

            {!isEditMode && (
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-gray-500">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Tài khoản tự động áp dụng chính sách bảo mật hệ thống On-Chainpass</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />

            <PremiumButton
              label={isEditMode ? "Lưu thay đổi" : "Tạo tài khoản"}
              icon={isEditMode ? Save : UserPlus}
              onClick={handleSubmit(onSubmit)}
              size="md"
              isLoading={isSubmitting}
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-300 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-stretch">
          <div className="lg:col-span-4 relative flex flex-col">
            <div className="bg-linear-to-b from-white via-orange-50/20 to-white rounded-2xl p-2 border border-gray-100/90 shadow-custom flex flex-col items-center text-center h-full justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
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

                  <div
                    onClick={handleAvatarClick}
                    className={cn(
                      "w-32 h-32 relative overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-linear-to-br from-gray-100 to-orange-100/40 mb-4 group flex items-center justify-center ring-4 ring-orange-500/10 transition-all duration-300 isolate",
                      shouldDisableFields ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:ring-orange-500/30 hover:scale-[1.02]",
                    )}
                    title={shouldDisableFields ? "Không thể đổi ảnh khi có gói hoạt động" : "Nhấn để thêm hoặc đổi ảnh đại diện"}
                  >
                    {formValues.avatarUrl && !formValues.avatarUrl.includes("api.dicebear.com") ? (
                      <img
                        src={formValues.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-full h-full rounded-2xl flex items-center justify-center font-extrabold text-5xl transition-transform duration-500 group-hover:scale-105 select-none",
                          avatarFallback.bg,
                          avatarFallback.text,
                        )}
                      >
                        {avatarFallback.char}
                      </div>
                    )}

                    {!shouldDisableFields && (
                      <div className="absolute inset-0 rounded-2xl bg-slate-950/65 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
                          <Plus size={22} strokeWidth={3} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-sm">
                          {formValues.avatarUrl ? "Đổi ảnh" : "Thêm ảnh"}
                        </span>
                      </div>
                    )}

                    {!shouldDisableFields && (
                      <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-0 transition-transform duration-200 z-10">
                        <Camera size={13} className="text-orange-600" />
                      </div>
                    )}

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

              <div className="w-full mt-4 space-y-3 rounded-2xl p-4 border border-gray-100 bg-white/80 backdrop-blur-md shadow-xs text-left">
                <div className="flex items-center justify-between gap-3 text-gray-600">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail size={14} className="text-orange-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 truncate max-w-32.5" title={formValues.email}>
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
                  <span className="text-[11px] font-semibold text-gray-800 truncate max-w-32.5" title={formValues.company}>
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

              {formValues.isVIFCPass && (
                <div className="w-full mt-3 p-4 rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-orange-950/80 text-white shadow-xl relative overflow-hidden text-left border border-orange-500/30 group/card animate-in fade-in zoom-in-95 duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-orange-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">ON-CHAINPASS</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30">
                      {formValues.loai_the || selectedPlan?.name || "MEMBER"}
                    </span>
                  </div>
                  <div className="font-mono text-base font-black tracking-widest text-white mb-2 text-shadow-sm">#{formValues.so_the || "00001"}</div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/10">
                    <span className="font-bold text-gray-200 uppercase truncate max-w-32.5">{formValues.cardUsername || formValues.name || "CARDHOLDER"}</span>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
                    </span>
                  </div>
                </div>
              )}

              <div className="w-full mt-3 p-2.5 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-2 text-left">
                <Shield size={14} className="text-orange-600 shrink-0" />
                <p className="text-[9.5px] text-orange-950/80 leading-snug font-medium">
                  {isEditMode
                    ? "Thông tin được cập nhật theo chính sách phân quyền quản trị On-Chainpass."
                    : "Tài khoản lưu trữ an toàn và đồng bộ cơ sở dữ liệu On-Chainpass."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between h-full overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-4">
              {hasActiveSubscription && (
                <div className="rounded-2xl bg-orange-50/80 border border-orange-200/80 p-3.5 text-orange-700 text-xs font-medium flex items-center gap-2.5">
                  <Shield size={15} className="text-orange-500 shrink-0" />
                  <span>Người dùng hiện có gói hội viên đang hoạt động. Bạn có thể chỉnh sửa thẻ, chuyển gói hoặc thay đổi trạng thái tài khoản.</span>
                </div>
              )}

              <div className="divide-y space-y-8 p-1 divide-gray-100/80">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Thông tin cá nhân & Liên hệ</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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
                      placeholder="Ví dụ: an.nguyen@onchainpass.io"
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
                      label="Công ty / Doanh nghiệp"
                      placeholder="Ví dụ: On-Chainpass Global Lab / Tech Corp"
                      {...register("company")}
                      error={errors.company?.message}
                    />

                    <FormInput label="Quốc gia" placeholder="Ví dụ: Việt Nam" {...register("country")} error={errors.country?.message} />
                  </div>
                </div>

                {!isEditMode && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">2</div>
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Mật khẩu khởi tạo</h4>
                          <p className="text-[11px] text-gray-400">Mật khẩu đăng nhập ban đầu cho tài khoản</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 transition-all cursor-pointer border border-orange-500/20 active:scale-95"
                      >
                        <Sparkles size={13} className="text-orange-600 group-hover:rotate-12 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Gợi ý mật khẩu</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5 relative">
                        <FormInput
                          label="Mật khẩu ban đầu"
                          placeholder="Nhập mật khẩu..."
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          error={errors.password?.message}
                        />
                        <div className="absolute right-3 top-[34px] flex items-center gap-1 text-gray-400">
                          {formValues.password && (
                            <button
                              type="button"
                              onClick={handleCopyPassword}
                              className="p-1 hover:text-orange-500 transition-colors"
                              title="Sao chép mật khẩu"
                            >
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
                  </div>
                )}

                <div className=" space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                      {isEditMode ? "2" : "3"}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Gói Hội Viên & Trạng Thái</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                        {isEditMode ? "3" : "4"}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
                          Thẻ Định Danh & On-Chainpass
                          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">Member Card</span>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectComponent
                        label="Trạng thái thẻ On-Chainpass"
                        value={formValues.isVIFCPass ? "ACTIVE" : "INACTIVE"}
                        onChange={(val: string | string[]) => {
                          const isActive = val === "ACTIVE";
                          setValue("isVIFCPass", isActive, { shouldValidate: true });
                          if (isActive && !formValues.cardUsername) {
                            setValue("cardUsername", formValues.name?.toUpperCase() || "", { shouldValidate: true });
                          }
                        }}
                        options={[
                          {
                            label: "Chưa cấp thẻ / Tắt thẻ (Inactive)",
                            value: "INACTIVE",
                            icon: XCircle,
                            color: "text-slate-400",
                          },
                          {
                            label: "Đã cấp thẻ On-Chainpass (Active)",
                            value: "ACTIVE",
                            icon: CheckCircle2,
                            color: "text-emerald-500",
                          },
                        ]}
                      />

                      {formValues.isVIFCPass && (
                        <SelectComponent
                          label="Hạng thẻ / Loại thẻ (Card Tier)"
                          value={formValues.loai_the || "DEFAULT"}
                          onChange={(val: string | string[]) => setValue("loai_the", val as string, { shouldValidate: true })}
                          options={cardTierOptions}
                        />
                      )}
                    </div>

                    {formValues.isVIFCPass && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-dashed border-gray-200/80 animate-in fade-in duration-300">
                        <FormInput
                          label="Mã số thẻ (Card Number / ID)"
                          placeholder="Ví dụ: 00001 hoặc OCP-9999"
                          {...register("so_the")}
                          error={errors.so_the?.message}
                        />

                        <FormInput
                          label="Tên in trên thẻ (Cardholder Name)"
                          placeholder="Ví dụ: NGUYEN VAN AN"
                          {...register("cardUsername")}
                          error={errors.cardUsername?.message}
                        />
                      </div>
                    )}
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
