import React from "react";
import { LeftPanelProps } from "./type";
import { SectionNavigator } from "./_components/SectionNavigator";
import { AddBlockPanel } from "./_components/AddBlockPanel";
import { BlockStackManager } from "./_components/BlockStackManager";
import { SuggestionBox } from "./_components/SuggestionBox";
import { useArticleEditorStore } from "../../_store/useArticleEditorStore";

export const LeftPanel: React.FC<LeftPanelProps> = ({
  formContainerRef,
  previewContainerRef
}) => {
  const { setActiveSection } = useArticleEditorStore();
  const handleTabClick = (sectionId: any) => {
    const container = formContainerRef?.current;
    const target = document.getElementById(sectionId);
    if (container && target) {
      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 12,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="hidden lg:flex w-87.5 shrink-0 bg-slate-50/50 p-4 flex-col gap-4 overflow-y-auto select-none custom-scrollbar">
      <SectionNavigator handleTabClick={handleTabClick} />
      <AddBlockPanel />
      <BlockStackManager formContainerRef={formContainerRef} previewContainerRef={previewContainerRef} />
      <SuggestionBox />
    </div>
  );
};
