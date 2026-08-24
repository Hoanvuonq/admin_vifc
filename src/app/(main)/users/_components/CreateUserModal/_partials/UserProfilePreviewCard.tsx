"use client";

import { RoleBadge } from "@/app/(main)/users/_components/RoleBadge";
import { StatusBadge } from "@/components";
import { SubscriptionPlan } from "@/types/user";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import { Building2, Camera, Check, Clock, CreditCard, KeyRound, Mail, Phone, Plus, Shield, Verified, X } from "lucide-react";
import React from "react";
import { CreateUserFormData } from "../createUserSchema";

export interface UserProfilePreviewCardProps {
  formValues: CreateUserFormData;
  selectedPlan?: SubscriptionPlan;
  avatarFallback: { bg: string; text: string; char: string };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarClick: () => void;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: (e: React.MouseEvent) => void;
}

export const UserProfilePreviewCard: React.FC<UserProfilePreviewCardProps> = ({
  formValues,
  selectedPlan,
  avatarFallback,
  fileInputRef,
  onAvatarClick,
  onAvatarFileChange,
  onRemoveAvatar,
}) => {
  return (
    <div className="lg:col-span-4 relative flex flex-col">
      <div className="bg-linear-to-b from-white via-orange-50/20 to-white rounded-2xl p-6 border border-gray-100/90 shadow-custom flex flex-col items-center text-center h-full justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full flex flex-col items-center">
          <div className="relative mt-2">
            <input type="file" ref={fileInputRef} onChange={onAvatarFileChange} accept="image/png, image/jpeg, image/webp, image/gif" className="hidden" />

            <div
              onClick={onAvatarClick}
              className="w-32 h-32 relative overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-linear-to-br from-gray-100 to-orange-100/40 mb-4 group cursor-pointer flex items-center justify-center ring-4 ring-orange-500/10 hover:ring-orange-500/30 transition-all duration-300 isolate"
              title="Nhấn để thêm hoặc đổi ảnh đại diện"
            >
              {formValues.avatarUrl ? (
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

              <div className="absolute inset-0 rounded-2xl bg-slate-950/65 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
                  <Plus size={22} strokeWidth={3} className="text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-sm">
                  {formValues.avatarUrl ? "Đổi ảnh" : "Thêm ảnh"}
                </span>
              </div>

              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-0 transition-transform duration-200 z-10">
                <Camera size={13} className="text-orange-600" />
              </div>

              {formValues.avatarUrl && (
                <button
                  type="button"
                  onClick={onRemoveAvatar}
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
              {formValues.name?.trim() || "NEW MEMBER"}
              <Verified size={18} className="text-orange-500 fill-orange-50 shrink-0" />
            </h3>
            <div className="mt-2 flex items-center justify-center">
              <RoleBadge role={selectedPlan?.name || "FREE TIER"} className="shadow-sm border px-3 py-1 text-[11px] font-bold" />
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

          <div className="w-full h-px bg-gray-100" />

          <div className="flex items-center justify-between gap-3 text-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              <Clock size={14} className="text-gray-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ngày tạo</span>
            </div>
            <span className="text-[10.5px] font-bold text-gray-700">{dayjs().format("DD.MM.YYYY")}</span>
          </div>
        </div>

        {/* VIFC-PASS DIGITAL CARD PREVIEW */}
        {formValues.isVIFCPass && (
          <div className="w-full mt-3 p-4 rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-orange-950/80 text-white shadow-xl relative overflow-hidden text-left border border-orange-500/30 group/card animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <CreditCard size={14} className="text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">VIFC-PASS</span>
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
          <p className="text-[9.5px] text-orange-950/80 leading-snug font-medium">Tài khoản lưu trữ an toàn và đồng bộ cơ sở dữ liệu VIFC.</p>
        </div>
      </div>
    </div>
  );
};
