"use client";

import { AdminPageHeader, ItemImage, PremiumButton } from "@/components";
import { DataTable } from "@/components/DataTable";
import {
    Calendar,
    Clock,
    Edit,
    Mail,
    Phone,
    UserCheck,
    UserPlus,
    Users,
    UserX,
    X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { UserFilters, UserModal, PaymentHistoryModal, UserDetailModal } from "../_components";
import { getColumns } from "./columns";
import { INITIAL_USERS } from "../_constants/users.constants";
import { UserItem } from "./types";


export const ManagerUsersScreen = () => {
    const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserItem | null>(null);

    const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
    const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState<string | null>(null);

    const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<string | null>(null);


    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(5);

    const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter((u) => u.status === "ACTIVE").length;
        const inactive = users.filter((u) => u.status === "INACTIVE").length;
        const banned = users.filter((u) => u.status === "BANNED").length;
        return { total, active, inactive, banned };
    }, [users]);



    // Apply filters
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.phone.includes(searchQuery) ||
                u.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
            const matchesStatus = selectedStatus === "ALL" || u.status === selectedStatus;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, selectedRole, selectedStatus]);


    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(filteredUsers.length / pageSize) - 1);
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [filteredUsers.length, pageSize, currentPage]);


    const paginatedUsers = useMemo(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, currentPage, pageSize]);


    const handleCycleRole = (id: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((u) => {
                if (u.id === id) {
                    const nextRoleMap: Record<UserItem["role"], UserItem["role"]> = {
                        CUSTOMER: "BUYER",
                        BUYER: "SHOP",
                        SHOP: "BUSINESS",
                        BUSINESS: "LOGISTICS",
                        LOGISTICS: "SALE",
                        SALE: "EMPLOYEE",
                        EMPLOYEE: "STAFF",
                        STAFF: "ADMIN",
                        ADMIN: "CUSTOMER",
                    };
                    const nextRole = nextRoleMap[u.role] || "CUSTOMER";
                    showToast(`Changed ${u.name}'s role to ${nextRole}`, "info");
                    return { ...u, role: nextRole };
                }
                return u;
            })
        );
    };

    const handleToggleBlock = (id: string, nextStatus: "ACTIVE" | "BANNED") => {
        setUsers((prevUsers) =>
            prevUsers.map((u) => {
                if (u.id === id) {
                    showToast(
                        nextStatus === "BANNED"
                            ? `Locked user account: ${u.name}`
                            : `Unlocked user account: ${u.name}`,
                        nextStatus === "BANNED" ? "warning" : "success"
                    );
                    return { ...u, status: nextStatus };
                }
                return u;
            })
        );
    };

    const handleDeleteUser = (id: string) => {
        const userToDelete = users.find((u) => u.id === id);
        if (userToDelete) {
            if (confirm(`Are you sure you want to delete ${userToDelete.name}'s account?`)) {
                setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
                showToast(`Successfully deleted ${userToDelete.name}`, "warning");
            }
        }
    };

    const handleSaveUser = (userData: {
        name: string;
        email: string;
        phone: string;
        role: UserItem["role"];
        status: UserItem["status"];
    }) => {
        if (selectedUserToEdit) {
            // Edit mode
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === selectedUserToEdit.id
                        ? {
                            ...u,
                            ...userData,
                        }
                        : u
                )
            );
            showToast(`Updated user: ${userData.name}`, "success");
        } else {
            // Add mode
            const newId = `USR${String(users.length + 1).padStart(3, "0")}`;
            const newUser: UserItem = {
                id: newId,
                ...userData,
                joinedDate: new Date().toISOString().split("T")[0],
                lastActive: "Just now",
            };
            setUsers((prevUsers) => [newUser, ...prevUsers]);
            showToast(`Successfully created user: ${userData.name}`, "success");
        }

        setIsAddUserModalOpen(false);
        setSelectedUserToEdit(null);
    };

    const handleViewPaymentHistory = (id: string) => {
        setSelectedUserIdForHistory(id);
        setIsPaymentHistoryModalOpen(true);
    };

    const handleViewUserDetail = (id: string) => {
        setSelectedUserForDetail(id);
        setIsUserDetailModalOpen(true);
    };

    const columns = useMemo(() => getColumns(handleCycleRole, handleToggleBlock, handleDeleteUser, handleViewPaymentHistory, handleViewUserDetail), []);

    const renderUserDetail = (user: UserItem) => {
        return (
            <div className="px-8 py-6 bg-slate-50/50 rounded-4xl border border-gray-100 m-2 flex flex-col lg:flex-row gap-6 items-start justify-between shadow-inner animate-in fade-in duration-300">
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
                            {user.role === "ADMIN" ? "Full administrator access" : user.role === "STAFF" ? "Staff operation access" : "General customer access"}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400 block uppercase tracking-widest text-[9px] font-bold">Access Status</span>
                        <span className={`font-bold mt-0.5 block ${user.status === "ACTIVE" ? "text-emerald-600" : user.status === "BANNED" ? "text-rose-600" : "text-amber-600"}`}>
                            {user.status === "ACTIVE" ? "Online & Active" : user.status === "BANNED" ? "Locked & Suspended" : "Pending verification"}
                        </span>
                    </div>
                </div>

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
    };

    return (
        <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
            <AdminPageHeader
                icon={Users}
                title="Manage"
                highlightTitle="Users"
                subtitle="Manage user profiles, access controls, and system account statuses"
                metrics={[
                    {
                        label: "Total Users",
                        value: stats.total,
                        icon: <Users size={14} />,
                        color: "blue"
                    },
                    {
                        label: "Active",
                        value: stats.active,
                        icon: <UserCheck size={14} />,
                        color: "emerald"
                    },
                    {
                        label: "Inactive",
                        value: stats.inactive,
                        icon: <Clock size={14} />,
                        color: "orange"
                    },
                    {
                        label: "Banned",
                        value: stats.banned,
                        icon: <UserX size={14} />,
                        color: "rose"
                    }
                ]}
            />

            <DataTable
                data={paginatedUsers}
                columns={columns}
                loading={false}
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
                totalElements={filteredUsers.length}
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
