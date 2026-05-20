import { ContentBlock } from "../NewsPreview/type";

type SectionType = "section-basic" | "section-media" | "section-content" | "section-seo" | "section-settings";

export interface LeftPanelProps {
  sectionBasicCompleted: boolean;
  sectionMediaCompleted: boolean;
  sectionContentCompleted: boolean;
  sectionSEOCompleted: boolean;
  activeSection: string;
  handleTabClick: (section: SectionType) => void;
  handleAddBlock: (type: ContentBlock["type"]) => void;
  blocks: ContentBlock[];
  activeInput: string | null;
  handleBlockSelect: (blockId: string) => void;
  handleMoveBlock: (index: number, dir: "up" | "down") => void;
  handleDeleteBlock: (blockId: string) => void;
  handleBlockChange: (blockId: string, update: Partial<ContentBlock>) => void;
  currentSuggestion: { title: string; text: string };
}
