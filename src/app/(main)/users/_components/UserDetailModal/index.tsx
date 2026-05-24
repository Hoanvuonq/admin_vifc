"use client";

import { PortalModal } from "@/components";
import { UserItem } from "../../_pages/types";
import { InfoCard } from "./InfoCard";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { Shield, Fingerprint, Hash, Calendar, Clock, Activity, ShieldCheck, Mail, Phone, Building2, Globe, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader, SectionLoading } from "@/components";
import { User } from "@/types/user";

interface UserDetailModalProps {
  open: boolean;
  userId?: string | null;
  onClose: () => void;
}

/** Map raw API User → UserItem (same logic as useUsers hook) */
function mapUserToItem(user: User): UserItem {
  const statusMap: Record<string, UserItem["status"]> = {
    active: "ACTIVE",
    blocked: "BANNED",
    banned: "BANNED",
    inactive: "INACTIVE",
  };
  const status: UserItem["status"] = statusMap[user.status?.toLowerCase()] ?? "INACTIVE";
  return {
    id: user.id,
    name: user.full_name || user.email,
    email: user.email,
    role: (user.subscription?.plan?.name?.toUpperCase() ?? "FREE") as UserItem["role"],
    status,
    phone: "—",
    joinedDate: user.created_at ? user.created_at.split("T")[0] : "—",
    lastActive: user.updated_at ? user.updated_at.split("T")[0] : "—",
    avatar: user.avatar_url ?? undefined,
    company: user.company,
    title: user.title,
    country: user.country,
    auth_provider: user.auth_provider,
    subscription: user.subscription,
  };
}

export const UserDetailModal = ({
  open,
  userId,
  onClose,
}: UserDetailModalProps) => {
  const [user, setUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    setError(null);
    setUser(null);

    fetch(`/api/db/users/${userId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error?.message || "Fetch failed");
        return json.data as User;
      })
      .then((apiUser) => setUser(mapUserToItem(apiUser)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, userId]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title="Chi tiết tài khoản"
      description="Quản trị hệ thống"
      icon={Shield}
      width="max-w-4xl"
      className="max-h-[90vh]"
    >
      {loading ? (
        <SectionLoading message="Loading..." />
      ) : error ? (
        <div className="p-10 text-center text-rose-500 font-semibold">
          ⚠ {error}
        </div>
      ) : user ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-4">
          <ProfileHeaderCard
            user={user}
            statusLabelMap={{
              ACTIVE: "Đang hoạt động",
              INACTIVE: "Không hoạt động",
              BANNED: "Bị khóa",
            }}
          />

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-8">
              {/* Basic info */}
              <div className="p-8 rounded-[3rem] bg-slate-50/20 border border-slate-100/50 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
                <SectionHeader icon={Fingerprint} title="Thông tin cơ bản" description="System Governance & Identification" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  <InfoCard
                    label="Mã định danh (UID)"
                    value={`#${user.id.toUpperCase()}`}
                    icon={Hash}
                    className="md:col-span-2"
                    color="slate"
                  />
                  <InfoCard
                    label="Tên tài khoản"
                    value={user.name}
                    icon={ShieldCheck}
                  />
                  <InfoCard
                    label="Email liên hệ"
                    value={user.email}
                    icon={Mail}
                  />
                  <InfoCard
                    label="Ngày gia nhập"
                    value={user.joinedDate}
                    icon={Calendar}
                    color="emerald"
                  />
                  <InfoCard
                    label="Hoạt động cuối"
                    value={user.lastActive}
                    icon={Clock}
                    color="orange"
                  />
                  <InfoCard
                    label="Trạng thái hệ thống"
                    value={user.status}
                    icon={Activity}
                    color={user.status === "ACTIVE" ? "emerald" : "slate"}
                  />
                  <InfoCard
                    label="Nhà cung cấp xác thực"
                    value={user.auth_provider || "—"}
                    icon={ShieldCheck}
                    color="blue"
                  />
                  {user.company && (
                    <InfoCard
                      label="Công ty"
                      value={user.company}
                      icon={Building2}
                    />
                  )}
                  {user.country && (
                    <InfoCard
                      label="Quốc gia"
                      value={user.country}
                      icon={Globe}
                    />
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div className="p-8 rounded-[3rem] bg-slate-50/20 border border-slate-100/50 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
                <SectionHeader icon={CreditCard} title="Gói dịch vụ" description="Subscription & Plan Info" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  {user.subscription ? (
                    <>
                      <InfoCard
                        label="Tên gói"
                        value={user.subscription.plan?.name ?? "—"}
                        icon={CreditCard}
                        color="amber"
                        className="md:col-span-2"
                      />
                      <InfoCard
                        label="Giá gói"
                        value={user.subscription.plan?.price != null ? `$${user.subscription.plan.price.toLocaleString()}` : "—"}
                        icon={CreditCard}
                        color="emerald"
                      />
                      <InfoCard
                        label="Trạng thái"
                        value={user.subscription.status.toUpperCase()}
                        icon={Activity}
                        color="emerald"
                      />
                      <InfoCard
                        label="Ngày bắt đầu"
                        value={user.subscription.start_date?.split("T")[0] ?? "—"}
                        icon={Calendar}
                        color="blue"
                      />
                      <InfoCard
                        label="Ngày hết hạn"
                        value={user.subscription.end_date?.split("T")[0] ?? "—"}
                        icon={Clock}
                        color="orange"
                      />
                    </>
                  ) : (
                    <InfoCard
                      label="Gói hiện tại"
                      value="Free — Chưa đăng ký gói"
                      icon={CreditCard}
                      color="slate"
                      className="md:col-span-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 text-center text-gray-500">
          Không tìm thấy thông tin tài khoản.
        </div>
      )}
    </PortalModal>
  );
};
