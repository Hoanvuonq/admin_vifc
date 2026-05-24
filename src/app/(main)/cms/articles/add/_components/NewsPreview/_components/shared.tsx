import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { ContentBlock } from "../type";
import { FormInput } from "@/components";
import {
  AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Trash2
} from "lucide-react";
import Image from "next/image";

// ────────────────────────────────────────────────────────────
// Shared primitive helpers
// ────────────────────────────────────────────────────────────

export const ALIGN_OPTIONS = [
  { key: "left" as const, Icon: AlignLeft, title: "Align Left" },
  { key: "center" as const, Icon: AlignCenter, title: "Align Center" },
  { key: "right" as const, Icon: AlignRight, title: "Align Right" },
];

// Image padding CSS map
const PADDING_MAP: Record<string, string> = {
  none: "w-full max-w-full",
  small: "max-w-[95%] mx-auto",
  medium: "max-w-[85%] mx-auto",
  large: "max-w-[70%] mx-auto",
};

/** Renders a block image with placeholder fallback. */
export const BlockImage: React.FC<{ block: ContentBlock }> = ({ block }) =>
  block.content ? (
    <div className="inline-block rounded-2xl overflow-hidden border border-slate-100/80 max-w-full shadow-3xs w-full transition-transform hover:scale-[1.01] duration-300">
      <img src={block.content} alt={block.caption || ""} className="w-full max-h-100 object-cover rounded-2xl" />
    </div>
  ) : (
    <div className="w-full py-8 px-6 bg-linear-to-br from-orange-50/50 via-orange-50/80 to-orange-100/30 border-2 border-dashed border-orange-200/65 rounded-2xl flex flex-col items-center justify-center text-orange-400 select-none shadow-3xs hover:border-orange-300/80 transition-colors duration-300">
      <div className="w-10 h-10 rounded-full bg-orange-100/80 flex items-center justify-center mb-2.5 shadow-3xs border border-orange-200/20">
        <ImageIcon size={18} className="text-slate-400" />
      </div>
      <span className="text-xs font-extrabold text-orange-655 uppercase tracking-widest">No Image Uploaded</span>
      <span className="text-[9.5px] text-slate-450 mt-1 italic">Please upload or enter an image URL in the editor panel on the right</span>
    </div>
  );

export const BannerImage: React.FC<{
  thumbnail: string;
  title: string;
  isRounded?: boolean;
  aspectClass?: string;
}> = ({ thumbnail, title, isRounded = false, aspectClass = "aspect-21/9" }) => {
  const hasImage = thumbnail && !thumbnail.includes("api.dicebear.com/7.x/shapes/svg");
  return (
    <div className={`w-full p-2.5 ${aspectClass} overflow-hidden bg-slate-50 relative ${isRounded ? "rounded-3xl shadow-2xs" : ""}`}>
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <Image src={thumbnail} fill alt={title} className={`w-full h-full object-cover ${isRounded ? "rounded-2xl" : ""}`} />
      ) : (
        <div className="w-full h-full bg-linear-to-br border border-dashed rounded-2xl border-orange-200/60 from-orange-500/5 via-amber-500/5 to-white flex flex-col items-center justify-center text-slate-455 select-none shadow-3xs p-6">
          <div className="w-14 h-14 rounded-full bg-orange-100/60 flex items-center justify-center mb-2 shadow-2xs">
            <ImageIcon size={26} className="stroke-[1.2] text-orange-500/80 animate-pulse" />
          </div>
          <span className="text-xs font-extrabold text-orange-655 uppercase tracking-widest">Article Cover Image</span>
          <span className="text-[9.5px] text-slate-450 mt-1 italic">Please upload an image in the editor panel on the right</span>
        </div>
      )}
      {hasImage && !isRounded && <div className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent" />}
    </div>
  );
};

export const BlockControls: React.FC<{
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  onMoveBlock?: (index: number, dir: "up" | "down") => void;
  onDeleteBlock?: (id: string) => void;
  onBlockChange?: (id: string, update: Partial<ContentBlock>) => void;
}> = ({ block, index, totalBlocks, onMoveBlock, onDeleteBlock, onBlockChange }) => (
  <div
    className="absolute -top-7 right-3 bg-white border border-slate-200/60 rounded-xl px-2 py-1 flex items-center gap-1.5 shadow-md z-30 transition-all select-none scale-102"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onMoveBlock?.(index, "up"); }}
      disabled={index === 0}
      className="p-1 rounded-lg text-slate-555 hover:bg-slate-105 hover:text-slate-800 disabled:opacity-20 transition-colors"
      title="Move Up"
    >
      <ArrowUp size={11} className="stroke-[2.5]" />
    </button>
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onMoveBlock?.(index, "down"); }}
      disabled={index === totalBlocks - 1}
      className="p-1 rounded-lg text-slate-555 hover:bg-slate-105 hover:text-slate-800 disabled:opacity-20 transition-colors"
      title="Move Down"
    >
      <ArrowDown size={11} className="stroke-[2.5]" />
    </button>



    <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onDeleteBlock?.(block.id); }}
      className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
      title="Delete block"
    >
      <Trash2 size={11} className="stroke-[2.5]" />
    </button>
  </div>
);

export const BlockContent: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const blockStyle = block.align !== "left" ? { textAlign: block.align } : {};

  if (block.type === "heading") {
    return block.level === "h3" ? (
      <h3 style={blockStyle} className="text-sm font-extrabold text-slate-855 leading-snug tracking-tight">
        {block.content || <span className="text-slate-300 italic font-medium">Enter heading H3...</span>}
      </h3>
    ) : (
      <h2 style={blockStyle} className="text-base font-extrabold text-slate-900 leading-snug tracking-tight">
        {block.content || <span className="text-slate-300 italic font-medium">Enter heading H2...</span>}
      </h2>
    );
  }

  if (block.type === "text") {
    return (
      <p style={blockStyle} className="text-[12px] font-semibold leading-relaxed text-slate-655 whitespace-pre-wrap">
        {block.content || <span className="text-slate-300 italic font-medium">Enter paragraph content...</span>}
      </p>
    );
  }

  if (block.type === "image") {
    return (
      <div className="py-2.5 w-full text-center">
        <div className="w-full transition-all duration-300">
          <BlockImage block={block} />
          {block.caption && (
            <p className="text-[9.5px] text-slate-450 italic text-center font-bold mt-2">{block.caption}</p>
          )}
        </div>
      </div>
    );
  }

  if (block.type === "pdf") {
    return (
      <div className="py-4 w-full">
        <div className="bg-[#3b3b3b] rounded-[18px] p-5 max-w-[280px] mx-auto flex flex-col items-center justify-center relative overflow-hidden shadow-md">
          {block.thumbnailUrl ? (
            <div className="w-full relative shadow-sm rounded-lg overflow-hidden border border-[#555]">
              <img src={block.thumbnailUrl} alt={block.caption || "PDF Cover"} className="w-full h-auto object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-3/4 bg-[#444] border border-dashed border-[#666] rounded-lg flex items-center justify-center">
              <span className="text-xs text-[#888] font-bold uppercase">No PDF Cover</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-12 flex justify-center z-10">
            <a href={block.content || "#"} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-slate-50 text-slate-900 px-5 py-2 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95">
              View full report <ArrowUp size={11} className="rotate-45" />
            </a>
          </div>

          <div className="mt-5 text-center w-full">
            <span className="text-[10px] font-medium text-slate-300 truncate block w-full px-2">
              {block.caption || "Untitled Document.pdf"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const PDFPreview: React.FC<{ url?: string; cover?: string; name?: string }> = ({ url, cover, name }) => {
  if (!url && !cover && !name) return null;
  return (
    <div className="py-4 w-full">
      <div className="bg-[#3b3b3b] rounded-[18px] p-5 max-w-[280px] mx-auto flex flex-col items-center justify-center relative overflow-hidden shadow-md">
        {cover ? (
          <div className="w-full relative shadow-sm rounded-lg overflow-hidden border border-[#555]">
            <img src={cover} alt={name || "PDF Cover"} className="w-full h-auto object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-3/4 bg-[#444] border border-dashed border-[#666] rounded-lg flex items-center justify-center">
            <span className="text-xs text-[#888] font-bold uppercase">No PDF Cover</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-12 flex justify-center z-10">
          <a href={url || "#"} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-slate-50 text-slate-900 px-5 py-2 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95">
            View full report <ArrowUp size={11} className="rotate-45" />
          </a>
        </div>

        <div className="mt-5 text-center w-full">
          <span className="text-[10px] font-medium text-slate-300 truncate block w-full px-2">
            {name || "Untitled Document.pdf"}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TagsAndComments: React.FC<{ tags: string[]; allowComments: boolean }> = ({
  tags, allowComments
}) => (
  <>
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5 pt-6 mt-6 select-none">
        {tags.map((tg) => (
          <span key={tg} className="text-[9.5px] font-extrabold bg-slate-50 text-slate-655 px-3 py-1 rounded-lg border border-slate-255 transition-colors hover:bg-slate-border-gray-50/50">
            #{tg}
          </span>
        ))}
      </div>
    )}
  </>
);
