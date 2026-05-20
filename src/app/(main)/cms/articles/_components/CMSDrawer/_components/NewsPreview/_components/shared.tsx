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

    {block.type !== "divider" && (
      <>
        <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
        {ALIGN_OPTIONS.map(({ key, Icon, title }) => (
          <button
            key={key}
            type="button"
            onClick={(e) => { e.stopPropagation(); onBlockChange?.(block.id, { align: key }); }}
            className={`p-1 rounded-lg transition-all duration-200 ${block.align === key ? "bg-orange-105 text-orange-655 font-extrabold shadow-3xs" : "text-slate-400 hover:bg-slate-100 hover:text-slate-800"}`}
            title={title}
          >
            <Icon size={11} className="stroke-[2.5]" />
          </button>
        ))}
      </>
    )}

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
    const imgLayout = block.imageLayout || "full";
    const padding = block.imagePadding || "medium";
    const direction = block.imageDirection || "image-text";
    const sideText = block.imageSideText || "";

    if (imgLayout === "side-by-side") {
      const imgCol = (
        <div className="w-full">
          <BlockImage block={block} />
          {block.caption && (
            <p className="text-[9.5px] text-slate-450 italic text-center font-bold mt-2">{block.caption}</p>
          )}
        </div>
      );
      const textCol = (
        <div className="w-full flex flex-col justify-center px-2">
          <p className="text-[12px] font-semibold leading-relaxed text-slate-655 whitespace-pre-wrap">
            {sideText || <span className="text-slate-355 italic font-medium">Enter text content beside the image in the editor panel...</span>}
          </p>
        </div>
      );
      return (
        <div className="py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-3 bg-slate-55/40 rounded-3xl border border-slate-100/60 shadow-3xs">
            {direction === "image-text" ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
          </div>
        </div>
      );
    }

    const widthClass = PADDING_MAP[padding] ?? "max-w-[85%] mx-auto";
    return (
      <div className="py-2.5 w-full text-center">
        <div className={`${widthClass} transition-all duration-300`}>
          <BlockImage block={block} />
          {block.caption && (
            <p className="text-[9.5px] text-slate-450 italic text-center font-bold mt-2">{block.caption}</p>
          )}
        </div>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote style={blockStyle} className="relative border-l-4 border-purple-500 pl-5 py-2 font-bold italic text-[12px] text-purple-800 bg-purple-50/15 rounded-r-2xl shadow-3xs">
        {block.content || <span className="text-purple-305 italic font-semibold">Enter quote content...</span>}
      </blockquote>
    );
  }

  if (block.type === "divider") {
    return (
      <div className="py-6 flex items-center justify-center select-none">
        <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-slate-205" />
        <div className="w-2 h-2 rounded-full bg-orange-400 mx-4 animate-pulse shadow-3xs" />
        <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-slate-205" />
      </div>
    );
  }

  return null;
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
    {allowComments && (
      <div className="pt-8 space-y-4 mt-6">
        <span className="text-[10.5px] font-extrabold text-slate-800 uppercase tracking-widest block select-none">Article Comments</span>
        <FormInput placeholder="Write your comment..." className="text-xs h-11" />
      </div>
    )}
  </>
);
