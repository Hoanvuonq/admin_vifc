"use client";

import { StatusTabs } from "@/app/(dashboad)/dashboard/_components";
import { SearchComponent, SelectComponent } from "@/components";
import { Clock, UserCheck, Users, UserX } from "lucide-react";
import React, { useMemo } from "react";
import { UserFiltersProps, useUserFilterOptions } from "./type";

export const UserFilters: React.FC<UserFiltersProps> = ({
    searchText,
    setSearchText,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    counts,
    onSearch,
}) => {
    const filterOptions = useUserFilterOptions();

    const tabs = useMemo(() => [
        { key: "ALL", label: "All Users", icon: Users, count: counts.total },
        { key: "ACTIVE", label: "Active", icon: UserCheck, count: counts.active },
        { key: "INACTIVE", label: "Inactive", icon: Clock, count: counts.inactive },
        { key: "BANNED", label: "Banned", icon: UserX, count: counts.banned },
    ], [counts]);

    return (
        <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-[2.5rem] border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                <div className="lg:col-span-2">
                    <StatusTabs
                        tabs={tabs}
                        current={selectedStatus}
                        onChange={setSelectedStatus}
                        layoutId="user-status-pill"
                    />
                </div>

                <div className="lg:col-span-2">
                    <SearchComponent
                        placeholder="Search by name, email, phone or ID..."
                        value={searchText}
                        onChange={setSearchText}
                        onEnter={onSearch}
                        size="md"
                        className="shadow-none border-slate-100"
                        inputClassName="bg-white/80 focus:ring-4 focus:ring-orange-500/5 h-12"
                    />
                </div>

                <div className="lg:col-span-1">
                    <SelectComponent
                        placeholder="All Roles"
                        value={selectedRole}
                        onChange={setSelectedRole}
                        options={filterOptions.roles}
                    />
                </div>
            </div>
        </div>
    );
};