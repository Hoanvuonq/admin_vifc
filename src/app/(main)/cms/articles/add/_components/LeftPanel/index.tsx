import React from "react";
import { LeftPanelProps } from "./type";
import { SectionNavigator } from "./_components/SectionNavigator";
import { AddBlockPanel } from "./_components/AddBlockPanel";
import { BlockStackManager } from "./_components/BlockStackManager";
import { SuggestionBox } from "./_components/SuggestionBox";

export const LeftPanel: React.FC<LeftPanelProps> = ({
  sectionBasicCompleted,
  sectionMediaCompleted,
  sectionContentCompleted,
  sectionSEOCompleted,
  activeSection,
  handleTabClick,
  handleAddBlock,
  blocks,
  activeInput,
  handleBlockSelect,
  handleMoveBlock,
  handleDeleteBlock,
  handleBlockChange,
  currentSuggestion,
}) => (
  <div className="hidden lg:flex w-87.5 shrink-0 bg-slate-50/50 p-4 flex-col gap-4 overflow-y-auto select-none custom-scrollbar">
    <SectionNavigator
      activeSection={activeSection}
      handleTabClick={handleTabClick}
      sectionBasicCompleted={sectionBasicCompleted}
      sectionMediaCompleted={sectionMediaCompleted}
      sectionContentCompleted={sectionContentCompleted}
      sectionSEOCompleted={sectionSEOCompleted}
    />
    <AddBlockPanel handleAddBlock={handleAddBlock} />
    <BlockStackManager
      blocks={blocks}
      activeInput={activeInput}
      handleBlockSelect={handleBlockSelect}
      handleMoveBlock={handleMoveBlock}
      handleDeleteBlock={handleDeleteBlock}
      handleBlockChange={handleBlockChange}
    />
    <SuggestionBox title={currentSuggestion.title} text={currentSuggestion.text} />
  </div>
);
