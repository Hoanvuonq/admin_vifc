import { ActionTooltipBtn, ItemImage, StatusBadge } from "@/components";
import { BookingRequestItem } from "@/types/course";
import { Building, CheckCircle2, Clock, Eye, Trash2, XCircle } from "lucide-react";
import { BookingTypeBadge } from "../_components/BookingTypeBadge";

export const getColumns = (
  handleViewDetails: (item: BookingRequestItem) => void,
  handleQuickApprove: (item: BookingRequestItem) => void,
  handleQuickReject: (item: BookingRequestItem) => void,
  handleDelete: (item: BookingRequestItem) => void,
) => [
  {
    header: "Học Viên & Liên Hệ",
    accessor: "full_name" as keyof BookingRequestItem,
    render: (item: BookingRequestItem) => {
      const orderCode = `#${item.id.slice(0, 8).toUpperCase()}`;
      const statusLower = (item.status || "pending").toLowerCase();
      const isApproved = statusLower === "confirmed" || statusLower === "approved" || statusLower === "completed";
      const isRejected = statusLower === "rejected" || statusLower === "cancelled";

      const avatarUrl =
        item.users?.avatar_url ||
        item.avatar_url ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.email || item.full_name || "guest")}`;

      return (
        <div className="flex items-center gap-3 py-1">
          <div className="relative select-none shrink-0">
            <ItemImage path={avatarUrl} productName={item.full_name || item.email} className="w-14 h-14 shrink-0 rounded-2xl" />
            {isApproved ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            ) : isRejected ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
            ) : (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-700 tracking-tight group-hover:text-gray-800 transition-colors flex items-center gap-1.5">
              {item.full_name || "Chưa đặt tên"}
              <span className="px-1.5 py-0.5 rounded-md bg-orange-50 text-[9px] font-bold text-orange-600 border border-orange-100/60 font-mono tracking-wide">
                {orderCode}
              </span>
            </span>
            <span className="text-xs  text-gray-700 font-medium select-text">{item.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Khóa Học & Dịch Vụ",
    accessor: "booking_title" as keyof BookingRequestItem,
    render: (item: BookingRequestItem) => (
      <div className="flex flex-col py-1">
        <div className="flex items-center gap-2 mb-1">
          <BookingTypeBadge type={item.booking_type} />
        </div>
        <span className="font-bold text-[13px] text-gray-700 line-clamp-1 group-hover:text-gray-800 transition-colors max-w-70" title={item.booking_title}>
          {item.booking_title || "Yêu cầu đặt chỗ"}
        </span>
        {item.company && (
          <span className="text-[11px]  text-gray-700 font-medium truncate mt-0.5 flex items-center gap-1">
            <Building size={10} className=" text-gray-700 shrink-0" />
            {item.company}
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Số Điện Thoại",
    accessor: "phone" as keyof BookingRequestItem,
    render: (item: BookingRequestItem) => <span className="text-gray-600 font-bold font-mono tracking-tight select-text">{item.phone || "--"}</span>,
  },
  {
    header: "Ngày Đăng Ký",
    accessor: "created_at" as keyof BookingRequestItem,
    render: (item: BookingRequestItem) => {
      const createdDate = new Date(item.created_at);
      const isValid = !isNaN(createdDate.getTime());

      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} className=" text-gray-700" />
          <span className="text-xs font-semibold">
            {isValid
              ? createdDate.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "--"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Trạng Thái",
    accessor: "status" as keyof BookingRequestItem,
    render: (item: BookingRequestItem) => <StatusBadge status={item.status} variant="premium" />,
  },
  {
    header: "Thao Tác",
    align: "center" as const,
    render: (item: BookingRequestItem) => {
      const isPending = (item.status || "").toLowerCase() === "pending";

      return (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {isPending && (
            <>
              <ActionTooltipBtn onClick={() => handleQuickApprove(item)} icon={<CheckCircle2 size={14} />} color="green" tooltip="Xác nhận đơn" />
              <ActionTooltipBtn onClick={() => handleQuickReject(item)} icon={<XCircle size={14} />} color="red" tooltip="Từ chối đơn" />
            </>
          )}
          <ActionTooltipBtn onClick={() => handleViewDetails(item)} icon={<Eye size={14} />} color="blue" tooltip="Xem chi tiết & Cập nhật" />
          <ActionTooltipBtn onClick={() => handleDelete(item)} icon={<Trash2 size={14} />} color="red" tooltip="Xóa đơn" />
        </div>
      );
    },
  },
];
