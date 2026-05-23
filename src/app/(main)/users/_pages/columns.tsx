import { ItemImage, ActionTooltipBtn, StatusBadge } from "@/components";
import { Clock, History, Lock, Pencil, Shield, Trash2, Unlock, UserIcon } from "lucide-react";
import { UserItem } from "./types";
import { RoleBadge } from "../_components/RoleBadge";

export const getColumns = (
    handleCycleRole: (id: string) => void,
    handleToggleBlock: (id: string, status: "ACTIVE" | "BANNED") => void,
    handleDeleteUser: (id: string) => void,
    handleViewPaymentHistory: (id: string) => void,
    handleViewUserDetail: (id: string) => void
) => [
        {
            header: "User & Contact",
            accessor: "name" as keyof UserItem,
            render: (user: UserItem) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="relative select-none shrink-0">
                        <ItemImage
                            path={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
                            productName={user.name}
                            className="w-14 h-14 shrink-0"
                        />
                        {user.status === "ACTIVE" ? (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        ) : user.status === "BANNED" ? (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
                        ) : (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 tracking-tight group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                            {user.name}
                            {user.role === "ADMIN" && (
                                <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[9px] font-bold text-purple-600 border border-purple-100/50 flex items-center gap-0.5 uppercase tracking-wide">
                                    <Shield size={8} /> Pro
                                </span>
                            )}
                        </span>
                        <span className="text-xs text-gray-400 font-medium select-text">{user.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            accessor: "role" as keyof UserItem,
            render: (user: UserItem) => (
                <RoleBadge role={user.role} />
            )
        },

        {
            header: "Phone Number",
            accessor: "phone" as keyof UserItem,
            render: (user: UserItem) => (
                <span className="text-gray-600 font-bold font-mono tracking-tight select-text">{user.phone}</span>
            )
        },
        {
            header: "Last Active",
            accessor: "lastActive" as keyof UserItem,
            render: (user: UserItem) => (
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs font-semibold">{user.lastActive}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status" as keyof UserItem,
            render: (user: UserItem) => (
                <StatusBadge status={user.status} variant="premium" />
            )
        },
        {
            header: "Actions",
            align: "center" as const,
            render: (user: UserItem) => (
                <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <ActionTooltipBtn
                        onClick={() => handleViewUserDetail(user.id)}
                        icon={<UserIcon size={14} />}
                        color="blue"
                        tooltip="View Profile"
                    />
                    <ActionTooltipBtn
                        onClick={() => {
                            // This should open the edit modal, but for now we'll leave it as handleCycleRole 
                            // or pass handleEditUser. The user previously bound this to handleCycleRole.
                            handleCycleRole(user.id);
                        }}
                        icon={<Pencil size={14} />}
                        color="emerald"
                        tooltip="Edit User"
                    />
                    <ActionTooltipBtn
                        onClick={() => handleViewPaymentHistory(user.id)}
                        icon={<History size={14} />}
                        color="emerald"
                        tooltip="History Payment"
                    />
                    {user.status === "BANNED" ? (
                        <ActionTooltipBtn
                            onClick={() => handleToggleBlock(user.id, "ACTIVE")}
                            icon={<Unlock size={14} />}
                            color="green"
                            tooltip="Unlock Account"
                            className="animate-pulse"
                        />
                    ) : (
                        <ActionTooltipBtn
                            onClick={() => handleToggleBlock(user.id, "BANNED")}
                            icon={<Lock size={14} />}
                            color="red"
                            tooltip="Lock Account"
                        />
                    )}
                    <ActionTooltipBtn
                        onClick={() => handleDeleteUser(user.id)}
                        icon={<Trash2 size={14} />}
                        color="red"
                        tooltip="Delete User"
                    />
                </div>
            )
        }
    ];
