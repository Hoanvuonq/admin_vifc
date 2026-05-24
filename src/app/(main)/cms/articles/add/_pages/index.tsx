"use client";

import { PremiumButton } from "@/components";
import { ArrowLeft, Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { NewsItem } from "../../(articles)/_pages/types";
import { LeftPanel, NewsPreview, RightPanel } from "../_components";
import { ContentBlock } from "../_components/NewsPreview/type";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useArticles } from "@/hooks/useArticles";

type SectionType = "section-basic" | "section-media" | "section-content" | "section-seo" | "section-pdf" | "section-settings";

const compileBlocksToHTML = (blocks: ContentBlock[]): string => {
  return blocks.map((block) => {
    const styleAttr = block.align !== "left" ? ` style="text-align: ${block.align};"` : "";
    switch (block.type) {
      case "heading":
        const tag = block.level || "h2";
        return `<${tag}${styleAttr}>${block.content}</${tag}>`;
      case "image": {
        return `<div${styleAttr} class="image-block-wrapper w-full"><img src="${block.content}" alt="${block.caption || ''}" class="rounded-2xl max-w-full my-4 inline-block w-full" />${block.caption ? `<p class="text-xs text-gray-500 italic mt-1 text-center">${block.caption}</p>` : ''}</div>`;
      }
      case "pdf": {
        return `<div class="pdf-block-wrapper w-full" data-pdf-url="${block.content || ''}" data-pdf-cover="${block.thumbnailUrl || ''}" data-pdf-name="${block.caption || ''}">
          <a href="${block.content}" target="_blank" class="pdf-attachment-link p-4 border rounded-xl flex items-center gap-3 bg-slate-50 text-rose-600 font-bold hover:bg-rose-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            ${block.caption || 'Download PDF Document'}
          </a>
        </div>`;
      }
      case "text":
      default:
        return `<p${styleAttr}>${block.content}</p>`;
    }
  }).join("\n");
};



export const AddArticlePage: React.FC = () => {
  const router = useRouter();
  const { createArticle, isCreating } = useArticles();

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<string[]>(["Web3"]);
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  // Content blocks
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  // SEO states
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Settings states
  const [allowComments, setAllowComments] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState<NewsItem["status"]>("DRAFT");


  // UI state
  const [activeSection, setActiveSection] = useState<string>("section-basic");
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

  // Initialize state on mount
  useEffect(() => {
    setActiveSection("section-basic");
    setActiveInput(null);
    setTitle("");
    setSlug("");
    setCategory(["Web3"]);
    setTags([]);
    setThumbnail("https://api.dicebear.com/7.x/shapes/svg?seed=" + Math.random().toString());
    setSummary("");

    const initialBlocks: ContentBlock[] = [
      { id: `block-${Date.now()}`, type: "text", align: "left", content: "" }
    ];
    setBlocks(initialBlocks);
    setContent(compileBlocksToHTML(initialBlocks));

    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setAllowComments(true);
    setIsFeatured(false);
    setScheduledDate("");
    setStatus("DRAFT");

  }, []);

  // Scroll spy inside the right form panel
  useEffect(() => {
    const container = rightPanelRef.current;
    if (!container) return;

    const sections: SectionType[] = [
      "section-basic",
      "section-media",
      "section-content",
      "section-seo",
      "section-pdf",
      "section-settings",
    ];

    const handleScroll = () => {
      let currentSection: string = sections[0];
      const containerRect = container.getBoundingClientRect();

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - containerRect.top < 180) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (sectionId: SectionType) => {
    const container = rightPanelRef.current;
    const target = document.getElementById(sectionId);
    if (container && target) {
      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 12,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  // Block handlers
  const handleBlockChange = (id: string, updatedBlock: Partial<ContentBlock>) => {
    const newBlocks = blocks.map((b) => (b.id === id ? { ...b, ...updatedBlock } : b));
    setBlocks(newBlocks);
    setContent(compileBlocksToHTML(newBlocks));
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIndex];
    newBlocks[newIndex] = temp;

    setBlocks(newBlocks);
    setContent(compileBlocksToHTML(newBlocks));

    // Double sync scroll focus on move
    handleBlockSelect(temp.id);
  };

  const handleDeleteBlock = (id: string) => {
    const newBlocks = blocks.filter((b) => b.id !== id);
    if (newBlocks.length === 0) {
      newBlocks.push({ id: `block-${Date.now()}`, type: "text", align: "left", content: "" });
    }
    setBlocks(newBlocks);
    setContent(compileBlocksToHTML(newBlocks));
  };

  const handleAddBlock = (type: ContentBlock["type"], defaults?: Partial<ContentBlock>) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      align: "left",
      content: "",
      ...(type === "heading" ? { level: "h2" } : {}),
      ...defaults
    };

    let newBlocks = [...blocks];
    const activeIndex = blocks.findIndex(b => b.id === activeInput);

    if (activeIndex !== -1) {
      newBlocks.splice(activeIndex + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    setBlocks(newBlocks);
    setContent(compileBlocksToHTML(newBlocks));

    handleBlockSelect(newBlock.id);
  };

  // Dual Scroll Selection Manager
  const handleBlockSelect = (blockId: string) => {
    setActiveInput(blockId);

    // 1. Scroll Right Panel (Form) to block card
    const formEl = document.getElementById(`form-${blockId}`);
    const formContainer = rightPanelRef.current;
    if (formEl && formContainer) {
      formContainer.scrollTo({
        top: formEl.offsetTop - formContainer.offsetTop - 12,
        behavior: "smooth"
      });
    }

    // 2. Scroll Center Panel (UI Preview) to corresponding preview element
    const previewEl = document.getElementById(`preview-${blockId}`);
    const previewContainer = centerPanelRef.current;
    if (previewEl && previewContainer) {
      previewContainer.scrollTo({
        top: previewEl.offsetTop - previewContainer.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  const handleImageUpload = () => {
    const url = prompt("Enter the cover image URL of the article:", thumbnail);
    if (url) {
      setThumbnail(url);
    }
  };

  const handleSave = async (finalStatus?: NewsItem["status"]) => {
    if (!title || !slug || !category) {
      alert("Please fill in all required fields (*)");
      return;
    }

    // Format blocks exactly according to article-schema.md
    const formattedBlocks: any[] = blocks.map((b) => {
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
          name: b.caption || undefined
        };
      }
      return null;
    }).filter(Boolean);



    // Build the final JSON matching the schema
    const articleJsonPayload = {
      id: `post-uuid-${Date.now()}`,
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
      await createArticle(articleJsonPayload);
      router.push("/cms/articles");
    } catch (e: any) {
      console.error(e);
      // Let useArticles hook handle the toast error since it already does it via onError!
      // But we can keep it simple.
    }
  };

  const tagOptions = [
    { label: "Web3", value: "Web3" },
    { label: "Commerce", value: "Commerce" },
    { label: "Blockchain", value: "Blockchain" },
    { label: "Crypto", value: "Crypto" },
    { label: "NFT", value: "NFT" },
    { label: "Metaverse", value: "Metaverse" },
    { label: "DeFi", value: "DeFi" },
    { label: "Tutorial", value: "Tutorial" },
  ];

  // Completions validation
  const sectionBasicCompleted = title.trim().length >= 10 && slug.trim().length > 0 && !!category && tags.length >= 1;
  const sectionMediaCompleted = !!thumbnail && !thumbnail.includes("api.dicebear.com/7.x/shapes/svg") && summary.trim().length >= 30;
  const sectionContentCompleted = content.replace(/<[^>]*>/g, "").trim().length >= 100;
  const sectionSEOCompleted = seoTitle.trim().length >= 10 && seoDescription.trim().length >= 30 && seoKeywords.trim().length >= 3;

  const checklistItems = [
    { id: "title", label: "Article Title (>= 10 characters)", checked: title.trim().length >= 10 },
    { id: "slug", label: "Article URL Slug", checked: slug.trim().length > 0 },
    { id: "category", label: "Article Category", checked: !!category },
    { id: "tags", label: "Assign at least 1 Tag", checked: tags.length >= 1 },
    { id: "thumbnail", label: "Article Cover Image", checked: !!thumbnail && !thumbnail.includes("api.dicebear.com/7.x/shapes/svg") },
    { id: "summary", label: "Article Summary (>= 30 characters)", checked: summary.trim().length >= 30 },
    { id: "content", label: "Article Content (>= 100 characters)", checked: content.replace(/<[^>]*>/g, "").trim().length >= 100 },
    { id: "seoTitle", label: "SEO Title Optimization", checked: seoTitle.trim().length >= 10 },
    { id: "seoDescription", label: "SEO Description Optimization", checked: seoDescription.trim().length >= 30 },
    { id: "seoKeywords", label: "SEO Keywords Optimization", checked: seoKeywords.trim().length >= 3 },
  ];

  const completedCount = checklistItems.filter((item) => item.checked).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  const getSuggestionText = () => {
    if (activeInput && activeInput.startsWith("block-")) {
      const block = blocks.find((b) => b.id === activeInput);
      return {
        title: `Align Element: ${block?.type === "heading" ? "Heading" : block?.type === "image" ? "Image" : "Paragraph"}`,
        text: "Use the position controls (Up/Down) to reorder elements. Formatting alignments (Left/Center/Right) will update live on the central news article detail preview."
      };
    }

    switch (activeInput) {
      case "title":
        return {
          title: "Article Title",
          text: "Briefly describe the article. Maintain a length between 50 - 120 characters to optimize visual display and reader click rates."
        };
      case "slug":
        return {
          title: "Article URL Slug",
          text: "The static URL route of the article. Generated automatically from the title. Can be edited manually to be more concise. Only lowercase letters, numbers, and hyphens allowed."
        };
      case "category":
        return {
          title: "News Category",
          text: "Select the most relevant category to automatically organize the article in the correct channel on the website portal."
        };
      case "tags":
        return {
          title: "Article Tags",
          text: "Assign main keyword tags for the article. This helps link articles of similar subtopics and improves the internal SEO link structure."
        };
      case "thumbnail":
        return {
          title: "Article Cover Image",
          text: "Select an image with a standard aspect ratio (usually 3:2 or 16:9). Ensure high resolution, clear imagery, and direct relevance to the article."
        };
      case "summary":
        return {
          title: "Article Summary",
          text: "Enter a brief summary of 30 - 200 words to display on the home or category pages, helping readers quickly grasp the topic before opening it."
        };
      case "seoTitle":
        return {
          title: "SEO Title (Google Title)",
          text: "The title that displays directly on search engine results. Keep between 50 - 70 characters so it doesn't get cut off with ellipses."
        };
      case "seoDescription":
        return {
          title: "SEO Description (Snippet)",
          text: "The short description snippet below the search title. Ideally 120 - 160 characters. Include key search terms to boost Click-Through Rate (CTR)."
        };
      case "seoKeywords":
        return {
          title: "SEO Keywords",
          text: "Key search keywords describing the main theme of the article, separated by commas, making it easy for search bots to index."
        };
      default:
        return {
          title: "Input Helper Suggestions",
          text: "Click or focus on any input field in the right panel to display detailed writing tips and SEO optimization guidelines here."
        };
    }
  };

  const currentSuggestion = getSuggestionText();

  const getReadingTime = () => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (!text) return 0;
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "Web3":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Crypto":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "NFT":
        return "bg-pink-50 text-pink-700 border border-pink-200";
      case "Metaverse":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Blockchain":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "DeFi":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "Tutorial":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-in fade-in duration-300">
      {/* Top sticky editor navigation header */}
      <div className="bg-white px-6 py-4.5 flex items-center justify-between shrink-0 select-none shadow-3xs">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => router.push("/cms/articles")}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Back to List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
              {"Create New Article"}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Article Status:{" "}
              <span
                className={`ml-1 text-[9.5px] font-extrabold uppercase ${status === "PUBLISHED"
                  ? "text-emerald-500"
                  : status === "PENDING_REVIEW"
                    ? "text-amber-500"
                    : "text-blue-500"
                  }`}
              >
                {status === "PUBLISHED"
                  ? "Published"
                  : status === "PENDING_REVIEW"
                    ? "Pending Review"
                    : "Draft"}
              </span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <PremiumButton
            icon={X}
            label="Cancel"
            variant="rose"
            size="md"
            onClick={() => router.push("/cms/articles")}
            className="rounded-xl font-bold px-4 py-2 text-xs"
          />
          <PremiumButton
            label={"Publish"}
            variant="emerald"
            icon={Check}
            size="md"
            onClick={() => handleSave("PUBLISHED")}
            className="rounded-xl font-bold px-6 py-2 text-xs"
          />
        </div>
      </div>

      {/* Editor Columns Container */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-68px)]">
        {/* COLUMN 1: LEFT BLOCK MANAGER PANEL */}
        <LeftPanel
          sectionBasicCompleted={sectionBasicCompleted}
          sectionMediaCompleted={sectionMediaCompleted}
          sectionContentCompleted={sectionContentCompleted}
          sectionSEOCompleted={sectionSEOCompleted}
          activeSection={activeSection}
          handleTabClick={handleTabClick}
          handleAddBlock={handleAddBlock}
          blocks={blocks}
          activeInput={activeInput}
          handleBlockSelect={handleBlockSelect}
          handleMoveBlock={handleMoveBlock}
          handleDeleteBlock={handleDeleteBlock}
          handleBlockChange={handleBlockChange}
          currentSuggestion={currentSuggestion}
        />

        {/* COLUMN 2: CENTER LIVE PREVIEW */}
        <NewsPreview
          title={title}
          category={category}
          thumbnail={thumbnail}
          summary={summary}
          content={content}
          tags={tags}
          allowComments={allowComments}
          blocks={blocks}
          activeInput={activeInput}
          onBlockSelect={handleBlockSelect}
          getReadingTime={getReadingTime}
          getCategoryBadgeClass={getCategoryBadgeClass}
          slug={slug}
          centerPanelRef={centerPanelRef}
          handleMoveBlock={handleMoveBlock}
          handleDeleteBlock={handleDeleteBlock}
          handleBlockChange={handleBlockChange}

        />

        {/* COLUMN 3: RIGHT SCROLLABLE FORM INPUTS PANEL */}
        <RightPanel
          rightPanelRef={rightPanelRef}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
          title={title}
          handleTitleChange={handleTitleChange}
          slug={slug}
          setSlug={setSlug}
          category={category}
          setCategory={setCategory}
          tags={tags}
          setTags={setTags}
          tagOptions={tagOptions}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          handleImageUpload={handleImageUpload}
          summary={summary}
          setSummary={setSummary}
          blocks={blocks}
          handleMoveBlock={handleMoveBlock}
          handleBlockChange={handleBlockChange}
          handleDeleteBlock={handleDeleteBlock}
          seoTitle={seoTitle}
          setSeoTitle={setSeoTitle}
          seoDescription={seoDescription}
          setSeoDescription={setSeoDescription}
          seoKeywords={seoKeywords}
          setSeoKeywords={setSeoKeywords}
          allowComments={allowComments}
          setAllowComments={setAllowComments}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          newsToEdit={null}
          sectionBasicCompleted={sectionBasicCompleted}
          sectionMediaCompleted={sectionMediaCompleted}
          sectionContentCompleted={sectionContentCompleted}
          sectionSEOCompleted={sectionSEOCompleted}

        />
      </div>
    </div>
  );
};

