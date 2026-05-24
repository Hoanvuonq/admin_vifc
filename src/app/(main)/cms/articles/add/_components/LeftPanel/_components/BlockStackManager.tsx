import React from "react";
import {
  ArrowDown, ArrowUp, Trash2
} from "lucide-react";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

const BLOCK_TYPE_STYLES: Record<string, string> = {
  heading: "bg-blue-50 text-blue-600 border-blue-100",
  image: "bg-emerald-50 text-emerald-600 border-emerald-100",
  text: "bg-slate-50 text-slate-500 border-slate-100",
  pdf: "bg-rose-50 text-rose-600 border-rose-100",
};

const BLOCK_TYPE_LABELS: Record<string, string> = {
  heading: "Heading",
  image: "Image",
  text: "Paragraph",
  pdf: "PDF Block",
};

export const BlockStackManager: React.FC<{ formContainerRef?: React.RefObject<HTMLDivElement | null>; previewContainerRef?: React.RefObject<HTMLDivElement | null>; }> = ({ formContainerRef, previewContainerRef }) => {
  const {
    blocks, activeInput,
    handleBlockSelect, handleMoveBlock, handleDeleteBlock
  } = useArticleEditorStore();

  return (
    <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-2.5">
      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest px-1.5 block pb-1 border-b border-slate-100/50">
        Layout Manager ({blocks.length})
      </span>

      <div className="space-y-2">
        {blocks.map((block, index) => {
          const isActive = activeInput === block.id;

          let previewText = block.content.replace(/<[^>]*>/g, "").trim();
          if (!previewText && block.type === "image") previewText = block.caption || "Article Image";

          const typeLabel = block.type === "heading"
            ? `Heading ${block.level || "H2"}`
            : BLOCK_TYPE_LABELS[block.type] ?? block.type;

          return (
            <div
              key={block.id}
              onClick={() => {
                handleBlockSelect(block.id, formContainerRef?.current || null, previewContainerRef?.current || null);
              }}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 relative ${isActive
                ? "border-orange-200 border-r-4 border-r-orange-500 bg-white shadow-3xs"
                : "border-slate-200/65 bg-white hover:border-slate-300"
                }`}
            >
              {/* Type badge + align/edit row */}
              <div className="flex items-center justify-between">
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${BLOCK_TYPE_STYLES[block.type] ?? BLOCK_TYPE_STYLES.text}`}>
                  {typeLabel}
                </span>
              </div>

              {/* Content preview */}
              {previewText && (
                <p className="text-[10px] font-semibold text-gray-700 truncate px-0.5 leading-snug">{previewText}</p>
              )}

              {/* Move/delete controls */}
              {isActive && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {[
                      { dir: "up" as const, Icon: ArrowUp, disabled: index === 0 },
                      { dir: "down" as const, Icon: ArrowDown, disabled: index === blocks.length - 1 },
                    ].map(({ dir, Icon, disabled }) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => handleMoveBlock(index, dir)}
                        disabled={disabled}
                        className="p-1 px-2 rounded-lg bg-slate-50 text-gray-500 hover:text-orange-500 hover:bg-[#eaeaea] disabled:opacity-20 border border-slate-200 shadow-3xs transition-colors"
                      >
                        <Icon size={10} />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
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
  );
};
