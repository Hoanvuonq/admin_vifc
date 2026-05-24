import { ContentBlock } from "../NewsPreview/type";

type SectionType =
  | "section-basic"
  | "section-media"
  | "section-content"
  | "section-seo"
  | "section-pdf"
  | "section-settings";

export interface LeftPanelProps {
  formContainerRef?: React.RefObject<HTMLDivElement | null>;
  previewContainerRef?: React.RefObject<HTMLDivElement | null>;
  pdfUrl?: string;
  pdfCover?: string;
  pdfName?: string;
}
