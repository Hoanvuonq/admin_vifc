export interface UserFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  counts: {
    total: number;
    active: number;
    inactive: number;
    banned: number;
  };
  onSearch?: () => void;
}

export const useUserFilterOptions = () => {
  return {
    roles: [
      { value: "ALL", label: "All Roles" },
      { value: "ADMIN", label: "Administrator" },
      { value: "STAFF", label: "Staff" },
      { value: "CUSTOMER", label: "Customer" },
    ],
  };
};
