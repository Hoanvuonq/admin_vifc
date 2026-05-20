import React, { useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight,
  ArrowDown, ArrowUp, Check, Trash2
} from "lucide-react";
import { ContentBlock } from "../../NewsPreview/type";

interface BlockStackManagerProps {
  blocks: ContentBlock[];
  activeInput: string | null;
  handleBlockSelect: (id: string) => void;
  handleMoveBlock: (index: number, dir: "up" | "down") => void;
  handleDeleteBlock: (id: string) => void;
  handleBlockChange: (id: string, update: Partial<ContentBlock>) => void;
}

const BLOCK_TYPE_STYLES: Record<string, string> = {
  heading: "bg-blue-50 text-blue-600 border-blue-100",
  image: "bg-emerald-50 text-emerald-600 border-emerald-100",
  quote: "bg-purple-50 text-purple-600 border-purple-100",
  divider: "bg-amber-50 text-amber-600 border-amber-100",
  text: "bg-slate-50 text-slate-500 border-slate-100",
};

const BLOCK_TYPE_LABELS: Record<string, string> = {
  heading: "Heading",
  image: "Image",
  quote: "Quote",
  divider: "Divider",
  text: "Paragraph",
};

const ALIGN_OPTS = [
  { align: "left" as const, icon: AlignLeft, label: "Left" },
  { align: "center" as const, icon: AlignCenter, label: "Center" },
  { align: "right" as const, icon: AlignRight, label: "Right" },
];

const AlignBadge: React.FC<{ align: string }> = ({ align }) => {
  const Icon = align === "center" ? AlignCenter : align === "right" ? AlignRight : AlignLeft;
  const label = align === "center" ? "Center" : align === "right" ? "Right" : "Left";
  return (
    <span className="text-[8px] text-gray-400 font-bold flex items-center gap-0.5 border border-slate-100 bg-slate-50 px-1 py-0.5 rounded">
      <Icon size={7} />
      <span className="capitalize">{label}</span>
    </span>
  );
};

export const BlockStackManager: React.FC<BlockStackManagerProps> = ({
  blocks, activeInput,
  handleBlockSelect, handleMoveBlock, handleDeleteBlock, handleBlockChange
}) => {
  const [expandedAlignId, setExpandedAlignId] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeInput && blocks.some((b) => b.id === activeInput)) {
      setExpandedAlignId(activeInput);
    }
  }, [activeInput, blocks]);

  return (
    <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-2.5">
      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest px-1.5 block pb-1 border-b border-slate-100/50">
        Layout Manager ({blocks.length})
      </span>

      <div className="space-y-2">
        {blocks.map((block, index) => {
          const isActive = activeInput === block.id;
          const isExpanded = expandedAlignId === block.id;

          let previewText = block.content.replace(/<[^>]*>/g, "").trim();
          if (!previewText && block.type === "image") previewText = block.caption || "Article Image";
          if (!previewText && block.type === "divider") previewText = "— Section Divider —";

          const typeLabel = block.type === "heading"
            ? `Heading ${block.level || "H2"}`
            : BLOCK_TYPE_LABELS[block.type] ?? block.type;

          return (
            <div
              key={block.id}
              onClick={() => {
                handleBlockSelect(block.id);
                if (activeInput !== block.id) setExpandedAlignId(block.id);
              }}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 relative ${
                isActive
                  ? "border-orange-200 border-r-4 border-r-orange-500 bg-white shadow-3xs"
                  : "border-slate-200/65 bg-white hover:border-slate-300"
              }`}
            >
              {/* Type badge + align/edit row */}
              <div className="flex items-center justify-between">
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${BLOCK_TYPE_STYLES[block.type] ?? BLOCK_TYPE_STYLES.text}`}>
                  {typeLabel}
                </span>

                {block.type !== "divider" && !isExpanded && (
                  <div className="flex items-center gap-1.5">
                    <AlignBadge align={block.align} />
                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setExpandedAlignId(block.id); }}
                        className="p-1 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors flex items-center gap-0.5 text-[8px] font-extrabold px-1.5 border border-orange-100 shadow-3xs"
                        title="Edit Alignment"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        <span>EDIT</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Content preview */}
              {previewText && (
                <p className="text-[10px] font-semibold text-gray-700 truncate px-0.5 leading-snug">{previewText}</p>
              )}

              {/* Alignment controls (expand/collapse) */}
              {block.type !== "divider" && (
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "max-h-13.75 opacity-100 mt-1 border-t border-slate-100 pt-2 flex items-center justify-between"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 bg-slate-55 p-0.5 rounded-lg border border-slate-205">
                    {ALIGN_OPTS.map(({ align, icon: Icon, label }) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => handleBlockChange(block.id, { align })}
                        className={`p-1 px-1.5 rounded flex items-center gap-1 justify-center transition-all ${
                          block.align === align
                            ? "bg-white text-orange-655 border border-slate-205 shadow-3xs font-extrabold"
                            : "text-gray-400 hover:text-gray-600 hover:bg-slate-100 border border-transparent"
                        }`}
                        title={`Align ${label}`}
                      >
                        <Icon size={10} />
                        <span className="text-[8px] font-bold">{label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedAlignId(null)}
                    className="flex items-center justify-center py-1 px-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all font-bold text-[9px] gap-1 shadow-3xs"
                  >
                    <Check size={10} strokeWidth={3.5} /><span>Save</span>
                  </button>
                </div>
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
