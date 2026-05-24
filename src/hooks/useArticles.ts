import { PaginatedResponse } from "@/types/api";
import { Article } from "@/types/article";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useArticles = (page = 1, limit = 10, status?: string) => {
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) {
    queryParams.append("status", status);
  }

  const { data, isLoading, error, refetch } = useQuery<
    PaginatedResponse<Article>,
    Error
  >({
    queryKey: ["articles", page, limit, status],
    queryFn: async () => {
      const response = await fetch(
        `/api/db/articles?${queryParams.toString()}`,
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to fetch articles");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: Partial<Article>) => {
      const response = await fetch("/api/db/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to create article");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create article", { description: error.message });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, ...articleData }: Partial<Article> & { id: string }) => {
      const response = await fetch(`/api/db/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update article");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      toast.error("Failed to update article", { description: error.message });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/db/articles/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete article");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      toast.error("Failed to delete article", { description: error.message });
    },
  });

  return {
    articles: data?.data || [],
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
    createArticle: createArticleMutation.mutateAsync,
    isCreating: createArticleMutation.isPending,
    updateArticle: updateArticleMutation.mutateAsync,
    isUpdating: updateArticleMutation.isPending,
    deleteArticle: deleteArticleMutation.mutateAsync,
    isDeleting: deleteArticleMutation.isPending,
  };
};
