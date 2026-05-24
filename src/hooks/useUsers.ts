import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { PaginatedResponse } from "@/types/api";

export const useUsers = (page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<User>, Error>({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/db/users?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to fetch users");
      }
      return response.json();
    },
  });

  return {
    users: data?.data || [],
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
