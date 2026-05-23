// ─── Block Types ────────────────────────────────────────────

export interface HeadingBlock {
  type: "heading";
  level: "2" | "3" | "4";
  content: string;
}

export interface TextBlock {
  type: "text";
  content: string;
}

export interface ImageBlock {
  type: "image";
  url: string;
}

export type PdfActiveRole = "free" | "base" | "standard" | "premium";

export interface PdfBlock {
  type: "pdf";
  url: string;
  thumbnail?: string;
  activeRole: PdfActiveRole;
  name?: string;
}

export type ArticleBlock = HeadingBlock | TextBlock | ImageBlock | PdfBlock;

// ─── Article ────────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  slug: string;
  layouts: string[];
  summary: string;
  createdAt: string;
  updatedAt: string;
  blocks: ArticleBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}
