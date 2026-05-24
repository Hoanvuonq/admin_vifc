import { useQueryClient } from "@tanstack/react-query";
import { NewsItem } from "../_pages/types";
import { useArticles } from "@/hooks/useArticles";
import { toast } from "sonner";
import { Article } from "@/types/article";

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const useCMSArticles = () => {
  const queryClient = useQueryClient();
  const {
    articles: dbArticles,
    isLoading,
    error,
    refetch,
    createArticle,
    isCreating,
    updateArticle,
    isUpdating,
    deleteArticle: deleteArticleApi,
    isDeleting,
  } = useArticles(1, 100);

  const articles: NewsItem[] = dbArticles.map((art: Article) => ({
    id: art.id,
    title: art.title || "Untitled",
    slug: art.slug || "",
    layouts: art.layouts,
    summary: art.summary || art.description || "",
    content: art.content || "",
    category: ["WEB3"],
    tags: [],
    thumbnail: art.thumbnail || "",
    authorName: "Admin VIFC",
    authorAvatar: "/icons/icon_sidebar2.png",
    status: (art.status?.toUpperCase() as NewsItem["status"]) || "PUBLISHED",
    createdDate: formatDate(art.createdAt),
    views: 0,
    seoTitle: art.seoTitle,
    seoDescription: art.seoDescription,
    seoKeywords: art.seoKeywords,
  }));

  const saveArticle = async ({
    newsData,
    selectedId,
  }: {
    newsData: Omit<
      NewsItem,
      "id" | "createdDate" | "views" | "authorName" | "authorAvatar"
    >;
    selectedId?: string;
  }) => {
    if (selectedId) {
      await updateArticle({
        id: selectedId,
        title: newsData.title,
        slug: newsData.slug,
        summary: newsData.summary,
        description: newsData.summary,
        content: newsData.content,
        thumbnail: newsData.thumbnail,
        seoTitle: newsData.seoTitle,
        seoDescription: newsData.seoDescription,
        seoKeywords: newsData.seoKeywords,
        layouts: newsData.layouts || "1",
        status: newsData.status || "DRAFT",
        category_id: newsData.category?.[0] || "WEB3",
        blocks: (newsData as any).blocks || [],
      });
      toast.success("Article updated successfully!");
    } else {
      await createArticle({
        id: `NEWS${Date.now()}`,
        title: newsData.title,
        slug: newsData.slug,
        summary: newsData.summary,
        description: newsData.summary,
        content: newsData.content,
        thumbnail: newsData.thumbnail,
        seoTitle: newsData.seoTitle,
        seoDescription: newsData.seoDescription,
        seoKeywords: newsData.seoKeywords,
        layouts: newsData.layouts || "1",
        status: newsData.status || "DRAFT",
        category_id: newsData.category?.[0] || "WEB3",
        blocks: (newsData as any).blocks || [],
      });
    }
  };

  const deleteArticle = async (id: string) => {
    await deleteArticleApi(id);
    toast.success("Article deleted successfully!");
  };

  return {
    articles,
    isLoading,
    saveArticle,
    deleteArticle,
    isSaving: isCreating || isUpdating,
    isDeleting,
  };
};
