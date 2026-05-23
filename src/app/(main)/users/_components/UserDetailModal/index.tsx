"use client";

import { PortalModal } from "@/components";
import { UserItem } from "../../_pages/types";
import { InfoCard } from "./InfoCard";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { Shield, Fingerprint, Hash, Calendar, Clock, Activity, ShieldCheck, Mail, Phone } from "lucide-react";
import { INITIAL_USERS } from "../../_constants/users.constants";
import { useEffect, useState } from "react";
import { SectionHeader, SectionLoading } from "@/components";

interface UserDetailModalProps {
  open: boolean;
  userId?: string | null;
  onClose: () => void;
}

export const UserDetailModal = ({
  open,
  userId,
  onClose,
}: UserDetailModalProps) => {
  const [user, setUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    setTimeout(() => {
      const found = INITIAL_USERS.find((u: UserItem) => u.id === userId);
      setUser(found || null);
      setLoading(false);
    }, 500);
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
        <SectionLoading message="Đang giải mã dữ liệu..." />
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
                    label="Số điện thoại"
                    value={user.phone}
                    icon={Phone}
                    color="blue"
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