"use client";

import { PremiumButton } from "@/components";
import { FileText, ArrowLeft, X, Check, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { NewsItem } from "../../_pages/types";
import { LeftPanel, NewsPreview, RightPanel } from "./_components";
import { ContentBlock } from "./_components/NewsPreview/type";

interface CMSDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  newsToEdit: NewsItem | null;
  onSave: (newsData: Omit<NewsItem, "id" | "createdDate" | "views" | "authorName" | "authorAvatar">) => void;
}

type SectionType = "section-basic" | "section-media" | "section-content" | "section-seo" | "section-pdf" | "section-settings";

// Compiles content blocks into clean static HTML markup
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
      case "text":
      default:
        return `<p${styleAttr}>${block.content}</p>`;
    }
  }).join("\n");
};

const parseHTMLToBlocks = (html: string): ContentBlock[] => {
  if (!html) return [{ id: `block-${Date.now()}`, type: "text", align: "left", content: "" }];

  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html.trim();
    const blocks: ContentBlock[] = [];

    Array.from(tempDiv.children).forEach((el, index) => {
      const id = `block-${Date.now()}-${index}`;
      const textAlign = (el as HTMLElement).style.textAlign as "left" | "center" | "right" || "left";

      if (el.tagName === "H2" || el.tagName === "H3") {
        blocks.push({
          id,
          type: "heading",
          align: textAlign,
          content: el.innerHTML,
          level: el.tagName === "H2" ? "h2" : "h3"
        });
      } else if (el.tagName === "DIV" && el.classList.contains("image-block-wrapper")) {
        const img = el.querySelector("img");
        const captionEl = el.querySelector("p");
        blocks.push({
          id,
          type: "image",
          align: textAlign,
          content: img?.getAttribute("src") || "",
          caption: captionEl?.innerHTML || "",
          imagePadding: el.getAttribute("data-image-padding") as "none" | "small" | "medium" | "large" || "medium",
        });
      } else if (el.tagName === "IMG") {
        blocks.push({
          id,
          type: "image",
          align: "center",
          content: el.getAttribute("src") || ""
        });
      } else {
        blocks.push({
          id,
          type: "text",
          align: textAlign,
          content: el.innerHTML
        });
      }
    });

    if (blocks.length === 0) {
      return [{ id: `block-${Date.now()}`, type: "text", align: "left", content: html }];
    }
    return blocks;
  } catch (e) {
    return [{ id: `block-${Date.now()}`, type: "text", align: "left", content: html }];
  }
};

export const CMSDrawer: React.FC<CMSDrawerProps> = ({
  isOpen,
  onClose,
  newsToEdit,
  onSave,
}) => {
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

  // PDF states
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfCover, setPdfCover] = useState("");
  const [pdfName, setPdfName] = useState("");

  // UI state
  const [activeSection, setActiveSection] = useState<string>("section-basic");
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

  // Sync state when modal opens or newsToEdit changes
  useEffect(() => {
    if (isOpen) {
      setActiveSection("section-basic");
      setActiveInput(null);
      if (newsToEdit) {
        setTitle(newsToEdit.title);
        setSlug(newsToEdit.slug);
        setCategory(newsToEdit.category);
        setTags(newsToEdit.tags || []);
        setThumbnail(newsToEdit.thumbnail);
        setSummary(newsToEdit.summary);

        const parsed = parseHTMLToBlocks(newsToEdit.content);
        setBlocks(parsed);
        setContent(newsToEdit.content);

        setSeoTitle(newsToEdit.seoTitle || "");
        setSeoDescription(newsToEdit.seoDescription || "");
        setSeoKeywords(newsToEdit.seoKeywords || "");
        setAllowComments(newsToEdit.allowComments ?? true);
        setIsFeatured(newsToEdit.isFeatured ?? false);
        setScheduledDate(newsToEdit.scheduledDate || "");
        setStatus(newsToEdit.status);

        setPdfUrl(newsToEdit.pdfUrl || "");
        setPdfCover(newsToEdit.pdfCover || "");
        setPdfName(newsToEdit.pdfName || "");
      } else {
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

        setPdfUrl("");
        setPdfCover("");
        setPdfName("");
      }
    }
  }, [isOpen, newsToEdit]);

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
  }, [isOpen]);

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
    const newBlocks = [...blocks, newBlock];
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
    if (!newsToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    }
  };

  const handleImageUpload = () => {
    const url = prompt("Enter the cover image URL of the article:", thumbnail);
    if (url) {
      setThumbnail(url);
    }
  };

  const handleSave = (finalStatus?: NewsItem["status"]) => {
    if (!title || !slug || !category) {
      alert("Please fill in all required fields (*)");
      return;
    }

    onSave({
      title,
      slug,
      category,
      tags,
      thumbnail,
      summary,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
      allowComments,
      isFeatured,
      scheduledDate,
      status: finalStatus || status,
      pdfUrl,
      pdfCover,
      pdfName,
    });
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
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Back to List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
              {newsToEdit ? "Edit Article" : "Create New Article"}
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
            onClick={onClose}
            className="rounded-xl font-bold px-4 py-2 text-xs"
          />
          {/* {status !== "PUBLISHED" && (
            <PremiumButton
              label="Save Draft"
              icon={Save}
              variant="gray"
              size="md"
              onClick={() => handleSave("DRAFT")}
              className="rounded-xl font-bold border border-gray-200 px-4 py-2 bg-white text-gray-700 hover:bg-slate-50 text-xs"
            />
          )} */}
          <PremiumButton
            label={newsToEdit ? "Update" : "Publish"}
            variant="emerald"
            icon={Check}
            size="md"
            onClick={() => handleSave(status === "DRAFT" ? "PENDING_REVIEW" : status)}
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
          pdfUrl={pdfUrl}
          pdfCover={pdfCover}
          pdfName={pdfName}
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
          newsToEdit={newsToEdit}
          sectionBasicCompleted={sectionBasicCompleted}
          sectionMediaCompleted={sectionMediaCompleted}
          sectionContentCompleted={sectionContentCompleted}
          sectionSEOCompleted={sectionSEOCompleted}
          pdfUrl={pdfUrl}
          setPdfUrl={setPdfUrl}
          pdfCover={pdfCover}
          setPdfCover={setPdfCover}
          pdfName={pdfName}
          setPdfName={setPdfName}
        />
      </div>
    </div>
  );
};

