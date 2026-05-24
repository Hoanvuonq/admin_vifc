export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  layouts?: string | string[];
  summary: string;
  content: string;
  category: string[];
  tags: string[];
  thumbnail: string;
  authorName: string;
  authorAvatar: string;
  status: "PUBLISHED" | "DRAFT" | "PENDING_REVIEW" | "ARCHIVED";
  createdDate: string;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  allowComments?: boolean;
  isFeatured?: boolean;
  scheduledDate?: string;
  pdfUrl?: string;
  pdfCover?: string;
  pdfName?: string;
  pdfRole?: "free" | "base" | "standard" | "premium";
}
