import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArticle, useArticles } from "@/hooks/useArticles";
import { useArticleEditorStore } from "../_store/useArticleEditorStore";
import { ContentBlock } from "../_components/NewsPreview/type";

export const useArticleEditorSync = (articleId?: string) => {
  const router = useRouter();
  const { createArticle, updateArticle } = useArticles();
  const { data: articleData } = useArticle(articleId);

  const {
    title,
    slug,
    category,
    summary,
    thumbnail,
    blocks,
    seoTitle,
    seoDescription,
    seoKeywords,
    status,
    setTitle,
    setSlug,
    setCategory,
    setTags,
    setThumbnail,
    setSummary,
    setBlocks,
    setSeoTitle,
    setSeoDescription,
    setSeoKeywords,
    setStatus,
    setAllowComments,
    setIsFeatured,
    setScheduledDate,
    setActiveSection,
    setActiveInput,
  } = useArticleEditorStore();

  useEffect(() => {
    setActiveSection("section-basic");
    setActiveInput(null);

    if (articleData?.data) {
      const art = articleData.data as any;
      setTitle(art.title || "");
      setSlug(art.slug || "");
      setCategory(art.category_id ? [art.category_id] : ["Web3"]);
      setTags(
        art.seoKeywords
          ? art.seoKeywords
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      );
      setThumbnail(
        art.thumbnail ||
          "https://api.dicebear.com/7.x/shapes/svg?seed=" +
            Math.random().toString(),
      );
      setSummary(art.description || "");

      let initialBlocks: ContentBlock[] = [];
      if (art.blocks && Array.isArray(art.blocks)) {
        initialBlocks = art.blocks.map((b: any, index: number) => {
          let content = b.content || "";
          let caption = undefined;
          let thumbnailUrl = undefined;
          let activeRole: any = undefined;
          let level: "h2" | "h3" | undefined = undefined;

          if (b.type === "image") {
            content = b.url || "";
            caption = b.caption || undefined;
          } else if (b.type === "pdf") {
            content = b.url || "";
            caption = b.name || undefined;
            thumbnailUrl = b.thumbnail || undefined;
            activeRole = b.activeRole || "free";
          } else if (b.type === "heading") {
            level = b.level === "3" ? "h3" : "h2";
          }

          return {
            id: `block-${Date.now()}-${index}`,
            type: b.type || "text",
            align: "left",
            content,
            caption,
            thumbnailUrl,
            activeRole,
            level,
          } as ContentBlock;
        });
      }

      if (initialBlocks.length === 0) {
        initialBlocks = [
          {
            id: `block-${Date.now()}`,
            type: "text",
            align: "left",
            content: "",
          },
        ];
      }
      setBlocks(initialBlocks);

      setSeoTitle(art.seoTitle || "");
      setSeoDescription(art.seoDescription || "");
      setSeoKeywords(art.seoKeywords || "");
      setStatus(art.status?.toUpperCase() || "DRAFT");
    } else if (!articleId) {
      // Default empty state for Add new
      setTitle("");
      setSlug("");
      setCategory(["Web3"]);
      setTags([]);
      setThumbnail(
        "https://api.dicebear.com/7.x/shapes/svg?seed=" +
          Math.random().toString(),
      );
      setSummary("");

      const initialBlocks: ContentBlock[] = [
        { id: `block-${Date.now()}`, type: "text", align: "left", content: "" },
      ];
      setBlocks(initialBlocks);

      setSeoTitle("");
      setSeoDescription("");
      setSeoKeywords("");
      setAllowComments(true);
      setIsFeatured(false);
      setScheduledDate("");
      setStatus("DRAFT");
    }
  }, [
    articleData,
    articleId,
    setTitle,
    setSlug,
    setCategory,
    setTags,
    setThumbnail,
    setSummary,
    setBlocks,
    setSeoTitle,
    setSeoDescription,
    setSeoKeywords,
    setStatus,
    setAllowComments,
    setIsFeatured,
    setScheduledDate,
    setActiveSection,
    setActiveInput,
  ]);

  const handleSave = async (finalStatus?: string) => {
    if (!title || !slug || !category) {
      alert("Please fill in all required fields (*)");
      return;
    }

    const formattedBlocks: any[] = blocks
      .map((b) => {
        if (b.type === "heading") {
          return {
            type: "heading",
            level: b.level === "h3" ? "3" : "2",
            content: b.content,
          };
        }
        if (b.type === "text") {
          return { type: "text", content: b.content };
        }
        if (b.type === "image") {
          return { type: "image", url: b.content };
        }
        if (b.type === "pdf") {
          return {
            type: "pdf",
            url: b.content,
            thumbnail: b.thumbnailUrl || undefined,
            activeRole: b.activeRole || "free",
            name: b.caption || undefined,
          };
        }
        return null;
      })
      .filter(Boolean);

    const articleJsonPayload = {
      id: articleId || `post-uuid-${Date.now()}`,
      title,
      description: summary,
      thumbnail,
      slug,
      layouts: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: formattedBlocks,
      seoTitle,
      seoDescription,
      seoKeywords,
      status: (finalStatus || status).toLowerCase(),
      category_id: category[0] || "WEB3",
    };

    try {
      if (articleId) {
        await updateArticle(articleJsonPayload);
      } else {
        await createArticle(articleJsonPayload);
      }
      router.push("/cms/articles");
    } catch (e: any) {
      console.error(e);
    }
  };

  return { handleSave };
};
