import { create } from "zustand";
import { ContentBlock } from "../_components/NewsPreview/type";

type SectionType =
  | "section-basic"
  | "section-media"
  | "section-content"
  | "section-seo"
  | "section-pdf"
  | "section-settings";

interface ArticleEditorState {
  // Form states
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  category: string[];
  setCategory: (val: string[]) => void;
  tags: string[];
  setTags: (val: string[]) => void;
  thumbnail: string;
  setThumbnail: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  content: string;
  setContent: (val: string) => void;

  // Blocks
  blocks: ContentBlock[];
  setBlocks: (val: ContentBlock[]) => void;

  // SEO
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  seoKeywords: string;
  setSeoKeywords: (val: string) => void;

  // Settings
  allowComments: boolean;
  setAllowComments: (val: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;

  // UI State
  activeSection: SectionType;
  setActiveSection: (val: SectionType) => void;
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;

  // Complex Actions
  handleTitleChange: (val: string) => void;
  handleBlockChange: (id: string, updatedBlock: Partial<ContentBlock>) => void;
  handleMoveBlock: (index: number, direction: "up" | "down") => void;
  handleDeleteBlock: (id: string) => void;
  handleAddBlock: (
    type: ContentBlock["type"],
    defaults?: Partial<ContentBlock>,
  ) => void;
  handleBlockSelect: (
    id: string,
    formContainer: HTMLDivElement | null,
    previewContainer: HTMLDivElement | null,
  ) => void;

  // Computed state getters (can be used where needed)
  getReadingTime: () => number;
}

const compileBlocksToHTML = (blocks: ContentBlock[]): string => {
  return blocks
    .map((block) => {
      const styleAttr =
        block.align !== "left" ? ` style="text-align: ${block.align};"` : "";
      switch (block.type) {
        case "heading":
          const tag = block.level || "h2";
          return `<${tag}${styleAttr}>${block.content}</${tag}>`;
        case "image": {
          return `<div${styleAttr} class="image-block-wrapper w-full"><img src="${block.content}" alt="${block.caption || ""}" class="rounded-2xl max-w-full my-4 inline-block w-full" />${block.caption ? `<p class="text-xs text-gray-500 italic mt-1 text-center">${block.caption}</p>` : ""}</div>`;
        }
        case "pdf": {
          return `<div class="pdf-block-wrapper w-full" data-pdf-url="${block.content || ""}" data-pdf-cover="${block.thumbnailUrl || ""}" data-pdf-name="${block.caption || ""}">
          <a href="${block.content}" target="_blank" class="pdf-attachment-link p-4 border rounded-xl flex items-center gap-3 bg-slate-50 text-rose-600 font-bold hover:bg-rose-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            ${block.caption || "Download PDF Document"}
          </a>
        </div>`;
        }
        case "text":
        default:
          return `<p${styleAttr}>${block.content}</p>`;
      }
    })
    .join("\n");
};

export const useArticleEditorStore = create<ArticleEditorState>((set, get) => ({
  title: "",
  setTitle: (title) => set({ title }),
  slug: "",
  setSlug: (slug) => set({ slug }),
  category: ["Web3"],
  setCategory: (category) => set({ category }),
  tags: [],
  setTags: (tags) => set({ tags }),
  thumbnail: "",
  setThumbnail: (thumbnail) => set({ thumbnail }),
  summary: "",
  setSummary: (summary) => set({ summary }),
  content: "",
  setContent: (content) => set({ content }),

  blocks: [],
  setBlocks: (blocks) => {
    set({ blocks });
    set({ content: compileBlocksToHTML(blocks) });
  },

  seoTitle: "",
  setSeoTitle: (seoTitle) => set({ seoTitle }),
  seoDescription: "",
  setSeoDescription: (seoDescription) => set({ seoDescription }),
  seoKeywords: "",
  setSeoKeywords: (seoKeywords) => set({ seoKeywords }),

  allowComments: true,
  setAllowComments: (allowComments) => set({ allowComments }),
  isFeatured: false,
  setIsFeatured: (isFeatured) => set({ isFeatured }),
  scheduledDate: "",
  setScheduledDate: (scheduledDate) => set({ scheduledDate }),
  status: "DRAFT",
  setStatus: (status) => set({ status }),

  activeSection: "section-basic",
  setActiveSection: (activeSection) => set({ activeSection }),
  activeInput: null,
  setActiveInput: (activeInput) => set({ activeInput }),

  handleTitleChange: (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    set({ title: val, slug: generatedSlug });
  },

  handleBlockChange: (id: string, updatedBlock: Partial<ContentBlock>) => {
    const { blocks } = get();
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, ...updatedBlock } : b,
    );
    set({ blocks: newBlocks, content: compileBlocksToHTML(newBlocks) });
  },

  handleMoveBlock: (index: number, direction: "up" | "down") => {
    const { blocks } = get();
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIndex];
    newBlocks[newIndex] = temp;

    set({
      blocks: newBlocks,
      content: compileBlocksToHTML(newBlocks),
      activeInput: temp.id,
    });
  },

  handleDeleteBlock: (id: string) => {
    const { blocks } = get();
    const newBlocks = blocks.filter((b) => b.id !== id);
    if (newBlocks.length === 0) {
      newBlocks.push({
        id: `block-${Date.now()}`,
        type: "text",
        align: "left",
        content: "",
      });
    }
    set({ blocks: newBlocks, content: compileBlocksToHTML(newBlocks) });
  },

  handleAddBlock: (
    type: ContentBlock["type"],
    defaults?: Partial<ContentBlock>,
  ) => {
    const { blocks, activeInput } = get();
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      align: "left",
      content: "",
      ...(type === "heading" ? { level: "h2" } : {}),
      ...defaults,
    };

    let newBlocks = [...blocks];
    const activeIndex = blocks.findIndex((b) => b.id === activeInput);

    if (activeIndex !== -1) {
      newBlocks.splice(activeIndex + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    set({
      blocks: newBlocks,
      content: compileBlocksToHTML(newBlocks),
      activeInput: newBlock.id,
    });
  },

  handleBlockSelect: (
    id: string,
    formContainer: HTMLDivElement | null,
    previewContainer: HTMLDivElement | null,
  ) => {
    set({ activeInput: id });

    // 1. Scroll Right Panel (Form) to block card
    const formEl = document.getElementById(`form-${id}`);
    if (formEl && formContainer) {
      formContainer.scrollTo({
        top: formEl.offsetTop - formContainer.offsetTop - 12,
        behavior: "smooth",
      });
    }

    // 2. Scroll Center Panel (UI Preview) to corresponding preview element
    const previewEl = document.getElementById(`preview-${id}`);
    if (previewEl && previewContainer) {
      previewContainer.scrollTo({
        top: previewEl.offsetTop - previewContainer.offsetTop - 80,
        behavior: "smooth",
      });
    }
  },

  getReadingTime: () => {
    const { content } = get();
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (!text) return 0;
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  },
}));
