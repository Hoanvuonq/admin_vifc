import React from "react";
import { ContentBlock } from "../type";
import { BlockContent, BlockControls } from "./shared";

interface BlockListProps {
  blocks: ContentBlock[];
  activeInput: string | null;
  onBlockSelect: (id: string) => void;
  onMoveBlock?: (index: number, dir: "up" | "down") => void;
  onDeleteBlock?: (id: string) => void;
  onBlockChange?: (id: string, update: Partial<ContentBlock>) => void;
}

export const BlockList: React.FC<BlockListProps> = ({
  blocks, activeInput, onBlockSelect, onMoveBlock, onDeleteBlock, onBlockChange
}) => (
  <div className="space-y-10 pt-4">
    {blocks.map((block, index) => {
      const isActive = activeInput === block.id;
      return (
        <div
          key={block.id}
          id={`preview-${block.id}`}
          onClick={() => onBlockSelect(block.id)}
          className={`relative group rounded-2xl px-5 -mx-5 py-4 transition-all duration-300 cursor-pointer ${
            isActive
              ? "bg-orange-50/10 ring-1 ring-orange-200/40 shadow-3xs"
              : "hover:bg-slate-50/30"
          }`}
        >
          {isActive && (
            <>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-linear-to-b from-orange-500 to-amber-500 rounded-full shadow-2xs" />
              <BlockControls
                block={block}
                index={index}
                totalBlocks={blocks.length}
                onMoveBlock={onMoveBlock}
                onDeleteBlock={onDeleteBlock}
                onBlockChange={onBlockChange}
              />
            </>
          )}
          <BlockContent block={block} />
        </div>
      );
    })}
  </div>
);
