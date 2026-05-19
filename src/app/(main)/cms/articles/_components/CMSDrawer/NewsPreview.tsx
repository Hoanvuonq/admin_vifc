import React from "react";
import {
  User,
  Calendar,
  Clock,
  Compass,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2
} from "lucide-react";
import { FormInput } from "@/components";

export interface ContentBlock {
  id: string;
  type: "text" | "heading" | "image" | "quote" | "divider";
  align: "left" | "center" | "right";
  content: string;
  caption?: string;
  level?: "h2" | "h3";
}

interface NewsPreviewProps {
  title: string;
  category: string;
  thumbnail: string;
  summary: string;
  content: string;
  tags: string[];
  allowComments: boolean;
  blocks: ContentBlock[];
  activeInput: string | null;
  onBlockSelect: (blockId: string) => void;
  getReadingTime: () => number;
  getCategoryBadgeClass: (cat: string) => string;
  slug: string;
  centerPanelRef: React.RefObject<HTMLDivElement | null>;
  handleMoveBlock?: (index: number, dir: "up" | "down") => void;
  handleDeleteBlock?: (blockId: string) => void;
  handleBlockChange?: (blockId: string, update: Partial<ContentBlock>) => void;
}

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

  return (
    <div
      ref={centerPanelRef}
      className="flex-1 overflow-y-auto bg-slate-100/60 p-6 md:p-8 border-r border-slate-200/80 custom-scrollbar select-none"
    >
      {/* Browser Window Mockup Frame */}
      <div className="bg-white rounded-[28px] border border-slate-200/60 shadow-lg max-w-[720px] mx-auto overflow-hidden flex flex-col min-h-[820px] mb-8">

        {/* Browser Top Bar Mockup */}
        <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200/60 flex items-center justify-between gap-4 shrink-0">
          {/* Traffic lights controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20" />
          </div>

          {/* Browser address bar */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1 text-[10px] text-gray-400 font-semibold truncate flex items-center justify-center gap-1 shadow-3xs max-w-[420px]">
            <span className="text-gray-300">https://</span>
            <span className="text-slate-600 font-bold">vifc.vn/news/</span>
            <span className="text-orange-500 truncate font-bold">{slug || "web3-commerce-xu-huong-mua-sam"}</span>
          </div>

          {/* Dummy navigation actions */}
          <div className="flex gap-2 text-slate-400 text-[10px] font-extrabold shrink-0">
            <span className="hover:text-slate-600 cursor-pointer">⟨</span>
            <span className="hover:text-slate-600 cursor-pointer">⟩</span>
            <span className="hover:text-slate-600 cursor-pointer">⟳</span>
          </div>
        </div>

        {/* Website Navigation Header Mockup */}
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-150 flex justify-between items-center text-[10.5px] font-extrabold text-gray-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Compass size={13} className="text-orange-500" />
            <span className="uppercase tracking-widest text-slate-700">CỔNG THÔNG TIN VIFC</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-700 cursor-pointer">Trang chủ</span>
            <span className="hover:text-slate-700 cursor-pointer">Tin tức</span>
            <span className="text-orange-500 font-bold">Chi tiết</span>
          </div>
        </div>

        {/* Actual Article Page Preview (Mock Render) */}
        <div className="p-6 md:p-10 space-y-7 flex-1">

          {/* Breadcrumbs */}
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Trang chủ &gt; Tin tức &gt; <span className="text-orange-500 font-extrabold">{category}</span>
          </div>

          {/* Category Tag Badge */}
          <div>
            <span className={`inline-block text-[9.5px] font-extrabold uppercase px-3 py-1 rounded-full ${getCategoryBadgeClass(category)}`}>
              {category}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
            {title || "Tiêu đề bài viết..."}
          </h1>

          {/* Meta details row */}
          <div className="flex flex-wrap items-center gap-4 border-y border-slate-100 py-3.5 text-[10px] font-bold text-gray-400">
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-gray-400" />
              <span>Tác giả: Admin VIFC</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-gray-400" />
              <span>{new Date().toLocaleDateString("vi-VN")}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-gray-400" />
              <span>{getReadingTime()} phút đọc</span>
            </div>
          </div>

          {/* Large Hero/Featured Image */}
          {thumbnail && !thumbnail.includes("api.dicebear.com/7.x/shapes/svg") && (
            <div className="rounded-2xl overflow-hidden border border-slate-100 aspect-[16/9] shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnail} alt="Featured Hero image" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Summary Quote Box */}
          {summary && (
            <div className="p-5 bg-slate-50/80 rounded-2xl border-l-4 border-orange-500 italic text-[11.5px] leading-relaxed text-slate-650 font-bold shadow-3xs">
              {summary}
            </div>
          )}

          {/* Article blocks content body rendering */}
          <div className="space-y-6 pt-3">
            {blocks.map((block, index) => {
              const isBlockActive = activeInput === block.id;
              const blockStyle = block.align !== "left" ? { textAlign: block.align } : {};

              return (
                <div
                  key={block.id}
                  id={`preview-${block.id}`}
                  onClick={() => onBlockSelect(block.id)}
                  className={`relative group rounded-2xl p-2.5 -m-2.5 transition-all cursor-pointer ${isBlockActive ? "bg-orange-50/30 ring-1 ring-orange-200/50" : "hover:bg-slate-50/50"
                    }`}
                >
                  {isBlockActive && (
                    <>
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-orange-500 rounded-r-md" />
                      
                      {/* Floating actions toolbar for reordering and alignment */}
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


                  {/* Heading element */}
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

                  {/* Paragraph text element */}
                  {block.type === "text" && (
                    <p style={blockStyle} className="text-[11.5px] font-semibold leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {block.content || <span className="text-gray-300 italic font-medium">Nhập nội dung đoạn văn...</span>}
                    </p>
                  )}

                  {/* Image element */}
                  {block.type === "image" && (
                    <div style={blockStyle} className="space-y-1.5 py-1">
                      {block.content ? (
                        <div className="inline-block rounded-2xl overflow-hidden border border-slate-100 max-w-full shadow-3xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={block.content} alt={block.caption || ""} className="max-h-[350px] object-cover rounded-2xl" />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={22} />
                          <span className="text-[9px] font-bold mt-1 uppercase">Ảnh trống</span>
                        </div>
                      )}
                      {block.caption && (
                        <p className="text-[9.5px] text-gray-400 italic text-center font-bold">{block.caption}</p>
                      )}
                    </div>
                  )}

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

          {/* Tags list */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100">
              {tags.map((tg) => (
                <span key={tg} className="text-[9.5px] font-extrabold bg-slate-50 text-gray-600 px-2.5 py-0.5 rounded-md border border-slate-200/50">
                  #{tg}
                </span>
              ))}
            </div>
          )}

          {/* Comments section placeholder */}
          {allowComments && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <span className="text-[10.5px] font-extrabold text-slate-800 uppercase tracking-widest block">Bình luận bài viết</span>
              <FormInput
                placeholder="Viết bình luận bài viết của bạn..."
                className="text-xs h-11"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
