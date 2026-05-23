import React from "react";
import { NewsPreviewProps } from "../type";
import { ArticleHeader, SummaryBlock } from "./ArticleHeader";
import { BannerImage, TagsAndComments, PDFPreview } from "./shared";
import { BlockList } from "./BlockList";

export const Layout2: React.FC<NewsPreviewProps> = ({
  title, category, thumbnail, summary, tags, allowComments,
  blocks, activeInput, onBlockSelect, getReadingTime,
  handleMoveBlock, handleDeleteBlock, handleBlockChange,
  pdfUrl, pdfCover, pdfName
}) => (
  <div className="max-w-190 mx-auto bg-white min-h-screen shadow-xs">
    <div className="p-8 md:p-12 pb-8 space-y-8">
      <ArticleHeader title={title} category={category} getReadingTime={getReadingTime} />
      <SummaryBlock summary={summary} />
    </div>
    <div className="px-8 md:px-12 py-4">
      <BannerImage thumbnail={thumbnail} title={title} isRounded />
    </div>
    <div className="p-8 md:p-12 pt-8 space-y-12">
      <BlockList
        blocks={blocks} activeInput={activeInput} onBlockSelect={onBlockSelect}
        onMoveBlock={handleMoveBlock} onDeleteBlock={handleDeleteBlock} onBlockChange={handleBlockChange}
      />
      <PDFPreview url={pdfUrl} cover={pdfCover} name={pdfName} />
      <TagsAndComments tags={tags} allowComments={allowComments} />
    </div>
  </div>
);
