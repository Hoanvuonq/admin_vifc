"use client";

import { PortalModal, PremiumButton } from "@/components";
import { getAvatarFallback } from "@/hooks/avatar.utils";
import { generateSecurePassword, validatePasswordStrength } from "@/hooks/passwordGenerator";
import { toast } from "@/providers/ToastProvider";
import { SubscriptionPlan } from "@/types/user";
import { ShieldCheck, UserPlus } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { UserFormFields, UserProfilePreviewCard } from "./_partials";
import { CreateUserFormData, useCreateUserForm } from "./createUserSchema";
import { CreateUserModalProps } from "./type";

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onSave, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useCreateUserForm();

  const formValues = watch();

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  useEffect(() => {
    if (open) {
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open, reset]);

  const handleAvatarClick = () => {
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

  const onSubmit = async (data: CreateUserFormData) => {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || "",
      password: data.password || undefined,
      status: data.status,
      isVIFCPass: data.isVIFCPass || false,
      so_the: data.so_the?.trim() || undefined,
      loai_the: data.loai_the?.trim() || undefined,
      cardUsername: data.cardUsername?.trim() || undefined,
      avatarFile: data.avatarFile || null,
      avatarUrl: data.avatarUrl || "",
      subscriptionPlanId: data.subscriptionPlanId || undefined,
      company: data.company?.trim() || undefined,
      country: data.country?.trim() || undefined,
    };
    if (onSave) return await onSave(payload);
    try {
      const res = await fetch("/api/db/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          full_name: payload.name,
          card_username: payload.cardUsername,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || "Không thể tạo người dùng mới");
      }

      toast.success(`Đã tạo tài khoản ${data.name} thành công!`);
      reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi tạo tài khoản người dùng");
    }
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title="Tạo mới Người dùng & Tài khoản Thành viên"
      description="Thiết lập thông tin tài khoản, gói hội viên và thông tin bảo mật ban đầu."
      icon={UserPlus}
      width="max-w-5xl"
      className="h-[96vh] max-h-[96vh]"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Tài khoản tự động áp dụng chính sách bảo mật hệ thống VIFC</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />
            <PremiumButton label="Tạo tài khoản" icon={UserPlus} onClick={handleSubmit(onSubmit)} size="md" isLoading={isSubmitting} />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-300 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-stretch">
          <UserProfilePreviewCard
            formValues={formValues}
            selectedPlan={selectedPlan}
            avatarFallback={avatarFallback}
            fileInputRef={fileInputRef}
            onAvatarClick={handleAvatarClick}
            onAvatarFileChange={handleAvatarFileChange}
            onRemoveAvatar={handleRemoveAvatar}
          />

          <UserFormFields
            register={register}
            errors={errors}
            formValues={formValues}
            setValue={setValue}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleGeneratePassword={handleGeneratePassword}
            passwordStrength={passwordStrength}
            subscriptionPlans={subscriptionPlans}
          />
        </div>
      </form>
    </PortalModal>
  );
};
