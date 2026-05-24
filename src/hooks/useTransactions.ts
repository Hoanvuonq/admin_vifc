import { PaginatedResponse } from "@/types/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TransactionItem } from "@/app/(main)/transactions/_pages/types";

import axios from "axios";

export const useTransactions = (page = 1, limit = 10, status?: string, search?: string) => {
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
    PaginatedResponse<TransactionItem>,
    Error
  >({
    queryKey: ["transactions", page, limit, status, search],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/db/transactions?${queryParams.toString()}`,
        );
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.error?.message || "Failed to fetch transactions",
        );
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
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
