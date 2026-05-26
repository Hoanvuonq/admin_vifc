import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArticle, useArticles } from "@/hooks/useArticles";
import { useArticleEditorStore } from "../_store/useArticleEditorStore";
import { ContentBlock } from "../_components/NewsPreview/type";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "@/providers/ToastProvider";

export const useArticleEditorSync = (articleId?: string) => {
  const router = useRouter();
  const { uploadFile } = useUpload();
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
    setThumbnailFile,
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
    setContent,
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
      setThumbnailFile(null);
      setSummary(art.description || "");

      let initialBlocks: ContentBlock[] = [];
      let combinedHtml = "";

      if (art.blocks && Array.isArray(art.blocks)) {
        art.blocks.forEach((b: any, index: number) => {
          if (b.type === "pdf") {
            initialBlocks.push({
              id: `block-${Date.now()}-${index}`,
              type: "pdf",
              align: "left",
              content: b.url || "",
              caption: b.name || undefined,
              thumbnailUrl: b.thumbnail || undefined,
              activeRole: b.activeRole || "free",
            } as ContentBlock);
          } else if (b.type === "html") {
            combinedHtml += b.content || "";
          } else if (b.type === "heading") {
            const level = b.level || "2";
            combinedHtml += `<h${level}>${b.content || ""}</h${level}>`;
          } else if (b.type === "text") {
            combinedHtml += `<p>${b.content || ""}</p>`;
          } else if (b.type === "image") {
            initialBlocks.push({
              id: `block-${Date.now()}-${index}`,
              type: "image",
              content: b.url || "",
            } as ContentBlock);
          }
        });
      }

      setBlocks(initialBlocks);
      setContent(combinedHtml);

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
      setThumbnailFile(null);
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
      toast.error("Validation Error", {
        description: "Please fill in all required fields (*)",
      });
      return;
    }

    const { thumbnailFile, blocks } = useArticleEditorStore.getState();
    let finalThumbnail = thumbnail;
    const finalBlocks = [...blocks];

    try {
      if (thumbnailFile) {
        toast.loading("Uploading thumbnail...", { id: "article-save" });
        const res = await uploadFile(thumbnailFile);
        finalThumbnail = res.url;
      }

      for (let i = 0; i < finalBlocks.length; i++) {
        const b = finalBlocks[i];
        if (b.file) {
          toast.loading(`Uploading file for block ${i + 1}...`, {
            id: "article-save",
          });
          const res = await uploadFile(b.file);
          finalBlocks[i] = {
            ...b,
            content: res.url,
            thumbnailUrl: res.thumbnailUrl || b.thumbnailUrl,
          };
          delete finalBlocks[i].file;
        }
      }
    } catch (error: any) {
      toast.error("Upload failed", {
        id: "article-save",
        description: error.message || "Failed to upload media files.",
      });
      return;
    }

    toast.loading("Saving article data...", { id: "article-save" });

    const formattedBlocks: any[] = finalBlocks
      .map((b) => {
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

    const { content } = useArticleEditorStore.getState();
    if (content) {
      let finalHtml = content;
      if (content.trim().startsWith("[")) {
        try {
          const parsed = JSON.parse(content);
          finalHtml = parsed
            .map((b: any) => {
              let txt = Array.isArray(b.content)
                ? b.content.map((c: any) => c.text || "").join("")
                : "";
              if (b.type === "heading")
                return `<h${b.props?.level || 2}>${txt}</h${b.props?.level || 2}>`;
              if (b.type === "paragraph" && txt.trim() !== "")
                return `<p>${txt}</p>`;
              if (b.type === "image")
                return `<img src="${b.props?.url || ""}" />`;
              return "";
            })
            .join("");
        } catch (e) {}
      }
      formattedBlocks.push({
        type: "html",
        content: finalHtml,
      });
    }

    const articleJsonPayload = {
      id: articleId || `post-uuid-${Date.now()}`,
      title,
      description: summary,
      thumbnail: finalThumbnail,
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

    console.log(
      "=== ARTICLE PAYLOAD TO SAVE ===",
      JSON.stringify(articleJsonPayload, null, 2),
    );

    try {
      if (articleId) {
        await updateArticle(articleJsonPayload);
      } else {
        await createArticle(articleJsonPayload);
      }
      toast.success("Saved successfully!", { id: "article-save" });
      router.push("/cms/articles");
    } catch (e: any) {
      toast.error("Save failed", {
        id: "article-save",
        description: "Failed to save article",
      });
      console.error(e);
    }
  };

  return { handleSave };
};
