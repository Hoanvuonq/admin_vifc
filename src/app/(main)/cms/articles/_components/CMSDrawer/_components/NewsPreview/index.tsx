import { FormInput } from "@/components";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Image as ImageIcon,
  Trash2,
  User
} from "lucide-react";
import React, { useState } from "react";
import { ContentBlock, NewsPreviewProps } from "./type";


export const NewsPreview: React.FC<NewsPreviewProps> = ({
  title,
  category,
  thumbnail,
  summary,
  tags,
  allowComments,
  blocks,
  activeInput,
  onBlockSelect,
  getReadingTime,
  getCategoryBadgeClass,
  slug,
  centerPanelRef,
  handleMoveBlock,
  handleDeleteBlock,
  handleBlockChange
}) => {
  const [layout, setLayout] = useState<"layout1" | "layout2">("layout1");

  const renderImageElement = (block: ContentBlock) => {
    return block.content ? (
      <div className="inline-block rounded-2xl overflow-hidden border border-slate-100 max-w-full shadow-3xs w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.content} alt={block.caption || ""} className="w-full max-h-100 object-cover rounded-2xl" />
      </div>
    ) : (
      <div className="w-full h-32 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
        <ImageIcon size={22} className="text-slate-300" />
        <span className="text-[9px] font-bold mt-1 uppercase text-slate-400">Ảnh trống</span>
      </div>
    );
  };

  const renderTitleBlock = () => (
    <div className="space-y-4">
      {/* Breadcrumbs / Category */}
      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest select-none">
        <span>Tin tức</span>
        <span>&gt;</span>
        <span className="text-orange-500 font-extrabold">{category}</span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
        {title || "Tiêu đề bài viết..."}
      </h1>

      {/* Meta info */}
      <div className="flex items-center gap-3.5 text-[9.5px] font-bold text-gray-400 border-y border-slate-100 py-3 select-none">
        <span className="flex items-center gap-1"><User size={12} /> Admin VIFC</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date().toLocaleDateString("vi-VN")}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {getReadingTime()} phút đọc</span>
      </div>
    </div>
  );

  const renderBannerImage = (isRounded: boolean = false) => {
    const hasImage = thumbnail && !thumbnail.includes("api.dicebear.com/7.x/shapes/svg");
    return (
      <div className={`w-full aspect-21/9 overflow-hidden bg-slate-50 relative ${isRounded ? "rounded-2xl shadow-2xs" : ""}`}>
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-orange-500/10 via-amber-500/5 to-white flex flex-col items-center justify-center text-slate-400 select-none">
            <ImageIcon size={32} className="stroke-[1.2] text-orange-500/50 mb-1 animate-pulse" />
            <span className="text-[8.5px] font-extrabold text-orange-600/50 uppercase tracking-widest">Ảnh đại diện bài viết</span>
          </div>
        )}
        {hasImage && !isRounded && <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />}
      </div>
    );
  };

  const renderSummaryBlock = () => {
    if (!summary) return null;
    return (
      <div className="p-5 bg-slate-50/85 rounded-2xl border-l-4 border-orange-500 italic text-[11.5px] leading-relaxed text-slate-700 font-bold shadow-3xs">
        {summary}
      </div>
    );
  };

  const renderBlocks = () => (
    <div className="space-y-10 pt-4">
      {blocks.map((block, index) => {
        const isBlockActive = activeInput === block.id;
        const blockStyle = block.align !== "left" ? { textAlign: block.align } : {};

        return (
          <div
            key={block.id}
            id={`preview-${block.id}`}
            onClick={() => onBlockSelect(block.id)}
            className={`relative group rounded-xl px-4 -mx-4 py-3 transition-all cursor-pointer ${
              isBlockActive ? "bg-orange-50/30 ring-1 ring-orange-200/50" : "hover:bg-slate-50/50"
            }`}
          >
            {isBlockActive && (
              <>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-orange-500 rounded-r-md" />
                
                <div 
                  className="absolute -top-6 right-2 bg-white border border-slate-200/80 rounded-xl px-1.5 py-0.5 flex items-center gap-1 shadow-md z-30 transition-all select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (handleMoveBlock) handleMoveBlock(index, "up");
                    }}
                    disabled={index === 0}
                    className="p-1 rounded text-gray-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-20 transition-colors"
                    title="Di chuyển lên"
                  >
                    <ArrowUp size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (handleMoveBlock) handleMoveBlock(index, "down");
                    }}
                    disabled={index === blocks.length - 1}
                    className="p-1 rounded text-gray-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-20 transition-colors"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown size={10} />
                  </button>

                  {block.type !== "divider" && (
                    <>
                      <div className="w-px h-3 bg-gray-200 mx-0.5" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleBlockChange) handleBlockChange(block.id, { align: "left" });
                        }}
                        className={`p-1 rounded transition-colors ${block.align === "left" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:bg-slate-50 hover:text-slate-800"}`}
                        title="Căn trái"
                      >
                        <AlignLeft size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleBlockChange) handleBlockChange(block.id, { align: "center" });
                        }}
                        className={`p-1 rounded transition-colors ${block.align === "center" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:bg-slate-50 hover:text-slate-800"}`}
                        title="Căn giữa"
                      >
                        <AlignCenter size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleBlockChange) handleBlockChange(block.id, { align: "right" });
                        }}
                        className={`p-1 rounded transition-colors ${block.align === "right" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:bg-slate-50 hover:text-slate-800"}`}
                        title="Căn phải"
                      >
                        <AlignRight size={10} />
                      </button>
                    </>
                  )}

                  <div className="w-px h-3 bg-gray-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (handleDeleteBlock) handleDeleteBlock(block.id);
                    }}
                    className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                    title="Xóa block"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </>
            )}

            {block.type === "heading" && (
              block.level === "h3" ? (
                <h3 style={blockStyle} className="text-sm font-extrabold text-slate-800 leading-snug">
                  {block.content || <span className="text-gray-300 italic font-medium">Nhập tiêu đề H3...</span>}
                </h3>
              ) : (
                <h2 style={blockStyle} className="text-base font-extrabold text-slate-900 leading-snug">
                  {block.content || <span className="text-gray-300 italic font-medium">Nhập tiêu đề H2...</span>}
                </h2>
              )
            )}

            {block.type === "text" && (
              <p style={blockStyle} className="text-[11.5px] font-semibold leading-relaxed text-slate-650 whitespace-pre-wrap">
                {block.content || <span className="text-gray-300 italic font-medium">Nhập nội dung đoạn văn...</span>}
              </p>
            )}

            {block.type === "image" && (() => {
              const imgLayout = block.imageLayout || "full";
              const padding = block.imagePadding || "medium";
              const direction = block.imageDirection || "image-text";
              const sideText = block.imageSideText || "";

              if (imgLayout === "side-by-side") {
                const imgCol = (
                  <div className="w-full">
                    {renderImageElement(block)}
                    {block.caption && (
                      <p className="text-[9.5px] text-gray-450 italic text-center font-bold mt-1.5">{block.caption}</p>
                    )}
                  </div>
                );
                
                const textCol = (
                  <div className="w-full flex flex-col justify-center">
                    <p className="text-[11.5px] font-semibold leading-relaxed text-slate-650 whitespace-pre-wrap">
                      {sideText || <span className="text-gray-300 italic font-medium">Nhập nội dung văn bản bên cạnh ảnh ở bảng nhập liệu...</span>}
                    </p>
                  </div>
                );

                return (
                  <div className="py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                      {direction === "image-text" ? (
                        <>
                          {imgCol}
                          {textCol}
                        </>
                      ) : (
                        <>
                          {textCol}
                          {imgCol}
                        </>
                      )}
                    </div>
                  </div>
                );
              }

              // Full layout with padding
              let widthClass = "max-w-[85%] mx-auto";
              if (padding === "none") widthClass = "w-full max-w-full";
              else if (padding === "small") widthClass = "max-w-[95%] mx-auto";
              else if (padding === "large") widthClass = "max-w-[70%] mx-auto";

              return (
                <div className="py-2 w-full text-center">
                  <div className={`${widthClass} transition-all duration-300`}>
                    {renderImageElement(block)}
                    {block.caption && (
                      <p className="text-[9.5px] text-gray-450 italic text-center font-bold mt-1.5">{block.caption}</p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Quote element */}
            {block.type === "quote" && (
              <blockquote style={blockStyle} className="border-l-3 border-purple-400 pl-4 py-1.5 font-bold italic text-[11.5px] text-purple-700 bg-purple-50/20 rounded-r-xl">
                {block.content || <span className="text-gray-300 italic font-medium">Nhập nội dung trích dẫn...</span>}
              </blockquote>
            )}

            {/* Divider element */}
            {block.type === "divider" && (
              <div className="py-4 flex items-center justify-center">
                <div className="w-1/3 h-px bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-3" />
                <div className="w-1/3 h-px bg-slate-200" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderTagsAndComments = () => (
    <>
      {/* Tags list */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100 mt-6 select-none">
          {tags.map((tg) => (
            <span key={tg} className="text-[9.5px] font-extrabold bg-slate-50 text-gray-600 px-2.5 py-0.5 rounded-md border border-slate-200/50">
              #{tg}
            </span>
          ))}
        </div>
      )}

      {/* Comments section placeholder */}
      {allowComments && (
        <div className="pt-8 border-t border-slate-100 space-y-4 mt-6">
          <span className="text-[10.5px] font-extrabold text-slate-800 uppercase tracking-widest block select-none">Bình luận bài viết</span>
          <FormInput
            placeholder="Viết bình luận bài viết của bạn..."
            className="text-xs h-11"
          />
        </div>
      )}
    </>
  );

  return (
    <div
      ref={centerPanelRef}
      id="center-preview-panel"
      className="flex-1 overflow-y-auto bg-slate-100/40 custom-scrollbar select-none relative"
    >
      {/* Sticky Layout Toggle Selector bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4 shrink-0 select-none shadow-3xs">
        <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Bố cục giao diện trang tin
        </div>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
          <button
            type="button"
            onClick={() => setLayout("layout1")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[9.5px] font-extrabold transition-all duration-200 ${
              layout === "layout1"
                ? "bg-white text-orange-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Layout 1 (Banner trên)
          </button>
          <button
            type="button"
            onClick={() => setLayout("layout2")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[9.5px] font-extrabold transition-all duration-200 ${
              layout === "layout2"
                ? "bg-white text-orange-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Layout 2 (Banner dưới)
          </button>
        </div>
      </div>

      {/* Main Web Page Content - Rendering the actual detail template */}
      {layout === "layout1" ? (
        <div className="max-w-[760px] mx-auto bg-white min-h-screen shadow-xs">
          {renderBannerImage(false)}
          <div className="p-8 md:p-12 space-y-12">
            {renderTitleBlock()}
            {renderSummaryBlock()}
            {renderBlocks()}
            {renderTagsAndComments()}
          </div>
        </div>
      ) : (
        <div className="max-w-[760px] mx-auto bg-white min-h-screen shadow-xs">
          <div className="p-8 md:p-12 pb-8 space-y-8">
            {renderTitleBlock()}
            {renderSummaryBlock()}
          </div>
          <div className="px-8 md:px-12 py-4">
            {renderBannerImage(true)}
          </div>
          <div className="p-8 md:p-12 pt-8 space-y-12">
            {renderBlocks()}
            {renderTagsAndComments()}
          </div>
        </div>
      )}
    </div>
  );
};

