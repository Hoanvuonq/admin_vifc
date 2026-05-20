import React from "react";
import { NewsPreviewProps } from "../type";
import { ArticleHeader, SummaryBlock } from "./ArticleHeader";
import { BannerImage, TagsAndComments } from "./shared";
import { BlockList } from "./BlockList";

export const Layout5: React.FC<NewsPreviewProps> = ({
  title, category, thumbnail, summary, tags, allowComments,
  blocks, activeInput, onBlockSelect, getReadingTime,
  handleMoveBlock, handleDeleteBlock, handleBlockChange
}) => (
  <div className="max-w-200 mx-auto bg-white min-h-screen shadow-xs rounded-3xl overflow-hidden">
    <div className="relative w-full overflow-hidden">
      <BannerImage thumbnail={thumbnail} title={title} aspectClass="aspect-[21/9] md:aspect-[16/7]" />
    </div>
    <div className="relative z-10 -mt-16 md:-mt-24 mx-6 md:mx-12 p-6 md:p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-150 shadow-xl space-y-4">
      <ArticleHeader title={title} category={category} getReadingTime={getReadingTime} hideBorderTop />
      <SummaryBlock summary={summary} />
    </div>
    <div className="p-8 md:p-12 pt-8 space-y-12">
      <BlockList
        blocks={blocks} activeInput={activeInput} onBlockSelect={onBlockSelect}
        onMoveBlock={handleMoveBlock} onDeleteBlock={handleDeleteBlock} onBlockChange={handleBlockChange}
      />
      <TagsAndComments tags={tags} allowComments={allowComments} />
    </div>
  </div>
);
