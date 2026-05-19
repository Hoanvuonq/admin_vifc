export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail: string;
  authorName: string;
  authorAvatar: string;
  status: "PUBLISHED" | "DRAFT" | "PENDING_REVIEW" | "ARCHIVED";
  createdDate: string;
  views: number;
  
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;

  // Settings
  allowComments?: boolean;
  isFeatured?: boolean;
  scheduledDate?: string;
}
