import { NewsItem } from "../../../(articles)/_pages/types";
import { ContentBlock } from "../NewsPreview/type";

export interface RightPanelProps {
  rightPanelRef: React.RefObject<HTMLDivElement | null>;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
}
