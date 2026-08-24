"use client";

import { FormInput, SectionHeader, SelectComponent } from "@/components";
import { validatePasswordStrength } from "@/hooks/passwordGenerator";
import { SubscriptionPlan } from "@/types/user";
import { cn } from "@/utils/cn";
import { CheckCircle2, Clock, CreditCard, Crown, Gem, KeyRound, Sparkles, Star, User, XCircle } from "lucide-react";
import React, { useMemo } from "react";
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
  setShowPassword,
  handleGeneratePassword,
  passwordStrength,
  subscriptionPlans,
}) => {
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

  return (
    <div className="lg:col-span-8 flex flex-col justify-between h-full overflow-y-auto pr-2 custom-scrollbar">
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
              <FormInput label="Họ và tên đầy đủ" placeholder="Ví dụ: Nguyễn Văn An" {...register("name")} error={errors.name?.message} required />
            </div>

            <FormInput
              label="Địa chỉ Email"
              placeholder="Ví dụ: an.nguyen@onchainpass.io"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              required
            />

            <FormInput label="Số điện thoại" placeholder="Ví dụ: 0912 345 678" type="tel" {...register("phone")} error={errors.phone?.message} />

            <FormInput
              label="Công ty / Doanh nghiệp"
              placeholder="Ví dụ: On-Chainpass Global Lab / Tech Corp"
              {...register("company")}
              error={errors.company?.message}
            />

            <FormInput label="Quốc gia" placeholder="Ví dụ: Việt Nam" {...register("country")} error={errors.country?.message} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">2</div>
              <div>
                <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Mật khẩu khởi tạo</h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeneratePassword}
              className="group inline-flex items-center gap-1.5  text-orange-700 transition-all cursor-pointer"
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
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-gray-600">Độ mạnh mật khẩu:</span>
                <span
                  className={cn(
                    "font-bold text-[10px] uppercase tracking-wider",
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

        {/* SECTION 3: SUBSCRIPTION PLAN & STATUS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">3</div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">Gói Hội Viên & Trạng Thái</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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
              onChange={(val: any) =>
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

        {/* SECTION 4: ON-CHAINPASS MEMBER CARD */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">4</div>
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
                value={formValues.isVIFCPass || false}
                onChange={(val: any) => {
                  const isPass = Boolean(val);
                  setValue("isVIFCPass", isPass, { shouldValidate: true });
                  if (isPass && !formValues.cardUsername) {
                    setValue("cardUsername", formValues.name?.toUpperCase() || "", { shouldValidate: true });
                  }
                }}
                options={[
                  {
                    label: "Chưa cấp thẻ On-Chainpass (Inactive)",
                    value: false,
                    icon: XCircle,
                    color: "text-slate-400",
                  },
                  {
                    label: "Đã cấp thẻ On-Chainpass (Active)",
                    value: true,
                    icon: CheckCircle2,
                    color: "text-emerald-500",
                  },
                ]}
              />

              {formValues.isVIFCPass && (
                <SelectComponent
                  label="Hạng thẻ / Loại thẻ (Card Tier)"
                  value={formValues.loai_the || "DEFAULT"}
                  onChange={(val: any) => setValue("loai_the", val as string, { shouldValidate: true })}
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
  );
};
