import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Check,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Plus,
  Quote,
  Trash2,
  X
} from "lucide-react";
import React, { useState } from "react";
import { LeftPanelProps } from "./type";
import { ContentBlock } from "../NewsPreview/type";


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
  currentSuggestion
}) => {
  const [expandedAlignBlockId, setExpandedAlignBlockId] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeInput && blocks.some(b => b.id === activeInput)) {
      setExpandedAlignBlockId(activeInput);
    }
  }, [activeInput, blocks]);

  return (
    <div className="hidden lg:flex w-87.5 shrink-0 bg-slate-50/50 p-4 flex-col gap-4 overflow-y-auto select-none custom-scrollbar">
      
      <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-1.5">
        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider px-1 block pb-1.5">
          Định vị danh mục
        </span>
        <div className="space-y-1.5 pt-1">
          {[
            { id: "section-basic" as const, label: "1. Thông tin cơ bản", completed: sectionBasicCompleted },
            { id: "section-media" as const, label: "2. Ảnh & Tóm tắt", completed: sectionMediaCompleted },
            { id: "section-content" as const, label: "3. Nội dung bài viết", completed: sectionContentCompleted },
            { id: "section-seo" as const, label: "4. Tối ưu hóa SEO", completed: sectionSEOCompleted },
            { id: "section-settings" as const, label: "5. Cài đặt xuất bản", completed: true },
          ].map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleTabClick(section.id)}
                className={`w-full flex items-center justify-between py-2 px-3 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border transition-all duration-200 ${isActive
                  ? "bg-orange-50 text-orange-600 border-orange-100 shadow-3xs"
                  : "bg-white text-gray-500 border-slate-100 hover:bg-slate-55 hover:text-gray-700"
                  }`}
              >
                <span>{section.label}</span>
                {section.completed && (
                  <div className="w-3.5 h-3.5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={8} strokeWidth={3.5} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Blocks Panel */}
      <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-2.5">
        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider px-1 block pb-1.5">
          Thêm phần tử trang
        </span>
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {[
            { type: "text", label: "Văn bản", icon: FileText, hover: "hover:border-orange-200 hover:text-orange-500" },
            { type: "heading", label: "Tiêu đề", icon: Plus, hover: "hover:border-blue-200 hover:text-blue-500" },
            { type: "image", label: "Hình ảnh", icon: ImageIcon, hover: "hover:border-emerald-200 hover:text-emerald-500" },
            { type: "quote", label: "Trích dẫn", icon: Quote, hover: "hover:border-purple-200 hover:text-purple-500" },
            { type: "divider", label: "Kẻ chia", icon: X, hover: "hover:border-amber-200 hover:text-amber-500" },
          ].map((btn) => (
            <button
              key={btn.type}
              type="button"
              onClick={() => handleAddBlock(btn.type as ContentBlock["type"])}
              className={`flex flex-col items-center justify-center p-2.5 aspect-square bg-slate-50/40 border border-slate-200/60 rounded-xl text-[9.5px] font-extrabold text-slate-500 transition-all duration-200 hover:bg-slate-50 active:scale-95 shadow-3xs ${btn.hover}`}
            >
              <btn.icon size={13} className="mb-1 shrink-0" />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Block Stack Manager (No Height Restriction) */}
      <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-2.5">
        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider px-1 block pb-1.5">
          Quản lý bố cục ({blocks.length})
        </span>

        <div className="space-y-2">
          {blocks.map((block, index) => {
            const isBlockActive = activeInput === block.id;
            const isExpanded = expandedAlignBlockId === block.id;
            
            let previewText = block.content.replace(/<[^>]*>/g, "").trim();
            if (!previewText && block.type === "image") previewText = block.caption || "Hình ảnh bài viết";
            if (!previewText && block.type === "divider") previewText = "— Đường kẻ phân cách —";

            return (
              <div
                key={block.id}
                onClick={() => {
                  handleBlockSelect(block.id);
                  if (activeInput !== block.id) {
                    setExpandedAlignBlockId(block.id);
                  }
                }}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 relative ${isBlockActive
                  ? "border-orange-200 border-r-4 border-r-orange-500 bg-white shadow-3xs"
                  : "border-slate-200/65 bg-white hover:border-slate-300"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                    block.type === "heading" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    block.type === "image" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    block.type === "quote" ? "bg-purple-50 text-purple-600 border-purple-100" :
                    block.type === "divider" ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-slate-50 text-slate-500 border-slate-100"
                  }`}>
                    {block.type === "heading" ? `Tiêu đề ${block.level || "H2"}` :
                      block.type === "image" ? "Hình ảnh" :
                        block.type === "quote" ? "Trích dẫn" :
                          block.type === "divider" ? "Kẻ chia" : "Văn bản"}
                  </span>

                  {block.type !== "divider" && !isExpanded && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] text-gray-400 font-bold flex items-center gap-0.5 border border-slate-100 bg-slate-50 px-1 py-0.5 rounded">
                        {block.align === "center" ? <AlignCenter size={7} /> : block.align === "right" ? <AlignRight size={7} /> : <AlignLeft size={7} />}
                        <span className="capitalize">{block.align === "center" ? "Giữa" : block.align === "right" ? "Phải" : "Trái"}</span>
                      </span>

                      {isBlockActive && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedAlignBlockId(block.id);
                          }}
                          className="p-1 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors flex items-center gap-0.5 text-[8px] font-extrabold px-1.5 border border-orange-100 shadow-3xs"
                          title="Sửa căn lề"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                          </svg>
                          <span>SỬA</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {previewText && (
                  <p className="text-[10px] font-semibold text-gray-700 truncate px-0.5 leading-snug">
                    {previewText}
                  </p>
                )}

                {/* SLIDE DOWN ALIGNMENT CONTROLS */}
                {block.type !== "divider" && (
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? "max-h-13.75 opacity-100 mt-1 border-t border-slate-100 pt-2 flex items-center justify-between"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                      {[
                        { align: "left" as const, icon: AlignLeft, label: "Trái" },
                        { align: "center" as const, icon: AlignCenter, label: "Giữa" },
                        { align: "right" as const, icon: AlignRight, label: "Phải" },
                      ].map((opt) => (
                        <button
                          key={opt.align}
                          type="button"
                          onClick={() => handleBlockChange(block.id, { align: opt.align })}
                          className={`p-1 px-1.5 rounded flex items-center gap-1 justify-center transition-all ${
                            block.align === opt.align
                              ? "bg-white text-orange-600 border border-slate-200 shadow-3xs font-extrabold"
                              : "text-gray-400 hover:text-gray-600 hover:bg-slate-100 border border-transparent"
                          }`}
                          title={`Căn ${opt.label}`}
                        >
                          <opt.icon size={10} />
                          <span className="text-[8px] font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedAlignBlockId(null)}
                      className="flex items-center justify-center py-1 px-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all font-bold text-[9px] gap-1 shadow-3xs"
                    >
                      <Check size={10} strokeWidth={3.5} />
                      <span>Lưu</span>
                    </button>
                  </div>
                )}

                {isBlockActive && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(index, "up")}
                        disabled={index === 0}
                        className="p-1 px-2 rounded-lg bg-slate-50 text-gray-500 hover:text-orange-500 hover:bg-[#eaeaea] disabled:opacity-20 border border-slate-200 shadow-3xs transition-colors"
                      >
                        <ArrowUp size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(index, "down")}
                        disabled={index === blocks.length - 1}
                        className="p-1 px-2 rounded-lg bg-slate-50 text-gray-500 hover:text-orange-500 hover:bg-[#eaeaea] disabled:opacity-20 border border-slate-200 shadow-3xs transition-colors"
                      >
                        <ArrowDown size={10} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="p-1 px-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100/50 shadow-3xs transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick instructions suggestions box */}
      <div className="bg-linear-to-b from-orange-50/20 to-amber-50/10 p-3.5 rounded-2xl border border-orange-100/30">
        <span className="text-[9.5px] font-extrabold text-orange-600 uppercase tracking-wide flex items-center gap-1">
          <HelpCircle size={12} className="text-orange-500 shrink-0" />
          {currentSuggestion.title}
        </span>
        <p className="text-[9.5px] font-semibold text-slate-500 leading-relaxed mt-1">
          {currentSuggestion.text}
        </p>
      </div>
    </div>
  );
};
