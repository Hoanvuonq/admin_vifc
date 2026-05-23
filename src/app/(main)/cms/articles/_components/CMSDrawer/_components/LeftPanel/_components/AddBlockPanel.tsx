import React from "react";
import {
  FileText, Image as ImageIcon, Heading2, Heading3,
  File
} from "lucide-react";
import { ContentBlock } from "../../NewsPreview/type";

interface AddBlockPanelProps {
  handleAddBlock: (type: ContentBlock["type"], defaults?: Partial<ContentBlock>) => void;
}

const BLOCK_BUTTONS = [
  {
    type: "text", label: "Paragraph", icon: FileText,
    hover: "hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50/10",
  },
  {
    type: "heading", label: "Heading H2", icon: Heading2,
    hover: "hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/10",
    defaults: { level: "h2" as const },
  },
  {
    type: "heading", label: "Heading H3", icon: Heading3,
    hover: "hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/10",
    defaults: { level: "h3" as const },
  },
  {
    type: "image", label: "Image", icon: ImageIcon,
    hover: "hover:border-emerald-200 hover:text-emerald-500 hover:bg-emerald-50/10",
    defaults: { imageLayout: "full" as const, imagePadding: "medium" as const },
  },
  {
    type: "pdf", label: "PDF Block", icon: File,
    hover: "hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/10",
  },
] as const;

export const AddBlockPanel: React.FC<AddBlockPanelProps> = ({ handleAddBlock }) => (
  <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-1.5">
    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest px-1.5 block pb-1 border-b border-slate-100/50">
      Add Content Block
    </span>
    <div className="grid grid-cols-2 gap-2 pt-2">
      {BLOCK_BUTTONS.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={() => handleAddBlock(btn.type as ContentBlock["type"], (btn as any).defaults)}
          className={`flex flex-col items-center justify-center p-2.5 bg-slate-50/30 border border-slate-200/50 rounded-xl text-[10px] font-extrabold text-slate-550 transition-all duration-300 hover:shadow-2xs active:scale-95 shadow-3xs ${btn.hover} ${(btn as any).className || ""}`}
        >
          <btn.icon size={13} className="mb-1 shrink-0 stroke-[2.2]" />
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  </div>
);
