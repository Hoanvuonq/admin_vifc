import React from "react";
import { LayoutProps } from "../type";
import { ArticleHeader, SummaryBlock } from "./ArticleHeader";
import { BannerImage, TagsAndComments } from "./shared";
import { BlockList } from "./BlockList";

export const Layout1: React.FC<LayoutProps> = ({
  title, category, thumbnail, summary, tags, allowComments,
  blocks, activeInput, onBlockSelect, getReadingTime,
  handleMoveBlock, handleDeleteBlock, handleBlockChange,
}) => (
  <div className="max-w-190 mx-auto bg-white min-h-screen shadow-xs">
    <BannerImage thumbnail={thumbnail} title={title} />
    <div className="p-8 md:p-12 space-y-12">
      <ArticleHeader title={title} category={category} getReadingTime={getReadingTime} />
      <SummaryBlock summary={summary} />
      <BlockList
        blocks={blocks} activeInput={activeInput} onBlockSelect={onBlockSelect}
        onMoveBlock={handleMoveBlock} onDeleteBlock={handleDeleteBlock} onBlockChange={handleBlockChange}
      />

      <TagsAndComments tags={tags} allowComments={allowComments} />
    </div>
  </div>
);
