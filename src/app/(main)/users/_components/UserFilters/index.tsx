"use client";

import { PremiumButton, SearchComponent, SelectComponent } from "@/components";
import { UserPlus } from "lucide-react";
import React from "react";
import { UserFiltersProps, useUserFilterOptions } from "./type";

export const UserFilters: React.FC<UserFiltersProps> = ({ searchText, setSearchText, selectedRole, setSelectedRole, onSearch, onCreateUser }) => {
  const filterOptions = useUserFilterOptions();

  return (
    <div className="bg-white/80 backdrop-blur-2xl py-4 px-6 rounded-2xl border border-white/60 shadow-custom w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
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

        <div className="w-full md:w-56 shrink-0">
          <SelectComponent placeholder="All Roles" value={selectedRole} onChange={setSelectedRole} options={filterOptions.roles} />
        </div>

        {onCreateUser && (
          <div className="shrink-0">
            <PremiumButton label="Tạo người dùng mới" icon={UserPlus} onClick={onCreateUser} size="md" variant="gray" />
          </div>
        )}
      </div>
    </div>
  );
};
