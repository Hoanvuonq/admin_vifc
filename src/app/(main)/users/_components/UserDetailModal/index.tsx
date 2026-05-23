/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SectionHeader, SectionLoading } from "@/components";
import { PortalModal } from "@/features";
import {
  EmployeeStatus,
  employeeStatusLabelMap,
  Gender,
  genderLabelMap,
  shopLabelMap,
  ShopStatus,
  statusLabelMap,
  UserDetail,
} from "@/modules/users/_types/user.type";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Activity,
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Fingerprint,
  Globe,
  Hash,
  Lock,
  Palmtree,
  Shield,
  ShieldCheck,
  Store,
  User as UserIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetUserDetail } from "@/modules/users";
import { workerTypeLabelMap } from "../../../personnel/_types/employee.type";
import { InfoCard } from "../InfoCard";
import { ProfileHeaderCard } from "../ProfileHeaderCard";
import { getRoleBadgeStyle } from "../../_constants/users";

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
  const { handleGetUserDetail, loading, error } = useGetUserDetail();
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    if (!open || !userId) return;
    const fetchDetail = async () => {
      try {
        const data = await handleGetUserDetail(userId);
        setUser(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [open, userId]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title="Chi tiết tài khoản"
      description="Quản trị hệ thống"
      icon={Shield}
      width="max-w-4xl"
    >
      {loading ? (
        <SectionLoading message="Đang giải mã dữ liệu..." />
      ) : error ? (
        <div className="m-4 p-10 bg-rose-50 border border-rose-100 rounded-[3rem] text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} />
          </div>
          <h4 className="text-rose-900 font-bold uppercase text-sm mb-2">
            Truy xuất thất bại
          </h4>
          <p className="text-rose-600/70 text-xs font-medium">{error}</p>
        </div>
      ) : user ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-4">
          <ProfileHeaderCard
            user={user}
            statusLabelMap={statusLabelMap}
            getRoleBadgeStyle={getRoleBadgeStyle}
          />

          {(user as any).lockedAt && (
            <div className="mx-2 p-6 rounded-[2.5rem] bg-rose-50 border border-rose-200 flex items-start gap-4 shadow-sm animate-in zoom-in-95 duration-500">
              <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg">
                <Lock size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-rose-900 font-bold uppercase text-xs mb-1">Tài khoản bị hạn chế truy cập</h4>
                <p className="text-rose-700/80 text-[11px] font-medium leading-relaxed">
                  Lý do quản chế: <span className="font-bold underline italic text-rose-800">"{(user as any).reason || "Vi phạm quy định vận hành hệ thống"}"</span>.
                  Hệ thống đã tạm ngưng toàn bộ quyền hạn của thực thể này từ ngày {dayjs((user as any).lockedAt).format("DD/MM/YYYY")}.
                </p>
              </div>
            </div>
          )}

          {(!user.buyer?.fullName || (user.shop && !user.shop.shopName) || (user.buyer && user.buyer.phone === "-")) && (
            <div className="mx-2 p-6 rounded-[2.5rem] bg-orange-50 border border-orange-200 flex items-start gap-4 shadow-sm animate-in zoom-in-95 duration-500">
              <div className="p-3 rounded-2xl bg-orange-500 text-white shadow-lg">
                <AlertCircle size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-orange-900 font-bold uppercase text-xs mb-1">Hệ thống ghi nhận thiếu sót dữ liệu</h4>
                <p className="text-orange-700/80 text-[11px] font-medium leading-relaxed">
                  Tài khoản đang thiếu các thuộc tính định danh cơ bản:
                  {!user.buyer?.fullName && <span className="font-bold underline ml-1">Chưa đặt tên thật</span>}
                  {(user.buyer && user.buyer.phone === "-") && <span className="font-bold underline ml-1">Chưa cập nhật SĐT</span>}
                  {(user.shop && !user.shop.shopName) && <span className="font-bold underline ml-1">Shop chưa có tên</span>}
                  . Điều này có thể ảnh hưởng đến quy trình vận hành và đối soát.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-8">
              <div className="p-8 rounded-[3rem] bg-slate-50/20 border border-slate-100/50 relative group overflow-hidden">
                <div className={cn("absolute top-0 right-0 w-64 h-64 bg-orange-500/5 ",
                  "rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50")}
                />
                <SectionHeader icon={Fingerprint} title="Cấu hình thực thể" description="System Governance & Identification" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  <InfoCard
                    label="Mã định danh (UID)"
                    value={`#${(user.userId || "").toUpperCase()}`}
                    icon={Hash}
                    className="md:col-span-2"
                    color="slate"
                  />
                  <InfoCard
                    label="Hội viên từ"
                    value={dayjs((user as any).createdAt || (user as any).createdDate).format("DD/MM/YYYY")}
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Xác thực Email"
                    value={(user as any).emailVerifiedAt ? dayjs((user as any).emailVerifiedAt).format("DD/MM/YYYY") : "Chưa xác thực"}
                    icon={ShieldCheck}
                    color={(user as any).emailVerifiedAt ? "emerald" : "orange"}
                  />
                  <InfoCard
                    label="Cập nhật cuối"
                    value={dayjs((user as any).lastModifiedAt || (user as any).lastModifiedDate).format("DD/MM/YYYY HH:mm")}
                    icon={Clock}
                  />
                  <InfoCard
                    label="Phiên bản dữ liệu"
                    value={`v${user.version || 1}.0`}
                    icon={Activity}
                  />
                </div>
              </div>

              {user.buyer && (
                <div className="p-8 rounded-[3rem] bg-blue-50/20 border border-blue-100/50 border-l-12 border-l-blue-500 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                  <SectionHeader
                    icon={UserIcon}
                    title="Hồ sơ Khách hàng"
                    description="Personal Profile & Consumer Data"
                    colorClass="text-blue-600"
                    bgClass="bg-blue-100"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                    <InfoCard
                      label="Họ và tên"
                      value={user.buyer.fullName}
                      icon={UserIcon}
                      className="md:col-span-2"
                      color="blue"
                      suggestion="User chưa đặt tên chính thức"
                    />
                    <InfoCard label="Giới tính" value={user.buyer.gender ? genderLabelMap[user.buyer.gender as Gender] : null} icon={Activity} className="md:col-span-1" color="blue" />
                    <InfoCard label="Số điện thoại" value={user.buyer.phone === "-" ? null : user.buyer.phone} icon={Hash} color="blue" suggestion="Chưa có thông tin liên lạc" />
                    <InfoCard label="Ngày sinh" value={user.buyer.dateOfBirth ? dayjs(user.buyer.dateOfBirth).format("DD/MM/YYYY") : null} icon={Calendar} color="blue" />
                    <InfoCard label="Tình trạng hồ sơ" value={(user.buyer as any).profileCompleted ? "Hoàn tất" : "Cần hoàn thiện"} icon={CheckCircle2} color={(user.buyer as any).profileCompleted ? "emerald" : "orange"} />
                  </div>
                </div>
              )}

              {user.shop && (
                <div className="p-8 rounded-[3rem] bg-emerald-50/20 border border-emerald-100/50 border-l-12 border-l-emerald-500 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                  <SectionHeader
                    icon={Store}
                    title="Hồ sơ Đối tác"
                    description="Merchant Management & Operations"
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-100"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                    <InfoCard label="Tên đối tác" value={user.shop.shopName} icon={Store} className="md:col-span-2" color="emerald" suggestion="Thương hiệu chưa được đặt tên" />
                    <InfoCard label="Hệ thống Slug" value={(user.shop as any).slug} icon={Globe} color="emerald" />
                    <InfoCard label="Vận hành" value={shopLabelMap[user.shop.status as ShopStatus]} icon={Activity} color="emerald" />
                    <InfoCard label="Nghỉ lễ" value={(user.shop as any).onVacation ? "Bật" : "Tắt"} icon={Palmtree} color={(user.shop as any).onVacation ? "orange" : "emerald"} />
                    <InfoCard label="Mã định danh Shop" value={`#${user.shop.shopId.slice(-8).toUpperCase()}`} icon={Fingerprint} color="emerald" />
                    <div className="md:col-span-3">
                      <div className="p-6 rounded-4xl bg-slate-50 border border-slate-100 flex flex-col gap-2 relative overflow-hidden group/desc">
                        {!user.shop.description && (
                          <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 text-[9px] font-bold rounded-full animate-bounce">
                            THIẾU MÔ TẢ <AlertCircle size={10} />
                          </div>
                        )}
                        <span className="text-[10px] font-bold uppercase text-gray-600 tracking-widest">Sứ mệnh & Mô tả kinh doanh</span>
                        <p className={cn("text-sm font-medium leading-relaxed italic", user.shop.description ? "text-gray-600" : "text-gray-500")}>
                          {user.shop.description || "Đối tác chưa cung cấp thông tin giới thiệu doanh nghiệp."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.employee && (
                <div className="p-8 rounded-[3.5rem] bg-purple-50/20 border border-purple-100/50 border-l-12 border-l-purple-500 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                  <SectionHeader
                    icon={Briefcase}
                    title="Hồ sơ Nhân sự"
                    description="Personnel Allocation & Corporate Role"
                    colorClass="text-purple-600"
                    bgClass="bg-purple-100"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <InfoCard label="Phòng ban" value={user.employee.departmentName} icon={Briefcase} color="purple" suggestion="Chưa gán phòng ban" />
                    <InfoCard label="Chức vụ" value={user.employee.positionName} icon={Shield} color="purple" suggestion="Chưa xác định chức vụ" />
                    <InfoCard label="Hình thức" value={workerTypeLabelMap[user.employee.type as keyof typeof workerTypeLabelMap] || user.employee.type} icon={Activity} color="purple" />
                    <InfoCard label="Ngày thực thi" value={dayjs(user.employee.startDate).format("DD/MM/YYYY")} icon={Calendar} color="purple" />
                    <InfoCard label="Trạng thái công tác" value={employeeStatusLabelMap[user.employee.status as EmployeeStatus]} icon={Activity} className="md:col-span-2" color="purple" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </PortalModal>
  );
};