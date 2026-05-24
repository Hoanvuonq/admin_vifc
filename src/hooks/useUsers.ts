import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { PaginatedResponse } from "@/types/api";
import { UserItem } from "@/app/(main)/users/_pages/types";
import axios from "axios";

function mapUserToItem(user: User): UserItem {
  const statusMap: Record<string, UserItem["status"]> = {
    active: "ACTIVE",
    blocked: "BANNED",
    banned: "BANNED",
    inactive: "INACTIVE",
  };
  const status: UserItem["status"] =
    statusMap[user.status?.toLowerCase()] ?? "INACTIVE";

  return {
    id: user.id,
    name: user.full_name || user.email,
    email: user.email,
    role: (user.subscription?.plan?.name?.toUpperCase() ??
      "FREE") as UserItem["role"],
    status,
    phone: "—",
    joinedDate: user.created_at ? user.created_at.split("T")[0] : "—",
    lastActive: user.updated_at ? user.updated_at.split("T")[0] : "—",
    avatar: user.avatar_url ?? undefined,
    company: user.company,
    title: user.title,
    country: user.country,
    auth_provider: user.auth_provider,
    subscription: user.subscription,
  };
}

export const useUsers = (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status && status !== "ALL") {
    queryParams.append("status", status.toLowerCase());
  }
  if (search) {
    queryParams.append("search", search);
  }

  const { data, isLoading, error, refetch } = useQuery<
    PaginatedResponse<User>,
    Error
  >({
    queryKey: ["users", page, limit, status, search],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/db/users?${queryParams.toString()}`,
        );
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.error?.message || "Failed to fetch users",
        );
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const rawUsers: User[] = data?.data || [];

  return {
    users: rawUsers.map(mapUserToItem),
    pagination: data?.meta?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
    isLoading,
    error,
    refetch,
  };
};
