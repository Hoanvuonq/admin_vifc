import { useQuery } from "@tanstack/react-query";
import { SubscriptionTransaction } from "@/types/transaction";
import { PaginatedResponse } from "@/types/api";

export const useTransactions = (page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<SubscriptionTransaction>, Error>({
    queryKey: ["transactions", page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/db/transactions?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to fetch transactions");
      }
      return response.json();
    },
  });

  return {
    transactions: data?.data || [],
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
