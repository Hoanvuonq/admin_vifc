"use client";
import React from "react";
import { LayoutProps } from "../type";
import { ArticleHeader, SummaryBlock } from "./ArticleHeader";
import { BannerImage, TagsAndComments } from "./shared";
import { BlockList } from "./BlockList";

export const Layout2: React.FC<LayoutProps> = ({
  title, category, thumbnail, summary, tags, allowComments,
  blocks, activeInput, onBlockSelect, getReadingTime,
  handleMoveBlock, handleDeleteBlock, handleBlockChange,
}) => (
  <div className="max-w-190 mx-auto bg-white min-h-screen shadow-xs">
    <div className="p-8 md:p-12 pb-6 space-y-8">
      <ArticleHeader title={title} category={category} getReadingTime={getReadingTime} />
    </div>
    <div className="px-8 md:px-12 pb-6">
      <BannerImage thumbnail={thumbnail} title={title} isRounded />
    </div>
    <div className="p-8 md:p-12 pt-0 space-y-12">
      <SummaryBlock summary={summary} />
      <BlockList
        blocks={blocks} activeInput={activeInput} onBlockSelect={onBlockSelect}
        onMoveBlock={handleMoveBlock} onDeleteBlock={handleDeleteBlock} onBlockChange={handleBlockChange}
      />
      <TagsAndComments tags={tags} allowComments={allowComments} />
    </div>
  </div>
);
