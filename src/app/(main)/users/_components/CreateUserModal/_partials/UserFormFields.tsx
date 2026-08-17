"use client";

import { FormInput, SectionHeader, SelectComponent } from "@/components";
import { validatePasswordStrength } from "@/hooks/passwordGenerator";
import { SubscriptionPlan } from "@/types/user";
import { cn } from "@/utils/cn";
import { CheckCircle2, Clock, Crown, Gem, KeyRound, Sparkles, Star, User, XCircle } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { UserItem } from "../../../_pages/types";
import { CreateUserFormData } from "../createUserSchema";

export interface UserFormFieldsProps {
  register: UseFormRegister<CreateUserFormData>;
  errors: FieldErrors<CreateUserFormData>;
  formValues: CreateUserFormData;
  setValue: UseFormSetValue<CreateUserFormData>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleGeneratePassword: () => void;
  passwordStrength: ReturnType<typeof validatePasswordStrength> | null;
  subscriptionPlans: SubscriptionPlan[];
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  register,
  errors,
  formValues,
  setValue,
  showPassword,
  handleGeneratePassword,
  passwordStrength,
  subscriptionPlans,
}) => {
  return (
    <div className="lg:col-span-8 space-y-4 flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Section 1: Personal info */}
        <div className="space-y-4">
          <SectionHeader icon={User} title="Thông tin cá nhân & Liên hệ" description="Họ tên, email và số điện thoại liên lạc" size="sm" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormInput label="Họ và tên đầy đủ" placeholder="Ví dụ: Nguyễn Văn An" {...register("name")} error={errors.name?.message} required />
            </div>

            <FormInput
              label="Địa chỉ Email"
              placeholder="Ví dụ: an.nguyen@vifc.io"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              required
            />

            <FormInput label="Số điện thoại" placeholder="Ví dụ: 0912 345 678" type="tel" {...register("phone")} error={errors.phone?.message} />

            <FormInput label="Công ty / Đơn vị" placeholder="Ví dụ: VIFC Technology" {...register("company")} error={errors.company?.message} />

            <FormInput label="Quốc gia" placeholder="Ví dụ: Việt Nam" {...register("country")} error={errors.country?.message} />
          </div>
        </div>

        {/* Section 2: Password */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <SectionHeader icon={KeyRound} title="Mật khẩu khởi tạo" description="Mật khẩu đăng nhập ban đầu cho tài khoản" size="sm" />
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
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={errors.password?.message}
              />
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
                    passwordStrength.strength === "strong" ? "text-emerald-600" : passwordStrength.strength === "medium" ? "text-amber-600" : "text-rose-600",
                  )}
                >
                  {passwordStrength.strength === "strong" ? "Rất mạnh (Strong)" : passwordStrength.strength === "medium" ? "Trung bình (Medium)" : "Yếu (Weak)"}
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

        {/* Section 3: Subscription & Status */}
        <div className="space-y-4">
          <SectionHeader icon={Gem} title="Gói Hội Viên & Trạng Thái Tài Khoản" description="Cấu hình gói dịch vụ và trạng thái hoạt động" size="sm" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectComponent
              label="Gói hội viên (Subscription Plan)"
              value={formValues.subscriptionPlanId || ""}
              onChange={(val: string | string[]) =>
                setValue("subscriptionPlanId", val as string, {
                  shouldValidate: true,
                })
              }
              options={[
                {
                  label: "Free Tier (Mặc định)",
                  value: "",
                  icon: User,
                  color: "text-slate-500",
                },
                ...subscriptionPlans.map((plan) => ({
                  label: plan.name,
                  value: plan.id,
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
              onChange={(val: string | string[]) =>
                setValue("status", val as UserItem["status"], {
                  shouldValidate: true,
                })
              }
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};
