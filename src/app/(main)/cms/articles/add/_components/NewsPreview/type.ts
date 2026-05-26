export interface ContentBlock {
  id: string;
  type: "text" | "html" | "heading" | "image" | "pdf";
  align: "left" | "center" | "right";
  content: string;
  caption?: string;
  level?: "h2" | "h3";
  imageLayout?: "full" | "side-by-side";
  imageSideText?: string;
  imageDirection?: "image-text" | "text-image";
  imagePadding?: "none" | "small" | "medium" | "large";
  thumbnailUrl?: string;
  activeRole?: "free" | "base" | "standard" | "premium";
  file?: File;
}

export interface LayoutProps {
  title: string;
  category: string[];
  thumbnail: string;
  summary: string;
  content: string;
  tags: string[];
  allowComments: boolean;
  blocks: ContentBlock[];
  activeInput: string | null;
  onBlockSelect: (blockId: string) => void;
  getReadingTime: () => number;
  slug: string;
  centerPanelRef: React.RefObject<HTMLDivElement | null>;
  formContainerRef?: React.RefObject<HTMLDivElement | null>;
  handleMoveBlock?: (index: number, dir: "up" | "down") => void;
  handleDeleteBlock?: (blockId: string) => void;
  handleBlockChange?: (blockId: string, update: Partial<ContentBlock>) => void;
}

export interface NewsPreviewProps {
  centerPanelRef: React.RefObject<HTMLDivElement | null>;
  formContainerRef?: React.RefObject<HTMLDivElement | null>;
}
