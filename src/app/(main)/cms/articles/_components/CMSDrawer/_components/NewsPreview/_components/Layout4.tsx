import React from "react";
import { FormInput } from "@/components";
import { NewsPreviewProps } from "../type";
import { ArticleHeader, SummaryBlock } from "./ArticleHeader";
import { BannerImage } from "./shared";
import { BlockList } from "./BlockList";

export const Layout4: React.FC<NewsPreviewProps> = ({
  title, category, thumbnail, summary, tags, allowComments,
  blocks, activeInput, onBlockSelect, getReadingTime,
  handleMoveBlock, handleDeleteBlock, handleBlockChange
}) => (
  <div className="max-w-210 mx-auto bg-white min-h-screen shadow-xs">
    <div className="p-8 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 lg:pb-12 border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-8">
          <ArticleHeader title={title} category={category} getReadingTime={getReadingTime} hideBorderTop />
          {tags.length > 0 && (
            <div className="space-y-2 pt-4 select-none">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Keyword Tags</span>
              <div className="flex flex-wrap gap-1">
                {tags.map((tg) => (
                  <span key={tg} className="text-[9px] font-bold bg-slate-50 text-slate-655 px-2 py-0.5 rounded-md border border-slate-100">#{tg}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-8">
          <BannerImage thumbnail={thumbnail} title={title} isRounded aspectClass="aspect-[16/10]" />
          <SummaryBlock summary={summary} />
          <BlockList
            blocks={blocks} activeInput={activeInput} onBlockSelect={onBlockSelect}
            onMoveBlock={handleMoveBlock} onDeleteBlock={handleDeleteBlock} onBlockChange={handleBlockChange}
          />
          {allowComments && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <span className="text-[10.5px] font-extrabold text-slate-800 uppercase tracking-widest block">Article Comments</span>
              <FormInput placeholder="Write your comment..." className="text-xs h-11" />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
