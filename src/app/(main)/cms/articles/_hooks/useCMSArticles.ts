import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { NewsItem } from "../_pages/types";
import { INITIAL_NEWS } from "../_constants/cms.constants";

const CMS_ARTICLES_KEY = ["cms-articles"];

// Reads articles list from local storage or returns initial news data
const getArticles = (): NewsItem[] => {
  if (typeof window === "undefined") return INITIAL_NEWS;
  const stored = localStorage.getItem("cms_articles");
  if (!stored) {
    localStorage.setItem("cms_articles", JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_NEWS;
  }
};

// Saves or updates an article in storage
const saveArticle = (
  newsData: Omit<NewsItem, "id" | "createdDate" | "views" | "authorName" | "authorAvatar">,
  selectedId?: string
): NewsItem[] => {
  const list = _.cloneDeep(getArticles());
  if (selectedId) {
    // Edit mode
    const updated = list.map((n) =>
      n.id === selectedId
        ? {
            ...n,
            ...newsData,
          }
        : n
    );
    localStorage.setItem("cms_articles", JSON.stringify(updated));
    return updated;
  } else {
    // Create mode
    const now = new Date();
    const formatTime = (num: number) => String(num).padStart(2, "0");
    const dateString = `${formatTime(now.getDate())}/${formatTime(
      now.getMonth() + 1
    )}/${now.getFullYear()} ${formatTime(now.getHours())}:${formatTime(
      now.getMinutes()
    )}`;

    const newId = `NEWS${String(list.length + 1).padStart(3, "0")}`;
    const newNewsItem: NewsItem = {
      id: newId,
      authorName: "Admin VIFC",
      authorAvatar: "/icons/icon_sidebar2.png",
      createdDate: dateString,
      views: 0,
      ...newsData,
    };
    const updated = [newNewsItem, ...list];
    localStorage.setItem("cms_articles", JSON.stringify(updated));
    return updated;
  }
};

// Deletes an article from storage
const deleteArticle = (id: string): NewsItem[] => {
  const list = _.cloneDeep(getArticles());
  const updated = list.filter((n) => n.id !== id);
  localStorage.setItem("cms_articles", JSON.stringify(updated));
  return updated;
};

export const useCMSArticles = () => {
  const queryClient = useQueryClient();

  // Retrieve cached articles list
  const { data: articles = [], isLoading } = useQuery({
    queryKey: CMS_ARTICLES_KEY,
    queryFn: getArticles,
    initialData: typeof window !== "undefined" ? getArticles() : INITIAL_NEWS,
  });

  // Create/Edit Mutation
  const saveMutation = useMutation({
    mutationFn: async ({
      newsData,
      selectedId
    }: {
      newsData: Omit<
        NewsItem,
        "id" | "createdDate" | "views" | "authorName" | "authorAvatar"
      >;
      selectedId?: string;
    }) => {
      return saveArticle(newsData, selectedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_ARTICLES_KEY });
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_ARTICLES_KEY });
    }
  });

  return {
    articles,
    isLoading,
    saveArticle: saveMutation.mutateAsync,
    deleteArticle: deleteMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
