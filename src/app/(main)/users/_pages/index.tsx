"use client";

import { AdminPageHeader, ItemImage } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useUsers } from "@/hooks/useUsers";
import { useUpload } from "@/hooks/useUpload";
import {
    Calendar,
    Clock,
    Edit,
    Mail,
    Phone,
    UserCheck,
    Users,
    UserX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentHistoryModal, UserDetailModal, UserFilters, UserModal } from "../_components";
import { getColumns } from "./columns";
import { UserItem } from "./types";
import { toast } from "@/providers/ToastProvider";

export const ManagerUsersScreen = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserItem | null>(null);

    const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
    const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState<string | null>(null);

    const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Reset to page 0 when filters change
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearch, selectedStatus, selectedRole]);

    // Server-side pagination; search/status forwarded to the hook
    const { users: apiUsers, isLoading, pagination } = useUsers(
        currentPage + 1,
        pageSize,
        selectedStatus,
        debouncedSearch
    );

    const queryClient = useQueryClient();
    const { uploadFile } = useUpload();

    // Client-side role filter (API doesn't support role filtering yet)
    const filteredUsers = useMemo(() => {
        if (selectedRole === "ALL") return apiUsers;
        return apiUsers.filter((u) => u.role === selectedRole);
    }, [apiUsers, selectedRole]);

    const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
        toast[type](message)
    };

    const stats = useMemo(() => {
        const total = pagination.total || 0;
        const active = apiUsers.filter((u) => u.status === "ACTIVE").length;
        const inactive = apiUsers.filter((u) => u.status === "INACTIVE").length;
        const banned = apiUsers.filter((u) => u.status === "BANNED").length;
        return { total, active, inactive, banned };
    }, [apiUsers, pagination.total]);

    const handleCycleRole = (id: string) => {
        showToast(`Role cycling is not yet supported via API (id: ${id})`, "info");
    };

    const handleEditUser = (user: UserItem) => {
        setSelectedUserToEdit(user);
        setIsAddUserModalOpen(true);
    };

    const handleToggleBlock = (id: string, nextStatus: "ACTIVE" | "BANNED") => {
        showToast(
            nextStatus === "BANNED"
                ? `Locked user account: ${id}`
                : `Unlocked user account: ${id}`,
            nextStatus === "BANNED" ? "warning" : "success"
        );
    };

    const handleDeleteUser = (id: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            showToast(`Delete action triggered for user: ${id}`, "warning");
        }
    };

    const handleSaveUser = async (userData: {
        name: string;
        email: string;
        phone: string;
        status: UserItem["status"];
        avatarFile: File | null;
        avatarUrl: string;
        subscriptionPlanId?: string;
    }) => {
        if (selectedUserToEdit) {
            try {
                let finalAvatarUrl = userData.avatarUrl;
                if (userData.avatarFile) {
                    const result = await uploadFile(userData.avatarFile);
                    if (result?.url) {
                        finalAvatarUrl = result.url;
                    }
                }

                const payload: Record<string, unknown> = {};
                const hasActiveSubscription = Boolean(selectedUserToEdit.subscription?.plan?.id);

                if (!hasActiveSubscription) {
                    payload.full_name = userData.name;
                    payload.status = userData.status;
                    payload.avatar_url = finalAvatarUrl;
                }

                if (
                    userData.subscriptionPlanId &&
                    userData.subscriptionPlanId !== selectedUserToEdit.subscription?.plan?.id
                ) {
                    payload.subscription_plan_id = userData.subscriptionPlanId;
                }

                const res = await fetch(`/api/db/users/${selectedUserToEdit.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    showToast(`Updated user: ${userData.name}`, "success");
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                    setIsAddUserModalOpen(false);
                    setSelectedUserToEdit(null);
                } else {
                    showToast("Failed to update user", "warning");
                }
            } catch (error) {
                showToast("An error occurred during update", "warning");
            }
        } else {
            showToast(`Created user: ${userData.name}`, "success");
            setIsAddUserModalOpen(false);
        }
    };

    const handleViewPaymentHistory = (id: string) => {
        setSelectedUserIdForHistory(id);
        setIsPaymentHistoryModalOpen(true);
    };

    const handleViewUserDetail = (id: string) => {
        setSelectedUserForDetail(id);
        setIsUserDetailModalOpen(true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(
        () => getColumns(handleCycleRole, handleEditUser, handleToggleBlock, handleDeleteUser, handleViewPaymentHistory, handleViewUserDetail),
        []
    );

    const renderUserDetail = (user: UserItem) => (
        <div className="px-8 py-6 bg-slate-50/50 rounded-4xl border border-gray-100 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
            {/* Avatar + contact */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <ItemImage
                    path={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
                    productName={user.name}
                    className="w-16 h-16 shrink-0"
                />
                <div className="space-y-1">
                    <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                        {user.name}
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-md text-gray-500 uppercase tracking-widest font-mono select-all">
                            {user.id}
                        </span>
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 select-all">
                        <Mail size={12} className="text-gray-400 shrink-0" /> {user.email}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 select-all">
                        <Phone size={12} className="text-gray-400 shrink-0" /> {user.phone}
                    </p>
                </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs lg:border-l border-gray-200/80 lg:pl-6 w-full lg:w-auto">
                <div>
                    <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Joined Date</span>
                    <span className="font-bold text-gray-700 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} className="text-gray-400" />
                        {user.joinedDate}
                    </span>
                </div>
                <div>
                    <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Last Active</span>
                    <span className="font-bold text-gray-700 flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-gray-400" />
                        {user.lastActive}
                    </span>
                </div>
                <div>
                    <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">System Role</span>
                    <span className="font-bold text-gray-700 mt-0.5 block">
                        {user.role === "ADMIN"
                            ? "Full administrator access"
                            : user.role === "STAFF"
                                ? "Staff operation access"
                                : "General customer access"}
                    </span>
                </div>
                <div>
                    <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Access Status</span>
                    <span className={`font-bold mt-0.5 block ${user.status === "ACTIVE" ? "text-emerald-600" : user.status === "BANNED" ? "text-rose-600" : "text-amber-600"}`}>
                        {user.status === "ACTIVE" ? "Online & Active" : user.status === "BANNED" ? "Locked & Suspended" : "Pending verification"}
                    </span>
                </div>
                {user.company && (
                    <div>
                        <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Company</span>
                        <span className="font-bold text-gray-700 mt-0.5 block">{user.company}</span>
                    </div>
                )}
                {user.country && (
                    <div>
                        <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Country</span>
                        <span className="font-bold text-gray-700 mt-0.5 block">{user.country}</span>
                    </div>
                )}
                {user.subscription && (
                    <div className="col-span-2">
                        <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Subscription</span>
                        <span className="font-bold text-emerald-600 mt-0.5 block">
                            {user.subscription.plan?.name ?? "Active"} — expires {user.subscription.end_date?.split("T")[0] ?? "N/A"}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
                <button
                    onClick={() => {
                        setSelectedUserToEdit(user);
                        setIsAddUserModalOpen(true);
                    }}
                    className="h-10 px-4 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 text-[10.5px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
                >
                    <Edit size={12} /> Edit Profile
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
            <AdminPageHeader
                icon={Users}
                title="Manage"
                highlightTitle="Users"
                subtitle="Manage user profiles, access controls, and system account statuses"
                metrics={[
                    { label: "Total Users", value: stats.total, icon: <Users size={14} />, color: "blue" },
                    { label: "Active", value: stats.active, icon: <UserCheck size={14} />, color: "emerald" },
                    { label: "Inactive", value: stats.inactive, icon: <Clock size={14} />, color: "orange" },
                    { label: "Banned", value: stats.banned, icon: <UserX size={14} />, color: "rose" },
                ]}
            />

            <DataTable
                data={filteredUsers}
                columns={columns}
                loading={isLoading}
                rowKey="id"
                emptyMessage="No users found matching the filter criteria"
                page={currentPage}
                headerContent={
                    <UserFilters
                        searchText={searchQuery}
                        setSearchText={setSearchQuery}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        counts={stats}
                    />
                }
                size={pageSize}
                totalElements={pagination.total || filteredUsers.length}
                onPageChange={(p) => setCurrentPage(p)}
                renderDropdown={renderUserDetail}
            />

            <UserModal
                isOpen={isAddUserModalOpen}
                onClose={() => {
                    setIsAddUserModalOpen(false);
                    setSelectedUserToEdit(null);
                }}
                userToEdit={selectedUserToEdit}
                onSave={handleSaveUser}
            />

            <PaymentHistoryModal
                isOpen={isPaymentHistoryModalOpen}
                onClose={() => {
                    setIsPaymentHistoryModalOpen(false);
                    setSelectedUserIdForHistory(null);
                }}
                userId={selectedUserIdForHistory}
            />

            <UserDetailModal
                open={isUserDetailModalOpen}
                userId={selectedUserForDetail}
                onClose={() => {
                    setIsUserDetailModalOpen(false);
                    setSelectedUserForDetail(null);
                }}
            />
        </div>
    );
};
