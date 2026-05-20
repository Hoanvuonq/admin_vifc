import React from "react";
import { FormInput, MediaUploadField } from "@/components";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Compass,
  Trash2
} from "lucide-react";
import { ContentBlock } from "../../NewsPreview/type";

interface ContentSectionProps {
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;
  blocks: ContentBlock[];
  handleMoveBlock: (index: number, dir: "up" | "down") => void;
  handleBlockChange: (blockId: string, update: Partial<ContentBlock>) => void;
  handleDeleteBlock: (blockId: string) => void;
  sectionContentCompleted: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  activeInput,
  setActiveInput,
  blocks,
  handleMoveBlock,
  handleBlockChange,
  handleDeleteBlock,
  sectionContentCompleted,
}) => {
  const alignOptions = [
    { key: "left" as const, Icon: AlignLeft },
    { key: "center" as const, Icon: AlignCenter },
    { key: "right" as const, Icon: AlignRight }
  ];

  const imagePaddingOptions = [
    { key: "none", label: "Full (100%)" },
    { key: "small", label: "Wide (95%)" },
    { key: "medium", label: "Medium (85%)" },
    { key: "large", label: "Small (70%)" }
  ];

  return (
    <div
      id="form-section-content"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-orange-500" />
          <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">3. Fill Content</span>
        </div>
        <span
          className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${
            sectionContentCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
          }`}
        >
          {sectionContentCompleted ? "Completed" : "Incomplete"}
        </span>
      </div>

      <div className="space-y-3">
        {blocks.map((block, index) => {
          const isBlockActive = activeInput === block.id;
          return (
            <div
              key={block.id}
              id={`form-${block.id}`}
              className={`p-3 rounded-xl space-y-2 transition-all ${
                isBlockActive ? "bg-orange-50/20" : "bg-slate-50/50"
              }`}
              onFocusCapture={() => setActiveInput(block.id)}
            >
              {/* Local Block controls */}
              <div className="flex justify-between items-center border-b border-slate-100/50 pb-1.5 select-none">
                <span className="text-[8.5px] font-extrabold uppercase text-gray-500 tracking-widest">
                  #{index + 1} {
                    block.type === "heading" ? `Heading ${block.level || "H2"}` :
                    block.type === "image" ? "Image" :
                    block.type === "quote" ? "Quote" :
                    block.type === "divider" ? "Divider" : "Paragraph"
                  }
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(index, "up")}
                    disabled={index === 0}
                    className="p-0.5 rounded bg-white border border-gray-205 text-gray-500 disabled:opacity-20"
                  >
                    <ArrowUp size={9} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(index, "down")}
                    disabled={index === blocks.length - 1}
                    className="p-0.5 rounded bg-white border border-gray-205 text-gray-500 disabled:opacity-20"
                  >
                    <ArrowDown size={9} />
                  </button>

                  {block.type !== "divider" && (
                    <>
                      <div className="w-px h-3 bg-gray-200 mx-0.5" />
                      {alignOptions.map(({ key, Icon }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleBlockChange(block.id, { align: key })}
                          className={`p-0.5 rounded ${
                            block.align === key
                              ? "bg-orange-100 text-orange-600"
                              : "bg-white border border-gray-205 text-gray-400"
                          }`}
                        >
                          <Icon size={9} />
                        </button>
                      ))}
                    </>
                  )}

                  <div className="w-px h-3 bg-gray-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(block.id)}
                    className="p-0.5 rounded bg-white border border-red-150 text-red-500"
                  >
                    <Trash2 size={9} />
                  </button>
                </div>
              </div>

              {/* Block editors */}
              {block.type === "heading" && (
                <div className="flex gap-2 items-center">
                  <select
                    value={block.level || "h2"}
                    onChange={(e) => handleBlockChange(block.id, { level: e.target.value as "h2" | "h3" })}
                    className="h-10 px-2 bg-slate-50/50 border border-gray-202 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none"
                  >
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                  </select>
                  <FormInput
                    value={block.content}
                    onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Enter heading..."
                    className="h-10 text-xs"
                    containerClassName="flex-1"
                  />
                </div>
              )}

              {block.type === "text" && (
                <FormInput
                  isTextArea
                  value={block.content}
                  onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                  placeholder="Enter paragraph content..."
                  className="min-h-40 text-xs"
                />
              )}

              {block.type === "image" && (() => {
                const layout = block.imageLayout || "full";
                const padding = block.imagePadding || "medium";
                const direction = block.imageDirection || "image-text";

                return (
                  <div className="space-y-3">
                    {/* Image display layout (Layout selector group) */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">Display Layout</label>
                      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
                        {[
                          { key: "full" as const, label: "Full Image / With Padding" },
                          { key: "side-by-side" as const, label: "Side-by-Side Image & Text" }
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleBlockChange(block.id, { imageLayout: item.key })}
                            className={`flex-1 py-1 rounded-lg text-[9.5px] font-extrabold transition-all ${
                              layout === item.key ? "bg-white text-orange-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Controls specific to layout type */}
                    {layout === "full" ? (
                      /* Option 2: Full width & Padding selector group */
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">Image Width (Responsive Padding)</label>
                        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
                          {imagePaddingOptions.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => handleBlockChange(block.id, { imagePadding: item.key as any })}
                              className={`flex-1 py-1 rounded-lg text-[8.5px] font-extrabold transition-all ${
                                padding === item.key ? "bg-white text-orange-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Option 1: Side-by-side controls (direction, side text) */
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">Display Side</label>
                          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
                            {[
                              { key: "image-text" as const, label: "Image Left - Text Right" },
                              { key: "text-image" as const, label: "Text Left - Image Right" }
                            ].map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => handleBlockChange(block.id, { imageDirection: item.key })}
                                className={`flex-1 py-1 rounded-lg text-[9px] font-extrabold transition-all ${
                                  direction === item.key ? "bg-white text-orange-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">Text Content Beside Image</label>
                          <FormInput
                            isTextArea
                            value={block.imageSideText || ""}
                            onChange={(e) => handleBlockChange(block.id, { imageSideText: e.target.value })}
                            placeholder="Enter text description to go beside the image..."
                            className="min-h-25 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Upload / URL & Caption */}
                    <div className="space-y-2 pt-1.5 border-t border-slate-100/60">
                      <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">Image File</label>
                      <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl">
                        <MediaUploadField
                          value={block.content ? [{ uid: block.id, url: block.content, status: "done" }] : []}
                          onChange={(files) => {
                            if (files.length > 0) {
                              handleBlockChange(block.id, { content: files[0].url || "" });
                            } else {
                              handleBlockChange(block.id, { content: "" });
                            }
                          }}
                          maxCount={1}
                          size="md"
                          isBanner={true}
                          className="w-full"
                        />
                      </div>
                      <FormInput
                        value={block.content}
                        onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                        placeholder="Or enter the article image URL..."
                        className="h-10 text-xs"
                      />
                      <FormInput
                        value={block.caption || ""}
                        onChange={(e) => handleBlockChange(block.id, { caption: e.target.value })}
                        placeholder="Image description / caption..."
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>
                );
              })()}

              {block.type === "quote" && (
                <FormInput
                  isTextArea
                  value={block.content}
                  onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                  placeholder="Enter quote content..."
                  className="min-h-25 text-xs italic text-gray-650"
                />
              )}

              {block.type === "divider" && (
                <div className="py-1 flex items-center justify-center select-none">
                  <div className="w-full h-px border-t border-dashed border-gray-200" />
                  <span className="px-2 text-[8px] text-gray-300 font-bold uppercase shrink-0">Divider</span>
                  <div className="w-full h-px border-t border-dashed border-gray-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
