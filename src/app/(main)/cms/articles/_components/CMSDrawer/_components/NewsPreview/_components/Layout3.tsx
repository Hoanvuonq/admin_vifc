import React from "react";
import { NewsPreviewProps } from "../type";
import { ArticleHeader, SummaryBlock } from "./ArticleHeader";
import { BannerImage, TagsAndComments } from "./shared";
import { BlockList } from "./BlockList";

export const Layout3: React.FC<NewsPreviewProps> = ({
  title, category, thumbnail, summary, tags, allowComments,
  blocks, activeInput, onBlockSelect, getReadingTime,
  handleMoveBlock, handleDeleteBlock, handleBlockChange
}) => (
  <div className="max-w-190 mx-auto bg-white min-h-screen shadow-xs">
    <div className="p-8 md:p-12 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-slate-100/80 pb-8">
        <div className="md:col-span-7 space-y-6">
          <ArticleHeader title={title} category={category} getReadingTime={getReadingTime} hideBorderTop />
          <SummaryBlock summary={summary} />
        </div>
        <div className="md:col-span-5">
          <BannerImage thumbnail={thumbnail} title={title} isRounded aspectClass="aspect-[4/3]" />
        </div>
      </div>
    </div>
    <div className="p-8 md:p-12 pt-4 space-y-12">
      <BlockList
        blocks={blocks} activeInput={activeInput} onBlockSelect={onBlockSelect}
        onMoveBlock={handleMoveBlock} onDeleteBlock={handleDeleteBlock} onBlockChange={handleBlockChange}
      />
      <TagsAndComments tags={tags} allowComments={allowComments} />
    </div>
  </div>
);
