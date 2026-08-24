import { ItemImage, ActionTooltipBtn, StatusBadge } from "@/components";
import { Building2, Calendar, CreditCard, History, Pencil } from "lucide-react";
import { UserItem } from "./types";
import { RoleBadge } from "../_components/RoleBadge";
import dayjs from "dayjs";

export const getColumns = (
  handleCycleRole: (id: string) => void,
  handleEditUser: (user: UserItem) => void,
  handleToggleBlock: (id: string, status: "ACTIVE" | "BANNED") => void,
  handleDeleteUser: (id: string) => void,
  handleViewPaymentHistory: (id: string) => void,
  handleViewUserDetail: (id: string) => void,
) => [
  {
    header: "Người dùng & Email",
    accessor: "name" as keyof UserItem,
    render: (user: UserItem) => (
      <div className="flex items-center gap-3 py-1">
        <div className="relative select-none shrink-0">
          <ItemImage
            path={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
            productName={user.name}
            className="w-10 h-10 rounded-xl shrink-0"
          />
          {user.status === "ACTIVE" ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
          ) : user.status === "BANNED" ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-xs" />
          ) : (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-xs" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-900 text-[13px] tracking-tight group-hover:text-orange-600 transition-colors truncate max-w-[180px]">
              {user.name}
            </span>
            {user.auth_provider === "google" && (
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[9px] font-bold text-blue-600 border border-blue-100 uppercase">Google</span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-normal truncate max-w-[200px] select-text">{user.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Thẻ VIFC-Pass",
    accessor: "card" as keyof UserItem,
    render: (user: UserItem) => {
      if (!user.card) {
        return <span className="text-xs text-gray-400 font-medium italic">Chưa cấp thẻ</span>;
      }
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50/80 border border-orange-200/70 text-orange-800 shadow-2xs">
          <CreditCard size={12} className="text-orange-600 shrink-0" />
          <span className="font-mono font-bold text-xs text-orange-950 tracking-wide">#{user.card.so_the}</span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-200/50 text-orange-800">
            {user.card.loai_the || "DEFAULT"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Gói Hội Viên",
    accessor: "role" as keyof UserItem,
    render: (user: UserItem) => <RoleBadge role={user.subscription?.plan?.name || user.role || "FREE"} />,
  },
  {
    header: "Doanh nghiệp",
    accessor: "company" as keyof UserItem,
    render: (user: UserItem) => (
      <div className="flex items-center gap-1.5 text-gray-700">
        <Building2 size={13} className="text-gray-400 shrink-0" />
        <span className="text-xs font-semibold truncate max-w-[130px]" title={user.company || "Cá nhân"}>
          {user.company || "Cá nhân"}
        </span>
      </div>
    ),
  },
  {
    header: "Ngày tham gia",
    accessor: "joinedDate" as keyof UserItem,
    render: (user: UserItem) => {
      const formattedDate =
        user.joinedDate && user.joinedDate !== "—" && dayjs(user.joinedDate).isValid() ? dayjs(user.joinedDate).format("DD/MM/YYYY") : user.joinedDate;

      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar size={12} className="text-gray-400 shrink-0" />
          <span className="text-xs font-medium font-mono text-gray-600">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    accessor: "status" as keyof UserItem,
    render: (user: UserItem) => <StatusBadge status={user.status} variant="premium" />,
  },
  {
    header: "Thao tác",
    align: "center" as const,
    render: (user: UserItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <ActionTooltipBtn onClick={() => handleEditUser(user)} icon={<Pencil size={14} />} color="gray" tooltip="Xem & Chỉnh sửa" />
        <ActionTooltipBtn onClick={() => handleViewPaymentHistory(user.id)} icon={<History size={14} />} color="gray" tooltip="Lịch sử thanh toán" />
      </div>
    ),
  },
];
